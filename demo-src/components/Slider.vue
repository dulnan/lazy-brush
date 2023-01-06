<template>
  <div
    class="pt-[23px] pb-6 px-6 border-t border-stone-300 relative group hover:border-solid hover:bg-stone-50"
    :class="{ 'text-stone-300 pointer-events-none': disabled }"
  >
    <div class="flex justify-between">
      <label class="uppercase font-bold" :for="id">{{ label }}</label>
      <div>{{ value }}</div>
    </div>
    <p
      class="text-xs mt-3 mb-3"
      :class="disabled ? 'text-stone-300' : 'text-stone-800'"
    >
      {{ description }}
    </p>

    <input
      class="slider"
      :class="{ disabled: disabled }"
      type="range"
      :id="'slider_' + id"
      :name="id"
      :value="modelValue"
      @input="$emit('update:modelValue', getSliderValue($event))"
      @wheel.prevent="onWheel"
      :min="min"
      :max="max"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  min: {
    type: Number,
    default: 1
  },
  max: {
    type: Number,
    default: 100
  },
  id: {
    type: String,
    default: ''
  },
  modelValue: {
    type: Number,
    default: 0
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const step = computed(() => {
  return (props.max - props.min) / 100
})

const value = computed(() => {
  return Math.round(props.modelValue).toString()
})

function getSliderValue(e: Event) {
  if ('target' in e && 'value' in e.target) {
    return parseFloat(e.target.value as any)
  }
}

function onWheel(e: WheelEvent) {
  if (e.deltaY > 0) {
    emit(
      'update:modelValue',
      Math.max(props.modelValue - step.value, props.min)
    )
  } else {
    emit(
      'update:modelValue',
      Math.min(props.modelValue + step.value, props.max)
    )
  }
}
</script>

<style lang="postcss"></style>
