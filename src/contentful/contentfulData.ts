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
import type { RenderAllData, RenderData, RenderItem } from '../render/renderTypes.js'
import type { CacheData, CacheDataFilterArgs, DataFilterArgs } from '../filters/filtersTypes.js'
import resolveResponse from 'contentful-resolve-response'
import { applyFilters } from '../filters/filters.js'
import { isObject, isObjectStrict } from '../utils/object/object.js'
import { isStringSafe, isStringStrict } from '../utils/string/string.js'
import { isNumber } from '../utils/number/number.js'
import { config } from '../config/config.js'
import { getStoreItem } from '../store/store.js'
import { normalizeContentfulData } from './contentfulDataNormal.js'

/**
 * Fetch data from Contentful CMS or cache.
 *
 * @param {string} key
 * @param {ContentfulDataParams} [params]
 * @return {Promise<RenderData>}
 */
const getContentfulData = async (key: string, params?: ContentfulDataParams): Promise<RenderData> => {
  /* Key required for cache */

  if (!isStringStrict(key)) {
    throw new Error('No key')
  }

  /* Check cache */

  const hasCache = config.env.cache

  if (hasCache) {
    const cacheDataFilterArgs = {
      key,
      type: 'get'
    }

    const cacheData = await applyFilters('cacheData', undefined as CacheData | undefined, cacheDataFilterArgs, true)

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

  const urlObj = new URL(`https://${host}/spaces/${space}/environments/${env}/entries?access_token=${accessToken}`)
  let loop = false
  let skip = 0
  let limit = 0
  const maxLimit = 100

  if (isObjectStrict(params)) {
    for (const [key, value] of Object.entries(params)) {
      let val = value

      if (key === 'limit' && isNumber(val)) {
        loop = val === -1
        limit = loop ? maxLimit : val
        val = limit
      }

      if (key === 'skip' && isNumber(val)) {
        skip = val
      }

      urlObj.searchParams.set(key, val.toString())
    }
  }

  /* Request - loop through entries by skip if limit is -1 */

  const newItems: RenderItem[] = []
  const rawData: ContentfulData[] = []
  let initData: ContentfulData | undefined
  let nextSkip = skip
  let total = 0

  do {
    if (loop) {
      urlObj.searchParams.set('skip', nextSkip.toString())
    }

    const resp = await fetch(urlObj.toString())
    const data = await resp.json() as ContentfulData | ContentfulDataError

    /* Check if error */

    if (!resp.ok) {
      const message =
        isStringStrict((data as ContentfulDataError).message) ? (data as ContentfulDataError).message : 'Bad fetch response'

      throw new Error(message, { cause: data })
    }

    /* Total */

    if (!initData) {
      initData = data as ContentfulData
      total = initData.total
      limit = initData.limit
      skip = initData.skip
    }

    if (hasCache) {
      rawData.push(data as ContentfulData)
    }

    /* Normalize */

    const resolvedData = resolveResponse(data) as ContentfulDataItem[]

    newItems.push(...normalizeContentfulData(resolvedData))

    nextSkip += limit
  } while (loop && limit > 0 && nextSkip < total)

  /* Full data */

  const newData = {
    items: newItems,
    total,
    limit,
    skip
  }

  /* Add to cache */

  if (hasCache) {
    const cacheDataFilterArgs: CacheDataFilterArgs<ContentfulData[]> = {
      key,
      type: 'set',
      rawData
    }

    await applyFilters('cacheData', newData, cacheDataFilterArgs, true)
  }

  /* Output */

  return newData
}

/**
 * Fetch data from all content types or single entry if serverless.
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

      if (item) {
        const [itemId, itemContentType, itemLocale] = item

        id = itemId || ''
        contentType = itemContentType || ''
        locale = itemLocale || ''
      }
    }

    if (isPreview) {
      id = previewData.id
      contentType = previewData.contentType
      locale = previewData.locale
    }

    if (id && isStringSafe(contentType)) {
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
      let { items } = data

      items = applyFilters('contentfulData', items, {
        ...contentfulDataFilterArgs,
        contentType
      })

      allData.content[contentType] = items
    }
  }

  /* Partial data - not serverless */

  if (!isServerless) {
    const partial = config.partialTypes.filter(type => isStringSafe(type))

    for (const contentType of partial) {
      let newItems: RenderItem[] = []

      for (const locale of paramLocales) {
        let key = `all_${contentType}`
        const params: ContentfulDataParams = {
          content_type: contentType,
          limit: -1
        }

        if (locale && locale !== defaultLocale) {
          key += `_${locale}`
          params.locale = locale
        }

        const newData = await getContentfulData(key, params)
        let { items } = newData

        items = applyFilters('contentfulData', items, {
          ...contentfulDataFilterArgs,
          contentType
        })

        newItems = [
          ...newItems,
          ...items
        ]
      }

      allData[contentType] = newItems
    }
  }

  /* Whole data (render items) - not serverless or preview */

  if (!isServerless && !isPreview) {
    const whole = config.wholeTypes.filter(type => isStringSafe(type))

    for (const contentType of whole) {
      let newItems: RenderItem[] = []

      for (const locale of paramLocales) {
        let key = `all_${contentType}`
        const params: ContentfulDataParams = {
          content_type: contentType,
          include: 10,
          limit: -1
        }

        if (locale && locale !== defaultLocale) {
          key += `_${locale}`
          params.locale = locale
        }

        const newData = await getContentfulData(key, params)
        let { items } = newData

        items = applyFilters('contentfulData', items, {
          ...contentfulDataFilterArgs,
          contentType
        })

        newItems = [
          ...newItems,
          ...items
        ]
      }

      allData.content[contentType] = newItems
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
