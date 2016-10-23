
if (!('requestAnimationFrame' in window)) {

    window.requestAnimationFrame = window.webkitRequestAnimationFrame;
    window.cancelAnimationFrame = window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame;
};

"use strict";

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AnimationFrame = (function () {
    function AnimationFrame() {
        _classCallCheck(this, AnimationFrame);

        this.ids = [];
        this.timer = 0;
    }

    _createClass(AnimationFrame, [{
        key: "animationStop",
        value: function animationStop(id) {

            cancelAnimationFrame(this.ids[id]);

            delete this.ids[id];
        }
    }, {
        key: "cumulativeTimer",
        value: function cumulativeTimer() {

            return ++this.timer;
        }
    }, {
        key: "animationRun",
        value: function animationRun(func, scope) {
            var _this = this;

            var id = undefined;

            func = scope ? func.bind(scope) : func;

            var onAnimationFrameEvent = function onAnimationFrameEvent() {

                var self = onAnimationFrameEvent,
                    id = self.$id;

                if (func() !== false) {

                    _this.ids[id] = requestAnimationFrame(self);
                } else {

                    _this.animationStop(id);
                }
            };

            this.ids[id = onAnimationFrameEvent.$id = this.cumulativeTimer()] = requestAnimationFrame(onAnimationFrameEvent);

            return id;
        }
    }]);

    return AnimationFrame;
})();

var Easing = (function (_AnimationFrame) {
    _inherits(Easing, _AnimationFrame);

    function Easing() {
        _classCallCheck(this, Easing);

        _get(Object.getPrototypeOf(Easing.prototype), "constructor", this).call(this);
    }

    _createClass(Easing, [{
        key: "setConfig",
        value: function setConfig(config) {

            var name = undefined;

            for (name in config) {

                config.hasOwnProperty(name) && (this[name] = config[name]);
            }
        }
    }, {
        key: "defaultRun",
        value: function defaultRun() {

            var ended = this.isEnded();

            this.callback(this.getValue(), ended);

            if (ended) {

                this.reset();

                return false;
            }
        }
    }, {
        key: "run",
        value: function run() {

            this.$animationFrameId = this.animationRun(this.defaultRun, this);
        }
    }, {
        key: "stop",
        value: function stop() {

            this.reset();

            this.animationStop(this.$animationFrameId);
        }
    }, {
        key: "isEnded",
        value: function isEnded() {

            return true;
        }
    }, {
        key: "getValue",
        value: function getValue() {}
    }, {
        key: "reset",
        value: function reset() {}
    }, {
        key: "startTime",
        set: function set(value) {

            this.$startTime = value;
        },
        get: function get() {

            return this.$startTime || (this.$startTime = Date.now());
        }
    }, {
        key: "callback",
        set: function set(value) {

            this.$func = value;
        },
        get: function get() {

            return this.$func || (this.$func = function () {});
        }
    }]);

    return Easing;
})(AnimationFrame);

var EaseOutEasing = (function (_Easing) {
    _inherits(EaseOutEasing, _Easing);

    function EaseOutEasing() {
        _classCallCheck(this, EaseOutEasing);

        _get(Object.getPrototypeOf(EaseOutEasing.prototype), "constructor", this).call(this);
    }

    _createClass(EaseOutEasing, [{
        key: "isEnded",
        value: function isEnded() {

            return Date.now() - this.startTime > this.duration;
        }
    }, {
        key: "getValue",
        value: function getValue() {

            var currentValue = this.startValue + (1 - Math.pow(1 - (Date.now() - this.startTime) / this.duration, this.exponent)) * this.distance;

            if (this.isEnded()) {

                return this.endValue;
            }

            return currentValue;
        }
    }, {
        key: "distance",
        get: function get() {

            return this.endValue - this.startValue;
        }
    }, {
        key: "exponent",
        get: function get() {

            return 4;
        }
    }, {
        key: "duration",
        get: function get() {

            return this.$duration;
        },
        set: function set(value) {

            this.$duration = value || 1500;
        }
    }]);

    return EaseOutEasing;
})(Easing);

var BounceEasing = (function (_Easing2) {
    _inherits(BounceEasing, _Easing2);

    function BounceEasing() {
        _classCallCheck(this, BounceEasing);

        _get(Object.getPrototypeOf(BounceEasing.prototype), "constructor", this).call(this);
    }

    _createClass(BounceEasing, [{
        key: "getValue",
        value: function getValue() {

            var theta = (Date.now() - this.startTime) / this.acceleration;

            return this.startValue - this.startVelocity * theta * Math.pow(Math.E, -this.springTension * theta);
        }
    }, {
        key: "springTension",
        get: function get() {

            return 0.3;
        }
    }, {
        key: "acceleration",
        set: function set(value) {

            this.$acceleration = value;
        },
        get: function get() {

            return this.$acceleration || 30;
        }
    }, {
        key: "startVelocity",
        set: function set(value) {

            this.$startVelocity = value;
        },
        get: function get() {

            return this.$startVelocity || 0;
        }
    }]);

    return BounceEasing;
})(Easing);

var MomentumEasing = (function (_Easing3) {
    _inherits(MomentumEasing, _Easing3);

    function MomentumEasing() {
        _classCallCheck(this, MomentumEasing);

        _get(Object.getPrototypeOf(MomentumEasing.prototype), "constructor", this).call(this);
    }

    _createClass(MomentumEasing, [{
        key: "getValue",
        value: function getValue() {

            return this.startValue + this.startVelocity * (1 - this.frictionFactor) / this.$theta;
        }
    }, {
        key: "acceleration",
        set: function set(value) {

            this.$startVelocity = this.startVelocity * value;
            this.$alpha = this.$theta / value;
            this.$acceleration = value;
        },
        get: function get() {

            return this.$acceleration || 30;
        }
    }, {
        key: "friction",
        set: function set(value) {

            var theta = Math.log(1 - value / 10);

            this.$theta = theta;
            this.$alpha = theta / this.acceleration;
            this.$friction = value;
        },
        get: function get() {

            return this.$friction || 0;
        }
    }, {
        key: "startVelocity",
        set: function set(value) {

            this.$startVelocity = value * this.acceleration;
        },
        get: function get() {

            return this.$startVelocity || 0;
        }
    }, {
        key: "frictionFactor",
        get: function get() {

            return Math.exp((Date.now() - this.startTime) * this.$alpha);
        }
    }, {
        key: "velocity",
        get: function get() {

            return this.frictionFactor * this.startVelocity;
        }
    }]);

    return MomentumEasing;
})(Easing);

var BoundMomentumEasing = (function (_Easing4) {
    _inherits(BoundMomentumEasing, _Easing4);

    function BoundMomentumEasing() {
        _classCallCheck(this, BoundMomentumEasing);

        _get(Object.getPrototypeOf(BoundMomentumEasing.prototype), "constructor", this).call(this);

        this.momentum = new MomentumEasing();
        this.bounce = new BounceEasing();
    }

    _createClass(BoundMomentumEasing, [{
        key: "setStartTime",
        value: function setStartTime(startTime) {

            this.momentum.startTime = startTime;
            this.startTime = startTime;
        }
    }, {
        key: "isEnded",
        value: function isEnded() {

            var momentum = this.momentum;

            if (!this.isOutOfBound) {

                if (Math.abs(momentum.velocity) < this.minVelocity) {

                    return true;
                }
            }

            if (this.isBouncingBack) {

                if (Math.round(this.bounce.getValue()) === (momentum.startVelocity > 0 ? this.minMomentumValue : this.maxMomentumValue)) {

                    return true;
                }
            }

            return false;
        }
    }, {
        key: "reset",
        value: function reset() {

            this.lastValue = null;

            this.isBouncingBack = false;

            this.isOutOfBound = false;
        }
    }, {
        key: "getValue",
        value: function getValue() {

            var momentum = this.momentum,
                bounce = this.bounce,
                startVelocity = momentum.startVelocity,
                direction = startVelocity > 0 ? 1 : -1,
                minValue = this.minMomentumValue,
                maxValue = this.maxMomentumValue,
                boundedValue = direction == 1 ? minValue : maxValue,
                lastValue = this.lastValue,
                value = undefined,
                velocity = undefined;

            if (startVelocity === 0) {

                return this.startValue;
            }

            if (!this.isOutOfBound) {

                value = momentum.getValue();
                velocity = momentum.velocity;

                if (maxValue === undefined) {

                    if (value > minValue) {

                        return value;
                    }
                }

                if (value >= minValue && value <= maxValue) {

                    return value;
                }

                this.isOutOfBound = true;

                bounce.startTime = Date.now();
                bounce.startVelocity = velocity;
                bounce.startValue = boundedValue;
            }

            value = bounce.getValue();

            if (!this.isEnded() && !this.isBouncingBack && lastValue !== null && direction == 1 && value < lastValue || direction == -1 && value > lastValue) {

                this.isBouncingBack = true;
            }

            this.lastValue = value;

            return value;
        }
    }, {
        key: "minVelocity",
        set: function set(value) {

            this.$minVelocity = value;
        },
        get: function get() {

            return this.$minVelocity || 0.01;
        }
    }, {
        key: "minMomentumValue",
        set: function set(value) {

            return this.$minMomentumValue = value;
        },
        get: function get() {

            return this.$minMomentumValue || 0;
        }
    }, {
        key: "maxMomentumValue",
        set: function set(value) {

            return this.$maxMomentumValue = value;
        },
        get: function get() {

            return this.$maxMomentumValue || 0;
        }
    }]);

    return BoundMomentumEasing;
})(Easing);


export {

    EaseOutEasing,
    BounceEasing,
    MomentumEasing,
    BoundMomentumEasing
}

