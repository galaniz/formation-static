/**
 * Serverless - Test
 */

/* Imports */

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
import { config, setConfig } from '../../config/config.js'
import { setStoreItem } from '../../store/store.js'
import {
  serverlessActions,
  serverlessPreview,
  serverlessReload,
  serverlessRender,
  setServerless
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

  it('should return undefined if method is not get', () => {
    const result = serverlessPreview(testRequest('http://test.com/?preview=123&content_type=post', 'POST'))
    const expectedResult = undefined

    expect(result).toEqual(expectedResult)
  })

  it('should return undefined if no id', () => {
    const result = serverlessPreview(testRequest('http://test.com/?content_type=post'))
    const expectedResult = undefined

    expect(result).toEqual(expectedResult)
  })

  it('should return undefined if no content type', () => {
    const result = serverlessPreview(testRequest('http://test.com/?preview=123'))
    const expectedResult = undefined

    expect(result).toEqual(expectedResult)
  })

  it('should return id and content type', () => {
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

  it('should return undefined if method is not get', () => {
    const result = serverlessReload(testRequest('http://test.com/blog/?page=2', 'POST'))
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
