/**
 * Utils - Shortcode Test
 */

/* Imports */

import { it, expect, describe, afterEach, vi } from 'vitest'
import {
  shortcodes,
  addShortcode,
  removeShortcode,
  doShortcodes,
  resetShortcodes,
  setShortcodes,
  stripShortcodes
} from '../shortcode.js'

/* Test addShortcode */

describe('addShortcode()', () => {
  afterEach(() => {
    shortcodes.clear()
  })

  it('should return false if name is not a string', () => {
    // @ts-expect-error - test undefined name
    const result = addShortcode()
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if shortcode is not an object', () => {
    // @ts-expect-error - test null shortcode
    const result = addShortcode('test', null)
    const expectedResult = false

    expect(result).toBe(expectedResult)
    expect(shortcodes.has('test')).toBe(expectedResult)
  })

  it('should return true if name is a string and shortcode is an object', () => {
    const result = addShortcode('test', {
      callback: () => 'test'
    })

    const expectedResult = true

    expect(result).toBe(expectedResult)
    expect(shortcodes.has('test')).toBe(expectedResult)
  })
})

/* Test removeShortcode */

describe('removeShortcode()', () => {
  afterEach(() => {
    shortcodes.clear()
  })

  it('should return false if name is not a string', () => {
    // @ts-expect-error - test undefined name
    const result = removeShortcode()
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if shortcode is not found', () => {
    const result = removeShortcode('test')
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return true if shortcode is found', () => {
    addShortcode('test', {
      callback: () => 'test'
    })

    const result = removeShortcode('test')
    const expectedResult = true

    expect(result).toBe(expectedResult)
    expect(shortcodes.has('test')).toBe(false)
  })
})

/* Test doShortcodes */

describe('doShortcodes()', () => {
  afterEach(() => {
    shortcodes.clear()
  })

  it('should return content if no shortcodes exist', async () => {
    const result = await doShortcodes('test')
    const expectedResult = 'test'

    expect(result).toBe(expectedResult)
  })

  it('should return null if content is null and shortcodes exist', async () => {
    addShortcode('test', {
      callback: () => 'test'
    })
    // @ts-expect-error - test null content
    const result = await doShortcodes(null)
    const expectedResult = null

    expect(result).toBe(expectedResult)
  })

  it('should return content if no shortcodes found in content', async () => {
    addShortcode('test', {
      callback: () => 'test'
    })

    const result = await doShortcodes('Lorem ipsum')
    const expectedResult = 'Lorem ipsum'

    expect(result).toBe(expectedResult)
  })

  it('should return content if shortcode is null', async () => {
    // @ts-expect-error - test null shortcode
    shortcodes.set('test', null)

    const result = await doShortcodes('Lorem ipsum [test]')
    const expectedResult = 'Lorem ipsum [test]'

    expect(result).toBe(expectedResult)
  })

  it(
    'should return content with shortcode replaced and skip invalid attributes',
    async () => await new Promise(async (resolve) => { // eslint-disable-line @typescript-eslint/no-misused-promises
      addShortcode('test', {
        callback ({ attributes }) {
          const result = Object.keys(attributes).length

          expect(result).toEqual(0)
          resolve('')

          return 'test'
        }
      })

      await doShortcodes('Test [test key="= =value key1= key3=value2 key4=\'\'] content.')
    })
  )

  it('should return content with shortcodes replaced', async () => {
    const itemDataProps = vi.fn()

    addShortcode('test', {
      callback ({ attributes, content = '', itemData }) {
        itemDataProps(itemData)

        const {
          type = 'default',
          required = false,
          size = 0
        } = attributes as {
          type: string
          required: boolean
          size: number
        }

        return `<${type} ${required.toString()} ${size}${content} />`
      },
      attributeTypes: {
        type: 'string',
        required: 'boolean',
        size: 'number'
      }
    })

    const content =
      'This is [test] content [test type="test" required="true" size="10"] continued[/test].'

    const expectedResult =
      'This is <default false 0 /> content <test true 10 continued />.'

    const result = await doShortcodes(content, {
      id: 'test-id',
      contentType: 'test'
    })

    expect(result).toBe(expectedResult)
    expect(itemDataProps).toHaveBeenCalledTimes(2)
    expect(itemDataProps).toHaveBeenCalledWith({
      id: 'test-id',
      contentType: 'test'
    })
  })

  it('should return content with parent and child shortcodes replaced', async () => {
    addShortcode('child', {
      callback ({ attributes, content = '' }) {
        const { subtype = 'default' } = attributes as {
          subtype: string
        }

        return `<child ${subtype}>${content}</child>`
      },
      attributeTypes: {
        subtype: 'string'
      }
    })

    addShortcode('parent', {
      child: 'child',
      callback ({ attributes, content }) {
        const {
          type = 'default',
          required = false,
          size = 0
        } = attributes as {
          type: string
          required: boolean
          size: number
        }

        return `<parent ${type} ${required.toString()} ${size}>${content}</parent>`
      },
      attributeTypes: {
        type: 'string',
        required: 'boolean',
        size: 'number'
      }
    })

    const content =
      'Before [parent type="foo" required="true" size="5"][child]One[/child][child subtype="bar"]Two[/child][/parent] after.'

    const expectedResult =
      'Before <parent foo true 5><child default>One</child><child bar>Two</child></parent> after.'

    const result = await doShortcodes(content)

    expect(result).toBe(expectedResult)
  })
})

/* Test resetShortcodes */

describe('resetShortcodes()', () => {
  afterEach(() => {
    shortcodes.clear()
  })

  it('should clear shortcodes map', () => {
    addShortcode('test', {
      callback: () => 'test'
    })

    resetShortcodes()

    const result = shortcodes.size
    const expectedResult = 0

    expect(result).toBe(expectedResult)
  })
})

/* Test setShortcodes */

describe('setShortcodes()', () => {
  afterEach(() => {
    shortcodes.clear()
  })

  it('should return false if args is not an object', () => {
    // @ts-expect-error - test undefined args
    const result = setShortcodes()
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if args is an empty object', () => {
    const result = setShortcodes({})
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return true if args is an object but not add null shortcodes', () => {
    const result = setShortcodes({
      // @ts-expect-error - test null shortcode
      test: null
    })

    const resultSize = shortcodes.size
    const expectedResult = true
    const expectedResultSize = 0

    expect(result).toBe(expectedResult)
    expect(resultSize).toBe(expectedResultSize)
  })

  it('should return true and add shortcodes to shortcodes map', () => {
    const result = setShortcodes({
      test: {
        callback ({ attributes, content = '' }) {
          const { tag = 'p' } = attributes as {
            tag: string
          }

          return `<${tag}>${content}</${tag}>`
        },
        attributeTypes: {
          tag: 'string'
        },
        child: 'testChild'
      },
      testChild: {
        callback: ({ content }) => content
      }
    })

    const resultSize = shortcodes.size
    const resultTest = shortcodes.has('test')
    const resultTestChild = shortcodes.has('testChild')
    const expectedResult = true
    const expectedResultSize = 2

    expect(result).toBe(expectedResult)
    expect(resultTest).toBe(expectedResult)
    expect(resultTestChild).toBe(expectedResult)
    expect(resultSize).toBe(expectedResultSize)
  })
})

/* Test stripShortcodes */

describe('stripShortcodes()', () => {
  it('should return content if no shortcodes exist', () => {
    const content =
      'No [parent type="foo" required="true" size="5"][child]shortcodes[/child][/parent].'

    const result = stripShortcodes(content)
    const expectedResult = content

    expect(result).toBe(expectedResult)
  })

  it('should remove shortcodes from content', () => {
    addShortcode('child', {
      callback ({ attributes, content = '' }) {
        const { subtype = 'default' } = attributes as {
          subtype: string
        }

        return `<child ${subtype}>${content}</child>`
      },
      attributeTypes: {
        subtype: 'string'
      }
    })

    addShortcode('parent', {
      child: 'child',
      callback ({ attributes, content }) {
        const {
          type = 'default',
          required = false,
          size = 0
        } = attributes as {
          type: string
          required: boolean
          size: number
        }

        return `<parent ${type} ${required.toString()} ${size}>${content}</parent>`
      },
      attributeTypes: {
        type: 'string',
        required: 'boolean',
        size: 'number'
      }
    })

    const content =
      'No [parent type="foo" required="true" size="5"][child]shortcodes[/child][child subtype="bar"][/child][/parent].'

    const result = stripShortcodes(content)
    const expectedResult = 'No shortcodes.'

    expect(result).toBe(expectedResult)
  })
})
