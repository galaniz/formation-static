/**
 * Components - Pagination Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { Pagination } from '../Pagination.js'

/**
 * Remove all empty spaces from string
 *
 * @param {string} str
 * @return {string}
 */
const testMinify = (str: string): string => {
  return str.replace(/\s/g, '')
}

/* Tests */

describe('Pagination()', () => {
  const basePermaLink = 'https://example.com/'

  it('should return empty output and data if props are undefined', () => {
    // @ts-expect-error
    const result = Pagination(undefined)
    const expectedResult = {
      output: '',
      data: {}
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return empty output and data if props are empty', () => {
    const result = Pagination({})
    const expectedResult = {
      output: '',
      data: {}
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return empty output and data if total is 1', () => {
    const result = Pagination({
      total: 1
    })

    const expectedResult = {
      output: '',
      data: {}
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return empty output and data if basePermaLink is empty', () => {
    const result = Pagination({
      basePermaLink: ''
    })

    const expectedResult = {
      output: '',
      data: {}
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return list of five items with first as current', () => {
    const result = Pagination({
      total: 5,
      display: 3,
      current: 1,
      basePermaLink
    })

    const { output, data } = result

    const expectedOutput = `
      <ol>
        <li data-pag-prev="text">
          <span></span>
        </li>
        <li data-pag-current>
          <span>
            <span class="a-hide-vis">Current page </span>
            1
          </span>
        </li>
        <li>
          <a href="${basePermaLink}?page=2">
            <span class="a-hide-vis">Page </span>
            2
          </a>
        </li>
        <li>
          <a href="${basePermaLink}?page=3">
            <span class="a-hide-vis">Page </span>
            3
          </a>
        </li>
        <li data-pag-next="link">
          <a
            href="${basePermaLink}?page=2"
            aria-label="Next page"
          >
          </a>
        </li>
      </ol>
    `

    const expectedData = {
      current: 1,
      nextFilters: '',
      currentFilters: '',
      next: 2
    }

    expect(testMinify(output)).toBe(testMinify(expectedOutput))
    expect(data).toEqual(expectedData)
  })

  it('should return list of five items with second as current', () => {
    const result = Pagination({
      total: 5,
      display: 3,
      current: 2,
      basePermaLink,
      ellipsis: '&hellip;',
      prev: '&larr;',
      next: '&rarr;'
    })

    const { output, data } = result

    const expectedOutput = `
      <ol>
        <li data-pag-prev="link">
          <a
            href="${basePermaLink}"
            aria-label="Previous page"
          >
            &larr;
          </a>
        </li>
        <li>
          <a href="${basePermaLink}">
            <span class="a-hide-vis">Page </span>
            1
          </a>
        </li>
        <li data-pag-current>
          <span>
            <span class="a-hide-vis">Current page </span>
            2
          </span>
        </li>
        <li>
          <a href="${basePermaLink}?page=3">
            <span class="a-hide-vis">Page </span>
            3
          </a>
        </li>
        <li aria-hidden="true" data-pag-ellipsis>&hellip;</li>
        <li data-pag-next="link">
          <a
            href="${basePermaLink}?page=3"
            aria-label="Next page"
          >
            &rarr;
          </a>
        </li>
      </ol>
    `

    const expectedData = {
      current: 2,
      prevFilters: '',
      nextFilters: '',
      currentFilters: '',
      title: 'Page 2 of 5',
      next: 3,
      prev: 1
    }

    expect(testMinify(output)).toBe(testMinify(expectedOutput))
    expect(data).toEqual(expectedData)
  })

  it('should return list of five items with third as current', () => {
    const result = Pagination({
      total: 5,
      display: 3,
      current: 3,
      basePermaLink,
      ellipsis: '&hellip;',
      prev: '&larr;',
      next: '&rarr;'
    })

    const { output, data } = result

    const expectedOutput = `
      <ol>
        <li data-pag-prev="link">
          <a
            href="${basePermaLink}?page=2"
            aria-label="Previous page"
          >
            &larr;
          </a>
        </li>
        <li aria-hidden="true" data-pag-ellipsis>&hellip;</li>
        <li>
          <a href="${basePermaLink}?page=2">
            <span class="a-hide-vis">Page </span>
            2
          </a>
        </li>
        <li data-pag-current>
          <span>
            <span class="a-hide-vis">Current page </span>
            3
          </span>
        </li>
        <li>
          <a href="${basePermaLink}?page=4">
            <span class="a-hide-vis">Page </span>
            4
          </a>
        </li>
        <li aria-hidden="true" data-pag-ellipsis>&hellip;</li>
        <li data-pag-next="link">
          <a
            href="${basePermaLink}?page=4"
            aria-label="Next page"
          >
            &rarr;
          </a>
        </li>
      </ol>
    `

    const expectedData = {
      current: 3,
      prevFilters: '',
      nextFilters: '',
      currentFilters: '',
      title: 'Page 3 of 5',
      next: 4,
      prev: 2
    }

    expect(testMinify(output)).toBe(testMinify(expectedOutput))
    expect(data).toEqual(expectedData)
  })
})
