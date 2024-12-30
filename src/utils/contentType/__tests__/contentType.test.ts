/**
 * Utils - Content Type Test
 */

/* Imports */

import { it, expect, describe, beforeEach, afterEach } from 'vitest'
import { normalizeContentType } from '../contentType.js'
import { config } from '../../../config/config.js'

/* Test normalizeContentType */

describe('normalizeContentType()', () => {
  beforeEach(() => {
    config.normalTypes = {
      'ssf/content-type': 'normalContentType',
      // @ts-expect-error
      'ssf/content-null': null
    }
  })

  afterEach(() => {
    config.normalTypes = {}
  })

  it('should return initial content type', () => {
    const contentType = 'doesNotExist'
    const result = normalizeContentType(contentType)
    const expectedResult = 'doesNotExist'

    expect(result).toBe(expectedResult)
  })

  it('should return initial content type if normal type is null', () => {
    const contentType = 'ssf/content-null'
    const result = normalizeContentType(contentType)
    const expectedResult = 'ssf/content-null'

    expect(result).toBe(expectedResult)
  })

  it('should return normal content type', () => {
    const contentType = 'ssf/content-type'
    const result = normalizeContentType(contentType)
    const expectedResult = 'normalContentType'

    expect(result).toBe(expectedResult)
  })
})
