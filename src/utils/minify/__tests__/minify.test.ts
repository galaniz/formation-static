/**
 * Utils - Minify Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { minify } from '../minify.js'

/* Tests */

describe('minify()', () => {
  it('should throw error if value is not a string', () => {
    // @ts-expect-error - test null value
    expect(() => minify(null)).toThrow(TypeError)
  })

  it('should remove extra spaces from a string', () => {
    const value = `
      <p>
        Hello
        World
      </p>
    `
    const result = minify(value)
    const expectedResult = '<p> Hello World </p>'

    expect(result).toBe(expectedResult)
  })
})
