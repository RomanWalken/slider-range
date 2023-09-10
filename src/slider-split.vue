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
			>
				<div class="tooltip">
					{{ valueLeftMin }} {{ unit }}
				</div>
			</div>
			<div
				class="slider-range__thumb slider-range__thumb-pr"
				:style="{ left: secondThumbPosition + '%' }"
				@mousedown="onSecondThumbMouseDown"
			>
				<div class="tooltip">
					{{ valueLeftMax }} {{ unit }}
				</div>
			</div>
			<div
				class="slider-range__thumb slider-range__thumb-pl"
				:style="{ left: thirdThumbPosition + '%' }"
				@mousedown="onThirdThumbMouseDown"
			>
				<div class="tooltip">
					{{ valueRightMin }} {{ unit }}
				</div>
			</div>
			<div
				class="slider-range__thumb slider-range__thumb-pr"
				:style="{ left: fourthThumbPosition + '%' }"
				@mousedown="onFourthThumbMouseDown"
			>
				<div class="tooltip">
					{{ valueRightMax }} {{ unit }}
				</div>
			</div>
			<div class="slider-range__thumb-bg" :style="{ left: leftBgRectParams.left, width: leftBgRectParams.width }"></div>
			<div class="slider-range__thumb-bg" :style="{ left: rightBgRectParams.left, width: rightBgRectParams.width }"></div>
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
import {reactive, ref, watchEffect} from 'vue'

	const {min, max, valueLeftMin, valueLeftMax, valueRightMin, valueRightMax, step, offset, innerLeftOffset, innerRightOffset, show, orientation, disabled, unit} = defineProps({
		valueLeftMin: { type: Number, default: 30 },
		valueLeftMax: { type: Number, default: 70 },
		valueRightMin: { type: Number, default: 90 },
		valueRightMax: { type: Number, default: 130 },
		min: { type: Number, default: 10 },
		max: { type: Number, default: 200 },
		step: { type: Number, default: 5 },
		offset: { type: Number, default: 10 }, // Must be definition between valueRightMin & valueLeftMax
		innerLeftOffset: { type: Number, default: 5 },
		innerRightOffset: { type: Number, default: 5 },

		show: { type: Boolean, default: true },
		orientation: { type: String, default: 'horizontal' },
		disabled: { type: Boolean, default: false },
		unit: { type: String, default: '' }
	})

	const emits = defineEmits()

	const thumbWidth = 19

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
		thumbRightMaxValue = ref(valueRightMax),
		leftBgRectParams = reactive({
			left: valueLeftMin + '%',
			width: (valueLeftMax - valueLeftMin) + '%'
		}),
		rightBgRectParams = reactive({
			left: valueRightMin + '%',
			width: (valueRightMax - valueRightMin) + '%'
		})

	const addEventListeners = (thumb) => {
		activeThumb.value = thumb;
		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', onMouseUp);
	};

	watchEffect(() => {

		// width: (secondThumbPosition.value - firstThumbPosition.value) + '%'

		console.log(leftBgRectParams)
		if (sliderRange.value) {
			containerWidth.value = sliderRange.value.offsetWidth;
			const thumbWidthPercent = ((thumbWidth / 2) / containerWidth.value) * 100;

			const calculateThumbPosition = (searchedThumbValue) => {
				const thumbWay = ((searchedThumbValue - min) / (max - min)) * 100;
				const thumbPosition = (thumbWidthPercent * thumbWay) / 100;
				return thumbWay - thumbPosition;
			};

			firstThumbPosition.value = calculateThumbPosition(thumbLeftMinValue.value);
			secondThumbPosition.value = calculateThumbPosition(thumbLeftMaxValue.value);
			thirdThumbPosition.value = calculateThumbPosition(thumbRightMinValue.value);
			fourthThumbPosition.value = calculateThumbPosition(thumbRightMaxValue.value);

			leftBgRectParams.left =	firstThumbPosition.value + '%'
			leftBgRectParams.width = (secondThumbPosition.value - firstThumbPosition.value) + '%'

			rightBgRectParams.left =	thirdThumbPosition.value + '%'
			rightBgRectParams.width = (fourthThumbPosition.value - thirdThumbPosition.value) + '%'
		}
	})

	const updateThumbLeftMinValue = (value: number) => {
		let newValue = value
		if (newValue >= min && newValue < thumbLeftMaxValue.value - innerLeftOffset) {
			thumbLeftMinValue.value = Math.round(newValue / step) * step
			emits('update:valueLeftMin', thumbLeftMinValue.value)
		}
	}
	const updateThumbLeftMaxValue = (value: number) => {
		let newValue = value
		if (newValue > thumbLeftMinValue.value + innerLeftOffset && newValue < thumbRightMinValue.value && newValue <= thumbRightMinValue.value - offset) {
			thumbLeftMaxValue.value = Math.round(newValue / step) * step
			emits('update:valueLeftMax', thumbLeftMaxValue.value)
		}
	}
	const updateThumbRightMinValue = (value: number) => {
		let newValue = value
		if (newValue > thumbLeftMaxValue.value && newValue < thumbRightMaxValue.value - innerRightOffset && newValue >= thumbLeftMaxValue.value + offset) {
			thumbRightMinValue.value = Math.round(newValue / step) * step
			emits('update:valueRightMin', thumbRightMinValue.value)
		}
	}
	const updateThumbRightMaxValue = (value: number) => {
		let newValue = value
		if (newValue > thumbRightMinValue.value + innerRightOffset && newValue <= max) {
			thumbRightMaxValue.value = Math.round(newValue / step) * step
			emits('update:valueRightMax', thumbRightMaxValue.value)
		}
	}

	const onFirstThumbMouseDown = () => addEventListeners('thumb1');
	const onSecondThumbMouseDown = () => addEventListeners('thumb2');
	const onThirdThumbMouseDown = () => addEventListeners('thumb3');
	const onFourthThumbMouseDown = () => addEventListeners('thumb4');
	const onRangeMouseDown = () => addEventListeners('range');

	const onMouseMove = (event) => {
		const trackRect = document.querySelector('.slider-range__track').getBoundingClientRect();
		const mousePosition = event.clientX - trackRect.left;
		const mouseValue = ((mousePosition / trackRect.width) * (max - min)) + min;

		switch (activeThumb.value) {
			case 'thumb1':
				updateThumbLeftMinValue(mouseValue);
				break;
			case 'thumb2':
				updateThumbLeftMaxValue(mouseValue);
				break;
			case 'thumb3':
				updateThumbRightMinValue(mouseValue);
				break;
			case 'thumb4':
				updateThumbRightMaxValue(mouseValue);
				break;
			case 'range':
				const mainRangeWidth = thumbRightMinValue.value - thumbLeftMaxValue.value;
				const leftRangeWidth = thumbLeftMaxValue.value - thumbLeftMinValue.value;
				const rightRangeWidth = thumbRightMaxValue.value - thumbRightMinValue.value;

				let newValue1,
					newValue2 = mouseValue - (mainRangeWidth / 2),
					newValue3 = mouseValue + (mainRangeWidth / 2),
					newValue4;

				newValue1 = newValue2 - leftRangeWidth;
				newValue4 = newValue3 + rightRangeWidth;

				if (newValue1 < min) {
					newValue1 = min;
					newValue2 = newValue1 + leftRangeWidth;
					newValue3 = newValue2 + mainRangeWidth;
					newValue4 = newValue3 + rightRangeWidth;
				}

				if (newValue4 > max) {
					newValue4 = max;
					newValue3 = newValue4 - rightRangeWidth;
					newValue2 = newValue3 - mainRangeWidth;
					newValue1 = newValue2 - leftRangeWidth;
				}

				updateThumbLeftMinValue(newValue1);
				updateThumbLeftMaxValue(newValue2);
				updateThumbRightMinValue(newValue3);
				updateThumbRightMaxValue(newValue4);
				break;
		}
	};
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
		z-index: 5;
	}

	.slider-range__thumb-pl {
		border-top: 2px solid #00A04F;
		border-left: 2px solid #00A04F;
		border-bottom: 2px solid #00A04F;
		border-top-left-radius: 20px;
		border-bottom-left-radius: 20px;
	}

	.slider-range__thumb-bg {
		position: absolute;
		top: calc(-19px / 2);
		top: -7px;
		background: red;
		height: 19px;
		border-top-left-radius: 30px;
		border-bottom-left-radius: 30px;
		background: #ffffff;
		border-top: 2px solid #B3B8BB;
		border-bottom: 2px solid #B3B8BB;
		z-index: 1;
	}

	.slider-range__thumb-pr {
		border-top: var(--thumb-border);
		border-right: var(--thumb-border);
		border-bottom: var(--thumb-border);
		border-top-right-radius: 20px;
		border-bottom-right-radius: 20px;
	}

	.visually-hidden{
		position:absolute;
		clip:rect(0,0,0,0);
	}
</style>