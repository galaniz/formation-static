/**
 * Utils - Boolean Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { isBoolean } from '../boolean.js'

/* Tests */

describe('isBoolean()', () => {
  it('should return true if value is true', () => {
    const value = true
    const result = isBoolean(value)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return true if value is false', () => {
    const value = false
    const result = isBoolean(value)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an empty string', () => {
    const value = ''
    const result = isBoolean(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is a string', () => {
    const value = 'true'
    const result = isBoolean(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an object', () => {
    const value = {}
    const result = isBoolean(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an array', () => {
    const value: unknown[] = []
    const result = isBoolean(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is null', () => {
    const value = null
    const result = isBoolean(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is undefined', () => {
    const value = undefined
    const result = isBoolean(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is a function', () => {
    const value = (): void => {}
    const result = isBoolean(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })
})
