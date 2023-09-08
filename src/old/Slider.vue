<template>
    <div ref="svgContainer"
         v-click-away="clickAway"
         class="vue-slide-bar-component vue-slide-bar-horizontal w-full">
  
      <resize-observer @notify="handleResize" />
  
      <div v-if="orientation === 'HORIZONTAL'" class="w-0 h-0 bg-red-800 relative" :style="{ 'top': -0.1 + 'rem', 'left': Math.min(usefulWidth+sideSize,sideSize+usefulWidth*(linearValue-minInternal)/(maxInternal-minInternal)) + 'px' }">
        <transition name="dropdown-content">
          <div v-show="isOpenWithDelay"
               ref="dropdown"
               class="absolute flex justify-center"
               style="transform: translate(-50%, -100%);"
               @mouseover="openTooltip"
               @mouseleave="closeTooltip">
            <span class="geo-tooltiptext">
              <div id="arrow-top" />
              <div class="flex justify-center" @mouseover="openTooltip" @mouseleave="closeTooltip">
                <div ref="inputDiv" @keyup.esc="clickAway" @keydown.enter.prevent @keyup.enter="keyboardEnterBlur" contenteditable="true" @input="enterValue($event.srcElement.innerHTML)" @click="editingWithKeyboard = true" @blur="keyboardEnterBlur">{{ tooltipString }}</div>
                <div v-if="unit" class="ml-1">{{ unit }}</div>
                <div v-if="type === 'percentage' || type === 'percentage1'" class="ml-1">%</div>
              </div>
            </span>
          </div>
        </transition>
      </div>
  
      <div v-if="orientation === 'VERTICAL-INVERTED'" class="w-0 h-0 bg-red-800 relative" :style="{ 'left': -0.1 + 'rem', 'top': Math.min(usefulHeight+sideSize,sideSize+usefulHeight*(linearValue-minInternal)/(maxInternal-minInternal)) + 'px' }">
        <transition name="dropdown-content">
          <div v-show="isOpenWithDelay"
               ref="dropdown"
               class="absolute flex justify-center"
               style="transform: translate(-100%, -50%);"
               @mouseover="openTooltip"
               @mouseleave="closeTooltip">
            <span class="geo-tooltiptext">
              <div id="arrow-left" />
              <div class="flex justify-center" @mouseover="openTooltip" @mouseleave="closeTooltip">
                <div ref="inputDiv" @keyup.esc="clickAway" @keydown.enter.prevent @keyup.enter="keyboardEnterBlur" contenteditable="true" @input="enterValue($event.srcElement.innerHTML)" @click="editingWithKeyboard = true" @blur="keyboardEnterBlur">{{ tooltipString }}</div>
                <div v-if="unit" class="ml-1">{{ unit }}</div>
                <div v-if="type === 'percentage' || type === 'percentage1'" class="ml-1">%</div>
              </div>
            </span>
          </div>
        </transition>
      </div>
  
      <div v-if="orientation === 'HORIZONTAL'" class="w-full" style="height: 2rem">
        <svg xmlns="http://www.w3.org/2000/svg"
             v-if="show"
             height="2rem"
             xml:space="preserve"
             width="100%"
             version="1.1"
             shape-rendering="geometricPrecision"
             text-rendering="geometricPrecision"
             image-rendering="optimizeQuality"
             fill-rule="evenodd"
             clip-rule="evenodd"
             xmlns:xlink="http://www.w3.org/1999/xlink">
  
          <rect class="fill-transparent"
                y="0rem"
                :width="wi"
                height="2rem"
                @click="clickBarHorizontal"
                @touchstart="dragStartTouch" />
  
          <rect class="fill-transparent cursor-pointer"
                y="0.6rem"
                :width="wi"
                height="0.8rem"
                @click="clickBarHorizontal"
                @mousedown="dragStartMouse" />
  
          <rect class="fill-gray-400 dark:fill-darkgray-400 pointer-events-none" y="0.85rem" :width="wi" height="0.3rem" @click="clickBarHorizontal" />
          <rect v-if="minInternal!==null" class="fill-current text-geo-primary dark:text-geo-darkprimary pointer-events-none" y="0.85rem" :width="Math.max(0,sideSize+usefulWidth*(linearValue-minInternal)/(maxInternal-minInternal))" height="0.3rem" />
  
          <circle v-if="minInternal!==null"
                  ref="showInputButton"
                  :opacity="disabled ? 0 : 1"
                  class="text-geo-primary dark:text-geo-darkprimary fill-current pointer-events-none"
                  :cx="Math.min(usefulWidth+sideSize,sideSize+usefulWidth*(linearValue-minInternal)/(maxInternal-minInternal))"
                  cy="1rem"
                  :r="RADIOUS_OUT" />
  
          <circle v-if="minInternal!==null"
                  :opacity="disabled ? 0 : 1"
                  class="text-white dark:text-darkwhite fill-current cursor-pointer"
                  :cx="Math.min(usefulWidth+sideSize,sideSize+usefulWidth*(linearValue-minInternal)/(maxInternal-minInternal))"
                  cy="1rem"
                  :r="RADIOUS_IN"
                  @mousedown="dragStartMouse"
                  @touchstart="dragStartTouch"
                  @mouseover="openTooltip"
                  @mouseleave="closeTooltip"
                  @click="editingWithKeyboard = false" />
        </svg>
      </div>
  
      <div v-if="orientation === 'VERTICAL-INVERTED'" class="h-full" style="width: 2rem">
        <svg xmlns="http://www.w3.org/2000/svg"
             v-if="show"
             width="2rem"
             xml:space="preserve"
             height="100%"
             version="1.1"
             shape-rendering="geometricPrecision"
             text-rendering="geometricPrecision"
             image-rendering="optimizeQuality"
             fill-rule="evenodd"
             clip-rule="evenodd"
             xmlns:xlink="http://www.w3.org/1999/xlink">
  
          <rect class="fill-transparent"
                x="0rem"
                :height="he"
                width="2rem"
                @click="clickBarVertical"
                @touchstart="dragStartTouch" />
  
          <rect class="fill-transparent cursor-pointer"
                x="0.6rem"
                :height="he"
                width="0.8rem"
                @click="clickBarVertical"
                @mousedown="dragStartMouse" />
  
          <rect class="fill-gray-400 dark:fill-darkgray-400 pointer-events-none" x="0.85rem" :height="he" width="0.3rem" @click="clickBarVertical" />
          <rect v-if="minInternal!==null" class="fill-current text-geo-primary dark:text-geo-darkprimary pointer-events-none" x="0.85rem" :height="Math.max(0,sideSize+usefulHeight*(linearValue-minInternal)/(maxInternal-minInternal))" width="0.3rem" />
  
          <circle v-if="minInternal!==null"
                  ref="showInputButton"
                  :opacity="disabled ? 0 : 1"
                  class="text-geo-primary dark:text-geo-darkprimary fill-current pointer-events-none"
                  :cy="Math.min(usefulHeight+sideSize,sideSize+usefulHeight*(linearValue-minInternal)/(maxInternal-minInternal))"
                  cx="1rem"
                  :r="RADIOUS_OUT" />
  
          <circle v-if="minInternal!==null"
                  :opacity="disabled ? 0 : 1"
                  class="text-white dark:text-darkwhite fill-current cursor-pointer"
                  :cy="Math.min(usefulHeight+sideSize,sideSize+usefulHeight*(linearValue-minInternal)/(maxInternal-minInternal))"
                  cx="1rem"
                  :r="RADIOUS_IN"
                  @mousedown="dragStartMouse"
                  @touchstart="dragStartTouch"
                  @mouseover="openTooltip"
                  @mouseleave="closeTooltip"
                  @click="editingWithKeyboard = false" />
        </svg>
      </div>
  
    </div>
  </template>
  
  
  
  <script>
  
    import { mixin as clickaway } from "vue3-click-away";
    import TWEEN from "@tweenjs/tween.js";
  
    export default {
      mixins: [clickaway],
      props: {
        modelValue: {
          type: Number,
          default: 0
        },
        min: {
          type: Number,
          default: 0
        },
        max: {
          type: Number,
          default: 100
        },
        type: {
          type: String,
          default: 'int'
        },
        unit: {
          type: String,
          default: ''
        },
        logarithmic: {
          type: Boolean,
          default: false
        },
        step: {
          type: Number,
          default: 1
        },
        disabled: {
          type: Boolean,
          default: false
        },
        flexibleMax: {
          type: Boolean,
          default: false
        },
        flexibleMaxStep: {
          type: Number,
          default: 50
        },
        show: {
          type: Boolean,
          default: true
        },
        orientation: {
          type: String,
          default: "HORIZONTAL"
        },
      },
      emits: ['update:modelValue'],
      data()
      {
        return {
          wi: 0,
          he: 0,
          draggingMouse: false,
          draggingTouch: false,
          hover: false,
          closing: false,
          editingWithKeyboard: false,
          valueString: "",
          internalValue: null,
          maxInternal: null,
          minInternal: null,
          editingValueClipboard: null,
          RADIOUS_OUT: this.convertRemToPixels(0.6),
          RADIOUS_IN: this.convertRemToPixels(0.45),
          isOpenWithDelay: false,
          animating: false,
        };
      },
      computed: {
        linearValue()
        {
          if (this.logarithmic)
          {
            var c = -Math.log10(this.minInternal) / Math.log10(this.maxInternal / this.minInternal);
            var k = (1 / Math.log10(this.maxInternal / this.minInternal));
            return this.minInternal + (k * Math.log10(this.internalValue) + c) * (this.maxInternal - this.minInternal);
          }
          else
          {
            return this.internalValue;
          }
        },
        usefulWidth()
        {
          try
          {
            return this.wi - 2 * this.RADIOUS_OUT;
          }
          catch
          {
            return 10;
          }
        },
        usefulHeight()
        {
          try
          {
            return this.he - 2 * this.RADIOUS_OUT;
          }
          catch
          {
            return 10;
          }
        },
        sideSize()
        {
          try
          {
            return Number(this.RADIOUS_OUT);
          }
          catch
          {
            return 0;
          }
        },
        isOpen()
        {
          return this.draggingMouse || this.draggingTouch || this.hover || this.animating;
        },
        tooltipString()
        {
          let tmp;
  
          if (this.type === 'percentage')
            tmp = Math.round(this.modelValue * 100);
  
          else if (this.type === 'percentage1')
            tmp = Math.round(this.modelValue * 100 * 10) / 10;
  
          else if (this.type === 'int')
            tmp = Math.round(this.modelValue);
  
          else if (this.type === 'float1')
            tmp = Math.round(this.modelValue * 10) / 10;
  
          else if (this.type === 'float2')
            tmp = Math.round(this.modelValue * 100) / 100;
  
          else if (this.type === 'float3')
            tmp = Math.round(this.modelValue * 1000) / 1000;
  
          return tmp;
        },
      },
      watch: {
        'max': function ()
        {
          this.adjustLimits();
        },
        'min': function ()
        {
          this.adjustLimits();
        },
        isOpen: function (newVal)
        {
          if (newVal)
          {
            this.isOpenWithDelay = true;
          }
          else
          {
            setTimeout(() =>
            {
              if (!this.isOpen)
              {
                this.isOpenWithDelay = false;
              }
            }, 100);
          }
        },
        internalValue()
        {
  
        },
        modelValue()
        {
          if (!this.animating)
          {
            this.internalValue = this.modelValue;
          }
        }
      },
      beforeUnmount()
      {
        this.isOpenWithDelay = false;
  
        document.removeEventListener('touchmove', this.dragTouch);
        document.removeEventListener('mousemove', this.drag);
        document.removeEventListener('mouseup', this.dragEndMouse);
        document.removeEventListener('touchend', this.dragEndTouch);
      },
      mounted()
      {
        this.adjustLimits();
        this.handleResize();
        if (!this.disabled)
        {
          if (this.maxInternal !== null && this.modelValue > this.maxInternal)
            this.$emit('update:modelValue', this.maxInternal);
          if (this.minInternal !== null && this.modelValue < this.minInternal)
            this.$emit('update:modelValue', this.minInternal);
        }
        this.internalValue = this.modelValue;
        document.addEventListener('touchmove', this.dragTouch);
        document.addEventListener('mousemove', this.drag);
        document.addEventListener('mouseup', this.dragEndMouse);
        document.addEventListener('touchend', this.dragEndTouch);
      },
      methods: {
        convertRemToPixels(rem) {
          return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
        },
        clickBarHorizontal(e)
        {
          let offset = this.$refs.svgContainer.getBoundingClientRect().left;
          let fraction = (e.pageX - offset - this.sideSize) / (this.$refs.svgContainer.clientWidth - this.sideSize * 2);
          this.setValue(fraction, 200);
        },
        clickBarVertical(e)
        {
          let offset = this.$refs.svgContainer.getBoundingClientRect().top;
          let fraction = (e.pageY - offset - this.sideSize) / (this.$refs.svgContainer.clientHeight - this.sideSize * 2);
          this.setValue(fraction, 200);
        },
        handleResize()
        {
          if (this.$refs.svgContainer != null)
          {
            this.he = this.$refs.svgContainer.clientHeight;
            this.wi = this.$refs.svgContainer.clientWidth;
          }
        },
        dragStartMouse()
        {
          this.draggingMouse = true;
        },
        dragStartTouch()
        {
          this.draggingTouch = true;
        },
        drag(e)
        {
          if (this.draggingMouse)
          {
            if (e.buttons > 0)
            {
              if (this.logarithmic && this.minInternal === 0)
                console.log("Zero not allowed as min when using logarithmic scale");
  
              let fraction;
              if (this.orientation === "HORIZONTAL")
              {
                let offset = this.$refs.svgContainer.getBoundingClientRect().left;
                fraction = (e.pageX - offset - this.sideSize) / (this.$refs.svgContainer.clientWidth - this.sideSize * 2);
              }
              else
              {
                let offset = this.$refs.svgContainer.getBoundingClientRect().top;
                fraction = (e.pageY - offset - this.sideSize) / (this.$refs.svgContainer.clientHeight - this.sideSize * 2);
              }
  
              this.setValue(fraction, 50);
            }
            else
            {
              this.dragEndMouse();
            }
          }
        },
        dragTouch(e)
        {
          if (this.draggingTouch)
          {
            if (e.touches.length === 1)
            {
              if (this.logarithmic && this.minInternal === 0)
                console.log("Zero not allowed as min when using logarithmic scale");
  
              let fraction;
              if (this.orientation === "HORIZONTAL")
              {
                let offset = this.$refs.svgContainer.getBoundingClientRect().left;
                fraction = (e.touches[0].pageX - offset - this.sideSize) / (this.$refs.svgContainer.clientWidth - this.sideSize * 2);
              }
              else
              {
                let offset = this.$refs.svgContainer.getBoundingClientRect().top;
                fraction = (e.touches[0].pageY - offset - this.sideSize) / (this.$refs.svgContainer.clientHeight - this.sideSize * 2);
              }
  
              this.setValue(fraction, 50);
            }
            else
            {
              this.dragEndMouse();
            }
          }
        },
        setValue(fraction, animationLength)
        {
          let value = -1;
  
          var c = -Math.log10(this.minInternal) / Math.log10(this.maxInternal / this.minInternal);
          var k = (1 / Math.log10(this.maxInternal / this.minInternal));
  
          if (this.logarithmic)
            value = Math.pow(10, (fraction - c) / (k));
          else
            value = fraction * (this.maxInternal - this.minInternal) + this.minInternal;
  
          value = (value - this.minInternal) / this.step;
          value = Math.round(value);
          value = value * this.step + this.minInternal;
  
          //this.$emit('update:modelValue', Math.max(this.minInternal, Math.min(this.maxInternal, value)));
          let newValue = Math.max(this.minInternal, Math.min(this.maxInternal, value));
  
          if (newValue !== this.modelValue)
          {
            if (this.tween !== undefined) this.tween.stop();
  
            this.tween = new TWEEN.Tween({val: this.internalValue})
              .to({val: newValue}, animationLength)
              .easing(TWEEN.Easing.Quadratic.Out)
              .onUpdate((tmp) =>
              {
                this.internalValue = tmp.val;
              })
              .onComplete((tmp) =>
              {
                this.internalValue = tmp.val;
                this.animating = false;
              })
              .start();
  
            if (!this.animating)
            {
              this.animating = true;
              this.animator();
            }
  
            this.$emit('update:modelValue', newValue);
          }
        },
        animator()
        {
          this.tween.update();
          if (this.animating)
          {
            setTimeout(this.animator, 1000 / 60);
          }
        },
        adjustLimits()
        {
          this.maxInternal = this.max;
          while (this.flexibleMax && this.modelValue >= this.maxInternal)
            this.maxInternal += this.flexibleMaxStep;
  
          this.minInternal = this.min;
          while (this.flexibleMax && this.modelValue <= this.minInternal)
            this.minInternal -= this.flexibleMaxStep;
        },
        enterValue(val)
        {
          try
          {
            val = Number(val);
            if (this.type === 'percentage' || this.type === 'percentage1') val /= 100;
            if (this.flexibleMax === false)
              val = Math.max(this.minInternal, Math.min(this.maxInternal, val));
            if (!isNaN(val))
            {
              this.editingValueClipboard = val;
            }
          }
          // eslint-disable-next-line no-empty
          catch { }
        },
        keyboardEnterBlur()
        {
          if (this.editingValueClipboard !== null)
          {
            this.$emit('update:modelValue', this.editingValueClipboard);
            this.hover = false;
          }
        },
        dragEndTouch()
        {
          this.draggingTouch = false;
  
          if (this.flexibleMax && this.modelValue === this.maxInternal)
            this.maxInternal += this.flexibleMaxStep;
  
          if (this.flexibleMax && this.modelValue === this.minInternal)
            this.minInternal -= this.flexibleMaxStep;
        },
        dragEndMouse()
        {
          this.draggingMouse = false;
  
          if (this.flexibleMax && this.modelValue === this.maxInternal)
            this.maxInternal += this.flexibleMaxStep;
  
          if (this.flexibleMax && this.modelValue === this.minInternal)
            this.minInternal -= this.flexibleMaxStep;
        },
        openTooltip()
        {
          this.hover = true;
          this.closing = null;
        },
        closeTooltip()
        {
          let closing = this.closing = new Date().getTime();
          setTimeout(() =>
          {
            if (this.closing === closing && !this.editingWithKeyboard)
            {
              this.hover = false;
            }
          }, 100);
        },
        clickAway()
        {
          this.hover = false;
          this.editingWithKeyboard = false;
        },
      }
    };
  </script>
  
  <style scoped>
  
    .dropdown-content-enter-active,
    .dropdown-content-leave-active {
      transition: opacity 0.12s;
    }
  
    .dropdown-content-enter,
    .dropdown-content-leave-to {
      opacity: 0;
    }
  
     /* Tooltip text */
    .geo-tooltipcontainer {
      display: block;
      min-width: 14rem;
      text-align: center;
      position: absolute;
      z-index: 1;
      left: 50%;
      margin-left: -7rem;
      transition: opacity 0.3s;
    }
  
        /* Tooltip text */
    .geo-tooltiptext {
      display: inline-block;
      @apply p-2;
      @apply border;
      @apply border-gray-400 dark:border-darkgray-400;
      @apply rounded;
      @apply bg-white dark:bg-darkwhite;
    }
  
    /* Tooltip arrow */
    #arrow-top {
      position: absolute;
      left: 50%;
      margin-left: -.3rem;
      bottom: -.3rem;
      width: .6rem;
      height: .6rem;
      background: inherit;
      border-bottom: inherit;
      border-left: inherit;
      transform: rotate(-45deg);
    }
  
    #arrow-left {
      position: absolute;
      top: 50%;
      margin-top: -.3rem;
      right: -.3rem;
      width: .6rem;
      height: .6rem;
      background: inherit;
      border-bottom: inherit;
      border-left: inherit;
      transform: rotate(-135deg);
    }
  
    .vue-slide-bar-component {
      position: relative;
      box-sizing: border-box;
      user-select: none;
    }
  </style>
  