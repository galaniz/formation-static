/**
 * Objects - Form Test
 */

/* Imports */

import { it, expect, describe, afterEach, vi } from 'vitest'
import { testMinify } from '../../../../tests/utils.js'
import { addFilter, resetFilters } from '../../../utils/filter/filter.js'
import { Form } from '../Form.js'

/* Tests */

describe('Form()', () => {
  afterEach(() => {
    resetFilters()
  })

  it('should return empty array if props are undefined', () => {
    // @ts-expect-error - test undefined props
    const result = Form(undefined)
    const expectedResult: string[] = []

    expect(result).toEqual(expectedResult)
  })

  it('should return empty array if args are undefined', () => {
    const result = Form({
      // @ts-expect-error - test undefined args
      args: undefined
    })

    const expectedResult: string[] = []

    expect(result).toEqual(expectedResult)
  })

  it('should return empty array if filtered props are undefined', () => {
    const formProps = vi.fn()

    // @ts-expect-error - test undefined filtered props
    addFilter('formProps', (props) => {
      formProps(props)

      return undefined
    })

    const result = Form({
      args: {
        formTag: 'frm-form'
      }
    })

    const expectedResult: string[] = []

    expect(result).toEqual(expectedResult)
    expect(formProps).toHaveBeenCalledTimes(1)
    expect(formProps).toHaveBeenCalledWith({
      args: {
        formTag: 'frm-form'
      }
    })
  })

  it('should return empty array if form tag is an empty string', () => {
    const result = Form({
      args: {
        formTag: ''
      }
    })

    const expectedResult: string[] = []

    expect(result).toEqual(expectedResult)
  })

  it('should return empty array if id is null', () => {
    const result = Form({
      args: {
        // @ts-expect-error - test null id
        id: null
      }
    })

    const expectedResult: string[] = []

    expect(result).toEqual(expectedResult)
  })

  it('should return empty array if submit label is null', () => {
    const result = Form({
      args: {
        // @ts-expect-error - test null submit label
        submitLabel: null
      }
    })

    const expectedResult: string[] = []

    expect(result).toEqual(expectedResult)
  })

  it('should return form with id and submit button', () => {
    const result = Form({
      args: {
        id: 'frm-id'
      }
    })

    const expectedResult = [`
      <form id="frm-id">
        <div>`,
          `<div>
            <button type="submit">
              Submit
            </button>
          </div>
        </div>
      </form>
    `]

    const resultStart = testMinify(result[0] as string)
    const resultEnd = testMinify(result[1] as string)
    const expectedResultStart = testMinify(expectedResult[0] as string)
    const expectedResultEnd = testMinify(expectedResult[1] as string)

    expect(resultStart).toEqual(expectedResultStart)
    expect(resultEnd).toEqual(expectedResultEnd)
  })

  it('should return form with honeypot, id and submit button', () => {
    const result = Form({
      args: {
        id: 'frm-id',
        honeypot: true
      }
    })

    const expectedResult = [`
      <form id="frm-id">
        <div>`,
          `<div>
            <label for="mock-uuid">Website</label>
            <input type="url" name="frm_asi" id="mock-uuid" autocomplete="off">
          </div>
          <div>
            <button type="submit">
              Submit
            </button>
          </div>
        </div>
      </form>
    `]

    const resultStart = testMinify(result[0] as string)
    const resultEnd = testMinify(result[1] as string)
    const expectedResultStart = testMinify(expectedResult[0] as string)
    const expectedResultEnd = testMinify(expectedResult[1] as string)

    expect(resultStart).toEqual(expectedResultStart)
    expect(resultEnd).toEqual(expectedResultEnd)
  })

  it('should return form with specified classes and attributes', () => {
    const result = Form({
      args: {
        id: 'frm-id',
        formTag: 'frm-form',
        formClasses: 'form',
        formAttr: 'type="send"',
        fieldsClasses: 'fields',
        fieldsAttr: 'novalidate',
        submitLabel: 'Enviar',
        submitFieldClasses: 'field-submit',
        submitFieldAttr: 'data-field="submit"',
        submitClasses: 'submit',
        submitAttr: 'data-input="submit"',
        honeypot: true,
        honeypotFieldClasses: 'field-honeypot',
        honeypotFieldAttr: 'data-field="honeypot"',
        honeypotLabelClasses: 'label-honeypot',
        honeypotClasses: 'honeypot',
        honeypotLabel: 'Sitio',
        honeypotAttr: 'data-input="honeypot"'
      }
    })

    const expectedResult = [`
      <frm-form id="frm-id" class="form" type="send">
        <form class="fields" novalidate>`,
          `<div class="field-honeypot" data-field="honeypot">
            <label for="mock-uuid" class="label-honeypot">Sitio</label>
            <input type="url" name="frm_asi" id="mock-uuid" autocomplete="off" class="honeypot" data-input="honeypot">
          </div>
          <div class="field-submit" data-field="submit">
            <button type="submit" class="submit" data-input="submit">
              Enviar
            </button>
          </div>
        </form>
      </frm-form>
    `]

    const resultStart = testMinify(result[0] as string)
    const resultEnd = testMinify(result[1] as string)
    const expectedResultStart = testMinify(expectedResult[0] as string)
    const expectedResultEnd = testMinify(expectedResult[1] as string)

    expect(resultStart).toEqual(expectedResultStart)
    expect(resultEnd).toEqual(expectedResultEnd)
  })

  it('should return filtered form with specified classes', () => {
    const formProps = vi.fn()

    addFilter('formProps', (props) => {
      formProps(props)

      const newProps = {
        ...props,
        args: {
          ...props.args,
          formTag: 'form',
          formClasses: 'form-new',
          submitFieldClasses: 'field-new',
          honeypotFieldClasses: 'field-new'
        }
      }

      return newProps
    })

    const result = Form({
      args: {
        id: 'frm-id',
        formTag: 'frm-form',
        formClasses: 'form',
        submitFieldClasses: 'field',
        honeypot: true,
        honeypotFieldClasses: 'field'
      }
    })

    const expectedResult = [`
      <form id="frm-id" class="form-new">
        <div>`,
          `<div class="field-new">
            <label for="mock-uuid">Website</label>
            <input type="url" name="frm_asi" id="mock-uuid" autocomplete="off">
          </div>
          <div class="field-new">
            <button type="submit">
              Submit
            </button>
          </div>
        </div>
      </form>
    `]

    const resultStart = testMinify(result[0] as string)
    const resultEnd = testMinify(result[1] as string)
    const expectedResultStart = testMinify(expectedResult[0] as string)
    const expectedResultEnd = testMinify(expectedResult[1] as string)

    expect(resultStart).toEqual(expectedResultStart)
    expect(resultEnd).toEqual(expectedResultEnd)
    expect(formProps).toHaveBeenCalledTimes(1)
    expect(formProps).toHaveBeenCalledWith({
      args: {
        id: 'frm-id',
        formTag: 'frm-form',
        formClasses: 'form',
        submitFieldClasses: 'field',
        honeypot: true,
        honeypotFieldClasses: 'field'
      }
    })
  })
})
