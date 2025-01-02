/**
 * Utils - Script Style Test
 */

/* Imports */

import { it, expect, describe, afterEach } from 'vitest'
import { scripts, styles, addStyle, addScript, outputStyles, outputScripts } from '../scriptStyle.js'

/* Test addStyle */

describe('addStyle()', () => {
  afterEach(() => {
    styles.item.clear()
    styles.build.clear()
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
    expect(styles.item).toEqual(expectedConfig)
    expect(styles.build).toEqual(expectedConfig)
  })

  it('should return true and add path and dependencies to config styles', () => {
    const result = addStyle('style', ['depOne'])
    const expectedResult = true

    const expectedConfig = new Map()
    expectedConfig.set('css/style', 'src/style.scss')
    expectedConfig.set('css/depOne', 'src/depOne.scss')

    expect(result).toBe(expectedResult)
    expect(styles.item).toEqual(expectedConfig)
    expect(styles.build).toEqual(expectedConfig)
  })
})

/* Test addScript */

describe('addScript()', () => {
  afterEach(() => {
    scripts.item.clear()
    scripts.build.clear()
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
    expect(scripts.item).toEqual(expectedConfig)
    expect(scripts.build).toEqual(expectedConfig)
  })

  it('should return true and add path and dependencies to config scripts', () => {
    const result = addScript('script', ['depOne'])
    const expectedResult = true

    const expectedConfig = new Map()
    expectedConfig.set('js/script', 'lib/script.js')
    expectedConfig.set('js/depOne', 'lib/depOne.js')

    expect(result).toBe(expectedResult)
    expect(scripts.item).toEqual(expectedConfig)
    expect(scripts.build).toEqual(expectedConfig)
  })
})

/* Test outputStyles */

describe('outputStyles()', () => {
  afterEach(() => {
    styles.item.clear()
    styles.build.clear()
  })

  it('should return empty string if link is empty string', () => {
    const result = outputStyles('')
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if config styles item map is empty', () => {
    const result = outputStyles('http://example.com/')
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return string of link elements sorted by dependencies', () => {
    addStyle('button', ['global'])
    addStyle('component')
    addStyle('header', ['button', 'collapsible'])

    const result = outputStyles('http://example.com/')
    const expectedResult = '<link rel="stylesheet" href="http://example.com/css/global.css" media="all"><link rel="stylesheet" href="http://example.com/css/button.css" media="all"><link rel="stylesheet" href="http://example.com/css/component.css" media="all"><link rel="stylesheet" href="http://example.com/css/collapsible.css" media="all"><link rel="stylesheet" href="http://example.com/css/header.css" media="all">'

    expect(result).toBe(expectedResult)
  })
})

/* Test outputScripts */

describe('outputScripts()', () => {
  afterEach(() => {
    scripts.item.clear()
    scripts.build.clear()
  })

  it('should return empty string if link is empty string', () => {
    const result = outputScripts('')
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if config scripts item map is empty', () => {
    const result = outputScripts('http://example.com/')
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return string of script elements sorted by dependencies', () => {
    addScript('button', ['global'])
    addScript('component')
    addScript('header', ['button', 'collapsible'])

    const result = outputScripts('http://example.com/')
    const expectedResult = '<script type="module" src="http://example.com/js/global.js"></script><script type="module" src="http://example.com/js/button.js"></script><script type="module" src="http://example.com/js/component.js"></script><script type="module" src="http://example.com/js/collapsible.js"></script><script type="module" src="http://example.com/js/header.js"></script>'

    expect(result).toBe(expectedResult)
  })
})
