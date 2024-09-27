/**
 * Utils - WordPress Data
 */

/* Imports */

import type {
  WordPressDataError,
  WordPressDataItem,
  WordPressDataParams,
  WordPressDataReturn
} from './wordpressDataTypes.js'
import { applyFilters } from '../filter/filter.js'
import { isObject } from '../object/object.js'
import { isArrayStrict } from '../array/array.js'
import { isStringStrict } from '../string/string.js'
import { config } from '../../config/config.js'
import { print } from '../print/print.js'
import { normalizeWordPressData } from './wordpressDataNormal.js'

/**
 * Fetch data from wordpress cms or cache
 *
 * @param {string} key
 * @param {string} route
 * @param {WordPressDataParams} params
 * @return {Promise<WordPressDataReturn>}
 */
const getWordPressData = async (
  key: string = '',
  route: string = '',
  params: WordPressDataParams = {}
): Promise<WordPressDataReturn> => {
  try {
    /* Key required for cache */

    if (!isStringStrict(key)) {
      throw new Error('No key')
    }

    /* Check cache */

    if (config.env.cache) {
      let cacheData: WordPressDataReturn = {}

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
      prodHost
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

    let url = `https://${host}/wp-json/wp/v2/${route}?_embed&status=${status}`

    for (const [key, value] of Object.entries(params)) {
      url += `&${key}=${value.toString()}`
    }

    /* Check and transform data */

    const resp = await fetch(url, {
      headers: {
        Authorization: `Basic ${btoa(`${user}:${pass}`)}`
      }
    })

    const data = await resp.json() as WordPressDataError | WordPressDataItem[]

    /* Check if error */

    if (!isArrayStrict(data)) {
      throw new Error(data.message, { cause: data })
    }

    /* Normalize */

    const newItems = normalizeWordPressData(data)

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
    print('[SSF] Error fetching WordPress data', error)

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

export { getWordPressData }
