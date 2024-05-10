/**
 * Utils - Get All Contentful Data
 */

/* Imports */

import type { AllContentfulDataArgs } from './getAllContentfulDataTypes'
import type { RenderAllData, RenderSlugs } from '../../render/renderTypes'
import { config } from '../../config/config'
import { getContentfulData } from '../getContentfulData/getContentfulData'
import { isArray } from '../isArray/isArray'
import { isObjectStrict } from '../isObject/isObject'
import { isStringStrict } from '../isString/isString'
import { isFunction } from '../isFunction/isFunction'
import { getJsonFile } from '../getJson/getJson'
import { getPath } from '../getPath/getPath'

/**
 * Function - fetch data from all content types or single entry if serverless
 *
 * @param {import('./getAllContentfulDataTypes').AllContentfulDataArgs} args
 * @return {Promise<import('../../render/RenderTypes').RenderAllData|undefined>}
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
        const slugsData: RenderSlugs | undefined = await getJsonFile(getPath('slugs', 'store'))
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

      for (let i = 0; i < partial.length; i += 1) {
        const contentType = partial[i]

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

      for (let i = 0; i < whole.length; i += 1) {
        const contentType = whole[i]

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
    console.error(config.console.red, '[SSF] Error getting all Contentful data: ', error)
  }
}

/* Exports */

export { getAllContentfulData }
