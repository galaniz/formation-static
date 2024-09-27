/**
 * Layouts - Column Test
 */

/* Imports */

import type { ColumnPropsFilter } from '../ColumnTypes.js'
import { it, expect, describe } from 'vitest'
import { addFilter, removeFilter } from '../../../utils/filter/filter.js'
import { Column } from '../Column.js'

/* Tests */

describe('Column()', () => {
  it('should return empty start and end if props are undefined', async () => {
    // @ts-expect-error
    const result = await Column(undefined)
    const expectedResult = {
      start: '',
      end: ''
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return empty start and end if filtered props are undefined', async () => {
    const filterName = 'columnProps'
    // @ts-expect-error
    const filter: ColumnPropsFilter = async () => {
      return undefined
    }

    addFilter(filterName, filter)

    const result = await Column({
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
    const result = await Column({
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
    const result = await Column({})
    const expectedResult = {
      start: '<div>',
      end: '</div>'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return div tags if args are undefined', async () => {
    // @ts-expect-error
    const result = await Column({ args: undefined })
    const expectedResult = {
      start: '<div>',
      end: '</div>'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return div tags and ignore invalid attr', async () => {
    const result = await Column({
      args: {
        tag: 'div',
        // @ts-expect-error
        attr: false
      }
    })

    const expectedResult = {
      start: '<div>',
      end: '</div>'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return li tags with classes', async () => {
    const result = await Column({
      args: {
        tag: 'li',
        classes: 'x y z'
      }
    })

    const expectedResult = {
      start: '<li class="x y z">',
      end: '</li>'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return figure tags with attributes', async () => {
    const result = await Column({
      args: {
        tag: 'figure',
        attr: 'data-attr="true"',
        style: 'background:black',
        classes: 'x'
      }
    })

    const expectedResult = {
      start: '<figure class="x" data-attr="true" style="background:black">',
      end: '</figure>'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return filtered footer tags and attributes', async () => {
    const filterName = 'columnProps'
    const filter: ColumnPropsFilter = async (props) => {
      props.args.tag = 'footer'
      props.args.attr = 'data-attr="true"'
      props.args.style = 'background:black'

      return props
    }

    addFilter(filterName, filter)

    const result = await Column({
      args: {
        tag: 'address',
        classes: 'x'
      }
    })

    removeFilter(filterName, filter)

    const expectedResult = {
      start: '<footer class="x" data-attr="true" style="background:black">',
      end: '</footer>'
    }

    expect(result).toEqual(expectedResult)
  })
})
