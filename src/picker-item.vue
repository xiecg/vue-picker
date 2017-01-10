<style></style>

<template>
	<touch class="picker-item" v-on:panstart="onPanStart" v-on:panmove="onPanMove" v-on:panend="onPanEnd">
		<div ref="pickerItemContent" :style="{ transform: 'rotateX('+ scrollValue +'deg)' }" class="picker-item-content" v-for-nested="[currentValues, keyName]"></div>
	</touch>
</template>

<script>

	import { EaseOutEasing, BounceEasing, MomentumEasing, BoundMomentumEasing } from './animation-es5';

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
			},
			index: {
				type: Number,
				default: 0
			},
			itemIndex: {
				type: Number
			},
			keyName: {
				type: String,
				default: 'value'
			},
			maxScrollValue: {
				type: Number
			}
		},
		data () {
			return {
				startValue: 0,
				startPageY: 0,
				scrollValue: 0,
				maxVelocity: 6,
				currentValues: this.values,
				currentMaxScrollValue: this.maxScrollValue,
				baseScrollValue: 0,
				firstTimeRequest: true,
				poolData: [],
				count: 0,
				requestStart: 0,
				lastValues: [],
				currentIndex: 0,
				isSend: true
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
				this.isSend = true;
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
				
				this.maxMomentumValue = (this.currentMaxScrollValue - 1) * 18;

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
						this.poolData = this.poolData.concat(data);
					}
				}
			},
			onScroll (value, oldValue) {

				this.setAlpha(value);

				this.currentIndex = Math.round(value / 18);

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
			},
			initAnimation () {
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
		},
		mounted () {
			this.lastValues = this.currentValues;
			this.setAlpha(0);
			this.initAnimation();
			let defaultValue = this.index * 18;

			if (! defaultValue) {
				this.$emit('change', this.itemIndex, this.allValues[0], false);
				return;
			}

			for(let i = 0; i <= defaultValue; i+=18) {
				this.onScroll(i, this.scrollValue);
				this.scrollValue = i;
				this.isSend = false;
			}
		},
		watch: {
			allValues (newAllValues) {
				this.setAlpha(0);
				this.scrollValue = 0;
				this.firstTimeRequest = true;
				this.baseScrollValue = 0;
				this.firstTimeRequest = true;
				this.poolData = [];
				this.count = 0;
				this.currentIndex = 0;
				this.requestStart = 0;
				this.currentValues = newAllValues.slice(0, 15);
				this.lastValues = this.currentValues;
				this.currentMaxScrollValue = newAllValues.length;
				this.$emit('change', this.itemIndex, newAllValues[0], true);
			},
			currentIndex (newIndex, oldIndex) {
				let result = this.allValues[newIndex];
				if (result) {
					this.$emit('change', this.itemIndex, result, this.isSend);
				}
			},
			maxScrollValue (newValue, oldValue) {
				this.currentMaxScrollValue = newValue;
				newValue = newValue - 1;
				if (newValue > this.currentIndex) {
					return;
				}
				this.bounceHelper.stop();
				this.bounce.stop();
				this.boundMomentum.stop();

				this.bounceHelper.setConfig({
					startTime: Date.now(),
					startValue: this.scrollValue,
					endValue: newValue * 18
				});

				this.bounceHelper.run();
			},
			index (newIndex, oldIndex) {
				let targetValue = newIndex * 18;
				let currentValue = this.scrollValue;
				this.isSend = true;
				if (this.scrollValue > targetValue) {
					for(let i = currentValue; i >= targetValue; i-=18) {
						this.onScroll(i, this.scrollValue);
						this.scrollValue = i;
					}
				} else {
					for(let i = currentValue; i <= targetValue; i+=18) {
						this.onScroll(i, this.scrollValue);
						this.scrollValue = i;
					}
				}
			}
		}
	}
</script>