<template>
  <div class="slider">
    <label :for="id">{{ label }}</label>
    <div>{{ value }}</div>
    <input
      class="range"
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
