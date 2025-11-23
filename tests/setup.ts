/**
 * Tests - Setup
 */

/* Imports */

import { vi, afterEach } from 'vitest'
import { fs, vol } from 'memfs'

/* Mock fs dependencies */

vi.mock('node:fs', () => fs)
vi.mock('node:fs/promises', () => fs.promises)

/* Mock uuid */

vi.mock('uuid', () => ({
  v4: vi.fn(() => 'mock-uuid'),
}))

/* Reset virtual files */

afterEach(() => {
  vol.reset()
})
