/**
 * WordPress - Data
 */

/* Imports */

import type {
  WordPressDataError,
  WordPressDataItem,
  WordPressDataParams,
  AllWordPressDataArgs
} from './wordpressDataTypes.js'
import type { RenderAllData, RenderItem } from '../render/renderTypes.js'
import type { DataFilterArgs } from '../utils/filter/filterTypes.js'
import { normalizeWordPressData } from './wordpressDataNormal.js'
import { applyFilters } from '../utils/filter/filter.js'
import { isObject, isObjectStrict } from '../utils/object/object.js'
import { isString, isStringStrict } from '../utils/string/string.js'
import { isArray } from '../utils/array/array.js'
import { fetchStoreItem } from '../store/store.js'
import { config } from '../config/config.js'

/**
 * Normalize route by type
 *
 * @private
 * @param {string} type
 * @return {string}
 */
const getRoute = (type: string): string => {
  const routes: Record<string, string> = {
    page: 'pages',
    post: 'posts',
    taxonomy: 'taxonomies',
    category: 'categories',
    tag: 'tags',
    attachment: 'media',
    navigation: 'menus',
    navigationItem: 'menu-items'
  }

  const route = routes[type]

  if (isString(route)) {
    return route
  }

  return type
}

/**
 * Fetch data from wordpress cms or cache
 *
 * @param {string} key
 * @param {string} route
 * @param {WordPressDataParams} [params]
 * @param {number} [_page]
 * @return {Promise<RenderItem[]>}
 */
const getWordPressData = async (
  key: string,
  route: string,
  params: WordPressDataParams = {},
  _page: number = 1
): Promise<RenderItem[]> => {
  /* Key required for cache */

  if (!isStringStrict(key)) {
    throw new Error('No key')
  }

  /* Check cache */

  if (config.env.cache) {
    let cacheData: RenderItem[] | undefined

    const cacheDataFilterArgs = {
      key,
      type: 'get'
    }

    cacheData = await applyFilters('cacheData', cacheData, cacheDataFilterArgs, true)

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

  let url = `${ssl ? 'https' : 'http'}://${host}/wp-json/wp/v2/${route}?_embed&status=${status}`
  let loop = false

  if (isObjectStrict(params)) {
    for (const [key, value] of Object.entries(params)) {
      let val = value

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

  /* Check and transform data */

  const headers = new Headers()
  headers.set('Authorization', `Basic ${btoa(`${user}:${pass}`)}`)

  const resp = await fetch(url, { headers })
  const data: WordPressDataError | WordPressDataItem | WordPressDataItem[] = await resp.json()

  /* Check if error */

  const isErr = isObjectStrict(data) && isStringStrict(data.message)
  const message = isErr ? data.message : 'Bad fetch response'

  if (!resp.ok || isErr) {
    throw new Error(message as string, { cause: data })
  }

  /* Total */

  const total = resp.headers.get('X-WP-TotalPages')
  const totalPages = isStringStrict(total) ? parseInt(total, 10) : 1

  /* Normalize */

  const dataItems = isArray(data) ? data : [data] as WordPressDataItem[]
  let newData = normalizeWordPressData(dataItems, route)

  if (loop && _page < totalPages) {
    const pagData = await getWordPressData(key, route, {
      per_page: -1
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

    await applyFilters('cacheData', newData, cacheDataFilterArgs, true)
  }

  /* Output */

  return newData
}

/**
 * Fetch data from all content types or single entry if serverless
 *
 * @param {AllWordPressDataArgs} args
 * @return {Promise<RenderAllData|undefined>}
 */
const getAllWordPressData = async (args?: AllWordPressDataArgs): Promise<RenderAllData | undefined> => {
  /* Args */

  const argsObj = isObjectStrict(args) ? args : {}

  const {
    serverlessData,
    previewData
  } = argsObj

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

  /* Get single entry data if serverless or preview data */

  let isEntry = false

  if (isServerless || isPreview) {
    let contentType = ''
    let id = ''

    if (isServerless) {
      const slugs = await fetchStoreItem('slugs')
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

    if (id !== '') {
      const key = `serverless_${id}_${contentType}`
      const data = await getWordPressData(key, `${getRoute(contentType)}/${id}`)

      if (isArray(data)) {
        isEntry = true
        allData.content[contentType] = data
      }
    }
  }

  /* Get partial data - not serverless */

  if (!isServerless || !isEntry) {
    const partial = config.partialTypes

    for (const contentType of partial) {
      allData[contentType] = []

      const key = `all_${contentType}`

      let data = await getWordPressData(key, getRoute(contentType), {
        per_page: -1
      })

      data = applyFilters('wordpressData', data, wordpressDataFilterArgs)

      if (isArray(data)) {
        allData[contentType] = data
      }
    }
  }

  /* Get whole data (for page generation) - not serverless or preview */

  if ((!isServerless && !isPreview) || !isEntry) {
    const whole = config.wholeTypes

    for (const contentType of whole) {
      allData.content[contentType] = []

      const key = `all_${contentType}`

      let data = await getWordPressData(key, getRoute(contentType), {
        per_page: -1
      })

      data = applyFilters('wordpressData', data, wordpressDataFilterArgs)

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
  getWordPressData,
  getAllWordPressData
}
