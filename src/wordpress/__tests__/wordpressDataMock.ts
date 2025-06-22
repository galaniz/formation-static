/**
 * WordPress - Data Mock Fetch
 */

/* Imports */

import type { MockFetchResult, MockFetchOptions } from '../../../tests/types.js'
import type { WordPressDataItem, WordPressDataError } from '../wordpressDataTypes.js'
import { mockFetchErrorMessage } from '../../../tests/types.js'
import { isNumber } from '../../utils/number/number.js'
import { isArray } from '../../utils/array/array.js'
import { vi } from 'vitest'

/**
 * Mock fetch function.
 *
 * @param {string} url
 * @param {MockFetchOptions} options
 * @return {Promise<MockFetchResult>}
 */
const mockWordPressFetch = vi.fn(async (
  url: string,
  options: MockFetchOptions
): Promise<MockFetchResult> => {
  return await new Promise(async (resolve) => { // eslint-disable-line @typescript-eslint/no-misused-promises
    /* Status */

    let status = 200

    /* Data */

    let data: WordPressDataItem | WordPressDataItem[] | WordPressDataError = {}

    /* Headers */

    const headers = new Headers()

    /* Url */

    const urlObj = new URL(url)

    /* Check if route exists */

    const path = urlObj.pathname.split('v2/')[1]
    const [route, id] = path?.split('/') ?? []

    if (route === 'does_not_exist') {
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
    const auth = authHeaders.get('Authorization')

    if (auth !== `Basic ${btoa('user:pass')}`) {
      status = 401
      data = {
        code: 'authorization_failed',
        message: mockFetchErrorMessage.auth
      }
    }

    /* Pagination */

    const page = urlObj.searchParams.get('page')
    const allPages = page && route === 'pages'

    let total = ''
    let totalPages = ''

    if (allPages) {
      totalPages = '2'
      total = '2'
    }

    /* Sample data */

    if (route === 'posts') {
      const posts = await import('../../../tests/data/wordpress/posts.json').then((res) => res.default) as WordPressDataItem[]

      if (id === '1') {
        data = posts.find((post) => post.id === 1) as WordPressDataItem
        total = '1'
      }

      if (!id) {
        data = posts
      }
    }

    if (route === 'pages') {
      const pages = await import('../../../tests/data/wordpress/pages.json').then((res) => res.default) as WordPressDataItem[]

      let pageIndex = 0

      if (allPages) {
        const pageNum = parseInt(page, 10)

        pageIndex = isNumber(pageNum) ? pageNum - 1 : 0
      }

      data = allPages ? pages[pageIndex] as WordPressDataItem : pages
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

    if (route === 'taxonomies') {
      data = await import('../../../tests/data/wordpress/taxonomies.json').then((res) => res.default) as Record<string, WordPressDataItem>
      total = '4'
    }

    if (route === 'empty') {
      data = []
    }

    if (route === 'null') {
      // @ts-expect-error - test null data
      data = [null, null, null, null]
    }

    /* Headers */

    if (isArray(data) && data.length) {
      total = data.length.toString()
    }

    headers.set('X-WP-TotalPages', totalPages)
    headers.set('X-WP-Total', total)

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
