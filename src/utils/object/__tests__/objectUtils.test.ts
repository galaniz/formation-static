/**
 * Utils - Object Utils Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { getObjectKeys } from '../objectUtils.js'

/* Test getObjectKeys */

describe('getObjectKeys()', () => {
  it('should throw type error if null', () => {
    expect(() => getObjectKeys(null)).toThrow(TypeError)
  })

  it('should throw type error if undefined', () => {
    expect(() => getObjectKeys(undefined)).toThrow(TypeError)
  })

  it('should return array of property names if object', () => {
    const result = getObjectKeys({ one: 'one', two: 'two', three: 'three' })

    expect(result).toEqual(['one', 'two', 'three'])
  })
})
