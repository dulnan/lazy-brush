<template>
  <div ref="container">
    <Sidebar
      v-model:brush-radius="brushRadius"
      v-model:lazy-radius="lazyRadius"
      v-model:damping="damping"
      v-model:enabled="enabled"
      @clear="clear++"
    >
      <Slider
        v-model="brushRadius"
        label="Brush radius"
        id="brush"
        :min="1"
        :max="100"
      />
      <Slider
        v-model="lazyRadius"
        label="Lazy radius"
        id="lazy"
        :min="1"
        :max="200"
      />

      <Slider
        v-model="damping"
        label="Damping"
        id="damping"
        :min="1"
        :max="100"
      />

      <template #bottom>
        <button
          class="button-disable"
          id="button_lazy"
          :class="{ disabled: !enabled }"
          @click="enabled = !enabled"
        >
          {{ enabled ? 'On' : 'Off' }}
        </button>
      </template>
    </Sidebar>
    <Scene
      :brushRadius="brushRadius"
      :lazyRadius="lazyRadius"
      :damping="damping"
      :width="width"
      :height="height"
      :dpi="dpi"
      :clear="clear"
      :enabled="enabled"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Scene from './components/Scene.vue'
import Slider from './components/Slider.vue'

const brushRadius = ref(12.5)
const lazyRadius = ref(60)
const damping = ref(90)
const enabled = ref(true)
const clear = ref(0)

const dpi = ref(1)
const width = ref(1280)
const height = ref(768)

const container = ref(null as HTMLDivElement)

let resizeTimeout: any = null

function setSizes() {
  width.value = window.innerWidth
  height.value = window.innerHeight
  dpi.value =
    width.value > 1024
      ? Math.min(window.devicePixelRatio, 4)
      : window.devicePixelRatio
}

setSizes()
onMounted(() => {
  const observeCanvas = new ResizeObserver((entries, observer) => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      setSizes()
    }, 500)
  })
  observeCanvas.observe(container.value)
})
</script>
