/**
 * Utils - Tag Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { getTag, tagExists } from '../tag.js'

/* Test getTag */

describe('getTag()', () => {
  it('should return undefined if no params', () => {
    // @ts-expect-error - test undefined params
    const result = getTag()
    const expectedResult = undefined

    expect(result).toBe(expectedResult)
  })

  it('should return undefined if object is null', () => {
    // @ts-expect-error - test null object
    const result = getTag(null, '123')
    const expectedResult = undefined

    expect(result).toBe(expectedResult)
  })

  it('should return undefined if tags are an empty array', () => {
    const result = getTag({
      metadata: {
        tags: []
      }
    }, '123')

    const expectedResult = undefined

    expect(result).toBe(expectedResult)
  })

  it('should return undefined if tags contains no objects', () => {
    const result = getTag({
      metadata: {
        // @ts-expect-error - test null tags
        tags: [null]
      }
    }, '123')

    const expectedResult = undefined

    expect(result).toBe(expectedResult)
  })

  it('should return undefined if no tag with specified ID exists', () => {
    const result = getTag({
      metadata: {
        tags: [
          {
            id: '321'
          }
        ]
      }
    }, '123')

    const expectedResult = undefined

    expect(result).toBe(expectedResult)
  })

  it('should return tag associated with specified ID', () => {
    const result = getTag({
      metadata: {
        tags: [
          {
            id: '123'
          }
        ]
      }
    }, '123')

    const expectedResult = {
      id: '123'
    }

    expect(result).toEqual(expectedResult)
  })
})

/* Test tagExists */

describe('tagExists()', () => {
  it('should return false if no params', () => {
    // @ts-expect-error - test undefined params
    const result = tagExists()
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if object is null', () => {
    // @ts-expect-error - test null object
    const result = tagExists(null, '123')
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if no tag with specified ID exists', () => {
    const result = tagExists({
      metadata: {
        tags: [
          {
            id: '321'
          }
        ]
      }
    }, '123')

    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return true if tag with specified ID exists', () => {
    const result = tagExists({
      metadata: {
        tags: [
          {
            id: '123'
          }
        ]
      }
    }, '123')

    const expectedResult = true

    expect(result).toEqual(expectedResult)
  })
})
