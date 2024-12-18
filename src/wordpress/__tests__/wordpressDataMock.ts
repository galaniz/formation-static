/**
 * WordPress - Data Mock Fetch
 */

/* Imports */

import type { MockFetchResult, MockFetchOptions } from '../../../tests/types.js'
import type { WordPressDataItem, WordPressDataError } from '../wordpressDataTypes.js'
import { mockFetchErrorMessage } from '../../../tests/types.js'
import { vi } from 'vitest'

/**
 * Mock fetch function
 *
 * @param {string} url
 * @param {MockFetchOptions} options
 * @return {Promise<MockFetchResult>}
 */
const mockWordPressFetch = vi.fn(async (
  url: string,
  options: MockFetchOptions
): Promise<MockFetchResult> => {
  return await new Promise(async (resolve, reject) => { // eslint-disable-line
    /* Status */

    let status = 200

    /* Data */

    let data: WordPressDataItem | WordPressDataItem[] | WordPressDataError = {}

    /* Headers */

    const headers = new Headers()

    /* Url check */

    let urlObj: URL

    try {
      urlObj = new URL(url)

      if (!urlObj.host.includes('.')) {
        throw new Error()
      }
    } catch (error) {
      reject(new TypeError(mockFetchErrorMessage.url))
      return
    }

    /* Check if route exists */

    const path = urlObj.pathname.split('v2/')[1]
    const [route, id] = path?.split('/') ?? []

    if (route === 'does-not-exist') {
      status = 500
      data = {
        code: 'route_not_found',
        message: mockFetchErrorMessage.route
      }
    }

    if (id === '0') {
      status = 404
      data = {
        code: 'item_not_found',
        message: mockFetchErrorMessage.data
      }
    }

    /* Options */

    const { headers: authHeaders } = options
    const auth = authHeaders?.get('Authorization')

    if (auth !== `Basic ${btoa('user:pass')}`) {
      status = 401
      data = {
        code: 'authorization_failed',
        message: mockFetchErrorMessage.auth
      }
    }

    /* Headers */

    headers.set('X-WP-TotalPages', '1')
    headers.set('X-WP-Total', '1')

    /* Posts sample data */

    if (route === 'posts') {
      const posts = await import('../../../tests/data/wordpress/posts.json').then((res) => res.default) as WordPressDataItem[]

      if (id === '1') {
        data = posts.find((post) => post.id === 1) as WordPressDataItem
      }

      if (id == null) {
        data = posts
      }
    }

    if (route === 'pages') {
      data = await import('../../../tests/data/wordpress/pages.json').then((res) => res.default) as WordPressDataItem[]
    }

    if (route === 'menus') {
      data = await import('../../../tests/data/wordpress/menus.json').then((res) => res.default) as WordPressDataItem[]
    }

    if (route === 'menu-items') {
      data = await import('../../../tests/data/wordpress/menu-items.json').then((res) => res.default) as WordPressDataItem[]
    }

    if (route === 'categories') {
      data = await import('../../../tests/data/wordpress/categories.json').then((res) => res.default) as WordPressDataItem[]
    }

    if (route === 'tags') {
      data = await import('../../../tests/data/wordpress/tags.json').then((res) => res.default) as WordPressDataItem[]
    }

    if (route === 'media') {
      data = await import('../../../tests/data/wordpress/media.json').then((res) => res.default) as WordPressDataItem[]
    }

    if (route === 'empty') {
      data = []
    }

    if (route === 'null') {
      // @ts-expect-error
      data = [null, null, null, null]
    }

    /* Result */

    const res = JSON.stringify(data)

    resolve({
      ok: status === 200,
      status,
      headers,
      body: res,
      text: async () => {
        return await new Promise((resolve) => {
          resolve(res)
        })
      },
      json: async () => {
        return await new Promise((resolve) => {
          resolve(data)
        })
      }
    })
  })
})

/* Exports */

export { mockWordPressFetch }
