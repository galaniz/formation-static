/**
 * Contentful - Data
 */

/* Imports */

import type {
  ContentfulData,
  ContentfulDataParams,
  ContentfulDataError,
  ContentfulDataItem,
  AllContentfulDataArgs
} from './contentfulDataTypes.js'
import type { RenderAllData, RenderDataMeta, RenderItem } from '../render/renderTypes.js'
import type { CacheData, DataFilterArgs } from '../utils/filter/filterTypes.js'
import resolveResponse from 'contentful-resolve-response'
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
 * @param {ContentfulDataParams} [params]
 * @param {RenderDataMeta} [meta]
 * @return {Promise<RenderItem[]>}
 */
const getContentfulData = async (
  key: string,
  params?: ContentfulDataParams,
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
      const { total, limit, skip } = cacheMeta

      meta.total = total
      meta.limit = limit
      meta.skip = skip
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

  if (isObjectStrict(params)) {
    for (const [key, value] of Object.entries(params)) {
      url += `&${key}=${value.toString()}`
    }
  }

  /* Request */

  const resp = await fetch(url)
  const data: ContentfulData | ContentfulDataError = await resp.json()

  /* Check if error */

  if (!resp.ok) {
    const message =
      isStringStrict((data as ContentfulDataError).message) ? (data as ContentfulDataError).message : 'Bad fetch response'

    throw new Error(message, { cause: data })
  }

  /* Total */

  if (hasMeta) {
    const { total, limit, skip } = data as ContentfulData

    meta.total = total
    meta.limit = limit
    meta.skip = skip
  }

  /* Normalize */

  const resolvedData = resolveResponse(data) as ContentfulDataItem[]
  const newData = normalizeContentfulData(resolvedData)

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
 * @param {AllContentfulDataArgs} [args]
 * @return {Promise<RenderAllData|undefined>}
 */
const getAllContentfulData = async (args?: AllContentfulDataArgs): Promise<RenderAllData | undefined> => {
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
  const contentfulDataFilterArgs: DataFilterArgs = {
    serverlessData,
    previewData
  }

  /* Locale */

  const cmsLocales = config.cms.locales || []
  const defaultLocale = cmsLocales[0]
  const paramLocales = isPreview ? [] : [...cmsLocales]

  if (paramLocales.length === 0) { // At least one param locale required
    paramLocales.push('')
  }

  /* Single entry data if serverless or preview data */

  if (isServerless || isPreview) {
    let contentType = ''
    let id = ''
    let locale: string | undefined

    if (isServerless) {
      const slugs = getStoreItem('slugs')
      const path = serverlessData.path
      const item = slugs[path]

      if (isObjectStrict(item)) {
        id = isStringStrict(item.id) ? item.id : ''
        contentType = isStringStrict(item.contentType) ? item.contentType : ''
        locale = isStringStrict(item.locale) ? item.locale : ''
      }
    }

    if (isPreview) {
      id = previewData.id
      contentType = previewData.contentType
      locale = previewData.locale
    }

    if (id) {
      const key = `serverless_${id}_${contentType}`
      const params: ContentfulDataParams = {
        content_type: contentType,
        'sys.id': id,
        include: 10
      }

      if (locale && locale !== defaultLocale) {
        params.locale = locale
        paramLocales[0] = locale
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
      const key = `all_${contentType}`
      let data: RenderItem[] = []

      for (const locale of paramLocales) {
        const params: ContentfulDataParams = {
          content_type: contentType
        }

        if (locale && locale !== defaultLocale) {
          params.locale = locale
        }

        let newData = await getContentfulData(key, params)

        newData = applyFilters('contentfulData', newData, contentfulDataFilterArgs)

        if (isArray(newData)) {
          data = [
            ...data,
            ...newData
          ]
        }
      }

      allData[contentType] = data
    }
  }

  /* Whole data (render items) - not serverless or preview */

  if (!isServerless && !isPreview) {
    const whole = config.wholeTypes

    for (const contentType of whole) {
      const key = `all_${contentType}`
      let data: RenderItem[] = []

      for (const locale of paramLocales) {
        const params: ContentfulDataParams = {
          content_type: contentType,
          include: 10
        }

        if (locale && locale !== defaultLocale) {
          params.locale = locale
        }

        let newData = await getContentfulData(key, params)

        newData = applyFilters('contentfulData', newData, contentfulDataFilterArgs)

        if (isArray(newData)) {
          data = [
            ...data,
            ...newData
          ]
        }
      }

      allData.content[contentType] = data
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
