/**
 * Utils - Data Source Test
 */

/* Imports */

import { it, expect, describe, beforeEach } from 'vitest'
import { dataSource } from '../dataSource.js'
import { config } from '../../../config/config.js'

/* Tests */

describe('dataSource', () => {
  beforeEach(() => {
    config.source = 'local'
    config.cms.name = ''
  })

  it('should return local if config source is local and cms name is empty', () => {
    const result = dataSource.get()
    const expectedResult = 'local'

    expect(result).toBe(expectedResult)
  })

  it('should return wordpress if config cms name is wordpress', () => {
    config.cms.name = 'wordpress'
    const result = dataSource.get()
    const expectedResult = 'wordpress'

    expect(result).toBe(expectedResult)
  })

  it('should return any if config cms name is any', () => {
    config.cms.name = 'any'
    const result = dataSource.get()
    const expectedResult = 'any'

    expect(result).toBe(expectedResult)
  })

  it('should return true if config source is local', () => {
    const result = dataSource.isLocal()
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return false if param source is any', () => {
    // @ts-expect-error
    const result = dataSource.isLocal('any')
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if config source is local', () => {
    const resultOne = dataSource.isWordPress()
    const resultTwo = dataSource.isContentful()
    const expectedResultOne = false
    const expectedResultTwo = false

    expect(resultOne).toBe(expectedResultOne)
    expect(resultTwo).toBe(expectedResultTwo)
  })

  it('should return false if config source is local and cms name is wordpress', () => {
    config.cms.name = 'wordpress'
    const result = dataSource.isWordPress()
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return true if config source is cms and cms name is wordpress', () => {
    config.source = 'cms'
    config.cms.name = 'wordpress'
    const result = dataSource.isWordPress()
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return true if config source is cms and cms name is contentful', () => {
    config.source = 'cms'
    config.cms.name = 'contentful'
    const result = dataSource.isContentful()
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return false if param source is any and cms name is contentful', () => {
    config.source = 'cms'
    config.cms.name = 'contentful'
    // @ts-expect-error
    const result = dataSource.isContentful('any')
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })
})
