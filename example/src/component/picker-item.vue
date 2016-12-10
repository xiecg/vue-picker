<style>
</style>

<template>
	<div class="picker-item" v-touch:panstart="onPanStart" v-touch:panmove="onPanMove" v-touch:panend="onPanEnd">
		<div ref="pickerItemContent" :style="{ transform: 'rotateX('+ scrollValue +'deg)' }" class="picker-item-content" v-for-nested="currentValues"></div>
	</div>
</template>

<script>

	import { EaseOutEasing, BounceEasing, MomentumEasing, BoundMomentumEasing } from './animation';

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
				let e = initialArgs[0];
				this.startPageY = e.changedPointers[0].pageY;
				this.startValue = this.scrollValue;
				this.bounceHelper.stop();
				this.bounce.stop();
				this.boundMomentum.stop();
			},
			onPanMove (...initialArgs) {
				let e = initialArgs[0];
				let deg = (this.startValue - (e.changedPointers[0].pageY - this.startPageY));
				let oldDeg = this.scrollValue;
				this.onScroll(deg, oldDeg);
				this.scrollValue = deg;
			},
			onPanEnd (...initialArgs) {

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
				dis = this.scrollValue + dis;

				this.maxMomentumValue = this.length * 18

				let boundValue = null;

				if (this.scrollValue < 0) {

					boundValue = 0;
				} else if (this.scrollValue >= this.maxMomentumValue) {

					boundValue = this.maxMomentumValue;
				}

				if (boundValue !== null) {

					this.bounce.setConfig({
						startTime: Date.now(),
						startValue: this.scrollValue,
						endValue: boundValue
					});

					this.bounce.run();
					return;
				}

				this.boundMomentum.momentum.setConfig({
					startTime: Date.now(),
					startValue: this.scrollValue,
					startVelocity: velocity
				});

				this.boundMomentum.setConfig({
					maxMomentumValue: this.maxMomentumValue,
					startValue: this.scrollValue,
					startVelocity: velocity,
					callback: this.animationScrollValue
				});

				this.boundMomentum.run();
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
				
				this.setAlpha(value);

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
			},
			setAlpha (deg) {
				let spans = this.$refs.pickerItemContent.querySelectorAll('span');
				let index = Math.round(deg / 18) % 20;
				deg = deg % 360;
				deg = deg < 0 ? deg + 360 : deg;
				for(let i = 0; i < spans.length; i++) {
					let dis = Math.abs(i * 18 - deg);
					let n = Math.abs(1 - dis / 18 * 0.1);
					spans[i].style.opacity = Math.abs(n - 0.5);
					spans[index] && (spans[index].style.opacity = 1);
				}
			},
			animationScrollValue (value, isEnd) {
				let deg = value;
				let oldDeg = this.scrollValue;
				this.onScroll(deg, oldDeg);
				this.scrollValue = value;
			}
		},
		mounted () {
			this.setAlpha(0);

			this.lastValues = this.currentValues;

			this.boundMomentum = new BoundMomentumEasing;
			this.boundMomentumIsEndedFn = this.boundMomentum.isEnded;
			this.bounceHelper = new EaseOutEasing;
			this.bounce = new EaseOutEasing;

			let boundMomentum = this.boundMomentum;
			let bounce = this.bounce;
			let bounceHelper = this.bounceHelper;

			boundMomentum.momentum.setConfig({
				acceleration: 30,
				friction: 1
			});
			boundMomentum.bounce.setConfig({
				acceleration: 30
			});
			boundMomentum.setConfig({
				minVelocity: 1,
				minMomentumValue: 0,
				callback: this.animationScrollValue
			});

			bounce.setConfig({
				duration: 400,
				callback: this.animationScrollValue
			});
			bounceHelper.setConfig({
				duration: 400,
				callback: this.animationScrollValue
			});

			boundMomentum.isEnded = () => {

				let result = this.boundMomentumIsEndedFn.call(boundMomentum);
				
				if (! boundMomentum.isOutOfBound && result) {
					animationScrollValueHelper();
				}

				return result;
			}

			let animationScrollValueHelper = () => {
				/*
				let scrollValue = this.scrollValue, deltaValue = scrollValue % 18,
					boundValue  = scrollValue - deltaValue + (deltaValue < 9 ? 0 : 18);
				*/

				let scrollValue = Math.round(this.scrollValue / 18);
				let supplyValue = scrollValue * 18 - this.scrollValue;

				bounceHelper.setConfig({
					startTime: Date.now(),
					startValue: this.scrollValue,
					endValue: this.scrollValue + supplyValue
				});

				bounceHelper.run();
			}
		}
	}
</script>