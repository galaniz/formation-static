/**
 * Utils - Filter Test
 */

/* Imports */

import type { Filters } from '../filterTypes.js'
import { it, expect, describe, beforeEach, vi } from 'vitest'
import {
  filters,
  addFilter,
  removeFilter,
  applyFilters,
  setFilters,
  resetFilters
} from '../filter.js'

/**
 * First test filter name
 *
 * @type {string}
 */
const testNameOne: string = 'testName'

/**
 * Second test filter name
 *
 * @type {string}
 */
const testNameTwo: string = 'testNameTwo'

/* Test filters */

describe('filters', () => {
  it('should be map containing 23 empty sets', () => {
    let allEmpty = true

    for (const [, value] of filters) {
      if (value.size) {
        allEmpty = false
        break
      }
    }

    const size = filters.size
    const expectedSize = 23

    expect(allEmpty).toEqual(true)
    expect(size).toBe(expectedSize)
  })
})

/* Test addFilter */

describe('addFilter()', () => {
  beforeEach(() => {
    filters.delete(testNameOne)
  })

  it('should return true if name is a string and filter is a function', () => {
    const result = addFilter(testNameOne, () => {})
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return false if name is null', () => {
    const name = null
    const filter = (): void => {}
    // @ts-expect-error - test null name
    const result = addFilter(name, filter)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if filter is null', () => {
    const name = 'name'
    const filter = null
    // @ts-expect-error - test null filter
    const result = addFilter(name, filter)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })
})

/* Test applyFilters */

describe('applyFilters()', () => {
  beforeEach(() => {
    filters.delete(testNameOne)
    filters.delete(testNameTwo)
  })

  it('should call filter and return true', () => {
    addFilter(testNameOne, (value: boolean): boolean => !value)

    const result = applyFilters(testNameOne, false)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should only call filter two', () => {
    const testFilterOne = vi.fn((value: boolean): boolean => !value)
    const testFilterTwo = vi.fn((value: boolean): boolean => !value)

    addFilter(testNameOne, testFilterOne)
    addFilter(testNameTwo, testFilterTwo)

    const result = applyFilters(testNameTwo, true)
    const expectedResult = false

    removeFilter(testNameTwo, testFilterTwo)

    expect(testFilterTwo).toHaveBeenCalledTimes(1)
    expect(testFilterOne).not.toHaveBeenCalled()
    expect(result).toBe(expectedResult)
  })

  it('should not call filter if different filter name called', () => {
    const testFilter = vi.fn((value: string) => `${value}1`)
    const exists = filters.has(testNameTwo)
    const expectExists = false

    addFilter(testNameOne, testFilter)

    const result = applyFilters(testNameTwo, 'test')
    const expectedResult = 'test'

    expect(exists).toBe(expectExists)
    expect(testFilter).not.toHaveBeenCalled()
    expect(result).toBe(expectedResult)
  })

  it('should call async filters and return cumulative number', async () => {
    const testFilterOne = vi.fn((value: number) => new Promise(resolve => {
      resolve(value + 4)
    }))

    const testFilterTwo = vi.fn((value: number) => new Promise(resolve => {
      resolve(value - 8)
    }))

    addFilter(testNameOne, testFilterOne)
    addFilter(testNameOne, testFilterTwo)

    const result = await applyFilters(testNameOne, 36, {}, true)
    const expectedResult = 32

    expect(testFilterOne).toHaveBeenCalledTimes(1)
    expect(testFilterOne).toHaveResolvedWith(40)
    expect(testFilterTwo).toHaveBeenCalledTimes(1)
    expect(testFilterTwo).toHaveResolvedWith(32)
    expect(result).toBe(expectedResult)
  })

  it('should call mixed filters and return cumulative string', async () => {
    const testFilterOne = vi.fn((
      value: string,
      arg: string
    ) => new Promise(resolve => {
      resolve(`${value}${arg}1`)
    }))

    const testFilterTwo = vi.fn((
      value: string,
      arg: string): string => `${value}${arg}2`
    )

    addFilter(testNameOne, testFilterOne)
    addFilter(testNameOne, testFilterTwo)

    const result = await applyFilters(testNameOne, 'test', 'Str', true)

    expect(testFilterOne).toHaveBeenCalledTimes(1)
    expect(testFilterOne).toHaveResolvedWith('testStr1')
    expect(testFilterTwo).toHaveBeenCalledTimes(1)
    expect(testFilterTwo).toHaveReturnedWith('testStr1Str2')
    expect(result).toBe('testStr1Str2')
  })
})

/* Test removeFilter */

describe('removeFilter()', () => {
  beforeEach(() => {
    filters.delete(testNameOne)
  })

  it('should return false if name is null', () => {
    const name = null
    const filter = (): void => {}
    // @ts-expect-error - test null name
    const result = removeFilter(name, filter)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if filter is null', () => {
    const name = 'name'
    const filter = null
    // @ts-expect-error - test null filter
    const result = removeFilter(name, filter)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if filter does not exist', () => {
    const name = 'name'
    const filter = (): boolean => false
    const result = removeFilter(name, filter)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return true if name and filter exists', () => {
    const testFilter = vi.fn()

    addFilter(testNameOne, testFilter)

    const result = removeFilter(testNameOne, testFilter)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })
})

/* Test setFilters */

describe('setFilters()', () => {
  beforeEach(() => {
    filters.delete(testNameOne)
  })

  it('should return false if args are null', () => {
    // @ts-expect-error - test null args
    const result = setFilters(null)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if args are an empty object', () => {
    const result = setFilters({})
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return true and filter should not be added', () => {
    const args: Partial<Filters> = {}
    // @ts-expect-error - test null action
    args[testNameOne] = null

    const result = setFilters(args)
    const expectedResult = true

    const existsResult = filters.has(testNameOne)
    const expectedAxistsResult = false

    expect(result).toBe(expectedResult)
    expect(existsResult).toBe(expectedAxistsResult)
  })

  it('should return true and filter should be added', () => {
    const args: Partial<Filters> = {}
    args[testNameOne] = () => {}

    const result = setFilters(args)
    const expectedResult = true

    const existsResult = filters.has(testNameOne)
    const expectedAxistsResult = true

    expect(result).toBe(expectedResult)
    expect(existsResult).toBe(expectedAxistsResult)
  })
})

/* Test resetFilters */

describe('resetFilters()', () => {
  beforeEach(() => {
    filters.delete(testNameOne)
  })

  it('should reset map to initial 23 empty sets', () => {
    addFilter(testNameOne, () => false)
    addFilter('richTextOutput', () => '')
    resetFilters()

    let allEmpty = true

    for (const [, value] of filters) {
      if (value.size) {
        allEmpty = false
        break
      }
    }

    const size = filters.size
    const expectedSize = 23

    expect(allEmpty).toEqual(true)
    expect(size).toBe(expectedSize)
  })
})
