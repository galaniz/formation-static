/**
 * Contentful - Data Mock Fetch
 */

/* Imports */

import type { MockFetchResult } from '../../../tests/types.js'
import type { ContentfulData, ContentfulDataError, ContentfulDataItem } from '../contentfulDataTypes.js'
import { mockFetchErrorMessage } from '../../../tests/types.js'
import { vi } from 'vitest'

/**
 * Mock fetch function
 *
 * @param {string} url
 * @return {Promise<MockFetchResult>}
 */
const mockContentfulFetch = vi.fn(async (url: string): Promise<MockFetchResult> => {
  return await new Promise(async (resolve) => { // eslint-disable-line @typescript-eslint/no-misused-promises
    /* Status */

    let status = 200

    /* Data */

    let data: ContentfulData | ContentfulDataError | undefined

    /* Headers */

    const headers = new Headers()

    /* Auth check */

    const urlObj = new URL(url)
    const token = urlObj.searchParams.get('access_token')

    if (token !== 'lipsum') {
      status = 401
      data = {
        sys: {
          type: 'Error',
          id: 'AccessTokenInvalid'
        },
        message: mockFetchErrorMessage.auth
      }
    }

    /* Check if content type exists */

    const contentType = urlObj.searchParams.get('content_type') || ''

    if (!['page', 'post', 'navigation', 'navigationItem', 'term', 'taxonomy', 'empty'].includes(contentType) && !data) {
      status = 400
      data = {
        sys: {
          type: 'Error',
          id: 'InvalidQuery'
        },
        message: mockFetchErrorMessage.contentType
      }
    }

    /* Locale */

    const locale = urlObj.searchParams.get('locale') || ''
    const isFr = locale === 'fr-CA'

    /* Sample data */

    if (contentType === 'page' && !data) {
      if (isFr) {
        data = await import('../../../tests/data/contentful/pageFr.json').then((res) => res.default) as ContentfulData
      } else {
        data = await import('../../../tests/data/contentful/page.json').then((res) => res.default) as ContentfulData
      }

      const id = urlObj.searchParams.get('sys.id')

      if (id === 'JH7SZfgxuZ2SQrLvQHjQg') {
        data = {
          ...data,
          items: [data.items[1]] as ContentfulDataItem[]
        }
      }

      if (id === 'none') {
        status = 404
        data = {
          sys: {
            type: 'Error',
            id: 'Error'
          },
          // @ts-expect-error - test null message
          message: null
        }
      }
    }

    if (contentType === 'navigation' && !data) {
      if (isFr) {
        data = await import('../../../tests/data/contentful/navigationFr.json').then((res) => res.default) as ContentfulData
      } else {
        data = await import('../../../tests/data/contentful/navigation.json').then((res) => res.default) as ContentfulData
      }
    }

    if (contentType === 'navigationItem' && !data) {
      if (isFr) {
        data = await import('../../../tests/data/contentful/navigationItemFr.json').then((res) => res.default) as ContentfulData
      } else {
        data = await import('../../../tests/data/contentful/navigationItem.json').then((res) => res.default) as ContentfulData
      }
    }

    if (contentType === 'taxonomy' && !data) {
      data = await import('../../../tests/data/contentful/taxonomy.json').then((res) => res.default) as ContentfulData
    }

    if (contentType === 'term' && !data) {
      data = await import('../../../tests/data/contentful/term.json').then((res) => res.default) as ContentfulData
    }

    if (contentType === 'empty' && !data) {
      data = {
        total: 0,
        skip: 0,
        limit: 0,
        items: []
      }
    }

    /* Result */

    const res = JSON.stringify(data || {})

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
          resolve(data || {})
        })
      }
    })
  })
})

/* Exports */

export { mockContentfulFetch }
