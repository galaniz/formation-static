/**
 * Tests - Setup
 */

/* Imports */

import { vi } from 'vitest'
import { fs } from 'memfs'

/* Mock fs dependencies */

vi.mock('node:fs/promises', () => fs.promises)
