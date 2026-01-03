/**
 * Utils - Proto Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { isProto } from '../proto.js'

/* Tests */

describe('isProto()', () => {
  it('should return true if value proto key', () => {
    const protoVal = isProto('__proto__')
    const prototypeVal = isProto('prototype')
    const constructorVal = isProto('constructor')
    const expectedResult = true

    expect(protoVal).toBe(expectedResult)
    expect(prototypeVal).toBe(expectedResult)
    expect(constructorVal).toBe(expectedResult)
  })

  it('should return false if value is empty string', () => {
    const value = isProto('')
    const expectedResult = false

    expect(value).toBe(expectedResult)
  })

  it('should return false if value is a random string', () => {
    const value = isProto('abc123')
    const expectedResult = false

    expect(value).toBe(expectedResult)
  })

  it('should return false if value is a null', () => {
    // @ts-expect-error - test null tag
    const value = isProto(null)
    const expectedResult = false

    expect(value).toBe(expectedResult)
  })
})
