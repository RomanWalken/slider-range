<template>
	<div class="slider-range" ref="sliderRange">
		<div class="slider-range__track"> <!--  @click="onTrackClick" -->
			<div
				class="slider-range__range"
				:style="{ left: secondThumbPosition + '%', right: 100 - thirdThumbPosition + '%' }"
				@mousedown="onRangeMouseDown"
			/>

			<div
				class="slider-range__thumb slider-range__thumb-pl"
				:style="{ left: firstThumbPosition + '%' }"
				@mousedown="onFirstThumbMouseDown"
			/>
			<div
				class="slider-range__thumb slider-range__thumb-pr"
				:style="{ left: secondThumbPosition + '%' }"
				@mousedown="onSecondThumbMouseDown"
			/>
			<div
				class="slider-range__thumb slider-range__thumb-pl"
				:style="{ left: thirdThumbPosition + '%' }"
				@mousedown="onThirdThumbMouseDown"
			/>
			<div
				class="slider-range__thumb slider-range__thumb-pr"
				:style="{ left: fourthThumbPosition + '%' }"
				@mousedown="onFourthThumbMouseDown"
			/>
		</div>
		<input
			type="range"
			:value="thumbLeftMinValue"
			:min="min"
			:max="max"
			:step="step"
			@input="updateThumbLeftMinValue($event.target.value)"
			class="visually-hidden"
		/>
		<input
			type="range"
			:value="thumbLeftMaxValue"
			:min="min"
			:max="max"
			:step="step"
			@input="updateThumbLeftMaxValue($event.target.value)"
			class="visually-hidden"
		/>
		<input
			type="range"
	        :value="thumbRightMinValue"
	        :min="min"
			:max="max"
			:step="step"
			@input="updateThumbRightMinValue($event.target.value)"
			class="visually-hidden"
		/>
		<input
			type="range"
			:value="thumbRightMaxValue"
			:min="min"
			:max="max"
			:step="step"
			@input="updateThumbRightMaxValue($event.target.value)"
			class="visually-hidden"
		/>

	</div>
</template>

<script setup lang="ts">
	import {ref, watchEffect} from 'vue'

	const {min, max, valueLeftMin, valueLeftMax, valueRightMin, valueRightMax, step, offset, innerLeftOffset, innerRightOffset} = defineProps({
		valueLeftMin: { type: Number, default: 30 },
		valueLeftMax: { type: Number, default: 70 },
		valueRightMin: { type: Number, default: 90 },
		valueRightMax: { type: Number, default: 130 },
		min: { type: Number, default: 10 },
		max: { type: Number, default: 200 },
		step: { type: Number, default: 5 },
		offset: { type: Number, default: 10 }, // Must be definition between valueRightMin & valueLeftMax
		innerLeftOffset: { type: Number, default: 5 },
		innerRightOffset: { type: Number, default: 5 }
	})

	const emits = defineEmits()

	let sliderRange = ref(null),
		containerWidth = ref(null),

		activeThumb = ref(null),
		firstThumbPosition = ref(0),
		secondThumbPosition = ref(0),
		thirdThumbPosition = ref(0),
		fourthThumbPosition = ref(0),
		thumbLeftMinValue = ref(valueLeftMin),
		thumbLeftMaxValue = ref(valueLeftMax),
		thumbRightMinValue = ref(valueRightMin),
		thumbRightMaxValue = ref(valueRightMax)

	const thumbWidth = 19

	const updateThumbLeftMinValue = (value) => {
		let newValue: number = value
		if (newValue >= min && newValue < thumbLeftMaxValue.value - innerLeftOffset) {
			thumbLeftMinValue.value = Math.round(newValue / step) * step
			emits('update:valueLeftMin', thumbLeftMinValue.value)
		}
	}

	const updateThumbLeftMaxValue = (value) => {
		let newValue: number = value
		if (newValue > thumbLeftMinValue.value + innerLeftOffset && newValue < thumbRightMinValue.value) {
			thumbLeftMaxValue.value = Math.round(newValue / step) * step
			emits('update:valueLeftMax', thumbLeftMaxValue.value)
		}
	}

	const updateThumbRightMinValue = (value) => {
		let newValue: number = value
		if (newValue > thumbLeftMaxValue.value && newValue < thumbRightMaxValue.value - innerRightOffset) {
			console.log(newValue)
			thumbRightMinValue.value = Math.round(newValue / step) * step
			emits('update:valueRightMin', thumbRightMinValue.value)
		}
	}

	const updateThumbRightMaxValue = (value) => {
		let newValue: number = value
		if (newValue > thumbRightMinValue.value + innerRightOffset && newValue <= max) {
			thumbRightMaxValue.value = Math.round(newValue / step) * step
			emits('update:valueRightMax', thumbRightMaxValue.value)
		}
	}

	watchEffect(() => {
		if (sliderRange.value) {
			containerWidth.value = sliderRange.value.offsetWidth

			const thumbWidthPercent = ((thumbWidth / 2) / containerWidth.value) * 100

			let thumbLeftMinWay = ((thumbLeftMinValue.value - min) / (max - min))  * 100,
				thumbLeftMinPosition = (thumbWidthPercent * thumbLeftMinWay) / 100,
				thumbLeftMinResult = thumbLeftMinWay - thumbLeftMinPosition
			console.log(thumbLeftMinResult)
			firstThumbPosition.value = thumbLeftMinResult

			let thumbLeftMaxWay = ((thumbLeftMaxValue.value - min) / (max - min))  * 100,
				thumbLeftMaxPosition = (thumbWidthPercent * thumbLeftMaxWay) / 100,
				thumbLeftMaxResult = thumbLeftMaxWay - thumbLeftMaxPosition
			console.log(thumbLeftMaxResult)
			secondThumbPosition.value = thumbLeftMaxResult

			let thumbRightMinWay = ((thumbRightMinValue.value - min) / (max - min))  * 100,
				thumbRightMinPosition = (thumbWidthPercent * thumbRightMinWay) / 100,
				thumbRightMinResult = thumbRightMinWay - thumbRightMinPosition
			console.log(thumbRightMinResult)
			thirdThumbPosition.value = thumbRightMinResult

			let thumbRightMaxWay = ((thumbRightMaxValue.value - min) / (max - min))  * 100,
				thumbRightMaxPosition = (thumbWidthPercent * thumbRightMaxWay) / 100,
				thumbRightMaxResult = thumbRightMaxWay - thumbRightMaxPosition
			console.log(thumbRightMaxResult)
			fourthThumbPosition.value = thumbRightMaxResult
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

	const onThirdThumbMouseDown = () => {
		activeThumb.value = 'thumb3'
		window.addEventListener('mousemove', onMouseMove)
		window.addEventListener('mouseup', onMouseUp)
	}

	const onFourthThumbMouseDown = () => {
		activeThumb.value = 'thumb4'
		window.addEventListener('mousemove', onMouseMove)
		window.addEventListener('mouseup', onMouseUp)
	}

	const onRangeMouseDown = () => {
		activeThumb.value = 'range'
		window.addEventListener('mousemove', onMouseMove)
		window.addEventListener('mouseup', onMouseUp)
	}

	let test = ref(null)

	const onMouseMove = (event) => {
		const trackRect = document.querySelector('.slider-range__track').getBoundingClientRect()
		const mousePosition = event.clientX - trackRect.left
		const mouseValue = ((mousePosition / trackRect.width) * (max - min)) + min

		if (activeThumb.value === 'thumb1') {
			updateThumbLeftMinValue(mouseValue)
		} else if (activeThumb.value === 'thumb2') {
			updateThumbLeftMaxValue(mouseValue)
		} else if(activeThumb.value === 'thumb3') {
			updateThumbRightMinValue(mouseValue)
		} else if(activeThumb.value === 'thumb4') {
			updateThumbRightMaxValue(mouseValue)
		} else if (activeThumb.value === 'range') {
			const mainRangeWidth = thumbRightMinValue.value - thumbLeftMaxValue.value
			const leftRangeWidth = thumbLeftMaxValue.value - thumbLeftMinValue.value
			const rightRangeWidth = thumbRightMaxValue.value - thumbRightMinValue.value

			let newValue1,
				newValue2 = mouseValue - mainRangeWidth / 2,
				newValue3 = mouseValue + mainRangeWidth / 2,
				newValue4

			newValue1 = newValue2 - leftRangeWidth
			newValue4 = newValue3 + rightRangeWidth

			if (newValue1 < min) {
				newValue1 = min
				newValue2 = newValue1 + leftRangeWidth
				newValue3 = newValue2 + mainRangeWidth
				newValue4 = newValue3 + rightRangeWidth
			}

			if (newValue4 > max) {
				newValue4 = max
				newValue3 = newValue4 - rightRangeWidth
				newValue2 = newValue3 - mainRangeWidth
				newValue1 = newValue2 - leftRangeWidth
			}

			test.value = leftRangeWidth

			updateThumbLeftMinValue(newValue1)
			updateThumbLeftMaxValue(newValue2)
			updateThumbRightMinValue(newValue3)
			updateThumbRightMaxValue(newValue4)
		}
	}

	console.log(test.value)

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
		width: calc(19px / 2);
		height:19px;
		background: #fff;
	}

	.slider-range__thumb-pl {
		border-top: 2px solid #00A04F;
		border-left: 2px solid #00A04F;
		border-bottom: 2px solid #00A04F;
		border-top-left-radius: 20px;
		border-bottom-left-radius: 20px;
	}

	.slider-range__thumb-pr {
		border-top: 2px solid #00A04F;
		border-right: 2px solid #00A04F;
		border-bottom: 2px solid #00A04F;
		border-top-right-radius: 20px;
		border-bottom-right-radius: 20px;
	}

	.visually-hidden{
		position:absolute;
		clip:rect(0,0,0,0);
	}
</style>
