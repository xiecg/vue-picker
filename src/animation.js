
if (!('requestAnimationFrame' in window)) {

    window.requestAnimationFrame = window.webkitRequestAnimationFrame;
    window.cancelAnimationFrame = window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame;
};

class AnimationFrame {

    constructor () {
        
        this.ids = [];
        this.timer = 0;
    }

    animationStop (id) {

        cancelAnimationFrame(this.ids[id]);

        delete this.ids[id];  
    }

    cumulativeTimer () {

        return ++this.timer;
    }

    animationRun (func, scope) {

        let id;

        func = scope ? func.bind(scope) : func;

        var onAnimationFrameEvent = () => {

            let self = onAnimationFrameEvent,
                id = self.$id;

            if (func() !== false) {

                this.ids[id] = requestAnimationFrame(self);
            } else {

                this.animationStop(id);
            }
        }

        this.ids[id = onAnimationFrameEvent.$id = this.cumulativeTimer()] = requestAnimationFrame(onAnimationFrameEvent);
        
        return id;
    }
}

class Easing extends AnimationFrame{

    constructor () {

        super();
    }

    set startTime (value) {

        this.$startTime = value;
    }
    get startTime () {

        return this.$startTime || (this.$startTime = Date.now());
    }

    set callback (value) {

        this.$func = value;
    }
    get callback () {

        return this.$func || (this.$func = function() {});
    }

    setConfig (config) {

        let name;

        for (name in config) {

            config.hasOwnProperty(name) && (this[name] = config[name]);
        }
    }

    defaultRun () {

        let ended = this.isEnded();

        this.callback(this.getValue(), ended);

        if (ended) {

            this.reset();

            return false;
        }
    }

    run () {

        this.$animationFrameId = this.animationRun(this.defaultRun, this);
    }

    stop () {

        this.reset();

        this.animationStop(this.$animationFrameId);
    }

    isEnded () {

        return true;
    }

    getValue () {}

    reset () {}
}

class EaseOutEasing extends Easing {

    constructor () {

        super();
    }

    get distance () {

        return this.endValue - this.startValue;
    }

    get exponent () {

        return 4;
    }

    get duration () {

        return this.$duration;
    }

    set duration (value) {

        this.$duration = value || 1500;
    }

    isEnded () {

        return Date.now() - this.startTime > this.duration;
    }

    getValue () {

        let currentValue = this.startValue + (1 - Math.pow(1 - (Date.now() - this.startTime) / this.duration, this.exponent)) * this.distance;

        if (this.isEnded()) {

             return this.endValue;
        }

        return currentValue;
    }
}

class BounceEasing extends Easing {

    constructor () {

        super();
    }

    get springTension () {

        return 0.3;
    }

    set acceleration (value) {

        this.$acceleration = value;
    }
    get acceleration () {

        return this.$acceleration || 30;
    }

    set startVelocity (value) {

        this.$startVelocity = value;
    }
    get startVelocity () {

        return this.$startVelocity || 0;
    }

    getValue () {

        let theta = (Date.now() - this.startTime) / this.acceleration;

        return this.startValue - this.startVelocity * theta * Math.pow(Math.E, -this.springTension * theta);
    }
}

class MomentumEasing extends Easing{

    constructor () {

        super();
    }

    set acceleration (value) {

        this.$startVelocity = this.startVelocity * value;
        this.$alpha = this.$theta / value;
        this.$acceleration = value;
    }
    get acceleration () {

        return this.$acceleration || 30;
    }

    set friction (value) {

        let theta = Math.log(1 - (value / 10));

        this.$theta = theta;
        this.$alpha = theta / this.acceleration;
        this.$friction = value;
    }
    get friction () {

        return this.$friction || 0;
    }

    set startVelocity (value) {

        this.$startVelocity = value * this.acceleration;
    }
    get startVelocity () {

        return this.$startVelocity || 0;
    }

    get frictionFactor () {

        return Math.exp((Date.now() - this.startTime) * this.$alpha);
    }

    get velocity () {

        return this.frictionFactor * this.startVelocity;
    }

    getValue () {

        return this.startValue + this.startVelocity * (1 - this.frictionFactor) / this.$theta;
    }
}

class BoundMomentumEasing extends Easing {

    constructor () {

        super();

        this.momentum = new MomentumEasing;
        this.bounce = new BounceEasing;
    }

    set minVelocity (value) {

        this.$minVelocity = value;
    }
    get minVelocity () {

        return this.$minVelocity || 0.01;
    }

    set minMomentumValue (value) {

        return this.$minMomentumValue = value;
    }
    get minMomentumValue () {

        return this.$minMomentumValue || 0;
    }

    set maxMomentumValue (value) {

        return this.$maxMomentumValue = value;
    }
    get maxMomentumValue () {

        return this.$maxMomentumValue || 0;
    }

    setStartTime (startTime) {

        this.momentum.startTime = startTime;
        this.startTime = startTime;
    }

    isEnded () {

        let momentum = this.momentum;

        if (!this.isOutOfBound) {

            if(Math.abs(momentum.velocity) < this.minVelocity){

                return true;
            }
        }

        if(this.isBouncingBack) {

            if (Math.round(this.bounce.getValue()) === (momentum.startVelocity > 0 ? this.minMomentumValue :  this.maxMomentumValue)){

                return true;
            }
        }

        return false;
    }

    reset () {

        this.lastValue = null;
        
        this.isBouncingBack = false;
    
        this.isOutOfBound = false;
    }

    getValue () {

        let momentum = this.momentum,
            bounce = this.bounce,
            startVelocity = momentum.startVelocity,
            direction = startVelocity > 0 ? 1 : -1,
            minValue = this.minMomentumValue,
            maxValue = this.maxMomentumValue,
            boundedValue = (direction == 1) ? minValue : maxValue,
            lastValue = this.lastValue,
            value, velocity;

        if (startVelocity === 0) {

            return this.startValue;
        }

        if (!this.isOutOfBound) {

            value = momentum.getValue();
            velocity = momentum.velocity;
            
            if(maxValue === undefined){

                if(value > minValue){

                    return value ;
                }
            }

            if (value >= minValue && value <= maxValue){

                return value;
            }

            this.isOutOfBound = true;
            
            bounce.startTime = Date.now();
            bounce.startVelocity = velocity;
            bounce.startValue = boundedValue;
        }

        value = bounce.getValue();

        if (!this.isEnded() && !this.isBouncingBack && (lastValue !== null) && (direction == 1 && value < lastValue) || (direction == -1 && value > lastValue)) {

            this.isBouncingBack = true;
        }

        this.lastValue = value;

        return value;
    }
}

export {

    EaseOutEasing,
    BounceEasing,
    MomentumEasing,
    BoundMomentumEasing
}

