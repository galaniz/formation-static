/**
 * Vitest
 */

/* Imports */

import { defineConfig } from 'vitest/config'

/* Config */

export default defineConfig({
  test: {
    cache: false,
    globals: true,
    coverage: {
      include: [
        'src/**/*.ts'
      ]
    }
  }
})
