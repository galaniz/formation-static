/**
 * Utils - Contentful Data
 */

/* Imports */

import type {
  ContentfulDataParams,
  ContentfulData,
  AllContentfulDataArgs
} from './contentfulDataTypes.js'
import type { RenderAllData, RenderItem } from '../render/renderTypes.js'
import resolveResponse from 'contentful-resolve-response'
import { ResponseError } from '../utils/ResponseError/ResponseError.js'
import { applyFilters } from '../utils/filter/filter.js'
import { isObject, isObjectStrict } from '../utils/object/object.js'
import { isStringStrict } from '../utils/string/string.js'
import { isFunction } from '../utils/function/function.js'
import { isArray } from '../utils/array/array.js'
import { print } from '../utils/print/print.js'
import { config } from '../config/config.js'
import { fetchStoreItem } from '../store/store.js'
import { normalizeContentfulData } from './contentfulDataNormal.js'

/**
 * Fetch data from contentful cms or cache
 *
 * @param {string} key
 * @param {ContentfulDataParams} params
 * @return {Promise<RenderItem[]>}
 */
const getContentfulData = async (
  key: string = '',
  params: ContentfulDataParams = {}
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

      cacheData = await applyFilters('cacheData', cacheData, cacheDataFilterArgs, true)

      if (isObject(cacheData)) {
        return structuredClone(cacheData)
      }
    }

    /* Credentials */

    const {
      space,
      devCredential,
      prodCredential,
      devHost,
      prodHost
    } = config.cms

    let accessToken = devCredential
    let host = devHost

    if (config.env.prod) {
      accessToken = prodCredential
      host = prodHost
    }

    if (!isStringStrict(space) || !isStringStrict(accessToken) || !isStringStrict(host)) {
      throw new Error('No credentials')
    }

    /* Params */

    let url = `https://${host}/spaces/${space}/environments/master/entries?access_token=${accessToken}`

    for (const [key, value] of Object.entries(params)) {
      url += `&${key}=${value.toString()}`
    }

    /* Check and transform data */

    const resp = await fetch(url)
    const data = await resp.json() as ContentfulData | undefined

    if (!resp.ok) {
      throw new ResponseError('Bad fetch response', resp)
    }

    const resolvedData = resolveResponse(data)
    const newData = normalizeContentfulData(resolvedData.items)

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
  } catch (error) {
    print('[SSF] Error fetching Contentful data', error)

    /* Add to cache (avoid extra calls when no result) */

    if (config.env.cache) {
      const cacheDataFilterArgs = {
        key,
        type: 'set',
        data: []
      }

      await applyFilters('cacheData', [], cacheDataFilterArgs, true)
    }

    /* Output */

    return []
  }
}

/**
 * Fetch data from all content types or single entry if serverless
 *
 * @param {AllContentfulDataArgs} args
 * @return {Promise<RenderAllData|undefined>}
 */
const getAllContentfulData = async (
  args: AllContentfulDataArgs = {}
): Promise<RenderAllData | undefined> => {
  try {
    /* All data */

    const {
      serverlessData,
      previewData,
      filterData,
      filterAllData
    } = args

    let allData: RenderAllData = {
      navigation: [],
      navigationItem: [],
      redirect: [],
      content: {
        page: []
      }
    }

    /* Serverless */

    const isServerless = serverlessData != null
    const isPreview = previewData != null

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
        const params = {
          'sys.id': id,
          include: 10
        }

        const data = await getContentfulData(key, params)

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
        const params = {
          content_type: contentType
        }

        let data = await getContentfulData(key, params)

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
        const params = {
          content_type: contentType,
          include: 10
        }

        let data = await getContentfulData(key, params)

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
    print('[SSF] Error getting all Contentful data', error)
  }
}

/* Exports */

export {
  getContentfulData,
  getAllContentfulData
}
