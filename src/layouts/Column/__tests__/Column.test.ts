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
  it('should return empty array if props are undefined', () => {
    // @ts-expect-error - test undefined props
    const result = Column(undefined)
    const expectedResult: string[] = []

    expect(result).toEqual(expectedResult)
  })

  it('should return empty array if filtered props are undefined', () => {
    const filterName = 'columnProps'
    // @ts-expect-error - test undefined filtered props
    const filter: ColumnPropsFilter = () => {
      return undefined
    }

    addFilter(filterName, filter)

    const result = Column({
      args: {
        tag: 'div'
      }
    })

    removeFilter(filterName, filter)

    const expectedResult: string[] = []

    expect(result).toEqual(expectedResult)
  })

  it('should return empty array if tag is an empty string', () => {
    const result = Column({
      args: {
        tag: ''
      }
    })

    const expectedResult: string[] = []

    expect(result).toEqual(expectedResult)
  })

  it('should return div tags if props is an empty object', () => {
    // @ts-expect-error - test empty props
    const result = Column({})
    const expectedResult = ['<div>', '</div>']

    expect(result).toEqual(expectedResult)
  })

  it('should return div tags if args are undefined', () => {
    // @ts-expect-error - test undefined args
    const result = Column({ args: undefined })
    const expectedResult = ['<div>', '</div>']

    expect(result).toEqual(expectedResult)
  })

  it('should return div tags and ignore invalid attr', () => {
    const result = Column({
      args: {
        tag: 'div',
        // @ts-expect-error - test invalid attr
        attr: false
      }
    })

    const expectedResult = ['<div>', '</div>']

    expect(result).toEqual(expectedResult)
  })

  it('should return li tags with classes', () => {
    const result = Column({
      args: {
        tag: 'li',
        classes: 'x y z'
      }
    })

    const expectedResult = [
      '<li class="x y z">',
      '</li>'
    ]

    expect(result).toEqual(expectedResult)
  })

  it('should return figure tags with attributes', () => {
    const result = Column({
      args: {
        tag: 'figure',
        attr: 'data-attr="true"',
        style: 'background:black',
        classes: 'x'
      }
    })

    const expectedResult = [
      '<figure class="x" data-attr="true" style="background:black">',
      '</figure>'
    ]

    expect(result).toEqual(expectedResult)
  })

  it('should return filtered footer tags and attributes', () => {
    const filterName = 'columnProps'
    const filter: ColumnPropsFilter = (props) => {
      props.args.tag = 'footer'
      props.args.attr = 'data-attr="true"'
      props.args.style = 'background:black'

      return props
    }

    addFilter(filterName, filter)

    const result = Column({
      args: {
        tag: 'address',
        classes: 'x'
      }
    })

    removeFilter(filterName, filter)

    const expectedResult = [
      '<footer class="x" data-attr="true" style="background:black">',
      '</footer>'
    ]

    expect(result).toEqual(expectedResult)
  })
})
