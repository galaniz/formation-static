/**
 * Utils - Heading Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { isHeading } from '../heading.js'

/* Tests */

describe('isHeading()', () => {
  it('should return true if value is a heading tag string', () => {
    const h1 = isHeading('h1')
    const h2 = isHeading('h2')
    const h3 = isHeading('h3')
    const h4 = isHeading('h4')
    const h5 = isHeading('h5')
    const h6 = isHeading('h6')
    const expectedResult = true

    expect(h1).toBe(expectedResult)
    expect(h2).toBe(expectedResult)
    expect(h3).toBe(expectedResult)
    expect(h4).toBe(expectedResult)
    expect(h5).toBe(expectedResult)
    expect(h6).toBe(expectedResult)
  })

  it('should return false if value is a paragraph tag string', () => {
    const value = isHeading('p')
    const expectedResult = false

    expect(value).toBe(expectedResult)
  })

  it('should return false if value is a list tag string', () => {
    const value = isHeading('ul')
    const expectedResult = false

    expect(value).toBe(expectedResult)
  })

  it('should return false if value is a number', () => {
    // @ts-expect-error - test number tag
    const value = isHeading(1)
    const expectedResult = false

    expect(value).toBe(expectedResult)
  })

  it('should return false if value is a null', () => {
    // @ts-expect-error - test null tag
    const value = isHeading(null)
    const expectedResult = false

    expect(value).toBe(expectedResult)
  })
})
