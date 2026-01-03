/**
 * Utils - Year Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { getYear } from '../year.js'

/* Tests */

describe('getYear()', () => {
  it('should return current year', () => {
    const result = getYear()
    const expectedResult = 2026

    expect(result).toBe(expectedResult)
  })
})
