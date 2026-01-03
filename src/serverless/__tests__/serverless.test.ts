/**
 * Serverless - Test
 */

/* Imports */

import type { ServerlessActionReturn } from '../serverlessTypes.js'
import { it, expect, describe, vi, afterEach, beforeEach, beforeAll } from 'vitest'
import {
  testRequest,
  testResetRenderFunctions,
  testResetStore,
  testResetServerless,
  testWordPressConfig
} from '../../../tests/utils.js'
import { getAllWordPressData } from '../../wordpress/wordpressData.js'
import { mockWordPressFetch } from '../../wordpress/__tests__/wordpressDataMock.js'
import { setRenderFunctions } from '../../render/render.js'
import { isStringStrict } from '../../utils/string/string.js'
import { addFilter, resetFilters } from '../../filters/filters.js'
import { config, setConfig } from '../../config/config.js'
import { setStoreItem } from '../../store/store.js'
import {
  serverlessActions,
  serverlessPreview,
  serverlessReload,
  serverlessRender,
  setServerless,
  doServerlessAction
} from '../serverless.js'

/* Test setServerless */

describe('setServerless()', () => {
  afterEach(() => {
    testResetServerless()
  })

  it('should not set actions if empty args', () => {
    setServerless()
    expect(serverlessActions).toEqual({})
  })

  it('should set actions', async () => {
    setServerless({
      test: () => new Promise(resolve => {
        resolve({})
      })
    })

    const resultAction = await serverlessActions.test?.(
      // @ts-expect-error - test empty data
      {}, {}, {}
    )

    expect(resultAction).toEqual({})
  })
})

/* Test serverlessPreview */

describe('serverlessPreview()', () => {
  it('should return undefined if no params', () => {
    const result = serverlessPreview(testRequest())
    const expectedResult = undefined

    expect(result).toEqual(expectedResult)
  })

  it('should return undefined if no ID', () => {
    const result = serverlessPreview(testRequest('http://test.com/?content_type=post'))
    const expectedResult = undefined

    expect(result).toEqual(expectedResult)
  })

  it('should return undefined if no content type', () => {
    const result = serverlessPreview(testRequest('http://test.com/?preview=123'))
    const expectedResult = undefined

    expect(result).toEqual(expectedResult)
  })

  it('should return ID and content type', () => {
    const result = serverlessPreview(testRequest('http://test.com/?preview=123&content_type=post'))
    const expectedResult = { id: '123', contentType: 'post' }

    expect(result).toEqual(expectedResult)
  })

  it('should return id, content type and locale', () => {
    const result = serverlessPreview(testRequest('http://test.com/?preview=123&content_type=post&locale=es'))
    const expectedResult = { id: '123', contentType: 'post', locale: 'es' }

    expect(result).toEqual(expectedResult)
  })
})

/* Test serverlessReload */

describe('serverlessReload()', () => {
  it('should return undefined if no params', () => {
    const result = serverlessReload(testRequest())
    const expectedResult = undefined

    expect(result).toEqual(expectedResult)
  })

  it('should return page and path', () => {
    const result = serverlessReload(testRequest('http://test.com/blog/?page=2'))
    const expectedResult = {
      path: '/blog/',
      query: {
        page: '2'
      }
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return filters and path', () => {
    const result = serverlessReload(testRequest('http://test.com/blog/?filters=category:1'))
    const expectedResult = {
      path: '/blog/',
      query: {
        filters: 'category:1'
      }
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return page, filters and path', () => {
    const result = serverlessReload(testRequest('http://test.com/blog/?page=2&filters=category:1'))
    const expectedResult = {
      path: '/blog/',
      query: {
        page: '2',
        filters: 'category:1'
      }
    }

    expect(result).toEqual(expectedResult)
  })
})

/* Test serverlessRender */

describe('serverlessRender()', () => {
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  beforeEach(() => {
    vi.stubGlobal('fetch', mockWordPressFetch)
    setConfig({ cms: testWordPressConfig() })
  })

  afterEach(() => {
    testResetRenderFunctions()
    testResetStore()
    config.cms = {
      name: '',
      space: '',
      prodUser: '',
      prodCredential: '',
      prodHost: '',
      devUser: '',
      devCredential: '',
      devHost: ''
    }
  })

  it('should return 500 response with empty body', async () => {
    // @ts-expect-error - test throwing error
    const response = await serverlessRender(null, {
      path: '/hello-world/',
      query: {
        page: '10'
      }
    })

    const body = await response.text()
    const status = response.status
    const expectedBody = ''
    const expectedStatus = 500

    expect(body).toBe(expectedBody)
    expect(status).toBe(expectedStatus)
  })

  it('should return 500 response with render http error output', async () => {
    setRenderFunctions({
      functions: {},
      layout: () => '',
      httpError: ({ code }) => `<html><body><h1>${code}</h1></body></html>`
    })

    // @ts-expect-error - test throwing error
    const response = await serverlessRender(null, {
      path: '/hello-world/',
      query: {
        page: '10'
      }
    })

    const body = await response.text()
    const status = response.status
    const expectedBody = '<html><body><h1>500</h1></body></html>'
    const expectedStatus = 500

    expect(body).toBe(expectedBody)
    expect(status).toBe(expectedStatus)
  })

  it('should return 404 response with render http error output', async () => {
    setRenderFunctions({
      functions: {},
      layout: () => '',
      httpError: ({ code }) => `<html><body><h1>${code}</h1></body></html>`
    })

    const response = await serverlessRender(getAllWordPressData, {
      path: '/hello-world/',
      query: {
        page: '10'
      }
    })

    const body = await response.text()
    const status = response.status
    const expectedBody = '<html><body><h1>404</h1></body></html>'
    const expectedStatus = 404

    expect(body).toBe(expectedBody)
    expect(status).toBe(expectedStatus)
  })

  it('should return 404 response with empty body', async () => {
    const response = await serverlessRender(getAllWordPressData, {
      path: '/hello-world/',
      query: {
        page: '10'
      }
    })

    const body = await response.text()
    const status = response.status
    const expectedBody = ''
    const expectedStatus = 404

    expect(body).toBe(expectedBody)
    expect(status).toBe(expectedStatus)
  })

  it('should return 200 response with serverless data output', async () => {
    setStoreItem('slugs', ['1', 'post'], '/hello-world/')
    setConfig({
      cms: testWordPressConfig(),
      env: {
        ...config.env,
        dir: '/'
      }
    })

    setRenderFunctions({
      functions: {},
      layout: ({ content, serverlessData }) => {
        let page = ''
        let filters = ''

        if (serverlessData) {
          const { query } = serverlessData

          page = isStringStrict(query?.page) ? query.page : ''
          filters = isStringStrict(query?.filters) ? query.filters : ''
        }

        return `<html><body>${page} ${filters} ${content}</body></html>`
      },
      httpError: ({ code }) => `<html><body><h1>${code}</h1></body></html>`
    })

    const response = await serverlessRender(getAllWordPressData, {
      path: '/hello-world/',
      query: {
        page: '10',
        filters: 'cat'
      }
    })

    const body = await response.text()
    const status = response.status
    const expectedStatus = 200
    const expectedBody =
      '<html><body>10 cat <p>Welcome to WordPress. This is your first post. Edit or delete it, then start writing!</p></body></html>'

    expect(body).toBe(expectedBody)
    expect(status).toBe(expectedStatus)
  })

  it('should return 200 response with preview data output', async () => {
    setRenderFunctions({
      functions: {},
      layout: ({ content, previewData }) => `<html lang="${previewData?.locale}"><body>${content}</body></html>`,
      httpError: ({ code }) => `<html><body><h1>${code}</h1></body></html>`
    })

    const response = await serverlessRender(getAllWordPressData, undefined, {
      id: '1',
      contentType: 'post',
      locale: 'en-CA'
    })

    const body = await response.text()
    const status = response.status
    const expectedStatus = 200
    const expectedBody =
      '<html lang="en-CA"><body><p>Welcome to WordPress. This is your first post. Edit or delete it, then start writing!</p></body></html>'

    expect(body).toBe(expectedBody)
    expect(status).toBe(expectedStatus)
  })
})

/* Test doServerlessAction */

describe('doServerlessAction()', () => {
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    resetFilters()
  })

  it('should return error if method is not post', async () => {
    const result = await doServerlessAction(testRequest('http://test.com/', 'GET', {}), {})
    const status = result.status
    const message = await result.json() as ServerlessActionReturn
    const expectedStatus = 405
    const expectedMessage = {
      error: 'Method not allowed'
    }

    expect(status).toBe(expectedStatus)
    expect(message).toEqual(expectedMessage)
  })

  it('should return error if data is not an object', async () => {
    // @ts-expect-error - test null data
    const result = await doServerlessAction(testRequest('http://test.com/', 'POST', null), {})
    const status = result.status
    const message = await result.json() as ServerlessActionReturn
    const expectedStatus = 500
    const expectedMessage = {
      error: 'Data not an object'
    }

    expect(status).toBe(expectedStatus)
    expect(message).toEqual(expectedMessage)
  })

  it('should return error if action does not exist', async () => {
    const result = await doServerlessAction(testRequest('http://test.com/', 'POST', {}), {})
    const status = result.status
    const message = await result.json() as ServerlessActionReturn
    const expectedStatus = 500
    const expectedMessage = {
      error: 'No action'
    }

    expect(status).toBe(expectedStatus)
    expect(message).toEqual(expectedMessage)
  })

  it('should return error if action has no result', async () => {
    const result = await doServerlessAction(testRequest('http://test.com/', 'POST', {
      action: 'test'
    }), {})

    const status = result.status
    const message = await result.json() as ServerlessActionReturn
    const expectedStatus = 500
    const expectedMessage = {
      error: 'No result'
    }

    expect(status).toBe(expectedStatus)
    expect(message).toEqual(expectedMessage)
  })

  it('should return empty success if honeypot exists', async () => {
    const result = await doServerlessAction(testRequest('http://test.com/', 'POST', {
      inputs: {
        frm_hp: {
          value: 'test'
        }
      }
    }), {}, undefined, 'frm_hp')

    const status = result.status
    const message = await result.json() as ServerlessActionReturn
    const contentType = result.headers.get('Content-Type')
    const expectedContentType = 'application/json'
    const expectedStatus = 200
    const expectedMessage = {
      success: ''
    }

    expect(status).toBe(expectedStatus)
    expect(message).toEqual(expectedMessage)
    expect(contentType).toEqual(expectedContentType)
  })

  it('should return empty success if action returns empty object', async () => {
    setServerless({
      test: async () => {
        return await Promise.resolve({})
      }
    })

    const result = await doServerlessAction(testRequest('http://test.com/', 'POST', 
      {
        action: 'test',
        inputs: {
          frm_hp: {
            value: ''
          },
          test: {
            value: 'ipsum'
          }
        }
      }),
      {},
      undefined,
      'frm_hp'
    )

    const status = result.status
    const message = await result.json() as ServerlessActionReturn
    const expectedStatus = 200
    const expectedMessage = {
      success: ''
    }

    expect(status).toBe(expectedStatus)
    expect(message).toEqual(expectedMessage)
  })

  it('should return success from test action', async () => {
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

    const result = await doServerlessAction(testRequest('http://test.com/', 'POST', 
      {
        action: 'test',
        inputs: {
          frm_hp: {
            value: ''
          },
          test: {
            value: 'ipsum'
          }
        }
      }),
      {},
      {
        'Access-Control-Allow-Origin': 'http://blog.test.com'
      },
      'frm_hp'
    )

    const status = result.status
    const contentType = result.headers.get('Content-Type')
    const allowOrigin = result.headers.get('Access-Control-Allow-Origin')
    const message = await result.json() as ServerlessActionReturn
    const expectedStatus = 200
    const expectedContentType = 'text/plain'
    const expectedAllowOrigin = 'http://blog.test.com'
    const expectedMessage = {
      success: 'Success'
    }

    expect(status).toBe(expectedStatus)
    expect(message).toEqual(expectedMessage)
    expect(contentType).toEqual(expectedContentType)
    expect(allowOrigin).toEqual(expectedAllowOrigin)
  })

  it('should return empty success', async () => {
    setServerless({
      // @ts-expect-error - test null message and headers
      test: async () => {
        return await Promise.resolve({
          success: {
            message: null,
            headers: null
          }
        })
      }
    })

    const result = await doServerlessAction(testRequest('http://test.com/', 'POST', 
      {
        action: 'test',
        inputs: {
          frm_hp: {
            value: ''
          },
          test: {
            value: 'ipsum'
          }
        }
      }),
      {},
      undefined,
      'frm_hp'
    )

    const status = result.status
    const contentType = result.headers.get('Content-Type')
    const message = await result.json() as ServerlessActionReturn
    const expectedStatus = 200
    const expectedContentType = 'application/json'
    const expectedMessage = {
      success: ''
    }

    expect(status).toBe(expectedStatus)
    expect(message).toEqual(expectedMessage)
    expect(contentType).toEqual(expectedContentType)
  })

  it('should filter result', async () => {
    const serverlessResult = vi.fn()

    addFilter('serverlessResult', async (result, args) => {
      serverlessResult(result, args)

      return await Promise.resolve({
        error: {
          message: 'Not found',
          response: new Response(null, { status: 404 })
        }
      })
    })

    const serverlessRequest = testRequest('http://test.com/', 'POST', {
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
    
    const result = await doServerlessAction(serverlessRequest, {}, {}, 'frm_hp')
    const status = result.status
    const message = await result.json() as ServerlessActionReturn
    const expectedStatus = 404
    const expectedMessage = {
      error: 'Not found'
    }

    expect(status).toBe(expectedStatus)
    expect(message).toEqual(expectedMessage)
    expect(serverlessResult).toHaveBeenCalledWith(
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
        request: serverlessRequest,
        env: {}
      }
    )
  })

  it('should return error from test action', async () => {
    setServerless({
      test: async () => {
        return await Promise.resolve({
          error: {
            message: 'Error'
          }
        })
      }
    })

    const result = await doServerlessAction(testRequest('http://test.com/', 'POST', {
      action: 'test',
      inputs: {
        frm_hp: {
          value: ''
        },
        test: {
          value: 'ipsum'
        }
      }
    }), {}, {}, 'frm_hp')

    const status = result.status
    const message = await result.json() as ServerlessActionReturn
    const expectedStatus = 500
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

    const result = await doServerlessAction(testRequest('http://test.com/', 'POST',
      {
        action: 'test',
        inputs: {
          frm_hp: {
            value: ''
          },
          test: {
            value: 'ipsum'
          }
        }
      }),
      {},
      {
        'Access-Control-Allow-Origin': 'http://sub.test.com'
      },
      'frm_hp'
    )

    const status = result.status
    const message = await result.json() as ServerlessActionReturn
    const allowOrigin = result.headers.get('Access-Control-Allow-Origin')
    const expectedAllowOrigin = 'http://sub.test.com'
    const expectedStatus = 500
    const expectedMessage = {
      error: 'Unknown error'
    }

    expect(status).toBe(expectedStatus)
    expect(message).toEqual(expectedMessage)
    expect(allowOrigin).toEqual(expectedAllowOrigin)
  })
})
