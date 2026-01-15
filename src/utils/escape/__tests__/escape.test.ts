/**
 * Utils - Escape Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { escape } from '../escape.js'

/* Tests */

describe('escape()', () => {
  it('should throw error if value is null', () => {
    // @ts-expect-error - test null value
    expect(() => escape(null)).toThrowError('Value not a string')
  })

  it('should escape html', () => {
    const result = escape('<script>alert("xss&fun");</script>')
    const expectedResult = '&lt;script&gt;alert(&quot;xss&amp;fun&quot;);&lt;&#x2F;script&gt;'

    expect(result).toBe(expectedResult)
  })

  it('should escape backticks', () => {
    const result = escape('Backtick: `')
    const expectedResult = 'Backtick: &#96;'

    expect(result).toBe(expectedResult)
  })

  it('should escape backslashes', () => {
    const result = escape('Backslash: \\')
    const expectedResult = 'Backslash: &#x5C;'

    expect(result).toBe(expectedResult)
  })

  it('should escape double quote', () => {
    const result = escape('Double quote: "')
    const expectedResult = 'Double quote: &quot;'

    expect(result).toBe(expectedResult)
  })

  it('should escape single quote', () => {
    const result = escape("Single quote: '")
    const expectedResult = 'Single quote: &#x27;'

    expect(result).toBe(expectedResult)
  })

  it('should escape forward slashes', () => {
    const result = escape('Forward slash: /')
    const expectedResult = 'Forward slash: &#x2F;'

    expect(result).toBe(expectedResult)
  })

  it('should escape ampersands', () => {
    const result = escape('Ampersand: &')
    const expectedResult = 'Ampersand: &amp;'

    expect(result).toBe(expectedResult)
  })

  it('should escape greater than', () => {
    const result = escape('Greater than: >')
    const expectedResult = 'Greater than: &gt;'

    expect(result).toBe(expectedResult)
  })

  it('should escape less than', () => {
    const result = escape('Less than: <')
    const expectedResult = 'Less than: &lt;'

    expect(result).toBe(expectedResult)
  })
})
