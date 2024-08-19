/**
 * Utils - Script Style Test
 */

/* Imports */

import { it, expect, describe, afterEach } from 'vitest'
import { addStyle, addScript, outputStyles, outputScripts } from '../scriptStyle.js'
import { config } from '../../../config/config.js'

/* Test addStyle */

describe('addStyle()', () => {
  afterEach(() => {
    config.styles.item.clear()
    config.styles.build.clear()
  })

  it('should return false if path is null', () => {
    // @ts-expect-error
    const result = addStyle(null)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if path is empty', () => {
    const result = addStyle('')
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return true and add path to config styles', () => {
    const result = addStyle('style')
    const expectedResult = true

    const expectedConfig = new Map()
    expectedConfig.set('css/style', 'src/style.scss')

    expect(result).toBe(expectedResult)
    expect(config.styles.item).toEqual(expectedConfig)
    expect(config.styles.build).toEqual(expectedConfig)
  })

  it('should return true and add path and dependencies to config styles', () => {
    const result = addStyle('style', ['depOne'])
    const expectedResult = true

    const expectedConfig = new Map()
    expectedConfig.set('css/style', 'src/style.scss')
    expectedConfig.set('css/depOne', 'src/depOne.scss')

    expect(result).toBe(expectedResult)
    expect(config.styles.item).toEqual(expectedConfig)
    expect(config.styles.build).toEqual(expectedConfig)
  })
})

/* Test addScript */

describe('addScript()', () => {
  afterEach(() => {
    config.scripts.item.clear()
    config.scripts.build.clear()
  })

  it('should return false if path is null', () => {
    // @ts-expect-error
    const result = addScript(null)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if path is empty', () => {
    const result = addScript('')
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return true and add path to config scripts', () => {
    const result = addScript('script')
    const expectedResult = true

    const expectedConfig = new Map()
    expectedConfig.set('js/script', 'lib/script.js')

    expect(result).toBe(expectedResult)
    expect(config.scripts.item).toEqual(expectedConfig)
    expect(config.scripts.build).toEqual(expectedConfig)
  })

  it('should return true and add path and dependencies to config scripts', () => {
    const result = addScript('script', ['depOne'])
    const expectedResult = true

    const expectedConfig = new Map()
    expectedConfig.set('js/script', 'lib/script.js')
    expectedConfig.set('js/depOne', 'lib/depOne.js')

    expect(result).toBe(expectedResult)
    expect(config.scripts.item).toEqual(expectedConfig)
    expect(config.scripts.build).toEqual(expectedConfig)
  })
})

/* Test outputStyles */

describe('outputStyles()', () => {
  afterEach(() => {
    config.styles.item.clear()
    config.styles.build.clear()
  })

  it('should return empty string if link is empty string', () => {
    const result = outputStyles('')
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if config styles item map is empty', () => {
    const result = outputStyles('https://example.com/')
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return string of link elements sorted by dependencies', () => {
    addStyle('button', ['global'])
    addStyle('component')
    addStyle('header', ['button', 'collapsible'])

    const result = outputStyles('https://example.com/')
    const expectedResult = '<link rel="stylesheet" href="https://example.com/css/global.css" media="all"><link rel="stylesheet" href="https://example.com/css/button.css" media="all"><link rel="stylesheet" href="https://example.com/css/component.css" media="all"><link rel="stylesheet" href="https://example.com/css/collapsible.css" media="all"><link rel="stylesheet" href="https://example.com/css/header.css" media="all">'

    expect(result).toBe(expectedResult)
  })
})

/* Test outputScripts */

describe('outputScripts()', () => {
  afterEach(() => {
    config.scripts.item.clear()
    config.scripts.build.clear()
  })

  it('should return empty string if link is empty string', () => {
    const result = outputScripts('')
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if config scripts item map is empty', () => {
    const result = outputScripts('https://example.com/')
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return string of script elements sorted by dependencies', () => {
    addScript('button', ['global'])
    addScript('component')
    addScript('header', ['button', 'collapsible'])

    const result = outputScripts('https://example.com/')
    const expectedResult = '<script type="module" src="https://example.com/js/global.js"></script><script type="module" src="https://example.com/js/button.js"></script><script type="module" src="https://example.com/js/component.js"></script><script type="module" src="https://example.com/js/collapsible.js"></script><script type="module" src="https://example.com/js/header.js"></script>'

    expect(result).toBe(expectedResult)
  })
})
