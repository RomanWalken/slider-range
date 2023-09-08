<template>
	<div v-if="show">
		<div class="slider-simple" ref="sliderSimple">
			<div class="slider-simple__track">
				<div class="slider-simple__range" :style="{ width: `${thumbPosition}%`}"></div>
				<div class="slider-simple__thumb" :style="{ left: `${thumbPosition}%` }"></div>
			</div>
			<input type="range" :value="value" :min="min" :max="max" :step="step" @input="updateValue" /> <!-- v-model="thumbValue" -->
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

	const updateValue = (event) => {
		let newValue: number = Number(event.target.value)
		thumbValue.value = newValue
		emit('update:value', newValue);
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
			} else {

			}
		}
	})
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
	top:-7px;
	width: 19px;
	height: 19px;
	border-radius:50%;
	border: 2px solid #00A04F;
	background-color: #fff;
}
</style>
