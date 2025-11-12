/**
 * Components - Pagination Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { testMinify } from '../../../../tests/utils.js'
import { Pagination } from '../Pagination.js'

/* Tests */

describe('Pagination()', () => {
  const url = 'http://example.com/'
  const args = {
    listClass: 'list',
    listAttr: 'data-test="list"',
    itemClass: 'item',
    itemAttr: 'data-test="item"',
    linkClass: 'link',
    linkAttr: 'data-test="link"',
    currentClass: 'current',
    a11yClass: 'a11y',
    firstClass: 'first-link',
    lastClass: 'last-link',
    prevSpanClass: 'prev-span',
    prevLinkClass: 'prev-link',
    nextSpanClass: 'next-span',
    nextLinkClass: 'next-link'
  }

  it('should return empty output and data if props are undefined', () => {
    // @ts-expect-error - test undefined props
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

  it('should return empty output and data if URL is empty', () => {
    const result = Pagination({
      url: ''
    })

    const expectedResult = {
      output: '',
      data: {}
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return list of 5 items with first as current', () => {
    const result = Pagination({
      total: 5,
      display: 3,
      current: 1,
      url
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
          <a href="${url}?page=2">
            <span class="a-hide-vis">Page </span>
            2
          </a>
        </li>
        <li>
          <a href="${url}?page=3">
            <span class="a-hide-vis">Page </span>
            3
          </a>
        </li>
        <li data-pag-next="link">
          <a
            href="${url}?page=2"
            aria-label="Next page"
          >
          </a>
        </li>
      </ol>
    `

    const expectedData = {
      current: 1,
      total: 5,
      nextParams: {
        page: '2'
      },
      lastParams: {
        page: '5'
      },
      next: 2
    }

    expect(testMinify(output)).toBe(testMinify(expectedOutput))
    expect(data).toEqual(expectedData)
  })

  it('should return list of 5 items with second as current and first and last items', () => {
    const result = Pagination({
      total: 5,
      display: 3,
      current: 2,
      url,
      prev: '&larr;',
      next: '&rarr;',
      first: '&laquo;',
      last: '&raquo;'
    })

    const { output, data } = result

    const expectedOutput = `
      <ol>
        <li data-pag-first>
          <a
            href="${url}"
            aria-label="First page"
          >
            &laquo;
          </a>
        </li>
        <li data-pag-prev="link">
          <a
            href="${url}"
            aria-label="Previous page"
          >
            &larr;
          </a>
        </li>
        <li>
          <a href="${url}">
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
          <a href="${url}?page=3">
            <span class="a-hide-vis">Page </span>
            3
          </a>
        </li>
        <li data-pag-next="link">
          <a
            href="${url}?page=3"
            aria-label="Next page"
          >
            &rarr;
          </a>
        </li>
        <li data-pag-last>
          <a
            href="${url}?page=5"
            aria-label="Last page"
          >
            &raquo;
          </a>
        </li>
      </ol>
    `

    const expectedData = {
      current: 2,
      total: 5,
      nextParams: {
        page: '3'
      },
      currentParams: {
        page: '2'
      },
      lastParams: {
        page: '5'
      },
      title: 'Page 2 of 5',
      next: 3,
      prev: 1
    }

    expect(testMinify(output)).toBe(testMinify(expectedOutput))
    expect(data).toEqual(expectedData)
  })

  it('should return list of 5 items with third as current', () => {
    const result = Pagination({
      total: 5,
      display: 3,
      current: 3,
      url,
      prev: '&larr;',
      next: '&rarr;'
    })

    const { output, data } = result

    const expectedOutput = `
      <ol>
        <li data-pag-prev="link">
          <a
            href="${url}?page=2"
            aria-label="Previous page"
          >
            &larr;
          </a>
        </li>
        <li>
          <a href="${url}?page=2">
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
          <a href="${url}?page=4">
            <span class="a-hide-vis">Page </span>
            4
          </a>
        </li>
        <li data-pag-next="link">
          <a
            href="${url}?page=4"
            aria-label="Next page"
          >
            &rarr;
          </a>
        </li>
      </ol>
    `

    const expectedData = {
      current: 3,
      total: 5,
      prevParams: {
        page: '2'
      },
      nextParams: {
        page: '4'
      },
      currentParams: {
        page: '3'
      },
      lastParams: {
        page: '5'
      },
      title: 'Page 3 of 5',
      next: 4,
      prev: 2
    }

    expect(testMinify(output)).toBe(testMinify(expectedOutput))
    expect(data).toEqual(expectedData)
  })

  it('should return list of 5 items with fourth as current', () => {
    const result = Pagination({
      total: 5,
      display: 3,
      current: 4,
      url,
      prev: '&larr;',
      next: '&rarr;'
    })

    const { output, data } = result

    const expectedOutput = `
      <ol>
        <li data-pag-prev="link">
          <a
            href="${url}?page=3"
            aria-label="Previous page"
          >
            &larr;
          </a>
        </li>
        <li>
          <a href="${url}?page=3">
            <span class="a-hide-vis">Page </span>
            3
          </a>
        </li>
        <li data-pag-current>
          <span>
            <span class="a-hide-vis">Current page </span>
            4
          </span>
        </li>
        <li>
          <a href="${url}?page=5">
            <span class="a-hide-vis">Page </span>
            5
          </a>
        </li>
        <li data-pag-next="link">
          <a
            href="${url}?page=5"
            aria-label="Next page"
          >
            &rarr;
          </a>
        </li>
      </ol>
    `

    const expectedData = {
      current: 4,
      total: 5,
      prevParams: {
        page: '3'
      },
      nextParams: {
        page: '5'
      },
      currentParams: {
        page: '4'
      },
      lastParams: {
        page: '5'
      },
      title: 'Page 4 of 5',
      next: 5,
      prev: 3
    }

    expect(testMinify(output)).toBe(testMinify(expectedOutput))
    expect(data).toEqual(expectedData)
  })

  it('should return list of 5 items with fifth as current', () => {
    const result = Pagination({
      total: 5,
      display: 3,
      current: 5,
      url,
      prev: '&larr;',
      next: '&rarr;'
    })

    const { output, data } = result

    const expectedOutput = `
      <ol>
        <li data-pag-prev="link">
          <a
            href="${url}?page=4"
            aria-label="Previous page"
          >
            &larr;
          </a>
        </li>
        <li>
          <a href="${url}?page=3">
            <span class="a-hide-vis">Page </span>
            3
          </a>
        </li>
        <li>
          <a href="${url}?page=4">
            <span class="a-hide-vis">Page </span>
            4
          </a>
        </li>
        <li data-pag-current>
          <span>
            <span class="a-hide-vis">Current page </span>
            5
          </span>
        </li>
        <li data-pag-next="text">
          <span>&rarr;</span>
        </li>
      </ol>
    `

    const expectedData = {
      current: 5,
      total: 5,
      prevParams: {
        page: '4'
      },
      currentParams: {
        page: '5'
      },
      lastParams: {
        page: '5'
      },
      title: 'Page 5 of 5',
      prev: 4
    }

    expect(testMinify(output)).toBe(testMinify(expectedOutput))
    expect(data).toEqual(expectedData)
  })

  it('should return list of 6 items with first as current and filters', () => {
    const result = Pagination({
      total: 5,
      display: 3,
      current: 1,
      url,
      ellipsis: '&hellip;',
      filters: {
        filters: 'cat:1'
      },
      args: { ...args }
    })

    const { output, data } = result

    const expectedOutput = `
      <ol class="list" data-test="list">
        <li class="item" data-test="item" data-pag-prev="text">
          <span class="prev-span"></span>
        </li>
        <li class="item" data-test="item" data-pag-current>
          <span class="current">
            <span class="a11y">Current page </span>
            1
          </span>
        </li>
        <li class="item" data-test="item">
          <a href="${url}?page=2&filters=cat%3A1" class="link" data-test="link">
            <span class="a11y">Page </span>
            2
          </a>
        </li>
        <li class="item" data-test="item">
          <a href="${url}?page=3&filters=cat%3A1" class="link" data-test="link">
            <span class="a11y">Page </span>
            3
          </a>
        </li>
        <li class="item" data-test="item" aria-hidden="true" data-pag-ellipsis>&hellip;</li>
        <li class="item" data-test="item" data-pag-next="link">
          <a
            href="${url}?page=2&filters=cat%3A1"
            aria-label="Next page"
            class="next-link"
          >
          </a>
        </li>
      </ol>
    `

    const expectedData = {
      current: 1,
      total: 5,
      prevParams: {
        filters: 'cat:1'
      },
      nextParams: {
        page: '2',
        filters: 'cat:1'
      },
      currentParams: {
        filters: 'cat:1'
      },
      firstParams: {
        filters: 'cat:1'
      },
      lastParams: {
        filters: 'cat:1',
        page: '5'
      },
      next: 2
    }

    expect(testMinify(output)).toBe(testMinify(expectedOutput))
    expect(data).toEqual(expectedData)
  })

  it('should return list of 6 items with second as current and filters', () => {
    const result = Pagination({
      total: 5,
      display: 3,
      current: 2,
      url,
      ellipsis: '&hellip;',
      prev: '&larr;',
      next: '&rarr;',
      filters: {
        filters: 'cat:1'
      },
      args: { ...args }
    })

    const { output, data } = result

    const expectedOutput = `
      <ol class="list" data-test="list">
        <li class="item" data-test="item" data-pag-prev="link">
          <a
            href="${url}?filters=cat%3A1"
            aria-label="Previous page"
            class="prev-link"
          >
            &larr;
          </a>
        </li>
        <li class="item" data-test="item">
          <a href="${url}?filters=cat%3A1" class="link" data-test="link">
            <span class="a11y">Page </span>
            1
          </a>
        </li>
        <li class="item" data-test="item" data-pag-current>
          <span class="current">
            <span class="a11y">Current page </span>
            2
          </span>
        </li>
        <li class="item" data-test="item">
          <a href="${url}?page=3&filters=cat%3A1" class="link" data-test="link">
            <span class="a11y">Page </span>
            3
          </a>
        </li>
        <li class="item" data-test="item" aria-hidden="true" data-pag-ellipsis>&hellip;</li>
        <li class="item" data-test="item" data-pag-next="link">
          <a
            href="${url}?page=3&filters=cat%3A1"
            aria-label="Next page"
            class="next-link"
          >
            &rarr;
          </a>
        </li>
      </ol>
    `

    const expectedData = {
      current: 2,
      total: 5,
      prevParams: {
        filters: 'cat:1'
      },
      nextParams: {
        page: '3',
        filters: 'cat:1'
      },
      currentParams: {
        page: '2',
        filters: 'cat:1'
      },
      firstParams: {
        filters: 'cat:1'
      },
      lastParams: {
        filters: 'cat:1',
        page: '5'
      },
      title: 'Page 2 of 5',
      next: 3,
      prev: 1
    }

    expect(testMinify(output)).toBe(testMinify(expectedOutput))
    expect(data).toEqual(expectedData)
  })

  it('should return list of 7 items with third as current, first and last items, filters and attributes', () => {
    const result = Pagination({
      total: 5,
      display: 3,
      current: 3,
      url,
      ellipsis: '&hellip;',
      prev: '&larr;',
      next: '&rarr;',
      first: '&laquo;',
      last: '&raquo;',
      filters: {
        filters: 'cat:1'
      },
      args: { ...args }
    })

    const { output, data } = result

    const expectedOutput = `
      <ol class="list" data-test="list">
        <li class="item" data-test="item" data-pag-first>
          <a
            href="${url}?filters=cat%3A1"
            aria-label="First page"
            class="first-link"
          >
            &laquo;
          </a>
        </li>
        <li class="item" data-test="item" data-pag-prev="link">
          <a
            href="${url}?page=2&filters=cat%3A1"
            aria-label="Previous page"
            class="prev-link"
          >
            &larr;
          </a>
        </li>
        <li class="item" data-test="item" aria-hidden="true" data-pag-ellipsis>&hellip;</li>
        <li class="item" data-test="item">
          <a href="${url}?page=2&filters=cat%3A1" class="link" data-test="link">
            <span class="a11y">Page </span>
            2
          </a>
        </li>
        <li class="item" data-test="item" data-pag-current>
          <span class="current">
            <span class="a11y">Current page </span>
            3
          </span>
        </li>
        <li class="item" data-test="item">
          <a href="${url}?page=4&filters=cat%3A1" class="link" data-test="link">
            <span class="a11y">Page </span>
            4
          </a>
        </li>
        <li class="item" data-test="item" aria-hidden="true" data-pag-ellipsis>&hellip;</li>
        <li class="item" data-test="item" data-pag-next="link">
          <a
            href="${url}?page=4&filters=cat%3A1"
            aria-label="Next page"
            class="next-link"
          >
            &rarr;
          </a>
        </li>
        <li class="item" data-test="item" data-pag-last>
          <a
            href="${url}?page=5&filters=cat%3A1"
            aria-label="Last page"
            class="last-link"
          >
            &raquo;
          </a>
        </li>
      </ol>
    `

    const expectedData = {
      current: 3,
      total: 5,
      prevParams: {
        page: '2',
        filters: 'cat:1'
      },
      nextParams: {
        page: '4',
        filters: 'cat:1'
      },
      currentParams: {
        page: '3',
        filters: 'cat:1'
      },
      firstParams: {
        filters: 'cat:1'
      },
      lastParams: {
        filters: 'cat:1',
        page: '5'
      },
      title: 'Page 3 of 5',
      next: 4,
      prev: 2
    }

    expect(testMinify(output)).toBe(testMinify(expectedOutput))
    expect(data).toEqual(expectedData)
  })

  it('should return list of 6 items with fourth as current and filters', () => {
    const result = Pagination({
      total: 5,
      display: 3,
      current: 4,
      url,
      ellipsis: '&hellip;',
      prev: '&larr;',
      next: '&rarr;',
      filters: {
        filters: 'cat:1'
      },
      args: { ...args }
    })

    const { output, data } = result

    const expectedOutput = `
      <ol class="list" data-test="list">
        <li class="item" data-test="item" data-pag-prev="link">
          <a
            href="${url}?page=3&filters=cat%3A1"
            aria-label="Previous page"
            class="prev-link"
          >
            &larr;
          </a>
        </li>
        <li class="item" data-test="item" aria-hidden="true" data-pag-ellipsis>&hellip;</li>
        <li class="item" data-test="item">
          <a href="${url}?page=3&filters=cat%3A1" class="link" data-test="link">
            <span class="a11y">Page </span>
            3
          </a>
        </li>
        <li class="item" data-test="item" data-pag-current>
          <span class="current">
            <span class="a11y">Current page </span>
            4
          </span>
        </li>
        <li class="item" data-test="item">
          <a href="${url}?page=5&filters=cat%3A1" class="link" data-test="link">
            <span class="a11y">Page </span>
            5
          </a>
        </li>
        <li class="item" data-test="item" data-pag-next="link">
          <a
            href="${url}?page=5&filters=cat%3A1"
            aria-label="Next page"
            class="next-link"
          >
            &rarr;
          </a>
        </li>
      </ol>
    `

    const expectedData = {
      current: 4,
      total: 5,
      prevParams: {
        page: '3',
        filters: 'cat:1'
      },
      nextParams: {
        page: '5',
        filters: 'cat:1'
      },
      currentParams: {
        page: '4',
        filters: 'cat:1'
      },
      firstParams: {
        filters: 'cat:1'
      },
      lastParams: {
        filters: 'cat:1',
        page: '5'
      },
      title: 'Page 4 of 5',
      next: 5,
      prev: 3
    }

    expect(testMinify(output)).toBe(testMinify(expectedOutput))
    expect(data).toEqual(expectedData)
  })

  it('should return list of 6 items with fifth as current and filters', () => {
    const result = Pagination({
      total: 5,
      display: 3,
      current: 5,
      url,
      ellipsis: '&hellip;',
      prev: '&larr;',
      next: '&rarr;',
      filters: {
        filters: 'cat:1'
      },
      args: { ...args }
    })

    const { output, data } = result

    const expectedOutput = `
      <ol class="list" data-test="list">
        <li class="item" data-test="item" data-pag-prev="link">
          <a
            href="${url}?page=4&filters=cat%3A1"
            aria-label="Previous page"
            class="prev-link"
          >
            &larr;
          </a>
        </li>
        <li class="item" data-test="item" aria-hidden="true" data-pag-ellipsis>&hellip;</li>
        <li class="item" data-test="item">
          <a href="${url}?page=3&filters=cat%3A1" class="link" data-test="link">
            <span class="a11y">Page </span>
            3
          </a>
        </li>
        <li class="item" data-test="item">
          <a href="${url}?page=4&filters=cat%3A1" class="link" data-test="link">
            <span class="a11y">Page </span>
            4
          </a>
        </li>
        <li class="item" data-test="item" data-pag-current>
          <span class="current">
            <span class="a11y">Current page </span>
            5
          </span>
        </li>
        <li class="item" data-test="item" data-pag-next="text">
          <span class="next-span">&rarr;</span>
        </li>
      </ol>
    `

    const expectedData = {
      current: 5,
      total: 5,
      prevParams: {
        page: '4',
        filters: 'cat:1'
      },
      currentParams: {
        page: '5',
        filters: 'cat:1'
      },
      firstParams: {
        filters: 'cat:1'
      },
      lastParams: {
        filters: 'cat:1',
        page: '5'
      },
      title: 'Page 5 of 5',
      prev: 4
    }

    expect(testMinify(output)).toBe(testMinify(expectedOutput))
    expect(data).toEqual(expectedData)
  })

  it('should return list of 12 items with second as current', () => {
    const result = Pagination({
      total: 10,
      display: 15,
      current: 1,
      url,
      ellipsis: '&hellip;'
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
          <a href="${url}?page=2">
            <span class="a-hide-vis">Page </span>
            2
          </a>
        </li>
        <li>
          <a href="${url}?page=3">
            <span class="a-hide-vis">Page </span>
            3
          </a>
        </li>
        <li>
          <a href="${url}?page=4">
            <span class="a-hide-vis">Page </span>
            4
          </a>
        </li>
        <li>
          <a href="${url}?page=5">
            <span class="a-hide-vis">Page </span>
            5
          </a>
        </li>
        <li>
          <a href="${url}?page=6">
            <span class="a-hide-vis">Page </span>
            6
          </a>
        </li>
        <li>
          <a href="${url}?page=7">
            <span class="a-hide-vis">Page </span>
            7
          </a>
        </li>
        <li>
          <a href="${url}?page=8">
            <span class="a-hide-vis">Page </span>
            8
          </a>
        </li>
        <li>
          <a href="${url}?page=9">
            <span class="a-hide-vis">Page </span>
            9
          </a>
        </li>
        <li>
          <a href="${url}?page=10">
            <span class="a-hide-vis">Page </span>
            10
          </a>
        </li>
        <li data-pag-next="link">
          <a
            href="${url}?page=2"
            aria-label="Next page"
          >
          </a>
        </li>
      </ol>
    `

    const expectedData = {
      current: 1,
      total: 10,
      nextParams: {
        page: '2'
      },
      lastParams: {
        page: '10'
      },
      next: 2
    }

    expect(testMinify(output)).toBe(testMinify(expectedOutput))
    expect(data).toEqual(expectedData)
  })
})
