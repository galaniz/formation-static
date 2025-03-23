/**
 * Layouts - Container Test
 */

/* Imports */

import { it, expect, describe, afterEach, vi } from 'vitest'
import { addFilter, resetFilters } from '../../../utils/filter/filter.js'
import { Container } from '../Container.js'

/* Tests */

describe('Container()', () => {
  afterEach(() => {
    resetFilters()
  })

  it('should return empty array if props are undefined', () => {
    // @ts-expect-error - test undefined props
    const result = Container(undefined)
    const expectedResult: string[] = []

    expect(result).toEqual(expectedResult)
  })

  it('should return empty array if filtered props are undefined', () => {
    const containerProps = vi.fn()

    // @ts-expect-error - test undefined filtered props
    addFilter('containerProps', (props) => {
      containerProps(props)

      return undefined
    })

    const result = Container({
      args: {
        tag: 'div'
      }
    })

    const expectedResult: string[] = []

    expect(result).toEqual(expectedResult)
    expect(containerProps).toHaveBeenCalledTimes(1)
    expect(containerProps).toHaveBeenCalledWith({
      args: {
        tag: 'div'
      }
    })
  })

  it('should return empty array if tag is an empty string', () => {
    const result = Container({
      args: {
        tag: ''
      }
    })

    const expectedResult: string[] = []

    expect(result).toEqual(expectedResult)
  })

  it('should return div tags if props is an empty object', () => {
    // @ts-expect-error - test empty props
    const result = Container({})
    const expectedResult = ['<div>', '</div>']

    expect(result).toEqual(expectedResult)
  })

  it('should return div tags if args are undefined', () => {
    // @ts-expect-error - test undefined args
    const result = Container({ args: undefined })
    const expectedResult = ['<div>', '</div>']

    expect(result).toEqual(expectedResult)
  })

  it('should return div tags and ignore invalid attr', () => {
    const result = Container({
      args: {
        tag: 'div',
        // @ts-expect-error - test invalid attr
        attr: 123
      }
    })

    const expectedResult = ['<div>', '</div>']

    expect(result).toEqual(expectedResult)
  })

  it('should return section and div tags with classes', () => {
    const result = Container({
      args: {
        tag: 'section',
        layoutClasses: 'x',
        classes: 'y',
        nest: true
      }
    })

    const expectedResult = [
      '<section class="y"><div class="x">',
      '</div></section>'
    ]

    expect(result).toEqual(expectedResult)
  })

  it('should return section tags with classes', () => {
    const result = Container({
      args: {
        tag: 'section',
        layoutClasses: 'x',
        classes: 'y'
      }
    })

    const expectedResult = [
      '<section class="y x">',
      '</section>'
    ]

    expect(result).toEqual(expectedResult)
  })

  it('should return div and ul tags with classes and attributes', () => {
    const result = Container({
      args: {
        tag: 'ul',
        layoutClasses: 'x',
        classes: 'y',
        attr: 'role="list"',
        style: 'background:black',
        nest: true
      }
    })

    const expectedResult = [
      '<div class="y"><ul class="x" role="list" style="background:black">',
      '</ul></div>'
    ]

    expect(result).toEqual(expectedResult)
  })

  it('should return figure tags with classes and style attribute', () => {
    const result = Container({
      args: {
        tag: 'figure',
        layoutClasses: 'x',
        classes: 'y',
        style: 'background:black'
      }
    })

    const expectedResult = [
      '<figure class="y x" style="background:black">',
      '</figure>'
    ]

    expect(result).toEqual(expectedResult)
  })

  it('should return filtered header tags and attributes', () => {
    const containerProps = vi.fn()

    addFilter('containerProps', (props) => {
      containerProps(props)

      const newProps = {
        ...props,
        args: {
          ...props.args,
          tag: 'header',
          attr: 'data-attr="true"'
        }
      }

      return newProps
    })

    const result = Container({
      args: {
        tag: 'dl',
        classes: 'x'
      }
    })

    const expectedResult = [
      '<header class="x" data-attr="true">',
      '</header>'
    ]

    expect(result).toEqual(expectedResult)
  })

  it('should return article tags', () => {
    const result = Container({
      args: {
        tag: 'article',
        nest: true
      }
    })

    const expectedResult = [
      '<article>',
      '</article>'
    ]

    expect(result).toEqual(expectedResult)
  })
})
