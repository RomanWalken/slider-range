<template>

  <div class="p-20">
     <slider class="w-80" v-model="slider1" :min="1" :max="100" :step="1" type="float1" unit="px" />

    <!-- 
      Proposed: mode="DOUBLE", props are now init and end
      <slider class="w-80" v-model:init="slider1" v-model:end="slider2" :min="1" :max="10" :step="0.1" type="float1" unit="px" mode="DOUBLE" /> 
    -->

    <!-- 
      Proposed #2: fadeWindow=true, with props initFrom, initTo, endFrom, endTo, when init or end are split, make original props init and end null
      <slider class="w-80" v-model="slider1" v-model:value2="slider2" :min="1" :max="10" :step="0.1" type="float1" unit="px" mode="DOUBLE" :fadeWindow="true" /> 
    -->

    <!-- <slider class="h-80" v-model="slider1" :min=1 :max="10" :step=0.001 type="float2" orientation="VERTICAL-INVERTED" /> -->

	<div style="width: 400px">
		<div style="margin-bottom: 90px">
			<div style="margin-bottom: 15px">
				<div>
					Value: {{ slider1 }}
				</div>
				<div>
					step: 10
				</div>
			</div>
			<slider-simple
				v-model:value="slider1"
				:min="0"
				:max="100"
				:step="10"
			/>
		</div>

		<div style="margin-bottom: 90px">
			<div style="margin-bottom: 15px; display: flex; align-items: center; justify-content: space-between; gap: 45px">
				<div style="width: 150px">
					Value Min: {{ slider2Min }}
				</div>
				<div style="width: 150px">
					Value Max: {{ slider2Max }}
				</div>
			</div>
			<slider-range
				v-model:valueMin="slider2Min"
				v-model:valueMax="slider2Max"
				:min="0"
				:max="100"
				:step="5"
			/>
		</div>


		<div style="margin-bottom: 90px">
			<div style="margin-bottom: 15px; display: flex; align-items: start; justify-content: start; flex-direction: column; gap: 15px">
				<div>Value Left Min: {{ slider3LeftMin }}</div>
				<div>Value Left Min: {{ slider3LeftMax }}</div>
				<div>Value Left Min: {{ slider3RightMin }}</div>
				<div>Value Left Min: {{ slider3RightMax }}</div>
			</div>
			<slider-split
				v-model:valueLeftMin="slider3LeftMin"
				v-model:valueLeftMax="slider3LeftMax"
				v-model:valueRightMin="slider3RightMin"
				v-model:valueRightMax="slider3RightMax"
				:min="0"
				:max="100"
				:step="5"
				:innerLeftOffset="10"
				:innerRightOffset="10"
			/>
		</div>
  </div>
  </div>
  
</template>

<script setup>
	import {ref, watch} from 'vue';
	import Slider from "./old/Slider.vue";
	import SliderSimple from "./slider-simple.vue";
	import SliderRange from "./slider-range.vue";
	import SliderSplit from "./slider-split.vue";

	defineProps({
	  msg: String,
	})

	const sliderMin = ref(60);
	const sliderMax = ref(120);

	const slider1 = ref(30)

	const slider2Min = ref(30)
	const slider2Max = ref(60)

	const slider3LeftMin = ref(20)
	const slider3LeftMax = ref(40)
	const slider3RightMin = ref(60)
	const slider3RightMax = ref(80)
</script>

<style scoped>

</style>


<!--<div>-->
<!--<div>-->
<!--	{{ thumbMinValue }}-->
<!--</div>-->
<!--<div>-->
<!--	{{ thumbMaxValue }}-->
<!--</div>-->
<!--</div>-->