<template>
  <main id="sidebar">
    <div class="content">
      <div class="content__header">
        <h1>lazy-brush</h1>
      </div>
      <div class="content__aside">
        <p>
          Draw smooth curves and straight lines with your mouse, finger or any
          pointing device.
        </p>

        <slot></slot>
      </div>

      <div class="flex content__bottom">
        <div class="flex-auto">
          <slot name="bottom"></slot>
        </div>
        <div class="flex-1">
          <button
            class="button-clear"
            id="button_clear"
            @click="$emit('clear')"
          >
            Clear
          </button>
        </div>

        <div class="flex-auto">
          <a
            href="https://github.com/dulnan/lazy-brush"
            class="button button-github"
          >
            <IconGithub />
          </a>
        </div>
        <div class="flex-auto hidden-desktop">
          <button class="button-menu" id="button_menu">
            <IconMenu />
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import IconGithub from './Icons/Github.vue'
import IconMenu from './Icons/Menu.vue'

defineEmits(['update:enabled', 'clear'])

defineProps({
  enabled: {
    type: Boolean,
    default: false
  }
})
</script>
