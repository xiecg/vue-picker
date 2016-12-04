<style>
</style>

<template>
	<div class="picker-item" v-touch:panstart="onPanStart" v-touch:panmove="onPanMove" v-touch:panend="onPanEnd">
		<div :style="{ transform: 'rotateX('+ scrollValue +'deg)' }" class="picker-item-content" v-for-nested="currentValues"></div>
	</div>
</template>

<script>

	if (!('requestAnimationFrame' in window)) {

		window.requestAnimationFrame = window.webkitRequestAnimationFrame;
		window.cancelAnimationFrame = window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame;
	}

	export default {
		props: {
			values: {
				type: Array,
				default: []
			},
			length: {
				type: Number,
				default: 0
			},
			allValues: {
				type: Array
			}
		},
		data () {
			return {
				startValue: 0,
				startPageY: 0,
				scrollValue: 0,
				maxVelocity: 6,
				current: 0,
				beginning: false,
				duration: 20,
				timer: 0,
				currentValues: this.values,
				baseScrollValue: 0,
				firstTimeRequest: true,
				poolData: [],
				count: 0,
				requestStart: 0,
				lastValues: []
			}
		},
		methods: {
			onPanStart (...initialArgs) {
				cancelAnimationFrame(this.timer);
				let e = initialArgs[0];
				this.startPageY = e.changedPointers[0].pageY;
				this.startValue = this.scrollValue;
			},
			onPanMove (...initialArgs) {
				let e = initialArgs[0];
				let deg = (this.startValue - (e.changedPointers[0].pageY - this.startPageY));
				let oldDeg = this.scrollValue;
				this.onScroll(deg, oldDeg);
				this.scrollValue = deg;
				/*
				if (deg < -18*3) {
					this.onPanEnd(e);
				} else if (deg > 18*(this.length+3)) {
					this.onPanEnd(e);
				}
				*/
			},
			onPanEnd (...initialArgs) {
				cancelAnimationFrame(this.timer);

				let e = initialArgs[0];
				let maxVelocity = this.maxVelocity;
				let velocity = e.velocityY;

				if (velocity < -maxVelocity) {
					velocity = -maxVelocity;
				} else if (velocity > maxVelocity) {
					velocity = maxVelocity;
				}

				let speed = velocity * 80;
				let target = -(speed + (-this.scrollValue));
				let now = Math.round(target / 18);
				let dis = 0;

				now = now < 0 ? 0 : now;
				now = now > this.length ? this.length : now;
				dis = now * 18 - this.scrollValue;

				this.beginning = this.scrollValue;

				let animationLoop = () => {
					this.render(dis);
					this.timer = requestAnimationFrame(animationLoop);
					this.current ++;
					if (this.duration < this.current) {
						cancelAnimationFrame(this.timer);
						this.current = 0;
						this.beginning = false;
					}
				}
				animationLoop();
			},
			render (change) {
				this.scrollValue = this.easeOut(this.current, this.beginning, change, this.duration);
			},
			easeOut (a, c, b, d) {
				return -b * (a /= d) * (a - 2) + c;
			},
			requestPoolData () {
				if (this.count + 3 >= this.requestStart * 5) {
					var data = this.allValues.slice((this.requestStart++) * 50, this.requestStart * 50), length = 0;
					if (data instanceof Array) {
						data = data.slice(0, 50);
						// length = data.length;
						this.poolData = this.poolData.concat(data);
					}
				}
			},
			onScroll (value, oldValue) {

				let data, helperData, countHelper;

				if (value >= oldValue) {
					if (value - this.baseScrollValue > 90) {
						if (this.firstTimeRequest) {
							this.requestPoolData();
							this.firstTimeRequest = false;
						}
						this.baseScrollValue += 90;
						data = this.poolData.slice(15 + (this.count++) * 5, 15 + this.count * 5);
						data.length = 5;
						helperData = this.lastValues;

						countHelper = (this.count + 2) % 4;
						countHelper += countHelper < 0 ? 4 : 0;

						Array.prototype.splice.apply(helperData, [5 * countHelper, 5].concat(data));
						
						this.currentValues = this.lastValues;
						this.lastValues = this.currentValues;
						this.requestPoolData();
					}
				} else {
					if (value < this.baseScrollValue) {
						if (this.firstTimeRequest) {
							this.requestPoolData();
							this.firstTimeRequest = false;
						}

						this.baseScrollValue -= 90;
						--this.count;
						data = this.count > 0 ? this.poolData.slice((this.count - 1) * 5, this.count * 5) : [];
						data.length = 5;
						helperData = this.lastValues;

						countHelper = (this.count - 1) % 4;
						countHelper += countHelper < 0 ? 4 : 0;

						Array.prototype.splice.apply(helperData, [5 * countHelper, 5].concat(data));

						this.currentValues = this.lastValues;
						this.lastValues = this.currentValues;
					}
				}
			}
		},
		mounted () {
			this.lastValues = this.currentValues;
		}
	}
</script>