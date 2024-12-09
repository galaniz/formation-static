/**
 * Utils - Excerpt Test
 */

/* Imports */

import { it, expect, describe, afterEach, beforeEach } from 'vitest'
import { addShortcode, removeShortcode } from '../../shortcode/shortcode.js'
import { getExcerpt } from '../excerpt.js'

/* Tests */

describe('getExcerpt()', () => {
  beforeEach(() => {
    addShortcode('shortcode', {
      callback: () => 'Test shortcode'
    })
  })

  afterEach(() => {
    removeShortcode('shortcode')
  })

  it('should return empty string if args are null or empty', () => {
    // @ts-expect-error
    const resultNull = getExcerpt(null)
    const resultEmpty = getExcerpt({})
    const expectedResult = ''

    expect(resultNull).toBe(expectedResult)
    expect(resultEmpty).toBe(expectedResult)
  })

  it('should return excerpt', () => {
    const result = getExcerpt({ excerpt: 'Test excerpt' })
    const expectedResult = 'Test excerpt'

    expect(result).toBe(expectedResult)
  })

  it('should return truncated excerpt', () => {
    const result = getExcerpt({
      excerpt: 'Test excerpt',
      limitExcerpt: true,
      limit: 1
    })

    const expectedResult = 'Test&hellip;'

    expect(result).toBe(expectedResult)
  })

  it('should return truncated content', () => {
    const result = getExcerpt({
      limit: 5,
      content: {
        content: [
          {
            content: 'Test nested excerpt.'
          },
          {
            content: 'The quick brown fox.'
          }
        ]
      }
    })

    const expectedResult = 'Test nested excerpt. The quick&hellip;'

    expect(result).toBe(expectedResult)
  })

  it('should return content', () => {
    const result = getExcerpt({
      prop: 'value',
      content: {
        value: 'Test nested excerpt'
      }
    })

    const expectedResult = 'Test nested excerpt'

    expect(result).toBe(expectedResult)
  })

  it('should return content without shortcodes', () => {
    const result = getExcerpt({
      content: [
        {
          content: 'Test content [shortcode]shortcode[/shortcode] excerpt'
        }
      ]
    })

    const expectedResult = 'Test content shortcode excerpt'

    expect(result).toBe(expectedResult)
  })
})
