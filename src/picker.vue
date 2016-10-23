
<style scoped>

@keyframes picker-close {

	0% {
		transform: translateY(0%)
	}

	100% {
		transform: translateY(100%);
	}
}

@keyframes picker-open {
	
	0% {
		transform: translateY(100%);
	}

	100% {
		transform: translateY(0);
	}
}

@keyframes picker-close-backdrop {
	
	0% {
		opacity: 1;
	}
	
	50% {
		opacity: 1;
	}
	
	100% {
		opacity: 0;
	}
}

@keyframes picker-open-backdrop {
	
	0% {
		opacity: 0;
	}
	
	50% {
		opacity: 1;
	}

	100% {
		opacity: 1;
	}
}

.picker-enter-active {
	animation: picker-open-backdrop 0.3s ease-out;
}
.picker-enter-active .picker-wrapper {
	animation: picker-open 0.3s ease;
}

.picker-leave-active {
	animation: picker-close-backdrop 0.3s ease-out;
}
.picker-leave-active .picker-wrapper {
	animation: picker-close 0.3s ease;
}

.picker-backdrop{
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	z-index: 999;
}

.picker-wrapper{
	position: absolute;
	left: 0;
	bottom: 0;
	width: 100%;
	background: transparent;
	transform: translate3d(0px, 0px, 0px);
}

.picker-wrapper .top-content, .picker-wrapper .bottom-content{
	display: flex;
	width: 100%;
	background-color: #fff;
	justify-content: center;
}

.picker-wrapper .picker-content {
	position: relative;
	width: 100%;
	height: 216px;
	background: white;
}

.picker-wrapper .picker-body{
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: row;
	justify-content: center;
}

.picker-flex-body .picker-item{
	flex: 1;
}

.picker-wrapper .picker-helper{
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.picker-wrapper .picker-helper:before{
	content: '';
	width: 100%;
	height: 38px;
	border-top: 1px solid #adb0a7;
	border-bottom: 1px solid #adb0a7;
	display: flex;
}

.picker-wrapper .picker-item {
	font-size: 20px;
	height: 100%;
	position: relative;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.picker-item-container {
	perspective: 1200px;
	display: flex;
	transform-style: preserve-3d;
	perspective-origin: center center;
	position: relative;
	width: 100%;
	height: 38px;
	border-top: 1px solid #adb0a7;
	border-bottom: 1px solid #adb0a7;
}

.picker-item-container>div{
	position: absolute;
	width: 100%;
	height: 36px;
	opacity: 0.3;
	overflow: hidden;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	transform-origin: center center -110px;
	backface-visibility: hidden;
	-webkit-backface-visibility: hidden;
}

.picker-item-container>div.scroller-is-current{
	opacity: 1;
}

</style>


<template>

	<transition name="picker">

		<div class="picker-backdrop" v-show="value" @click="close">

			<div class="picker-wrapper">

				<slot class="top-content" name="top-content"></slot>

				<div class="picker-content">
					
					<div class="picker-body" :class="{ 'picker-flex-body': isFlex }">
						
						<div v-for="item in dataItems" class="picker-item" :style="{ width: item.width }">
							<div class="picker-item-container">
								<div v-for="list in items" :class="{ 'scroller-is-current': list == 1 }"></div>
							</div>
						</div>

					</div>

					<div class="picker-helper" v-touch:panstart="onPanStart" v-touch:panmove="onPanMove" v-touch:panend="onPanEnd"></div>

				</div>

				<slot class="bottom-content" name="bottom-content"></slot>
			</div>

		</div>

	</transition>

</template>

<script>

	import Vue from 'vue';

	import VueTouch from 'vue-touch';

	import { EaseOutEasing, BounceEasing, MomentumEasing, BoundMomentumEasing } from './animation-es5';

	Vue.use(VueTouch);
	
	export default {

		name: 'picker',

		data () {

			return {

				text : 'picker',
				items : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
				propertyConfig : {},
				isFlex : true
			}
		},

		props: {
			value: {
				type: Boolean
			},
			dataItems: {
				type: Array
			}
		},

		methods : {

			close (...initialArgs) {

				let e = initialArgs[0];

				if (e.target && e.target.classList.contains('picker-backdrop')) {

					this.$emit('input', false);
				}
			},

			onPanStart (...initialArgs) {

				let e = initialArgs[0];

				let changedPointers = e.changedPointers[0],
					pageX = changedPointers.pageX;

				this.itemEl.forEach((el) => {
					
					if (pageX > el.offsetLeft) {

						this.activeScrollerEl = el;
					}
				});

				this.activeScrollerEl.bounceHelperLock = false;

				this.startPageY = changedPointers.pageY;

				this.startValue = this.activeScrollerEl.scrollValue;

				this.activeScrollerEl.bounceHelper.stop();
				this.activeScrollerEl.bounce.stop();
				this.activeScrollerEl.boundMomentum.stop();
			},

			onPanMove (...initialArgs) {

				let e = initialArgs[0];

				if (this.activeScrollerEl.bounceHelperLock) return;

				this.activeScrollerEl.scrollValue = this.startValue - (e.changedPointers[0].pageY - this.startPageY);
			},

			onPanEnd (...initialArgs) {

				let e = initialArgs[0];

				if (this.activeScrollerEl.bounceHelperLock) return;

				let activeScrollerEl = this.activeScrollerEl;

				let scrollValue = activeScrollerEl.scrollValue,
					minScrollValue = activeScrollerEl.minScrollValue,
					maxScrollValue = activeScrollerEl.maxScrollValue,
					velocity = e.velocityY,
					boundValue = null, maxVelocity = 6;

				if (scrollValue < minScrollValue) {

					boundValue = minScrollValue;
				} else if (scrollValue >= maxScrollValue) {

					boundValue = maxScrollValue;
				}

				if (boundValue !== null) {

					activeScrollerEl.bounce.setConfig({
						startTime: Date.now(),
						startValue: scrollValue,
						endValue: boundValue
					});

					activeScrollerEl.bounce.run();

					return;
				}

				if (velocity < -maxVelocity) {

					velocity = -maxVelocity;
				} else if (velocity > maxVelocity) {

					velocity = maxVelocity;
				}

				activeScrollerEl.boundMomentum.momentum.setConfig({
					startTime: Date.now(),
					startValue: scrollValue,
					startVelocity: velocity
				});

				activeScrollerEl.boundMomentum.setConfig({
					maxMomentumValue: maxScrollValue,
					startValue: scrollValue,
					startVelocity: velocity,
					callback: activeScrollerEl.animationScrollValue
				});

				activeScrollerEl.boundMomentum.run();
			},

			init (el, index) {

				let i = index + 1, config = {},
					baseScrollValue = 0, count = 0, requestStart = 0,
					firstTimeRequest = true,
					onRequestData = null,
					onRequestDataName = `onRequestData${i}`,
					poolData = [],
					emptyFunc = () => {};

				let requestPoolData = () => {

					if (count + 3 >= requestStart * 5) {

						let data = this.$el[onRequestDataName]((requestStart++) * 50, requestStart * 50, i),
							length;

						if (data instanceof Array) {

							data = data.slice(0, 50);
							length = data.length;
							poolData = poolData.concat(data);

							if (firstTimeRequest) {

								length = length - 1;

								el.maxScrollValue = (length < 0 ? 0 : length) * 18;
							} else {

								el.maxScrollValue += length * 18;
							}
						}
					}
				};

				this.propertyConfig[onRequestDataName] = {

					set (func) {
						
						if (func instanceof Function) {

							onRequestData = func;
						}
					},

					get () {

						return onRequestData || emptyFunc;
					}
				};

				this.propertyConfig[`data${i}`] = {

					set (data) {

						el.data = data;
					},

					get () {

						return el.data;
					}
				};

				this.propertyConfig[`value${i}`] = {

					set (value) {

						el.value = value;
					},

					get () {

						return el.value;
					}
				};

				this.propertyConfig[`scrollValue${i}`] = {

					set (value) {

						el.scrollValue = value;
					},

					get () {

						return el.scrollValue;
					}
				};

				this.propertyConfig[`maxScrollValue${i}`] = {

					set (value) {

						el.maxScrollValue = value;
					},

					get () {

						return el.maxScrollValue;
					}
				};

				this.$el[`reset${i}`] = () => {

					el.reset();

					firstTimeRequest = true;

					el.maxScrollValue = requestStart = count = baseScrollValue = poolData.length = poolData.length = 0;
				};

				el.scroll = (el, value, oldValue) => {

					var data, helperData,
						countHelper;

					if (value >= oldValue) {

						if (value - baseScrollValue > 90) {

							if (firstTimeRequest) {

								requestPoolData();
								firstTimeRequest = false;
							}

							baseScrollValue += 90;

							data = poolData.slice(15 + (count++) * 5, 15 + count * 5);
							data.length = 5;
							helperData = el.data;
							countHelper = (count + 2) % 4;
							countHelper += countHelper < 0 ? 4 : 0;

							Array.prototype.splice.apply(helperData, [5 * countHelper, 5].concat(data));
							
							el.data = helperData;

							requestPoolData();
						}

					} else {

						if (value < baseScrollValue) {

							if (firstTimeRequest) {

								requestPoolData();
								firstTimeRequest = false;
							}

							baseScrollValue -= 90;
							--count;
							data = count > 0 ? poolData.slice((count - 1) * 5, count * 5) : [];
							data.length = 5;
							helperData = el.data;
							countHelper = (count - 1) % 4;
							countHelper += countHelper < 0 ? 4 : 0;

							Array.prototype.splice.apply(helperData, [5 * countHelper, 5].concat(data));

							el.data = helperData;
						}
					}
				}

				this.sphereScroller(el);
			},

			getItemValue () {

				let result = [];

				this.itemEl.forEach((n) => {
					
					result.push(n.value);
				});

				return result;
			},

			sphereScroller (el) {

				let self = this,
					currentIndex = 0,
					firstEl = el.firstElementChild.firstElementChild,
					currentEl = firstEl,
					childEls = Array.prototype.slice.apply(el.firstElementChild.children);

				el.bounceHelperLock = false;

				let boundMomentum = new BoundMomentumEasing,
					boundMomentumIsEndedFn = boundMomentum.isEnded,
					bounce = new EaseOutEasing,
					bounceHelper = new EaseOutEasing;

				let animationScrollValue = (value) => {

					el.scrollValue = value;
				}

				el.animationScrollValue = animationScrollValue;

				boundMomentum.momentum.setConfig({
					acceleration: 30,
					friction: 0.5
				});
				boundMomentum.bounce.setConfig({
					acceleration: 30
				});
				boundMomentum.setConfig({
					minVelocity: 1,
					minMomentumValue: 0,
					callback: animationScrollValue
				});

				bounce.setConfig({
					duration: 400,
					callback: animationScrollValue
				});

				bounceHelper.setConfig({
					duration: 400,
					callback: animationScrollValue
				});

				let animationScrollValueHelper = () => {

					let scrollValue = el.scrollValue,
						deltaValue = scrollValue % 18,
						boundValue;

					boundValue = scrollValue - deltaValue + (deltaValue < 9 ? 0 : 18);

					el.bounceHelper.setConfig({
						startTime: Date.now(),
						startValue: scrollValue,
						endValue: boundValue
					});

					el.bounceHelper.run();
				}

				boundMomentum.isEnded = () => {

					let result = boundMomentumIsEndedFn.call(boundMomentum);

					if (!boundMomentum.isOutOfBound && result) {

						animationScrollValueHelper();
					}

					return result;
				};

				el.bounceHelper = bounceHelper;
				el.bounce = bounce;
				el.boundMomentum = boundMomentum;

				Object.defineProperties(el, {

					data : {

						set (data) {

							if (!(data instanceof Array)) return;

							let length = data.length,
								value, htmlValue;

							(delete this.$data) && (this.$data = []);

							childEls.forEach((el, i) => {

								if (i < length) {

									value = data[i];

									this.$data.push(value);
									
									htmlValue = value instanceof Object ? value[this.dataKey] : value;

									el.innerHTML = htmlValue === undefined ? '' : htmlValue;
								} else {

									el.innerHTML = '';
								}
							});

						},
						get () {

							return this.$data || [];
						}
					},

					minScrollValue : {

						get () {

							return 0;
						}
					},

					maxScrollValue : {

						set (value) {

							el.$maxScrollValue = value;
						},
						get () {

							return parseInt(el.$maxScrollValue || 0);
						}
					},

					value: {

						set (value) {

							let baseScrollValue = Math.floor(Math.round(this.scrollValue) / 360) * 360,
								data = this.data,
								itemValue, i = 0,
								length = data.length;

							this.bounceHelperLock = true;

							this.bounceHelper.stop();
							this.bounce.stop();
							this.boundMomentum.stop();

							for (; i < length; ++i) {

								itemValue = data[i];

								if (itemValue instanceof Object) {

									if (value instanceof Object) {

										if (itemValue.$key === value.$key && itemValue[el.dataKey] === value[el.dataKey]) {

											break;
										}
									} else {

										if (itemValue.$key === value || itemValue[el.dataKey] === value) {

											break;
										}
									}
								} else {

									if (itemValue === value || value.$key || value[el.dataKey]) {

										break;
									}
								}
							}

							i = i < 20 ? i : 0;

							this.bounceHelper.setConfig({
								startTime: Date.now(),
								startValue: this.scrollValue,
								endValue: baseScrollValue + i * 18
							});

							this.bounceHelper.run();
						},
						get () {
							
							return this.data[currentIndex];
						}
					},

					scrollValue: {

						set (value) {

							let oldValue = el.scrollValue, index = Math.round(value / 18) % 20;
							
							childEls.forEach((el, i) => {

								el.style['transform'] = `translate3d(0, 0, -110px) rotateX(${(value - 18 * i)}deg)`;
							});
							
							if (index < 0) index += 20;

							if (index !== currentIndex) {

								currentEl.classList.remove('scroller-is-current');

								currentEl = childEls[index];

								currentEl.classList.add('scroller-is-current');

								currentIndex = index;

								self.$emit('change', self.getItemValue(), self.$el, self.reset);
							};

							el.scroll(el, value, oldValue);
						},
						get () {
							
							return Number(((firstEl.style['transform'] || '').match(/rotateX\((\-?\d+(?:\.\d+)?)deg\)/) || [0, 0])[1]);
						}
					}
				});

				el.reset = () => {

					el.data = [];
					el.bounceHelper.stop();
					el.bounce.stop();
					el.boundMomentum.stop();
					el.scrollValue = 0;
				}
			},

			reset (index, result) {

				let data = result.slice(0, 15);

				this.$el[`reset${index}`]();

				this.$el[`data${index}`] = data;

				this.$el[`maxScrollValue${index}`] = (data.length - 1) * 18;

				this.$el[`onRequestData${index}`] = (begin, end, index) => {
					
					return result.slice(begin, end);
				};

				this.$emit('change', this.getItemValue(), this.$el, () => {});
			},

			locateToDefaultValue (el, index, data, targetValue, maxValue) {

				let dataName = `data${index}`,
					maxScrollValueName = `maxScrollValue${index}`,
					scrollValueName = `scrollValue${index}`;

				el[dataName] = data;
				el[maxScrollValueName] = (maxValue - 1) * 18;
				el[scrollValueName] += 1;

				for (let i = 1; i < maxValue + 1; i += 5) {
					
					if (targetValue < i + 5) {

						el[scrollValueName] += (targetValue - i) * 18;

						break;
					}

					el[scrollValueName] += 90;
				}

				el[scrollValueName] -= 1;
			},

			create (result) {
				
				let isFlex = false;

				this.itemEl = Array.prototype.slice.apply(this.$el.querySelectorAll('.picker-item'));

				this.itemEl.forEach(this.init);

				Object.defineProperties(this.$el, this.propertyConfig);

				result.forEach((n, i) => {

					n.values.map((n, i) => {

						(n instanceof Object) && (n.$key = (i+1));
					});

					if (!n.width) {

						isFlex = true;
					}

					let index = n.index || 1,
						values = n.values;

					this.itemEl[i]['dataKey'] = n.name || 'value';

					i = ++i;

					this.$el['onRequestData' + i] = (begin, end, index) => {
						
						return this.dataItems[index-1].values.slice(begin, end);
					};

					this.locateToDefaultValue(this.$el, i, values.slice(0, 15), index, values.length);
					
					this.isFlex = isFlex;
				});
			}
		},

		watch: {

			dataItems (result) {

				setTimeout(() => {

					result.length && (this.create(result));
				}, 0);
			}
		},

		mounted () {

			this.dataItems.length && (this.create(this.dataItems));
		}
	}
</script>
