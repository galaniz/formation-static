/**
 * Utils - Contentful Data
 */

/* Imports */

import type {
  ContentfulDataParams,
  ContentfulData,
  ContentfulDataReturn,
  AllContentfulDataArgs
} from './contentfulDataTypes.js'
import type { RenderAllData, RenderSlugs } from '../../render/renderTypes.js'
import resolveResponse from 'contentful-resolve-response'
import { normalizeContentfulData } from './contentfulDataNormal.js'
import { applyFilters } from '../filter/filter.js'
import { isObject, isObjectStrict } from '../object/object.js'
import { isStringStrict } from '../string/string.js'
import { isFunction } from '../function/function.js'
import { isArray } from '../array/array.js'
import { print } from '../print/print.js'
import { config } from '../../config/config.js'
import { getJsonFile } from '../json/json.js'

/**
 * Fetch data from contentful cms or cache
 *
 * @param {string} key
 * @param {ContentfulDataParams} params
 * @return {Promise<ContentfulDataReturn>}
 */
const getContentfulData = async (
  key: string = '',
  params: ContentfulDataParams = {}
): Promise<ContentfulDataReturn> => {
  try {
    /* Key required for cache */

    if (!isStringStrict(key)) {
      throw new Error('No key')
    }

    /* Check cache */

    if (config.env.cache) {
      let cacheData: ContentfulDataReturn = {}

      const cacheDataFilterArgs = {
        key,
        type: 'get'
      }

      cacheData = await applyFilters('cacheData', cacheData, cacheDataFilterArgs)

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

    if (!isObjectStrict(data)) {
      throw new Error('No data')
    }

    if (data.items === undefined) {
      throw new Error('No items')
    }

    data.items = resolveResponse(data)

    const newItems = normalizeContentfulData(data.items !== undefined ? data.items : [])

    const newData = {
      items: newItems
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
    print('[SSF] Error fetching Contentful data', error)

    /* Store in cache (avoid extra calls when no result) */

    if (config.env.cache) {
      const cacheDataFilterArgs = {
        key,
        type: 'set',
        data: {}
      }

      await applyFilters('cacheData', {}, cacheDataFilterArgs)
    }

    /* Output */

    return {}
  }
}

/**
 * Fetch data from all content types or single entry if serverless
 *
 * @param {AllContentfulDataArgs} args
 * @return {Promise<RenderAllData|undefined>}
 */
const getAllContentfulData = async (args: AllContentfulDataArgs = {}): Promise<RenderAllData | undefined> => {
  const {
    serverlessData,
    previewData,
    filterData,
    filterAllData
  } = args

  try {
    /* Store all data */

    let allData: RenderAllData = {
      navigation: [],
      navigationItem: [],
      redirect: [],
      content: {
        page: []
      }
    }

    /* Get single entry data if serverless or preview data */

    let isEntry = false

    if (serverlessData !== undefined || previewData !== undefined) {
      let contentType = ''
      let id = ''

      if (serverlessData !== undefined) {
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

      if (previewData !== undefined) {
        id = previewData.id
        contentType = previewData.contentType
      }

      if (id !== '') {
        const key = `serverless_${id}`
        const params = {
          'sys.id': id,
          include: 10
        }

        const data = await getContentfulData(key, params)

        if (isArray(data.items)) {
          isEntry = true
          allData.content[contentType] = data.items
        }
      }
    }

    /* Get partial data - not serverless */

    if (serverlessData === undefined || !isEntry) {
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

        if (isArray(data.items)) {
          allData[contentType] = data.items
        }
      }
    }

    /* Get whole data (for page generation) - not serverless or preview */

    if ((serverlessData === undefined && previewData === undefined) || !isEntry) {
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

        if (isArray(data.items)) {
          allData.content[contentType] = data.items
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
