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
import type { RenderAllData, RenderItem } from '../render/renderTypes.js'
import type { CacheData, DataFilterArgs } from '../utils/filter/filterTypes.js'
import {
  normalizeWordPressData,
  normalizeWordPressMenuItems,
  normalizeWordPressMenus,
  normalRoutes
} from './wordpressDataNormal.js'
import { applyFilters } from '../utils/filter/filter.js'
import { isObjectStrict } from '../utils/object/object.js'
import { isString, isStringStrict } from '../utils/string/string.js'
import { isArray } from '../utils/array/array.js'
import { getStoreItem } from '../store/store.js'
import { config } from '../config/config.js'

/**
 * Normalize route by type
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
 * Fetch data from wordpress cms or cache
 *
 * @param {WordPressDataArgs} args
 * @param {number} [_page=1]
 * @return {Promise<RenderItem[]>}
 */
const getWordPressData = async (args: WordPressDataArgs, _page: number = 1): Promise<RenderItem[]> => {
  /* Args required */

  if (!isObjectStrict(args)) {
    throw new Error('No args')
  }

  const {
    key,
    route,
    params,
    meta,
    fetcher = fetch,
    options
  } = args

  /* Key required for cache */

  if (!isStringStrict(key)) {
    throw new Error('No key')
  }

  /* Meta check */

  const hasMeta = isObjectStrict(meta)

  /* Check cache */

  if (config.env.cache) {
    const cacheDataFilterArgs = {
      key,
      type: 'get'
    }

    const cacheData = await applyFilters('cacheData', undefined as CacheData | undefined, cacheDataFilterArgs, true)
    const cacheItems = cacheData?.items
    const cacheMeta = cacheData?.meta

    if (isObjectStrict(cacheMeta) && hasMeta) {
      const { total, totalPages } = cacheMeta

      meta.total = total
      meta.totalPages = totalPages
    }

    if (isArray(cacheItems)) {
      return structuredClone(cacheItems)
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

  /* Check and transform data */

  const headers = new Headers()
  headers.set('Authorization', `Basic ${btoa(`${user}:${pass}`)}`)

  const resp = await fetcher(url, { headers, ...options })
  const data: WordPressDataError | WordPressDataItem | WordPressDataItem[] = await resp.json()

  /* Check if error */

  const isErr = isObjectStrict(data) && isStringStrict(data.message)
  const message = isErr ? data.message : 'Bad fetch response'

  if (!resp.ok || isErr) {
    throw new Error(message as string, { cause: data })
  }

  /* Total */

  const total = resp.headers.get('X-WP-Total')
  const totalPages = resp.headers.get('X-WP-TotalPages')
  const totalNum = isStringStrict(total) ? parseInt(total, 10) : 1
  const totalPagesNum = isStringStrict(totalPages) ? parseInt(totalPages, 10) : 1

  if (hasMeta) {
    meta.total = totalNum
    meta.totalPages = totalPagesNum
  }

  /* Normalize */

  const dataItems = isArray(data) ? data : [data] as WordPressDataItem[]
  let newData = normalizeWordPressData(dataItems, route)

  if (loop && _page < totalPagesNum) {
    const pagData = await getWordPressData({
      key,
      route,
      meta,
      params: {
        per_page: -1
      }
    }, _page + 1)

    if (isArray(pagData)) {
      newData = [
        ...newData,
        ...pagData
      ]
    }
  }

  /* Add to cache */

  if (config.env.cache) {
    const cacheDataFilterArgs = {
      key,
      type: 'set',
      data
    }

    await applyFilters('cacheData', {
      items: newData,
      meta
    }, cacheDataFilterArgs, true)
  }

  /* Output */

  return newData
}

/**
 * Fetch data from all content types or single entry if serverless
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

      if (isObjectStrict(item)) {
        id = isStringStrict(item.id) ? item.id : ''
        contentType = isStringStrict(item.contentType) ? item.contentType : ''
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

      if (isArray(data)) {
        allData.content[contentType] = data
      }
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

      let data = await getWordPressData({
        key,
        route: getRoute(contentType),
        params: {
          per_page: -1
        }
      })

      if (isMenuItem) {
        data = normalizeWordPressMenuItems(data)
      }

      if (isMenu) {
        data = normalizeWordPressMenus(data)
      }

      data = applyFilters('wordpressData', data, {
        ...wordpressDataFilterArgs,
        contentType
      })

      if (isArray(data)) {
        allData[partialType] = data
      }
    }
  }

  /* Whole data (for item render) - not serverless or preview */

  if (!isServerless && !isPreview) {
    const whole = config.wholeTypes

    for (const contentType of whole) {
      allData.content[contentType] = []

      const key = `all_${contentType}`

      let data = await getWordPressData({
        key,
        route: getRoute(contentType),
        params: {
          per_page: -1
        }
      })

      data = applyFilters('wordpressData', data, {
        ...wordpressDataFilterArgs,
        contentType
      })

      if (isArray(data)) {
        allData.content[contentType] = data
      }
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
