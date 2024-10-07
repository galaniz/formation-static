/**
 * Utils - WordPress Data
 */

/* Imports */

import type {
  WordPressDataError,
  WordPressDataItem,
  WordPressDataParams,
  AllWordPressDataArgs
} from './wordpressDataTypes.js'
import type { RenderAllData, RenderItem, RenderSlugs } from '../../render/renderTypes.js'
import { applyFilters } from '../filter/filter.js'
import { isObject, isObjectStrict } from '../object/object.js'
import { isArray } from '../array/array.js'
import { isStringStrict } from '../string/string.js'
import { isFunction } from '../function/function.js'
import { isNumber } from '../number/number.js'
import { getJsonFile } from '../json/json.js'
import { config } from '../../config/config.js'
import { print } from '../print/print.js'
import { normalizeWordPressData } from './wordpressDataNormal.js'

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

  if (routes[type] !== undefined) {
    return routes[type]
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
  try {
    /* Key required for cache */

    if (!isStringStrict(key)) {
      throw new Error('No key')
    }

    /* Check cache */

    if (config.env.cache) {
      let cacheData: RenderItem[] = []

      const cacheDataFilterArgs = {
        key,
        type: 'get'
      }

      cacheData = await applyFilters('cacheData', cacheData, cacheDataFilterArgs)

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

    params = isObjectStrict(params) ? params : {}

    for (const [key, value] of Object.entries(params)) {
      let val = value

      if (key === 'per_page' && value === -1) {
        val = 100
        loop = true
      }

      url += `&${key}=${val.toString()}`
    }

    if (loop) {
      url += `&page=${_page}`
    }

    /* Check and transform data */

    const resp = await fetch(url, {
      headers: {
        Authorization: `Basic ${btoa(`${user}:${pass}`)}`
      }
    })

    const data = await resp.json() as WordPressDataError | WordPressDataItem | WordPressDataItem[]
    const isObj = isObjectStrict(data)

    /* Check if error */

    const isErr = isObj && data.message !== undefined

    if (!resp.ok || isErr) {
      const message = isObj ? data.message : ''

      throw new Error(isStringStrict(message) ? message : 'Bad request', {
        cause: data
      })
    }

    /* Total */

    const total = resp.headers.get('X-WP-TotalPages')
    const totalNum = isStringStrict(total) ? parseInt(total, 10) : 1
    const totalPages = isNumber(totalNum) ? totalNum : 1

    /* Normalize */

    const dataItems = isArray(data) ? data : [data] as WordPressDataItem[]

    let newData = normalizeWordPressData(dataItems)

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

    /* Store in cache */

    if (config.env.cache) {
      const cacheDataFilterArgs = {
        key,
        type: 'set',
        data
      }

      await applyFilters('cacheData', newData, cacheDataFilterArgs)
    }

    /* Output */

    return newData
  } catch (error) {
    print('[SSF] Error fetching WordPress data', error)

    /* Store in cache (avoid extra calls when no result) */

    if (config.env.cache) {
      const cacheDataFilterArgs = {
        key,
        type: 'set',
        data: []
      }

      await applyFilters('cacheData', [], cacheDataFilterArgs)
    }

    /* Output */

    return []
  }
}

/**
 * Fetch data from all content types or single entry if serverless
 *
 * @param {AllWordPressDataArgs} args
 * @return {Promise<RenderAllData|undefined>}
 */
const getAllWordPressData = async (args?: AllWordPressDataArgs): Promise<RenderAllData | undefined> => {
  try {
    /* Args */

    const argsObj = isObjectStrict(args) ? args : {}

    const {
      serverlessData,
      previewData,
      filterData,
      filterAllData
    } = argsObj

    /* Store all data */

    let allData: RenderAllData = {
      navigation: [],
      navigationItem: [],
      redirect: [],
      content: {
        page: []
      }
    }

    /* Serverless */

    const isServerless = serverlessData !== undefined
    const isPreview = previewData !== undefined

    /* Get single entry data if serverless or preview data */

    let isEntry = false

    if (isServerless || isPreview) {
      let contentType = ''
      let id = ''

      if (isServerless) {
        const slugsData: RenderSlugs | undefined = await getJsonFile('slugs')
        const path = serverlessData.path

        if (slugsData !== undefined) {
          const item = slugsData[path]

          if (isObjectStrict(item)) {
            id = isStringStrict(item.id) ? item.id : ''
            contentType = isStringStrict(item.contentType) ? item.contentType : ''
          }
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

        if (isFunction(filterData)) {
          data = filterData(data, serverlessData, previewData)
        }

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

        if (isFunction(filterData)) {
          data = filterData(data, serverlessData, previewData)
        }

        if (isArray(data)) {
          allData.content[contentType] = data
        }
      }
    }

    /* Filter all data */

    if (isFunction(filterAllData)) {
      allData = filterAllData(allData, serverlessData, previewData)
    }

    /* Output */

    return allData
  } catch (error) {
    print('[SSF] Error getting all WordPress data', error)
  }
}

/* Exports */

export {
  getWordPressData,
  getAllWordPressData
}
