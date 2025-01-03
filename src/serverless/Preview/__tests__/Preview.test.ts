/**
 * Serverless - Preview Test
 */

/* Imports */

import { it, expect, describe, vi, afterEach } from 'vitest'
import {
  testResetRenderFunctions,
  testResetStore,
  testContext,
  testWordPressConfig
} from '../../../../tests/utils.js'
import { getAllWordPressData } from '../../../wordpress/wordpressData.js'
import { mockWordPressFetch } from '../../../wordpress/__tests__/wordpressDataMock.js'
import { setRenderFunctions } from '../../../render/render.js'
import { config, setConfig } from '../../../config/config.js'
import { Preview } from '../Preview.js'

/* Tests */

describe('Preview()', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
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

  it('should return next response if no preview id or content type', async () => {
    const next = vi.fn()
    const context = { ...testContext('http://wp.com/'), next }

    await Preview(context, () => {}, getAllWordPressData)

    expect(next).toHaveBeenCalledTimes(1)
  })

  it('should return next response if only preview id', async () => {
    const next = vi.fn()
    const context = { ...testContext('http://wp.com/?preview=2'), next }

    await Preview(context, () => {}, getAllWordPressData)

    expect(next).toHaveBeenCalledTimes(1)
  })

  it('should return next response if only content type', async () => {
    const next = vi.fn()
    const context = { ...testContext('http://wp.com/?content_type=post'), next }

    await Preview(context, () => {}, getAllWordPressData)

    expect(next).toHaveBeenCalledTimes(1)
  })

  it('should return 404 response with empty body', async () => {
    vi.stubGlobal('fetch', mockWordPressFetch)

    const context = testContext('http://wp.com/?content_type=post&preview=2')
    const response = await Preview(context, () => {
      setConfig({ cms: testWordPressConfig() })
    }, getAllWordPressData)

    const body = await response.text()
    const status = response.status
    const expectedBody = ''
    const expectedStatus = 404

    expect(body).toBe(expectedBody)
    expect(status).toBe(expectedStatus)
  })

  it('should return 404 response with render http error output', async () => {
    vi.stubGlobal('fetch', mockWordPressFetch)

    const context = testContext('http://wp.com/?content_type=post&preview=2')
    const response = await Preview(context, () => {
      setConfig({ cms: testWordPressConfig() })
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

  it('should return 200 response with render layout output', async () => {
    vi.stubGlobal('fetch', mockWordPressFetch)

    const context = testContext('http://wp.com/?content_type=post&preview=1')
    const response = await Preview(context, () => {
      setConfig({ cms: testWordPressConfig() })
      setRenderFunctions({
        functions: {},
        layout: ({ content }) => `<html><body>${content}</body></html>`,
        httpError: ({ code }) => `<html><body><h1>${code}</h1></body></html>`
      })
    }, getAllWordPressData)

    const body = await response.text()
    const status = response.status
    const expectedStatus = 200
    const expectedBody =
      '<html><body>\n<p>Welcome to WordPress. This is your first post. Edit or delete it, then start writing!</p>\n</body></html>'

    expect(body).toBe(expectedBody)
    expect(status).toBe(expectedStatus)
  })
})
