import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      all: true,
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.*']
    }
  }
})
