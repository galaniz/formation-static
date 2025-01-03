/**
 * Components - Pagination Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { testMinify } from '../../../../tests/utils.js'
import { Pagination } from '../Pagination.js'

/* Tests */

describe('Pagination()', () => {
  const basePermaLink = 'http://example.com/'
  const args = {
    listClass: 'list',
    listAttr: 'data-test="list"',
    itemClass: 'item',
    itemAttr: 'data-test="item"',
    linkClass: 'link',
    linkAttr: 'data-test="link"',
    currentClass: 'current',
    a11yClass: 'a11y',
    prevSpanClass: 'prev-span',
    prevLinkClass: 'prev-link',
    nextSpanClass: 'next-span',
    nextLinkClass: 'next-link',
    itemMaxWidth: true
  }

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

  it('should return list of 5 items with first as current', () => {
    const result = Pagination({
      total: 5,
      display: 3,
      current: 1,
      basePermaLink,
      args: {
        itemMaxWidth: true
      }
    })

    const { output, data } = result

    const expectedOutput = `
      <ol style="--pag-item-max-width:20%">
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
      total: 5,
      nextFilters: '',
      currentFilters: '',
      next: 2
    }

    expect(testMinify(output)).toBe(testMinify(expectedOutput))
    expect(data).toEqual(expectedData)
  })

  it('should return list of 5 items with second as current', () => {
    const result = Pagination({
      total: 5,
      display: 3,
      current: 2,
      basePermaLink,
      prev: '&larr;',
      next: '&rarr;',
      args: {
        itemMaxWidth: true
      }
    })

    const { output, data } = result

    const expectedOutput = `
      <ol style="--pag-item-max-width:20%">
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
      total: 5,
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

  it('should return list of 5 items with third as current', () => {
    const result = Pagination({
      total: 5,
      display: 3,
      current: 3,
      basePermaLink,
      prev: '&larr;',
      next: '&rarr;',
      args: {
        itemMaxWidth: true
      }
    })

    const { output, data } = result

    const expectedOutput = `
      <ol style="--pag-item-max-width:20%">
        <li data-pag-prev="link">
          <a
            href="${basePermaLink}?page=2"
            aria-label="Previous page"
          >
            &larr;
          </a>
        </li>
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
      total: 5,
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

  it('should return list of 5 items with fourth as current', () => {
    const result = Pagination({
      total: 5,
      display: 3,
      current: 4,
      basePermaLink,
      prev: '&larr;',
      next: '&rarr;',
      args: {
        itemMaxWidth: true
      }
    })

    const { output, data } = result

    const expectedOutput = `
      <ol style="--pag-item-max-width:20%">
        <li data-pag-prev="link">
          <a
            href="${basePermaLink}?page=3"
            aria-label="Previous page"
          >
            &larr;
          </a>
        </li>
        <li>
          <a href="${basePermaLink}?page=3">
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
          <a href="${basePermaLink}?page=5">
            <span class="a-hide-vis">Page </span>
            5
          </a>
        </li>
        <li data-pag-next="link">
          <a
            href="${basePermaLink}?page=5"
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
      prevFilters: '',
      nextFilters: '',
      currentFilters: '',
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
      basePermaLink,
      prev: '&larr;',
      next: '&rarr;',
      args: {
        itemMaxWidth: true
      }
    })

    const { output, data } = result

    const expectedOutput = `
      <ol style="--pag-item-max-width:20%">
        <li data-pag-prev="link">
          <a
            href="${basePermaLink}?page=4"
            aria-label="Previous page"
          >
            &larr;
          </a>
        </li>
        <li>
          <a href="${basePermaLink}?page=3">
            <span class="a-hide-vis">Page </span>
            3
          </a>
        </li>
        <li>
          <a href="${basePermaLink}?page=4">
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
      prevFilters: '',
      nextFilters: '',
      currentFilters: '',
      title: 'Page 5 of 5',
      next: 0,
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
      basePermaLink,
      ellipsis: '&hellip;',
      filters: 'filters=cat:1',
      args: { ...args }
    })

    const { output, data } = result

    const expectedOutput = `
      <ol class="list" data-test="list" style="--pag-item-max-width:16.6667%">
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
          <a href="${basePermaLink}?page=2&filters=cat:1" class="link" data-test="link">
            <span class="a11y">Page </span>
            2
          </a>
        </li>
        <li class="item" data-test="item">
          <a href="${basePermaLink}?page=3&filters=cat:1" class="link" data-test="link">
            <span class="a11y">Page </span>
            3
          </a>
        </li>
        <li class="item" data-test="item" aria-hidden="true" data-pag-ellipsis>&hellip;</li>
        <li class="item" data-test="item" data-pag-next="link">
          <a
            href="${basePermaLink}?page=2&filters=cat:1"
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
      nextFilters: '&filters=cat:1',
      currentFilters: '?filters=cat:1',
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
      basePermaLink,
      ellipsis: '&hellip;',
      prev: '&larr;',
      next: '&rarr;',
      filters: 'filters=cat:1',
      args: { ...args }
    })

    const { output, data } = result

    const expectedOutput = `
      <ol class="list" data-test="list" style="--pag-item-max-width:16.6667%">
        <li class="item" data-test="item" data-pag-prev="link">
          <a
            href="${basePermaLink}?filters=cat:1"
            aria-label="Previous page"
            class="prev-link"
          >
            &larr;
          </a>
        </li>
        <li class="item" data-test="item">
          <a href="${basePermaLink}?filters=cat:1" class="link" data-test="link">
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
          <a href="${basePermaLink}?page=3&filters=cat:1" class="link" data-test="link">
            <span class="a11y">Page </span>
            3
          </a>
        </li>
        <li class="item" data-test="item" aria-hidden="true" data-pag-ellipsis>&hellip;</li>
        <li class="item" data-test="item" data-pag-next="link">
          <a
            href="${basePermaLink}?page=3&filters=cat:1"
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
      prevFilters: '?filters=cat:1',
      nextFilters: '&filters=cat:1',
      currentFilters: '&filters=cat:1',
      title: 'Page 2 of 5',
      next: 3,
      prev: 1
    }

    expect(testMinify(output)).toBe(testMinify(expectedOutput))
    expect(data).toEqual(expectedData)
  })

  it('should return list of 7 items with third as current, filters and attributes', () => {
    const result = Pagination({
      total: 5,
      display: 3,
      current: 3,
      basePermaLink,
      ellipsis: '&hellip;',
      prev: '&larr;',
      next: '&rarr;',
      filters: 'filters=cat:1',
      args: { ...args }
    })

    const { output, data } = result

    const expectedOutput = `
      <ol class="list" data-test="list" style="--pag-item-max-width:14.2857%">
        <li class="item" data-test="item" data-pag-prev="link">
          <a
            href="${basePermaLink}?page=2&filters=cat:1"
            aria-label="Previous page"
            class="prev-link"
          >
            &larr;
          </a>
        </li>
        <li class="item" data-test="item" aria-hidden="true" data-pag-ellipsis>&hellip;</li>
        <li class="item" data-test="item">
          <a href="${basePermaLink}?page=2&filters=cat:1" class="link" data-test="link">
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
          <a href="${basePermaLink}?page=4&filters=cat:1" class="link" data-test="link">
            <span class="a11y">Page </span>
            4
          </a>
        </li>
        <li class="item" data-test="item" aria-hidden="true" data-pag-ellipsis>&hellip;</li>
        <li class="item" data-test="item" data-pag-next="link">
          <a
            href="${basePermaLink}?page=4&filters=cat:1"
            aria-label="Next page"
            class="next-link"
          >
            &rarr;
          </a>
        </li>
      </ol>
    `

    const expectedData = {
      current: 3,
      total: 5,
      prevFilters: '&filters=cat:1',
      nextFilters: '&filters=cat:1',
      currentFilters: '&filters=cat:1',
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
      basePermaLink,
      ellipsis: '&hellip;',
      prev: '&larr;',
      next: '&rarr;',
      filters: 'filters=cat:1',
      args: { ...args }
    })

    const { output, data } = result

    const expectedOutput = `
      <ol class="list" data-test="list" style="--pag-item-max-width:16.6667%">
        <li class="item" data-test="item" data-pag-prev="link">
          <a
            href="${basePermaLink}?page=3&filters=cat:1"
            aria-label="Previous page"
            class="prev-link"
          >
            &larr;
          </a>
        </li>
        <li class="item" data-test="item" aria-hidden="true" data-pag-ellipsis>&hellip;</li>
        <li class="item" data-test="item">
          <a href="${basePermaLink}?page=3&filters=cat:1" class="link" data-test="link">
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
          <a href="${basePermaLink}?page=5&filters=cat:1" class="link" data-test="link">
            <span class="a11y">Page </span>
            5
          </a>
        </li>
        <li class="item" data-test="item" data-pag-next="link">
          <a
            href="${basePermaLink}?page=5&filters=cat:1"
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
      prevFilters: '&filters=cat:1',
      nextFilters: '&filters=cat:1',
      currentFilters: '&filters=cat:1',
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
      basePermaLink,
      ellipsis: '&hellip;',
      prev: '&larr;',
      next: '&rarr;',
      filters: 'filters=cat:1',
      args: { ...args }
    })

    const { output, data } = result

    const expectedOutput = `
      <ol class="list" data-test="list" style="--pag-item-max-width:16.6667%">
        <li class="item" data-test="item" data-pag-prev="link">
          <a
            href="${basePermaLink}?page=4&filters=cat:1"
            aria-label="Previous page"
            class="prev-link"
          >
            &larr;
          </a>
        </li>
        <li class="item" data-test="item" aria-hidden="true" data-pag-ellipsis>&hellip;</li>
        <li class="item" data-test="item">
          <a href="${basePermaLink}?page=3&filters=cat:1" class="link" data-test="link">
            <span class="a11y">Page </span>
            3
          </a>
        </li>
        <li class="item" data-test="item">
          <a href="${basePermaLink}?page=4&filters=cat:1" class="link" data-test="link">
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
      prevFilters: '&filters=cat:1',
      nextFilters: '',
      currentFilters: '&filters=cat:1',
      title: 'Page 5 of 5',
      next: 0,
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
      basePermaLink,
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
        <li>
          <a href="${basePermaLink}?page=4">
            <span class="a-hide-vis">Page </span>
            4
          </a>
        </li>
        <li>
          <a href="${basePermaLink}?page=5">
            <span class="a-hide-vis">Page </span>
            5
          </a>
        </li>
        <li>
          <a href="${basePermaLink}?page=6">
            <span class="a-hide-vis">Page </span>
            6
          </a>
        </li>
        <li>
          <a href="${basePermaLink}?page=7">
            <span class="a-hide-vis">Page </span>
            7
          </a>
        </li>
        <li>
          <a href="${basePermaLink}?page=8">
            <span class="a-hide-vis">Page </span>
            8
          </a>
        </li>
        <li>
          <a href="${basePermaLink}?page=9">
            <span class="a-hide-vis">Page </span>
            9
          </a>
        </li>
        <li>
          <a href="${basePermaLink}?page=10">
            <span class="a-hide-vis">Page </span>
            10
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
      total: 10,
      nextFilters: '',
      currentFilters: '',
      next: 2
    }

    expect(testMinify(output)).toBe(testMinify(expectedOutput))
    expect(data).toEqual(expectedData)
  })
})
