/**
 * Utils - Link Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { getSlug, getLink, getPermalink } from '../link.js'

/* Test getSlug */

describe('getSlug()', () => {
  it('should return undefined if value is null', () => {
    const value = null
    // @ts-expect-error
    const result = getJson(value)
    const expectedResult = undefined

    expect(result).toBe(expectedResult)
  })
})
