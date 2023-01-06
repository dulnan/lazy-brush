<template>
  <div
    class="mb-6 pt-[23px] border-t border-gray-400 border-dashed"
    :class="{ 'text-gray-300 pointer-events-none': disabled }"
  >
    <div class="flex justify-between">
      <label class="uppercase font-bold" :for="id">{{ label }}</label>
      <div>{{ value }}</div>
    </div>
    <p class="my-6">{{ description }}</p>
    <input
      class="range block w-full h-6 bg-transparent border rounded-full border-gray-300 appearance-none cursor-pointer dark:bg-gray-700"
      :class="{ disabled: disabled }"
      type="range"
      :id="'slider_' + id"
      :name="id"
      :value="modelValue"
      @input="$emit('update:modelValue', getSliderValue($event))"
      @wheel="onWheel"
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
