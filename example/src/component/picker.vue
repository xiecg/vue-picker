<style>

@keyframes picker-close {
	0% { transform: translateY(0%) }
	100% { transform: translateY(100%) }
}

@keyframes picker-open {
	0% { transform: translateY(100%) }
	100% { transform: translateY(0) }
}

@keyframes picker-close-backdrop {
	0% { opacity: 1 }
	50% { opacity: 1 }
	100% {opacity: 0 }
}

@keyframes picker-open-backdrop {
	0% { opacity: 0 }
	50% { opacity: 1 }
	100% { opacity: 1 }
}

@component-namespace componentName {
	@component actionsheet {
		background: red;
	}
}

.text-test {
	@utils-ellipsis 3;
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

</style>

<template>
	<transition name="picker">
		<div class="picker-backdrop text-test componentName-actionsheet" v-show="value" @click="close">
			<div class="picker-wrapper">
				<slot class="top-content" name="top-content"></slot>
				<div class="picker-content">
					<div class="picker-body">
						body
					</div>
					<!-- <div class="picker-helper" v-touch:panstart="onPanStart" v-touch:panmove="onPanMove" v-touch:panend="onPanEnd"></div> -->
				</div>
				<slot class="bottom-content" name="bottom-content"></slot>
			</div>
		</div>
	</transition>
</template>

<script>

	import Vue from 'vue';

	import VueTouch from 'vue-touch';

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
			},
			onPanMove (...initialArgs) {
				let e = initialArgs[0];
			},
			onPanEnd (...initialArgs) {
				let e = initialArgs[0];
			}
		},
		watch: {
			dataItems (result) {
			}
		},
		mounted () {
		}
	}
</script>
