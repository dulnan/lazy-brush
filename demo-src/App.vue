<template>
  <div
    class="flex flex-col-reverse md:flex-row md:h-screen leading-6 bg-white"
    ref="container"
  >
    <Sidebar>
      <Toggle v-model="enabled" label="Enabled" />
      <Slider
        v-model="lazyRadius"
        label="Lazy radius"
        description="The minimum distance required before the brush is pulled towards the pointer."
        id="lazy"
        :min="1"
        :max="200"
        :disabled="!enabled"
      />

      <Slider
        v-model="friction"
        label="Friction"
        id="friction"
        description="Makes the brush lag behind the cursor. 100 = no lag, 1 = extreme lag."
        :min="1"
        :max="100"
        :disabled="!enabled"
      />
      <Slider
        v-model="brushRadius"
        label="Brush radius"
        description="The size of the brush. Has no effect on the functionality of lazy-brush."
        id="brush"
        :min="1"
        :max="100"
      />
      <div
        class="flex justify-between border-t border-stone-300 pt-[23px] pb-6 sticky md:static z-30 bottom-0 bg-white after:content-[''] after:block after:absolute after:left-0 after:bottom-full after:mb-[1px] after:w-full after:h-9 after:bg-gradient-to-b after:from-white/0 after:to-white after:pointer-events-none md:after:hidden px-6"
      >
        <button
          class="block w-full h-12 border-none rounded bg-orange-600 text-white uppercase font-bold hover:bg-orange-700"
          @click="clear++"
        >
          Clear
        </button>
      </div>
      <Copyright />
    </Sidebar>
    <Scene
      :brushRadius="brushRadius"
      :lazyRadius="lazyRadius"
      :friction="friction"
      :clear="clear"
      :enabled="enabled"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Scene from './components/Scene.vue'
import Slider from './components/Slider.vue'
import Copyright from './components/Copyright.vue'
import Toggle from './components/Toggle.vue'

const brushRadius = ref(12.5)
const lazyRadius = ref(60)
const friction = ref(90)
const enabled = ref(true)
const clear = ref(0)

const container = ref(null as HTMLDivElement)
</script>
