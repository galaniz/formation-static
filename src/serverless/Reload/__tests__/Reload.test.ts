/**
 * Serverless - Reload Test
 */

/* Imports */

import { it, expect, describe, vi, afterEach, beforeAll } from 'vitest'
import {
  testResetRenderFunctions,
  testResetStore,
  testContext,
  testWordPressConfig
} from '../../../../tests/utils.js'
import { getAllWordPressData } from '../../../wordpress/wordpressData.js'
import { mockWordPressFetch } from '../../../wordpress/__tests__/wordpressDataMock.js'
import { setRenderFunctions } from '../../../render/render.js'
import { isStringStrict } from '../../../utils/string/string.js'
import { config, setConfig } from '../../../config/config.js'
import { setStoreItem } from '../../../store/store.js'
import { Reload } from '../Reload.js'

/* Tests */

describe('Reload()', () => {
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
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

  it('should return next response if no page or filters', async () => {
    const next = vi.fn()
    const context = { ...testContext('http://wp.com/'), next }

    await Reload(context, () => {}, getAllWordPressData)

    expect(next).toHaveBeenCalledTimes(1)
  })

  it('should return 500 response with empty body', async () => {
    vi.stubGlobal('fetch', mockWordPressFetch)

    const context = testContext('http://wp.com/hello-world/?page=10')
    const response = await Reload(context, () => {
      setConfig({ cms: testWordPressConfig() })
      throw new Error()
    }, getAllWordPressData)

    const body = await response.text()
    const status = response.status
    const expectedBody = ''
    const expectedStatus = 500

    expect(body).toBe(expectedBody)
    expect(status).toBe(expectedStatus)
  })

  it('should return 500 response with render http error output', async () => {
    const context = testContext('http://wp.com/hello-world/?page=10')
    const response = await Reload(context, () => {
      setRenderFunctions({
        functions: {},
        layout: () => '',
        httpError: ({ code }) => `<html><body><h1>${code}</h1></body></html>`
      })
    }, () => { throw new Error() })

    const body = await response.text()
    const status = response.status
    const expectedBody = '<html><body><h1>500</h1></body></html>'
    const expectedStatus = 500

    expect(body).toBe(expectedBody)
    expect(status).toBe(expectedStatus)
  })

  it('should return 404 response with render http error output', async () => {
    vi.stubGlobal('fetch', mockWordPressFetch)

    const context = testContext('http://wp.com/hello-world/?page=10')
    const response = await Reload(context, () => {
      setRenderFunctions({
        functions: {},
        layout: () => '',
        httpError: ({ code }) => `<html><body><h1>${code}</h1></body></html>`
      })
    }, getAllWordPressData)

    const body = await response.text()
    const status = response.status
    const expectedBody = '<html><body><h1>404</h1></body></html>'
    const expectedStatus = 404

    expect(body).toBe(expectedBody)
    expect(status).toBe(expectedStatus)
  })

  it('should return 404 response with empty body', async () => {
    vi.stubGlobal('fetch', mockWordPressFetch)

    const context = testContext('http://wp.com/hello-world/?page=10')
    const response = await Reload(context, () => {
      setConfig({ cms: testWordPressConfig() })
    }, getAllWordPressData)

    const body = await response.text()
    const status = response.status
    const expectedBody = ''
    const expectedStatus = 404

    expect(body).toBe(expectedBody)
    expect(status).toBe(expectedStatus)
  })

  it('should return 200 response with render layout output', async () => {
    vi.stubGlobal('fetch', mockWordPressFetch)

    const context = testContext('http://wp.com/hello-world/?page=10&filters=cat')
    const response = await Reload(context, () => {
      setConfig({
        cms: testWordPressConfig(),
        env: {
          ...config.env,
          dir: '/'
        }
      })

      setStoreItem('slugs', {
        '/hello-world/': {
          id: '1',
          contentType: 'post'
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
    }, getAllWordPressData)

    const body = await response.text()
    const status = response.status
    const expectedStatus = 200
    const expectedBody =
      '<html><body>10 cat <p>Welcome to WordPress. This is your first post. Edit or delete it, then start writing!</p></body></html>'

    expect(body).toBe(expectedBody)
    expect(status).toBe(expectedStatus)
  })
})
