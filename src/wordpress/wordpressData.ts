/**
 * WordPress - Data
 */

/* Imports */

import type {
  WordPressDataError,
  WordPressDataItem,
  AllWordPressDataArgs,
  WordPressDataArgs
} from './wordpressDataTypes.js'
import type { RenderAllData, RenderData } from '../render/renderTypes.js'
import type { CacheData, DataFilterArgs } from '../filters/filtersTypes.js'
import {
  normalizeWordPressData,
  normalizeWordPressMenuItems,
  normalizeWordPressMenus,
  normalRoutes
} from './wordpressDataNormal.js'
import { applyFilters } from '../filters/filters.js'
import { isObject, isObjectStrict } from '../utils/object/object.js'
import { isString, isStringStrict } from '../utils/string/string.js'
import { isArray } from '../utils/array/array.js'
import { getStoreItem } from '../store/store.js'
import { config } from '../config/config.js'

/**
 * Normalize route by type.
 *
 * @param {string} type
 * @return {string}
 */
const getRoute = (type: string): string => {
  const route = normalRoutes.get(type)

  if (isString(route)) {
    return route
  }

  return type
}

/**
 * Fetch data from WordPress CMS or cache.
 *
 * @param {WordPressDataArgs} args
 * @return {Promise<RenderData>}
 */
const getWordPressData = async (args: WordPressDataArgs, _page: number = 1): Promise<RenderData> => {
  /* Args required */

  if (!isObjectStrict(args)) {
    throw new Error('No args')
  }

  const {
    key,
    route,
    params,
    fetcher = fetch,
    options
  } = args

  /* Key required for cache */

  if (!isStringStrict(key)) {
    throw new Error('No key')
  }

  /* Check cache */

  if (config.env.cache) {
    const cacheDataFilterArgs = {
      key,
      type: 'get'
    }

    const cacheData = await applyFilters('cacheData', undefined as CacheData | undefined, cacheDataFilterArgs, true)

    if (isObject(cacheData)) {
      return structuredClone(cacheData)
    }
  }

  /* Route required */

  if (!isStringStrict(route)) {
    throw new Error('No route')
  }

  /* Credentials */

  const {
    devUser,
    prodUser,
    devCredential,
    prodCredential,
    devHost,
    prodHost,
    ssl = true
  } = config.cms

  let user = devUser
  let pass = devCredential
  let host = devHost
  let status = 'any'

  if (config.env.prod) {
    user = prodUser
    pass = prodCredential
    host = prodHost
    status = 'publish'
  }

  if (!isStringStrict(user) || !isStringStrict(pass) || !isStringStrict(host)) {
    throw new Error('No credentials')
  }

  /* Params */

  let url = `${ssl ? 'https' : 'http'}://${host}/wp-json/wp/v2/${route}?status=${status}`
  let loop = false
  let embed = false

  if (isObjectStrict(params)) {
    for (const [key, value] of Object.entries(params)) {
      let val = value

      if (key === '_embed') {
        embed = true
      }

      if (key === 'per_page' && value === -1) {
        val = 100
        loop = true
      }

      url += `&${key}=${val.toString()}`
    }
  }

  if (loop) {
    url += `&page=${_page}`
  }

  if (!embed) {
    url += '&_embed'
  }

  /* Request */

  const headers = new Headers()
  headers.set('Authorization', `Basic ${btoa(`${user}:${pass}`)}`)

  const resp = await fetcher(url, { headers, ...options })
  const data = await resp.json() as WordPressDataError | WordPressDataItem | WordPressDataItem[]

  /* Check if error */

  const isErr = isObjectStrict(data) && isStringStrict(data.message)
  const message = isErr ? data.message : 'Bad fetch response'

  if (!resp.ok || isErr) {
    throw new Error(message as string, { cause: data })
  }

  /* Total */

  const total = resp.headers.get('X-WP-Total')
  const totalPages = resp.headers.get('X-WP-TotalPages')
  const totalNum = isStringStrict(total) ? parseInt(total, 10) : 0
  const totalPagesNum = isStringStrict(totalPages) ? parseInt(totalPages, 10) : 0

  /* Normalize */

  const dataItems = isArray(data) ? data : [data] as WordPressDataItem[]
  let newItems = normalizeWordPressData(dataItems, route)

  if (loop && _page < totalPagesNum) {
    const pagData = await getWordPressData({
      key,
      route,
      params: {
        per_page: -1
      }
    }, _page + 1)

    const { items: pagItems } = pagData

    newItems = [
      ...newItems,
      ...pagItems
    ]
  }

  /* Full data */

  const newData = {
    items: newItems,
    total: totalNum,
    pages: totalPagesNum
  }

  /* Add to cache */

  if (config.env.cache) {
    const cacheDataFilterArgs = {
      key,
      type: 'set',
      data
    }

    await applyFilters('cacheData', newData, cacheDataFilterArgs, true)
  }

  /* Output */

  return newData
}

/**
 * Fetch data from all content types or single entry if serverless.
 *
 * @param {AllWordPressDataArgs} [args]
 * @return {Promise<RenderAllData|undefined>}
 */
const getAllWordPressData = async (args?: AllWordPressDataArgs): Promise<RenderAllData | undefined> => {
  /* Args */

  const {
    serverlessData,
    previewData
  } = isObjectStrict(args) ? args : {}

  /* All data */

  let allData: RenderAllData = {
    navigationItem: [],
    navigation: [],
    content: {
      page: []
    }
  }

  /* Serverless */

  const isServerless = serverlessData != null
  const isPreview = previewData != null
  const wordpressDataFilterArgs: DataFilterArgs = {
    serverlessData,
    previewData
  }

  /* Single entry data if serverless or preview data */

  if (isServerless || isPreview) {
    let contentType = ''
    let id = ''

    if (isServerless) {
      const slugs = getStoreItem('slugs')
      const path = serverlessData.path
      const item = slugs[path]

      if (item) {
        const [itemId, itemContentType] = item

        id = itemId || ''
        contentType = itemContentType || ''
      }
    }

    if (isPreview) {
      id = previewData.id
      contentType = previewData.contentType
    }

    if (id) {
      const key = `serverless_${id}_${contentType}`
      const data = await getWordPressData({
        key,
        route: `${getRoute(contentType)}/${id}`
      })

      let { items } = data

      items = applyFilters('wordpressData', items, {
        ...wordpressDataFilterArgs,
        contentType
      })

      allData.content[contentType] = items
    }
  }

  /* Partial data - not serverless */

  if (!isServerless) {
    const partial = config.partialTypes

    for (const contentType of partial) {
      const isMenu = contentType === 'nav_menu'
      const isMenuItem = contentType === 'nav_menu_item'
      const partialType = isMenu ? 'navigation' : isMenuItem ? 'navigationItem' : contentType

      allData[partialType] = []

      const key = `all_${contentType}`
      const data = await getWordPressData({
        key,
        route: getRoute(contentType),
        params: {
          per_page: -1
        }
      })

      let { items } = data

      if (isMenuItem) {
        items = normalizeWordPressMenuItems(items)
      }

      if (isMenu) {
        items = normalizeWordPressMenus(items)
      }

      items = applyFilters('wordpressData', items, {
        ...wordpressDataFilterArgs,
        contentType
      })

      allData[partialType] = items
    }
  }

  /* Whole data (render items) - not serverless or preview */

  if (!isServerless && !isPreview) {
    const whole = config.wholeTypes

    for (const contentType of whole) {
      allData.content[contentType] = []

      const key = `all_${contentType}`
      const data = await getWordPressData({
        key,
        route: getRoute(contentType),
        params: {
          per_page: -1
        }
      })

      let { items } = data

      items = applyFilters('wordpressData', items, {
        ...wordpressDataFilterArgs,
        contentType
      })

      allData.content[contentType] = items
    }
  }

  /* Filter all data */

  allData = applyFilters('allData', allData, {
    type: 'wordpress',
    serverlessData,
    previewData
  })

  /* Output */

  return allData
}

/* Exports */

export {
  getRoute,
  getWordPressData,
  getAllWordPressData
}
