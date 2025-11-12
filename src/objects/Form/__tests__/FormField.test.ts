/**
 * Objects - Form Field Test
 */

/* Imports */

import type { FormFieldType } from '../FormTypes.js'
import { it, expect, describe, afterEach, vi } from 'vitest'
import { testMinify } from '../../../../tests/utils.js'
import { addFilter, resetFilters } from '../../../filters/filters.js'
import { FormField } from '../FormField.js'

/* Tests */

describe('FormField()', () => {
  const icons = {
    radioIcon: '<span data-form-radio-icon></span>',
    checkboxIcon: '<span data-form-checkbox-icon></span>',
    selectIcon: '<span data-form-select-icon></span>',
    requiredIcon: '<span data-form-required-icon></span>'
  }

  afterEach(() => {
    resetFilters()
  })

  it('should return empty array if props are undefined', () => {
    // @ts-expect-error - test undefined props
    const result = FormField(undefined)
    const expectedResult: string[] = []

    expect(result).toEqual(expectedResult)
  })

  it('should return empty array if args are undefined', () => {
    const result = FormField({
      // @ts-expect-error - test undefined args
      args: undefined
    })

    const expectedResult: string[] = []

    expect(result).toEqual(expectedResult)
  })

  it('should throw error if filtered props are undefined', () => {
    const formFieldProps = vi.fn()

    // @ts-expect-error - test undefined filtered props
    addFilter('formFieldProps', (props) => {
      formFieldProps(props)

      return undefined
    })

    expect(() => FormField({
      args: {
        type: 'email',
        name: 'email',
        label: 'Email'
      }
    })).toThrowError()

    expect(formFieldProps).toHaveBeenCalledTimes(1)
    expect(formFieldProps).toHaveBeenCalledWith({
      args: {
        type: 'email',
        name: 'email',
        label: 'Email'
      }
    })
  })

  it('should return empty array if label is an empty string', () => {
    const result = FormField({
      args: {
        label: ''
      }
    })

    const expectedResult: string[] = []

    expect(result).toEqual(expectedResult)
  })

  it('should return empty array if name is null', () => {
    const result = FormField({
      args: {
        label: 'Text',
        // @ts-expect-error - test null name
        name: null
      }
    })

    const expectedResult: string[] = []
    
    expect(result).toEqual(expectedResult)
  })

  it('should return a text input', () => {
    const result = FormField({
      args: {
        label: 'Text',
        name: 'text'
      }
    })

    const expectedResult = [`
      <div data-form-field>
        <label for="mock-uuid">
          <span data-form-label>
            <span data-form-label-text>Text</span>
          </span>
        </label>
        <input type="text" name="text" id="mock-uuid" data-form-input>`,
      `</div>
    `]

    const resultStart = testMinify(result[0] as string)
    const resultEnd = testMinify(result[1] as string)
    const expectedResultStart = testMinify(expectedResult[0] as string)
    const expectedResultEnd = testMinify(expectedResult[1] as string)

    expect(resultStart).toEqual(expectedResultStart)
    expect(resultEnd).toEqual(expectedResultEnd)
  })

  it('should return a textarea with specified attributes', () => {
    const result = FormField({
      args: {
        type: 'textarea',
        label: 'Textarea',
        name: 'textarea',
        fieldClasses: 'form-field',
        fieldAttr: 'data-textarea',
        labelClasses: 'form-label',
        classes: 'form-textarea',
        ...icons
      }
    })

    const expectedResult = [`
      <div data-form-field class="form-field" data-textarea>
        <label for="mock-uuid" class="form-label">
          <span data-form-label>
            <span data-form-label-text>Textarea</span>
          </span>
        </label>
        <textarea
          name="textarea"
          id="mock-uuid"
          data-form-input
          class="form-textarea"
        ></textarea>`,
      `</div>
    `]

    const resultStart = testMinify(result[0] as string)
    const resultEnd = testMinify(result[1] as string)
    const expectedResultStart = testMinify(expectedResult[0] as string)
    const expectedResultEnd = testMinify(expectedResult[1] as string)

    expect(resultStart).toEqual(expectedResultStart)
    expect(resultEnd).toEqual(expectedResultEnd)
  })

  it('should return a required textarea with a hint and specified attributes', () => {
    const result = FormField({
      args: {
        type: 'textarea',
        label: 'Textarea',
        name: 'textarea',
        hint: 'Lorem ipsum dolor sit amet',
        value: 'Quisque sed dolorem',
        required: true,
        attr: [
          'minlength : 100',
          'rows : 5'
        ].join('\n'),
        emptyError: 'This field is required',
        invalidError: 'This field is invalid',
        fieldClasses: 'form-field',
        fieldAttr: 'data-textarea',
        labelClasses: 'form-label',
        classes: 'form-textarea',
        ...icons
      }
    })

    const expectedResult = [`
      <div data-form-field class="form-field" data-textarea>
        <label for="mock-uuid" class="form-label">
          <span data-form-label>
            <span data-form-label-text>Textarea</span>
            <span data-form-required-icon></span>
          </span>
          <small data-form-hint>Lorem ipsum dolor sit amet</small>
        </label>
        <textarea
          name="textarea"
          id="mock-uuid"
          data-form-input
          minlength="100"
          rows="5"
          class="form-textarea"
          data-form-empty="This field is required"
          data-form-invalid="This field is invalid"
          required
        >
          Quisque sed dolorem
        </textarea>`,
      `</div>
    `]

    const resultStart = testMinify(result[0] as string)
    const resultEnd = testMinify(result[1] as string)
    const expectedResultStart = testMinify(expectedResult[0] as string)
    const expectedResultEnd = testMinify(expectedResult[1] as string)

    expect(resultStart).toEqual(expectedResultStart)
    expect(resultEnd).toEqual(expectedResultEnd)
  })

  it('should return a required select with a hint and specified attributes', () => {
    const result = FormField({
      args: {
        type: 'select',
        label: 'Select',
        name: 'select',
        hint: 'Lorem ipsum dolor sit amet',
        value: 'Quisque sed dolorem',
        required: true,
        attr: 'data-test : test',
        emptyError: 'This field is required',
        fieldClasses: 'select-field',
        fieldAttr: 'data-select',
        labelClasses: 'select-label',
        classes: 'select',
        ...icons
      }
    })

    const expectedResult = [`
      <div data-form-field class="select-field" data-select>
        <label for="mock-uuid" class="select-label">
          <span data-form-label>
            <span data-form-label-text>Select</span>
            <span data-form-required-icon></span>
          </span>
          <small data-form-hint>Lorem ipsum dolor sit amet</small>
        </label>
        <div data-form-select>
          <select
            name="select"
            id="mock-uuid"
            data-form-input
            data-test="test"
            class="select"
            data-form-empty="This field is required"
            required
          >`,
          `</select>
          <span data-form-select-icon></span>
        </div>
      </div>
    `]

    const resultStart = testMinify(result[0] as string)
    const resultEnd = testMinify(result[1] as string)
    const expectedResultStart = testMinify(expectedResult[0] as string)
    const expectedResultEnd = testMinify(expectedResult[1] as string)

    expect(resultStart).toEqual(expectedResultStart)
    expect(resultEnd).toEqual(expectedResultEnd)
  })

  it('should return a hidden input', () => {
    const result = FormField({
      args: {
        type: 'hidden',
        name: 'test',
        value: 'Quisque',
        attr: 'data-test : test',
        fieldClasses: 'hidden-field',
        fieldAttr: 'data-hidden',
        labelClasses: 'hidden-label',
        classes: 'hidden',
        required: true,
        emptyError: 'This field is required',
        invalidError: 'This field is invalid',
        ...icons
      }
    })

    const expectedResult = [`
      <input
        type="hidden"
        name="test"
        id="mock-uuid"
        data-form-input
        data-test="test"
        value="Quisque"
        class="hidden"
      >
    `]

    const resultStart = testMinify(result[0] as string)
    const resultEnd = result[1]
    const expectedResultStart = testMinify(expectedResult[0] as string)
    const expectedResultEnd = expectedResult[1]

    expect(resultStart).toEqual(expectedResultStart)
    expect(resultEnd).toEqual(expectedResultEnd)
  })

  it('should return a required radio group with a hint and specified attributes', () => {
    const result = FormField({
      args: {
        type: 'radio-group',
        label: 'Radio Group',
        name: 'radio-group',
        hint: 'Lorem ipsum dolor sit amet',
        value: 'Quisque sed dolorem',
        required: true,
        attr: 'data-test : test',
        emptyError: 'This field is required',
        fieldsetClasses: 'radio-group-fieldset',
        fieldsetAttr: 'data-radio-group-fieldset',
        fieldClasses: 'radio-group-field',
        fieldAttr: 'data-radio-group',
        labelClasses: 'radio-group-label',
        classes: 'radio-group',
        ...icons
      }
    })

    const expectedResult = [`
      <div data-form-field class="radio-group-field" data-radio-group>
        <fieldset
          class="radio-group-fieldset"
          data-radio-group-fieldset
          data-form-empty="This field is required"
          data-form-required
        >
          <legend id="mock-uuid" class="radio-group-label">
            <span data-form-legend>
              <span data-form-legend-text>Radio Group</span>
              <span data-form-required-icon></span>
            </span>
            <small data-form-hint>Lorem ipsum dolor sit amet</small>
          </legend>
          <div data-form-group>`,
          `</div>
        </fieldset>
      </div>
    `]

    const resultStart = testMinify(result[0] as string)
    const resultEnd = testMinify(result[1] as string)
    const expectedResultStart = testMinify(expectedResult[0] as string)
    const expectedResultEnd = testMinify(expectedResult[1] as string)

    expect(resultStart).toEqual(expectedResultStart)
    expect(resultEnd).toEqual(expectedResultEnd)
  })

  it('should return a checkbox group with a hint and specified attributes', () => {
    const result = FormField({
      args: {
        type: 'checkbox-group',
        label: 'Checkbox Group',
        name: 'checkbox-group',
        hint: 'Lorem ipsum dolor sit amet',
        value: 'Quisque sed dolorem',
        attr: 'data-test : test',
        invalidError: 'This field is invalid',
        fieldsetClasses: 'checkbox-group-fieldset',
        fieldsetAttr: 'data-checkbox-group-fieldset',
        fieldClasses: 'checkbox-group-field',
        fieldAttr: 'data-checkbox-group',
        labelClasses: 'checkbox-group-label',
        classes: 'checkbox-group',
        ...icons
      }
    })

    const expectedResult = [`
      <div data-form-field class="checkbox-group-field" data-checkbox-group>
        <fieldset
          class="checkbox-group-fieldset"
          data-checkbox-group-fieldset
          data-form-invalid="This field is invalid"
        >
          <legend id="mock-uuid" class="checkbox-group-label">
            <span data-form-legend>
              <span data-form-legend-text>Checkbox Group</span>
            </span>
            <small data-form-hint>Lorem ipsum dolor sit amet</small>
          </legend>
          <div data-form-group>`,
          `</div>
        </fieldset>
      </div>
    `]

    const resultStart = testMinify(result[0] as string)
    const resultEnd = testMinify(result[1] as string)
    const expectedResultStart = testMinify(expectedResult[0] as string)
    const expectedResultEnd = testMinify(expectedResult[1] as string)

    expect(resultStart).toEqual(expectedResultStart)
    expect(resultEnd).toEqual(expectedResultEnd)
  })

  it('should return a required checkbox group with a hint and specified attributes', () => {
    const result = FormField({
      args: {
        type: 'checkbox-group',
        label: 'Checkbox Group',
        name: 'checkbox-group',
        hint: 'Lorem ipsum dolor sit amet',
        value: 'Quisque sed dolorem',
        required: true,
        attr: 'data-test : test',
        emptyError: 'This field is required',
        invalidError: 'This field is invalid',
        fieldsetClasses: 'checkbox-group-fieldset',
        fieldsetAttr: 'data-checkbox-group-fieldset',
        fieldClasses: 'checkbox-group-field',
        fieldAttr: 'data-checkbox-group',
        labelClasses: 'checkbox-group-label',
        classes: 'checkbox-group',
        ...icons
      }
    })

    const expectedResult = [`
      <div data-form-field class="checkbox-group-field" data-checkbox-group>
        <fieldset
          class="checkbox-group-fieldset"
          data-checkbox-group-fieldset
          data-form-empty="This field is required"
          data-form-invalid="This field is invalid"
          data-form-required
        >
          <legend id="mock-uuid" class="checkbox-group-label">
            <span data-form-legend>
              <span data-form-legend-text>Checkbox Group</span>
              <span data-form-required-icon></span>
            </span>
            <small data-form-hint>Lorem ipsum dolor sit amet</small>
          </legend>
          <div data-form-group>`,
          `</div>
        </fieldset>
      </div>
    `]

    const resultStart = testMinify(result[0] as string)
    const resultEnd = testMinify(result[1] as string)
    const expectedResultStart = testMinify(expectedResult[0] as string)
    const expectedResultEnd = testMinify(expectedResult[1] as string)

    expect(resultStart).toEqual(expectedResultStart)
    expect(resultEnd).toEqual(expectedResultEnd)
  })

  it('should return a required checkbox with a hint and specified attributes', () => {
    const result = FormField({
      args: {
        type: 'checkbox',
        label: 'Checkbox',
        name: 'checkbox',
        hint: 'Lorem ipsum dolor sit amet',
        value: 'Quisque sed dolorem',
        required: true,
        attr: 'data-test : test',
        emptyError: 'This field is required',
        fieldsetClasses: 'checkbox-fieldset',
        fieldsetAttr: 'data-checkbox-fieldset',
        fieldClasses: 'checkbox-field',
        fieldAttr: 'data-checkbox',
        labelClasses: 'checkbox-label',
        classes: 'checkbox',
        ...icons
      }
    })

    const expectedResult = [`
      <div data-form-field class="checkbox-field" data-checkbox>
        <input
          type="checkbox"
          name="checkbox"
          id="mock-uuid"
          data-form-input
          data-test="test"
          value="Quisque sed dolorem"
          class="checkbox"
          data-form-empty="This field is required"
          required
        >`,
        `<label for="mock-uuid" class="checkbox-label">
          <span data-form-option>
            <span data-form-checkbox-icon></span>
            <span data-form-label>
              <span data-form-label-text>Checkbox</span>
              <span data-form-required-icon></span>
            </span>
          </span>
          <small data-form-hint>Lorem ipsum dolor sit amet</small>
        </label>
      </div>
    `]

    const resultStart = testMinify(result[0] as string)
    const resultEnd = testMinify(result[1] as string)
    const expectedResultStart = testMinify(expectedResult[0] as string)
    const expectedResultEnd = testMinify(expectedResult[1] as string)

    expect(resultStart).toEqual(expectedResultStart)
    expect(resultEnd).toEqual(expectedResultEnd)
  })

  it('should return a radio input with a hint and specified attributes', () => {
    const result = FormField({
      args: {
        type: 'radio',
        label: 'Radio',
        name: 'radio',
        hint: 'Lorem ipsum dolor sit amet',
        value: 'Quisque sed dolorem',
        attr: [ // Test incomplete attributes
          'data-test : ',
          'data-lorem : '
        ].join('\n'),
        fieldsetClasses: 'radio-fieldset',
        fieldsetAttr: 'data-radio-fieldset',
        fieldClasses: 'radio-field',
        fieldAttr: 'data-radio',
        fieldTag: 'frm-field',
        labelClasses: 'radio-label',
        classes: 'radio',
        ...icons
      }
    })

    const expectedResult = [`
      <frm-field data-form-field class="radio-field" data-radio>
        <input
          type="radio"
          name="radio"
          id="mock-uuid"
          data-form-input
          value="Quisque sed dolorem"
          class="radio"
        >`,
        `<label for="mock-uuid" class="radio-label">
          <span data-form-option>
            <span data-form-radio-icon></span>
            <span data-form-label>
              <span data-form-label-text>Radio</span>
            </span>
          </span>
          <small data-form-hint>Lorem ipsum dolor sit amet</small>
        </label>
      </frm-field>
    `]

    const resultStart = testMinify(result[0] as string)
    const resultEnd = testMinify(result[1] as string)
    const expectedResultStart = testMinify(expectedResult[0] as string)
    const expectedResultEnd = testMinify(expectedResult[1] as string)

    expect(resultStart).toEqual(expectedResultStart)
    expect(resultEnd).toEqual(expectedResultEnd)
  })

  it('should return a required fieldset with specified attributes', () => {
    const result = FormField({
      args: {
        type: 'fieldset',
        label: 'Fieldset',
        name: 'fieldset',
        hint: 'Lorem ipsum dolor sit amet',
        value: 'Quisque sed dolorem',
        required: true,
        emptyError: 'This field is required',
        invalidError: 'This field is invalid',
        attr: 'data-test : test',
        fieldsetClasses: 'fieldset',
        fieldsetAttr: 'data-fieldset',
        fieldClasses: 'field-fieldset',
        fieldAttr: 'data-field="fieldset"',
        labelClasses: 'fieldset-label',
        classes: 'label',
        ...icons
      }
    })

    const expectedResult = [`
      <div data-form-field class="field-fieldset" data-field="fieldset">
        <fieldset
          class="fieldset"
          data-fieldset
          data-form-empty="This field is required"
          data-form-invalid="This field is invalid"
          data-form-required
        >
          <legend id="mock-uuid" class="fieldset-label">
            <span data-form-legend>
              <span data-form-legend-text>Fieldset</span>
              <span data-form-required-icon></span>
            </span>
            <small data-form-hint>Lorem ipsum dolor sit amet</small>
          </legend>
          <div data-form-group>`,
          `</div>
        </fieldset>
      </div>
    `]

    const resultStart = testMinify(result[0] as string)
    const resultEnd = testMinify(result[1] as string)
    const expectedResultStart = testMinify(expectedResult[0] as string)
    const expectedResultEnd = testMinify(expectedResult[1] as string)

    expect(resultStart).toEqual(expectedResultStart)
    expect(resultEnd).toEqual(expectedResultEnd)
  })

  it('should return a filtered email input', () => {
    const formFieldProps = vi.fn()

    addFilter('formFieldProps', (props) => {
      formFieldProps(props)

      const newProps = {
        ...props,
        args: {
          ...props.args,
          type: 'email' as FormFieldType,
          name: 'email',
          label: 'Email',
          invalidError: 'Enter a valid email address',
          fieldTag: 'frm-field'
        }
      }

      return newProps
    })

    const result = FormField({
      args: {
        type: 'text',
        name: 'text',
        label: 'Text',
        required: true,
        emptyError: 'This field is required'       
      }
    })

    const expectedResult = [`
      <frm-field data-form-field>
        <label for="mock-uuid">
          <span data-form-label>
            <span data-form-label-text>Email</span>
          </span>
        </label>
        <input
          type="email"
          name="email"
          id="mock-uuid"
          data-form-input
          data-form-empty="This field is required"
          data-form-invalid="Enter a valid email address"
          required
        >`,
      `</frm-field>
    `]

    const resultStart = testMinify(result[0] as string)
    const resultEnd = testMinify(result[1] as string)
    const expectedResultStart = testMinify(expectedResult[0] as string)
    const expectedResultEnd = testMinify(expectedResult[1] as string)

    expect(resultStart).toEqual(expectedResultStart)
    expect(resultEnd).toEqual(expectedResultEnd)
    expect(formFieldProps).toHaveBeenCalledTimes(1)
    expect(formFieldProps).toHaveBeenCalledWith({
      args: {
        type: 'text',
        name: 'text',
        label: 'Text',
        required: true,
        emptyError: 'This field is required'
      }
    })
  })
})
