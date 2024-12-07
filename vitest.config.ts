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
    environment: 'node',
    coverage: {
      include: [
        'src/**/*.ts'
      ],
      exclude: [
        '**/*.test.ts',
        'src/**/*Types.ts'
      ]
    }
  }
})
