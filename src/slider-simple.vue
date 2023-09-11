<template>
	<div v-if="show">
		<div class="slider-simple" ref="sliderSimple">
			<div class="slider-simple__track">
				<div class="slider-simple__range" :style="{ width: `${thumbPosition}%`}"></div>
				<div
					class="slider-simple__thumb"
					:style="{ left: `${thumbPosition}%` }"
					@mousedown="onThumbMouseDown"
				>
					<div class="tooltip">
						{{ value }} {{ unit }}
					</div>
				</div>
			</div>
			<input
				type="range"
				:value="value"
				:min="min"
				:max="max"
				:step="step"
				@input="updateThumbValue($event.target.value)"
				class="visually-hidden"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
	import {ref, watchEffect} from 'vue'

	const {value, min, max, step, show, orientation, disabled, unit} = defineProps({
		value: { type: Number, default: 0, required: true },
		min: { type: Number, default: 0, required: true },
		max: { type: Number, default: 100, required: true },
		step: { type: Number, default: 1 },

		show: { type: Boolean, default: true },
		orientation: { type: String, default: 'horizontal' },
		disabled: { type: Boolean, default: false },
		unit: { type: String, default: '' }
	})

	const emit = defineEmits()

	let sliderSimple = ref(null),
		containerWidth = ref(null),
		containerHeight = ref(null),
		thumbPosition = ref(value),
		thumbValue = ref(value)

	const thumbWidth = 19

	const updateThumbValue = (value: number) => {
		let newValue: number = value
		if(newValue >= min && newValue <= max) {
			thumbValue.value = Math.round(newValue / step) * step
			emit('update:value', thumbValue.value);
		}
	}

	watchEffect(() => {
		if (sliderSimple.value) {
			containerWidth.value = sliderSimple.value.offsetWidth
			containerHeight.value = sliderSimple.value.offsetHeight

			if(orientation === 'horizontal') {
				const thumbWidthPercent = (thumbWidth / containerWidth.value) * 100
				let way = ((thumbValue.value - min) / (max - min))  * 100,
					position = (thumbWidthPercent * way) / 100

				thumbPosition.value = way - position
			} else {}
		}
	})

	const onThumbMouseDown = () => {
		// activeThumb.value = 'thumb1'

		console.log('qwe')
		window.addEventListener('mousemove', onMouseMove)
		window.addEventListener('mouseup', onMouseUp)
		window.addEventListener('touchmove', onMouseMove)
		window.addEventListener('touchend', onMouseUp)
	}

	const onMouseMove = (event) => {
		const trackRect = document.querySelector('.slider-range__track').getBoundingClientRect()
		console.log(event.touches)
		const mousePosition = (event.touches ? event.touches[0].clientX : event.clientX) - trackRect.left
		const mouseValue = ((mousePosition / trackRect.width) * (max - min)) + min

		updateThumbValue(mouseValue)
	}

	const onMouseUp = () => {
		window.removeEventListener('mousemove', onMouseMove)
	}

</script>

<style scoped>
.slider-simple {
	position: relative;
}

.slider-simple input[type=range] {
	position: absolute;
	width: 100%;
	height: 100%;
	opacity: 0;
}

.slider-simple__track {
	position: relative;
	height: 5px;
	background-color: #B3B8BB;
}

.slider-simple__range{
	position:absolute;
	top:0;
	bottom:0;
	background-color: #00A04F;
}

.slider-simple__thumb {
	position: absolute;
	top: -7px;
	width: 19px;
	height: 19px;
	border-radius:50%;
	border: var(--thumb-border);
	background-color: #fff;
}

.visually-hidden{
	position:absolute;
	clip:rect(0,0,0,0);
}
</style>