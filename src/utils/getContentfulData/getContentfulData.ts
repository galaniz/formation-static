/**
 * Utils - Get Contentful Data
 */

/* Imports */

import type { ContentfulDataParams, ContentfulData, ContentfulDataReturn } from './getContentfulDataTypes'
import resolveResponse from 'contentful-resolve-response'
import { normalizeContentfulData } from '../normalizeContentfulData/normalizeContentfulData'
import { applyFilters } from '../filters/filters'
import { isObject, isObjectStrict } from '../isObject/isObject'
import { isStringStrict } from '../isString/isString'
import { config } from '../../config/config'

/**
 * Function - fetch data from contentful cms or cache
 *
 * @param {string} key
 * @param {import('./getContentfulDataTypes').ContentfulDataParams} params
 * @return {Promise<import('./getContentfulDataTypes').ContentfulDataReturn>}
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
      previewAccessToken,
      deliveryAccessToken,
      previewHost,
      deliveryHost
    } = config.cms

    let accessToken = previewAccessToken
    let host = previewHost

    if (config.env.prod) {
      accessToken = deliveryAccessToken
      host = deliveryHost
    }

    if (!isStringStrict(space) || !isStringStrict(accessToken) || !isStringStrict(host)) {
      throw new Error('No credentials')
    }

    /* Params */

    let url = `https://${host}/spaces/${space}/environments/master/entries?access_token=${accessToken}`

    Object.keys(params).forEach(p => {
      url += `&${p}=${params[p].toString()}`
    })

    /* Check and transform data */

    const resp = await fetch(url)
    const data: ContentfulData = await resp.json()

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
    console.error(config.console.red, '[SSF] Error fetching Contentful data: ', error)

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

/* Exports */

export { getContentfulData }
