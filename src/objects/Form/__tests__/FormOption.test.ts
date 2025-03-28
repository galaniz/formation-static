/**
 * Objects - Form Option Test
 */

/* Imports */

import { it, expect, describe, afterEach, vi } from 'vitest'
import { testMinify } from '../../../../tests/utils.js'
import { addFilter, resetFilters } from '../../../utils/filter/filter.js'
import { FormOption } from '../FormOption.js'

/* Tests */

describe('FormOption()', () => {
  const icons = {
    radioIcon: '<span data-form-radio-icon></span>',
    checkboxIcon: '<span data-form-checkbox-icon></span>'
  }

  afterEach(() => {
    resetFilters()
  })

  it('should return empty string if props are undefined', () => {
    // @ts-expect-error - test undefined props
    const result = FormOption(undefined)
    const expectedResult = ''

    expect(result).toEqual(expectedResult)
  })

  it('should return empty string if args are undefined', () => {
    const result = FormOption({
      // @ts-expect-error - test undefined args
      args: undefined
    })

    const expectedResult = ''

    expect(result).toEqual(expectedResult)
  })

  it('should return empty string if parents are undefined', () => {
    const result = FormOption({
      args: {
        label: 'Option',
        value: 'option'
      },
      parents: undefined
    })

    const expectedResult = ''

    expect(result).toEqual(expectedResult)
  })

  it('should return empty string if parent is null', () => {
    const result = FormOption({
      args: {
        label: 'Option',
        value: 'option'
      },
      parents: [
        // @ts-expect-error - test null parent
        null
      ]
    })

    const expectedResult = ''

    expect(result).toEqual(expectedResult)
  })

  it('should return empty string if parent is not form field render type', () => {
    const result = FormOption({
      args: {
        label: 'Option',
        value: 'option'
      },
      parents: [
        {
          renderType: 'field',
          args: {
            type: 'select',
            name: 'select',
            label: 'Select'
          }
        }
      ]
    })

    const expectedResult = ''

    expect(result).toEqual(expectedResult)
  })

  it('should return empty string if parent is text form field', () => {
    const result = FormOption({
      args: {
        label: 'Option',
        value: 'option'
      },
      parents: [
        {
          renderType: 'formField',
          args: {
            type: 'text',
            name: 'text',
            label: 'Text'
          }
        }
      ]
    })

    const expectedResult = ''

    expect(result).toEqual(expectedResult)
  })

  it('should return empty string if empty input name', () => {
    const result = FormOption({
      args: {
        label: 'Option',
        value: 'option',
        name: ''
      },
      parents: [
        {
          renderType: 'formField',
          args: {
            type: 'radio-group',
            label: 'Radio Group'
          }
        }
      ]
    })

    const expectedResult = ''

    expect(result).toEqual(expectedResult)
  })

  it('should return empty string if empty input and field name', () => {
    const result = FormOption({
      args: {
        label: 'Option',
        value: 'option'
      },
      parents: [
        {
          renderType: 'formField',
          args: {
            type: 'radio-group',
            name: '',
            label: 'Radio Group'
          }
        }
      ]
    })

    const expectedResult = ''

    expect(result).toEqual(expectedResult)
  })

  it('should return empty string if filtered props are undefined', () => {
    const formOptionProps = vi.fn()

    // @ts-expect-error - test undefined filtered props
    addFilter('formOptionProps', (props) => {
      formOptionProps(props)

      return undefined
    })

    const result = FormOption({
      args: {
        label: 'Option',
        value: 'option'
      },
      parents: [
        {
          renderType: 'formField',
          args: {
            type: 'select',
            name: 'select',
            label: 'Select'
          }
        }
      ]
    })

    const expectedResult = ''

    expect(result).toEqual(expectedResult)
    expect(formOptionProps).toHaveBeenCalledTimes(1)
    expect(formOptionProps).toHaveBeenCalledWith({
      args: {
        label: 'Option',
        value: 'option'
      },
      parents: [
        {
          renderType: 'formField',
          args: {
            type: 'select',
            name: 'select',
            label: 'Select'
          }
        }
      ]
    })
  })

  it('should return select option', () => {
    const result = FormOption({
      args: {
        label: 'Option',
        value: 'option'
      },
      parents: [
        {
          renderType: 'formField',
          args: {
            type: 'select',
            name: 'select',
            label: 'Select'
          }
        }
      ]
    })

    const expectedResult = '<option value="option">Option</option>'

    expect(result).toEqual(expectedResult)
  })

  it('should return select option with empty value', () => {
    const result = FormOption({
      args: {
        label: 'Option'
      },
      parents: [
        {
          renderType: 'formField',
          args: {
            type: 'select',
            name: 'select',
            label: 'Select'
          }
        }
      ]
    })

    const expectedResult = '<option value="">Option</option>'

    expect(result).toEqual(expectedResult)
  })

  it('should return selected select option', () => {
    const result = FormOption({
      args: {
        label: 'Option',
        value: 'option',
        selected: true
      },
      parents: [
        {
          renderType: 'formField',
          args: {
            type: 'select',
            name: 'select',
            label: 'Select'
          }
        }
      ]
    })

    const expectedResult = '<option value="option" selected>Option</option>'

    expect(result).toEqual(expectedResult)
  })

  it('should return radio input with field name', () => {
    const result = FormOption({
      args: {
        label: 'Option',
        value: 'option',
        name: '',
        ...icons
      },
      parents: [
        {
          renderType: 'formField',
          args: {
            type: 'radio-group',
            name: 'test',
            label: 'Test'
          }
        }
      ]
    })

    const expectedResult = `
      <div>
        <input
          type="radio"
          value="option"
          name="test"
          id="mock-uuid"
          data-form-input
        >
        <label for="mock-uuid">
          <span data-form-option>
            <span data-form-radio-icon></span>
            <span data-form-label>
              <span data-form-label-text>Option</span>
            </span>
          </span>
        </label>
      </div>
    `

    expect(testMinify(result)).toEqual(testMinify(expectedResult))
  })

  it('should return checkbox input with field name', () => {
    const result = FormOption({
      args: {
        label: 'Option',
        value: 'option',
        ...icons
      },
      parents: [
        {
          renderType: 'formField',
          args: {
            type: 'checkbox-group',
            name: 'test',
            label: 'Test'
          }
        }
      ]
    })

    const expectedResult = `
      <div>
        <input
          type="checkbox"
          value="option"
          name="test"
          id="mock-uuid"
          data-form-input
        >
        <label for="mock-uuid">
          <span data-form-option>
            <span data-form-checkbox-icon></span>
            <span data-form-label>
              <span data-form-label-text>Option</span>
            </span>
          </span>
        </label>
      </div>
    `

    expect(testMinify(result)).toEqual(testMinify(expectedResult))
  })

  it('should return checked checkbox input with specified classes', () => {
    const result = FormOption({
      args: {
        label: 'Option',
        value: 'option',
        name: 'option',
        selected: true,
        hint: 'Lorem ipsum',
        optionClasses: 'option',
        labelClasses: 'label',
        classes: 'input',
        ...icons
      },
      parents: [
        {
          renderType: 'formField',
          args: {
            type: 'checkbox-group',
            name: 'test',
            label: 'Test'
          }
        }
      ]
    })

    const expectedResult = `
      <div class="option">
        <input
          type="checkbox"
          value="option"
          name="option"
          id="mock-uuid"
          class="input"
          data-form-input
          checked
        >
        <label for="mock-uuid" class="label">
          <span data-form-option>
            <span data-form-checkbox-icon></span>
            <span data-form-label>
              <span data-form-label-text>Option</span>
              <small data-form-hint>Lorem ipsum</small>
            </span>
          </span>
        </label>
      </div>
    `

    expect(testMinify(result)).toEqual(testMinify(expectedResult))
  })

  it('should return a filtered radio input', () => {
    const formOptionProps = vi.fn()

    addFilter('formOptionProps', (props) => {
      formOptionProps(props)

      const newProps = {
        ...props,
        args: {
          ...props.args,
          label: 'New Label'
        }
      }

      return newProps
    })

    const result = FormOption({
      args: {
        label: 'Option',
        value: 'option'
      },
      parents: [
        {
          renderType: 'formField',
          args: {
            type: 'radio-group',
            name: 'test',
            label: 'Test'
          }
        }
      ]
    })

    const expectedResult = `
      <div>
        <input
          type="radio"
          value="option"
          name="test"
          id="mock-uuid"
          data-form-input
        >
        <label for="mock-uuid">
          <span data-form-option>
            <span data-form-label>
              <span data-form-label-text>New Label</span>
            </span>
          </span>
        </label>
      </div>
    `

    expect(testMinify(result)).toEqual(testMinify(expectedResult))
    expect(formOptionProps).toHaveBeenCalledTimes(1)
    expect(formOptionProps).toHaveBeenCalledWith({
      args: {
        label: 'Option',
        value: 'option'
      },
      parents: [
        {
          renderType: 'formField',
          args: {
            type: 'radio-group',
            name: 'test',
            label: 'Test'
          }
        }
      ]
    })
  })
})
