<template>
  <aside
    class="md:w-72 relative z-50 bg-white border-t md:border-t-0 md:border-r md:h-screen border-stone-300 pt-[23px] flex-shrink-0 md:overflow-auto"
  >
    <h1
      class="uppercase font-black text-2xl md:text-5xl md:-ml-0.5 leading-6 md:leading-[48px] px-6"
    >
      Lazy Brush
    </h1>
    <p class="mt-6 px-6">
      JavaScript library to draw smooth curves and straight lines with your
      mouse, finger or any pointing device.
    </p>
    <ul class="flex justify-between mt-6 px-6">
      <li v-for="(link, i) in links" :key="i">
        <a
          class="text-orange-600 font-bold uppercase underline underline-offset-4 hover:text-orange-800"
          :href="link.href"
          >{{ link.text }}</a
        >
      </li>
    </ul>

    <slot></slot>
  </aside>
</template>

<script lang="ts" setup>
const links = [
  {
    href: 'https://github.com/dulnan/lazy-brush',
    text: 'GitHub'
  },
  {
    href: 'https://www.npmjs.com/package/lazy-brush',
    text: 'npm'
  },
  {
    href: 'https://www.reddit.com/r/javascript/comments/9paoyp/lazybrush_smooth_canvas_drawing_with_a_mouse_or',
    text: 'Reddit'
  }
]
</script>
