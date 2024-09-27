/**
 * Layouts - Container Test
 */

/* Imports */

import type { ContainerPropsFilter } from '../ContainerTypes.js'
import { it, expect, describe } from 'vitest'
import { addFilter, removeFilter } from '../../../utils/filter/filter.js'
import { Container } from '../Container.js'

/* Tests */

describe('Container()', () => {
  it('should return empty start and end if props are undefined', async () => {
    // @ts-expect-error
    const result = await Container(undefined)
    const expectedResult = {
      start: '',
      end: ''
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return empty start and end if filtered props are undefined', async () => {
    const filterName = 'containerProps'
    // @ts-expect-error
    const filter: ContainerPropsFilter = async () => {
      return undefined
    }

    addFilter(filterName, filter)

    const result = await Container({
      args: {
        tag: 'div'
      }
    })

    removeFilter(filterName, filter)

    const expectedResult = {
      start: '',
      end: ''
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return empty start and end if tag is an empty string', async () => {
    const result = await Container({
      args: {
        tag: ''
      }
    })

    const expectedResult = {
      start: '',
      end: ''
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return div tags if props is an empty object', async () => {
    // @ts-expect-error
    const result = await Container({})
    const expectedResult = {
      start: '<div>',
      end: '</div>'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return div tags if args are undefined', async () => {
    // @ts-expect-error
    const result = await Container({ args: undefined })
    const expectedResult = {
      start: '<div>',
      end: '</div>'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return div tags and ignore invalid attr', async () => {
    const result = await Container({
      args: {
        tag: 'div',
        // @ts-expect-error
        attr: 123
      }
    })

    const expectedResult = {
      start: '<div>',
      end: '</div>'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return section and div tags with classes', async () => {
    const result = await Container({
      args: {
        tag: 'section',
        layoutClasses: 'x',
        classes: 'y',
        nest: true
      }
    })

    const expectedResult = {
      start: '<section class="y"><div class="x">',
      end: '</div></section>'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return section tags with classes', async () => {
    const result = await Container({
      args: {
        tag: 'section',
        layoutClasses: 'x',
        classes: 'y'
      }
    })

    const expectedResult = {
      start: '<section class="y x">',
      end: '</section>'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return div and ul tags with classes and attributes', async () => {
    const result = await Container({
      args: {
        tag: 'ul',
        layoutClasses: 'x',
        classes: 'y',
        attr: 'role="list"',
        style: 'background:black',
        nest: true
      }
    })

    const expectedResult = {
      start: '<div class="y"><ul class="x" role="list" style="background:black">',
      end: '</ul></div>'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return figure tags with classes and style attribute', async () => {
    const result = await Container({
      args: {
        tag: 'figure',
        layoutClasses: 'x',
        classes: 'y',
        style: 'background:black'
      }
    })

    const expectedResult = {
      start: '<figure class="y x" style="background:black">',
      end: '</figure>'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return filtered header tags and attributes', async () => {
    const filterName = 'containerProps'
    const filter: ContainerPropsFilter = async (props) => {
      props.args.tag = 'header'
      props.args.attr = 'data-attr="true"'
      return props
    }

    addFilter(filterName, filter)

    const result = await Container({
      args: {
        tag: 'dl',
        classes: 'x'
      }
    })

    removeFilter(filterName, filter)

    const expectedResult = {
      start: '<header class="x" data-attr="true">',
      end: '</header>'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return article tags', async () => {
    const result = await Container({
      args: {
        tag: 'article',
        nest: true
      }
    })

    const expectedResult = {
      start: '<article>',
      end: '</article>'
    }

    expect(result).toEqual(expectedResult)
  })
})
