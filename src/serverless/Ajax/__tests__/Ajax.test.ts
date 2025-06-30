/**
 * Serverless - Ajax Test
 */

/* Imports */

import { it, expect, describe, vi, afterEach, beforeAll } from 'vitest'
import { testRequest } from '../../../../tests/utils.js'
import { addFilter, resetFilters } from '../../../utils/filter/filter.js'
import { setServerless } from '../../serverless.js'
import { Ajax } from '../Ajax.js'

/* Tests */

describe('Ajax()', () => {
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    resetFilters()
  })

  it('should return error if method is not post', async () => {
    const result = await Ajax(testRequest('http://test.com/', 'GET', {}), {})
    const status = result.status
    const message = await result.json()
    const expectedStatus = 405
    const expectedMessage = {
      error: 'Method not allowed'
    }

    expect(status).toBe(expectedStatus)
    expect(message).toEqual(expectedMessage)
  })

  it('should return error if data is not an object', async () => {
    // @ts-expect-error - test null data
    const result = await Ajax(testRequest('http://test.com/', 'POST', null), {})

    const status = result.status
    const message = await result.json()
    const expectedStatus = 500
    const expectedMessage = {
      error: 'Data not an object'
    }

    expect(status).toBe(expectedStatus)
    expect(message).toEqual(expectedMessage)
  })

  it('should return error if action does not exist', async () => {
    const result = await Ajax(testRequest('http://test.com/', 'POST', {}), {})
    const status = result.status
    const message = await result.json()
    const expectedStatus = 500
    const expectedMessage = {
      error: 'No action'
    }

    expect(status).toBe(expectedStatus)
    expect(message).toEqual(expectedMessage)
  })

  it('should return error if action has no result', async () => {
    const result = await Ajax(testRequest('http://test.com/', 'POST', {
      action: 'test'
    }), {})

    const status = result.status
    const message = await result.json()
    const expectedStatus = 500
    const expectedMessage = {
      error: 'No result'
    }

    expect(status).toBe(expectedStatus)
    expect(message).toEqual(expectedMessage)
  })

  it('should return success if honeypot exists', async () => {
    const result = await Ajax(testRequest('http://test.com/', 'POST', {
      inputs: {
        frm_hp: {
          value: 'test'
        }
      }
    }), {}, 'frm_hp')

    const status = result.status
    const message = await result.json()
    const expectedStatus = 200
    const expectedMessage = {
      success: 'Form successully sent'
    }

    expect(status).toBe(expectedStatus)
    expect(message).toEqual(expectedMessage)
  })

  it('should return success message from test action', async () => {
    setServerless({
      test: async () => {
        return await Promise.resolve({
          success: {
            message: 'Success',
            headers: {
              'Content-Type': 'text/plain'
            }
          }
        })
      }
    })

    const result = await Ajax(testRequest('http://test.com/', 'POST', {
      action: 'test',
      inputs: {
        frm_hp: {
          value: ''
        },
        test: {
          value: 'ipsum'
        }
      }
    }), {}, 'frm_hp')

    const status = result.status
    const contentType = result.headers.get('Content-Type')
    const message = await result.json()
    const expectedStatus = 200
    const expectedContentType = 'text/plain'
    const expectedMessage = {
      success: 'Success'
    }

    expect(status).toBe(expectedStatus)
    expect(message).toEqual(expectedMessage)
    expect(contentType).toEqual(expectedContentType)
  })

  it('should filter result', async () => {
    const ajaxResult = vi.fn()

    addFilter('ajaxResult', async (result, args) => {
      ajaxResult(result, args)

      return await Promise.resolve({
        error: {
          message: 'Not found',
          response: new Response(null, { status: 404 })
        }
      })
    })

    const ajaxRequest = testRequest('http://test.com/', 'POST', {
      action: 'test',
      inputs: {
        frm_hp: {
          value: ''
        },
        test: {
          value: 'ipsum'
        }
      }
    })

    setServerless({
      test: async () => {
        return await Promise.resolve({
          success: {
            message: 'Success'
          }
        })
      }
    })
    
    const result = await Ajax(ajaxRequest, {}, 'frm_hp')
    const status = result.status
    const message = await result.json()
    const expectedStatus = 404
    const expectedMessage = {
      error: 'Not found'
    }

    expect(status).toBe(expectedStatus)
    expect(message).toEqual(expectedMessage)
    expect(ajaxResult).toHaveBeenCalledWith(
      {
        success: {
          message: 'Success'
        }
      },
      {
        data: {
          action: 'test',
          inputs: {
            test: {
              value: 'ipsum'
            }
          }
        },
        request: ajaxRequest,
        env: {}
      }
    )
  })

  it('should return error message from test action', async () => {
    setServerless({
      test: async () => {
        return await Promise.resolve({
          error: {
            message: 'Error',
            response: new Response(null, { status: 400 })
          }
        })
      }
    })

    const result = await Ajax(testRequest('http://test.com/', 'POST', {
      action: 'test',
      inputs: {
        frm_hp: {
          value: ''
        },
        test: {
          value: 'ipsum'
        }
      }
    }), {}, 'frm_hp')

    const status = result.status
    const message = await result.json()
    const expectedStatus = 400
    const expectedMessage = {
      error: 'Error'
    }

    expect(status).toBe(expectedStatus)
    expect(message).toEqual(expectedMessage)
  })

  it('should return unknown error if error is not an object', async () => {
    setServerless({
      test: async () => { // eslint-disable-line @typescript-eslint/require-await
        throw 'test error' // eslint-disable-line @typescript-eslint/only-throw-error
      }
    })

    const result = await Ajax(testRequest('http://test.com/', 'POST', {
      action: 'test',
      inputs: {
        frm_hp: {
          value: ''
        },
        test: {
          value: 'ipsum'
        }
      }
    }), {}, 'frm_hp')

    const status = result.status
    const message = await result.json()
    const expectedStatus = 500
    const expectedMessage = {
      error: 'Unknown error'
    }

    expect(status).toBe(expectedStatus)
    expect(message).toEqual(expectedMessage)
  })
})
