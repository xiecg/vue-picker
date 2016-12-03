<style>
	
</style>

<template>
	<div class="picker-item" v-touch:panstart="onPanStart" v-touch:panmove="onPanMove" v-touch:panend="onPanEnd">
		<div :style="{ transform: 'rotateX('+ scrollValue +'deg)' }" class="picker-item-content" v-for-nested="values"></div>
	</div>
</template>

<script>
	export default {
		data () {
			return {
				last: 0,
				lastTime: 0,
				lastDis: 0,
				lastTimeDis: 0,
				startPageY: 0,
				scrollValue: 0
			}
		},
		props: {
			values: {
				type: Array,
				default : []
			},
			count: {
				type: Number,
				default: 0
			}
		},
		methods: {
			onPanStart (...initialArgs) {
				let e = initialArgs[0];
				this.startPageY = e.changedPointers[0].pageY;
				this.lastTime = e.timeStamp;
				this.lastTimeDis = 0;
				this.last = this.scrollValue;
				this.lastDis = 0;
			},
			onPanMove (...initialArgs) {
				let e = initialArgs[0];
				let newTime = e.timeStamp;
				this.scrollValue = (this.last - (e.changedPointers[0].pageY - this.startPageY));

				// this.lastTimeDis = newTime - this.lastTime;
				// this.lastDis = this.scrollValue - this.last;
				// this.last = this.scrollValue;
			},
			onPanEnd (...initialArgs) {
				let e = initialArgs[0];
				let target = (e.overallVelocityY + (this.scrollValue));
				let now = Math.round(target / 18);

				now = now < 0 ? 0 : now;
				now = now > this.count ? this.count : now;

				let dis = now * 18 - this.scrollValue;
				console.log(dis);

			}
		},
		mounted () {

			// console.log('picker-item', this.count)
		}
	}
</script>