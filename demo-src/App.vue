<template>
  <div class="flex flex-col-reverse md:flex-row" ref="container">
    <Sidebar>
      <label
        class="flex items-center cursor-pointer justify-between pt-[23px] pb-6 border-t border-gray-400 border-dashed mt-6"
      >
        <span class="uppercase font-bold">Enabled</span>
        <div class="relative">
          <input type="checkbox" v-model="enabled" class="sr-only peer" />

          <div
            class="w-9 h-5 peer-focus:outline-none border rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[3px] after:bg-gray-200 after:rounded-full after:h-3 after:w-3 transition-all after:transition-all dark:border-gray-600 peer-checked:bg-orange-600 peer-checked:after:bg-white peer-checked:border-orange-600"
          ></div>
        </div>
      </label>
      <Slider
        v-model="lazyRadius"
        label="Lazy radius"
        description="The minimum distance required before the brush is pulled."
        id="lazy"
        :min="1"
        :max="200"
        :disabled="!enabled"
      />

      <Slider
        v-model="damping"
        label="Damping"
        id="damping"
        description="Makes the brush lag behind the cursor. 100 = no lag, 1 = extreme lag."
        :min="1"
        :max="100"
        :disabled="!enabled"
      />
      <Slider
        v-model="brushRadius"
        label="Brush radius"
        description="The size of the brush."
        id="brush"
        :min="1"
        :max="100"
        :disabled="!enabled"
      />
      <div
        class="flex justify-between border-t border-gray-400 border-dashed pt-[23px] pb-6 sticky bottom-0 bg-white after:content-[''] after:block after:absolute after:left-0 after:bottom-full after:mb-[1px] after:w-full after:h-9 after:bg-gradient-to-b after:from-white/0 after:to-white after:pointer-events-none md:after:hidden"
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
      :damping="damping"
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
import Copyright from './components/Copyright.vue'

const brushRadius = ref(12.5)
const lazyRadius = ref(60)
const damping = ref(90)
const enabled = ref(true)
const clear = ref(0)

const container = ref(null as HTMLDivElement)
</script>
