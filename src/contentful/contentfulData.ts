/**
 * Contentful - Data
 */

/* Imports */

import type { ContentfulDataParams, ContentfulData, AllContentfulDataArgs } from './contentfulDataTypes.js'
import type { RenderAllData, RenderDataMeta, RenderItem } from '../render/renderTypes.js'
import type { CacheData, DataFilterArgs } from '../utils/filter/filterTypes.js'
import resolveResponse from 'contentful-resolve-response'
import { ResponseError } from '../utils/ResponseError/ResponseError.js'
import { applyFilters } from '../utils/filter/filter.js'
import { isObjectStrict } from '../utils/object/object.js'
import { isStringStrict } from '../utils/string/string.js'
import { isArray } from '../utils/array/array.js'
import { config } from '../config/config.js'
import { getStoreItem } from '../store/store.js'
import { normalizeContentfulData } from './contentfulDataNormal.js'

/**
 * Fetch data from contentful cms or cache
 *
 * @param {string} key
 * @param {ContentfulDataParams} params
 * @param {RenderDataMeta} [meta]
 * @return {Promise<RenderItem[]>}
 */
const getContentfulData = async (
  key: string,
  params: ContentfulDataParams,
  meta?: RenderDataMeta
): Promise<RenderItem[]> => {
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
      meta.total = cacheMeta.total
    }

    if (isArray(cacheItems)) {
      return structuredClone(cacheItems)
    }
  }

  /* Credentials */

  const {
    space,
    devCredential,
    prodCredential,
    devHost,
    prodHost,
    env = 'master'
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

  let url = `https://${host}/spaces/${space}/environments/${env}/entries?access_token=${accessToken}`

  for (const [key, value] of Object.entries(params)) {
    url += `&${key}=${value.toString()}`
  }

  /* Request */

  const resp = await fetch(url)

  if (!resp.ok) {
    throw new ResponseError('Bad fetch response', resp)
  }

  const data: ContentfulData = await resp.json()

  /* Total */

  if (hasMeta) {
    meta.total = data.total
  }

  /* Normalize */

  const resolvedData = resolveResponse(data) as ContentfulData
  const newData = normalizeContentfulData(resolvedData.items)

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
 * @param {AllContentfulDataArgs} args
 * @return {Promise<RenderAllData|undefined>}
 */
const getAllContentfulData = async (
  args: AllContentfulDataArgs = {}
): Promise<RenderAllData | undefined> => {
  /* All data */

  const {
    serverlessData,
    previewData
  } = args

  let allData: RenderAllData = {
    navigationItem: [],
    navigation: [],
    redirect: [],
    content: {
      page: []
    }
  }

  /* Serverless */

  const isServerless = serverlessData != null
  const isPreview = previewData != null
  const contentfulDataFilterArgs: DataFilterArgs = {
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
      const params = {
        'sys.id': id,
        include: 10
      }

      const data = await getContentfulData(key, params)

      if (isArray(data)) {
        allData.content[contentType] = data
      }
    }
  }

  /* Partial data - not serverless */

  if (!isServerless) {
    const partial = config.partialTypes

    for (const contentType of partial) {
      allData[contentType] = []

      const key = `all_${contentType}`
      const params = {
        content_type: contentType
      }

      let data = await getContentfulData(key, params)

      data = applyFilters('contentfulData', data, contentfulDataFilterArgs)

      if (isArray(data)) {
        allData[contentType] = data
      }
    }
  }

  /* Whole data (render items) - not serverless or preview */

  if (!isServerless && !isPreview) {
    const whole = config.wholeTypes

    for (const contentType of whole) {
      allData.content[contentType] = []

      const key = `all_${contentType}`
      const params = {
        content_type: contentType,
        include: 10
      }

      let data = await getContentfulData(key, params)

      data = applyFilters('contentfulData', data, contentfulDataFilterArgs)

      if (isArray(data)) {
        allData.content[contentType] = data
      }
    }
  }

  /* Filter all data */

  allData = applyFilters('allData', allData, {
    type: 'contentful',
    serverlessData,
    previewData
  })

  /* Output */

  return allData
}

/* Exports */

export {
  getContentfulData,
  getAllContentfulData
}
