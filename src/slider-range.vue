<template>
	<div v-if="show" class="slider-range" ref="sliderRange">
		<div class="slider-range__track"> <!--  @click="onTrackClick" -->
			<div
				class="slider-range__range"
				:style="{ left: firstThumbPosition + '%', right: 100 - secondThumbPosition + '%' }"
				@mousedown="onRangeMouseDown"
			/>
			<div
				class="slider-range__thumb slider-range__thumb--left"
				:style="{ left: firstThumbPosition + '%' }"
				@mousedown="onFirstThumbMouseDown"
			>
				<div class="tooltip">
					{{ valueMin }} {{ unit }}
				</div>
			</div>
			<div
				class="slider-range__thumb slider-range__thumb--right"
				:style="{ left: secondThumbPosition + '%' }"
				@mousedown="onSecondThumbMouseDown"
			>
				<div class="tooltip">
					{{ valueMax }} {{ unit }}
				</div>
			</div>
		</div>
		<input
			type="range"
			:value="valueMin"
			:min="min"
			:max="valueMax"
			:step="step"
			@input="updateThumbMinValue($event.target.value)"
			class="visually-hidden"
		/>
		<input
			type="range"
			:value="valueMax"
			:min="valueMin"
			:max="max"
			:step="step"
			@input="updateThumbMaxValue($event.target.value)"
			class="visually-hidden"
		/>
	</div>
</template>

<script setup lang="ts">
	import {ref, watchEffect} from 'vue'

	const {min, max, valueMin, valueMax, step, offset, show, orientation, disabled, unit} = defineProps({
		valueMin: { type: Number, default: 30 },
		valueMax: { type: Number, default: 70 },
		min: { type: Number, default: 10 },
		max: { type: Number, default: 100 },
		step: { type: Number, default: 5 },
		offset: { type: Number, default: 10 },

		show: { type: Boolean, default: true },
		orientation: { type: String, default: 'horizontal' },
		disabled: { type: Boolean, default: false },
		unit: { type: String, default: '' }
	})

	const emits = defineEmits();

	let sliderRange = ref(null),
		containerWidth = ref(null),
		firstThumbPosition = ref(0),
		secondThumbPosition = ref(0),
		activeThumb = ref(null),
		thumbMinValue = ref(valueMin),
		thumbMaxValue = ref(valueMax)

	const thumbWidth = 19

	const updateThumbMinValue = (value) => {
		let newValue: number = value
		if (newValue < max && newValue >= min && newValue < thumbMaxValue.value - offset) {
			thumbMinValue.value = Math.round(newValue / step) * step
			emits('update:valueMin', Math.round(newValue / step) * step)
		}
	}

	const updateThumbMaxValue = (value) => {
		let newValue: number = value
		if (newValue > min && newValue <= max && newValue > thumbMinValue.value + offset) {
			thumbMaxValue.value = Math.round(newValue / step) * step
			emits('update:valueMax', Math.round(newValue / step) * step)
		}
	}

	watchEffect(() => {
		if (sliderRange.value) {
			containerWidth.value = sliderRange.value.offsetWidth

			const thumbWidthPercent = (thumbWidth / containerWidth.value) * 100

			let thumbMinWay = ((thumbMinValue.value - min) / (max - min))  * 100,
				thumbMinPosition = (thumbWidthPercent * thumbMinWay) / 100
			firstThumbPosition.value = thumbMinWay - thumbMinPosition

			let thumbMaxWay = ((thumbMaxValue.value - min) / (max - min))  * 100,
				thumbMaxPosition = (thumbWidthPercent * thumbMaxWay) / 100
			secondThumbPosition.value = thumbMaxWay - thumbMaxPosition
		}
	})

	const onFirstThumbMouseDown = () => {
		activeThumb.value = 'thumb1'
		window.addEventListener('mousemove', onMouseMove)
		window.addEventListener('mouseup', onMouseUp)
	}

	const onSecondThumbMouseDown = () => {
		activeThumb.value = 'thumb2'
		window.addEventListener('mousemove', onMouseMove)
		window.addEventListener('mouseup', onMouseUp)
	}

	const onRangeMouseDown = () => {
		activeThumb.value = 'range'
		window.addEventListener('mousemove', onMouseMove)
		window.addEventListener('mouseup', onMouseUp)
	}

	const onMouseMove = (event) => {
		const trackRect = document.querySelector('.slider-range__track').getBoundingClientRect()
		const mousePosition = event.clientX - trackRect.left
		const mouseValue = ((mousePosition / trackRect.width) * (max - min)) + min

		if (activeThumb.value === 'thumb1') {
			updateThumbMinValue(mouseValue)
		} else if (activeThumb.value === 'thumb2') {
			updateThumbMaxValue(mouseValue)
		} else if (activeThumb.value === 'range') {
			const rangeWidth = thumbMaxValue.value - thumbMinValue.value
			let newValue1 = mouseValue - rangeWidth / 2
			let newValue2 = mouseValue + rangeWidth / 2

			if (newValue1 < min) {
				newValue1 = min
				newValue2 = newValue1 + rangeWidth
			}

			if (newValue2 > max) {
				newValue2 = max
				newValue1 = newValue2 - rangeWidth
			}

			updateThumbMinValue(newValue1)
			updateThumbMaxValue(newValue2)
		}
	}

	const onMouseUp = () => {
		activeThumb.value = null
		window.removeEventListener('mousemove', onMouseMove)
	}
</script>

<style scoped>
.slider-range{
	position:relative;
}
.slider-range__track{
	position:relative;
	height:5px;
	background-color: #B3B8BB;
}
.slider-range__range{
	position:absolute;
	top:0;
	bottom:0;
	background-color: #00A04F;
}
.slider-range__thumb{
	position:absolute;
	top:-7px;
	width:19px;
	height:19px;
	border-radius:50%;
	border: 2px solid #00A04F;
}
.slider-range__thumb--left{
	background-color: #fff;
}
.slider-range__thumb--right{
	background-color: #fff;
}
.visually-hidden{
	position:absolute;
	clip:rect(0,0,0,0);
}
</style>

<style setup>

.tooltip {
	position: absolute;
	width: auto;
	padding: 5px 20px;
	transform: translate(calc((var(--thumb-width) / 2) - var(--thumb-border-width) - 50%), -120%);
	background-color: var(--tooltip-bg);
	text-align: center;
	white-space: nowrap;
	user-select: none;
	color: #fff;
	border-radius: 6px;
	transition: opacity .3s;
	pointer-events: none !important;
	visibility: hidden;
	opacity: 0;
	z-index: 1000;
}

.tooltip::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translate(-50%, 100%);
	background: transparent;
	border-left: 5px solid transparent;
	border-right: 5px solid transparent;
	border-top: 4px solid var(--tooltip-bg);
}

/* Show the tooltip text when you mouse over the tooltip container */
.slider-simple__thumb:hover .tooltip,
.slider-simple__thumb:active .tooltip,
.slider-simple__thumb:focus .tooltip,
.slider-range__thumb:hover .tooltip,
.slider-range__thumb:active .tooltip,
.slider-range__thumb:focus .tooltip
{
	visibility: visible;
	opacity: 1;
}
</style>