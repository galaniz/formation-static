/**
 * Utils - Get All Data
 */

/* Imports */

import type { AllFileDataArgs } from './getAllFileDataTypes'
import type { Generic } from '../../global/globalTypes'
import type { RenderAllData } from '../../render/renderTypes'
import type { ImagesStore } from '../processImages/processImagesTypes'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { config } from '../../config/config'
import { getFileData } from '../getFileData/getFileData'
import { getJson } from '../getJson/getJson'
import { undefineProps } from '../undefineProps/undefineProps'
import { resolveInternalLinks } from '../resolveInternalLinks/resolveInternalLinks'
import { isObjectStrict } from '../isObject/isObject'
import { isStringStrict } from '../isString/isString'
import { isArray } from '../isArray/isArray'
import { isFunction } from '../isFunction/isFunction'

/**
 * Function - get data from file system
 *
 * @param {import('./getAllFileDataTypes').AllFileDataArgs} args
 * @return {Promise<import('../../render/RenderTypes').RenderAllData|undefined>}
 */
const getAllFileData = async (args: AllFileDataArgs): Promise<RenderAllData | undefined> => {
  args = isObjectStrict(args) ? args : {}

  const {
    resolveProps = {
      image: ['image'],
      data: ['items', 'internalLink', 'parent']
    },
    excludeProps = {
      data: ['content'],
      archive: {
        posts: ['content'],
        terms: ['content']
      }
    },
    filterData,
    filterAllData
  } = args

  try {
    /* Get data */

    let data = await getFileData('all_file_data', { all: true })

    /* Store all data */

    let allData: RenderAllData = {
      navigation: [],
      navigationItem: [],
      redirect: [],
      content: {
        page: []
      }
    }

    config.partialTypes.forEach((contentType) => {
      allData[contentType] = []
    })

    config.wholeTypes.forEach((contentType) => {
      allData.content[contentType] = []
    })

    /* Data must be non empty object */

    if (!isObjectStrict(data) || Object.keys(data).length === 0) {
      throw new Error('No file data')
    }

    /* Image data */

    let imageData = {}

    if (isStringStrict(config.static.image.dataFile)) {
      const imageDataContents = await readFile(resolve(config.static.image.dataFile), { encoding: 'utf8' })
      const imageDataJson: ImagesStore | undefined = getJson(imageDataContents)

      if (imageDataJson !== undefined) {
        imageData = imageDataJson
      }
    }

    resolveInternalLinks(imageData, data, resolveProps.image)

    /* Id */

    Object.keys(data).forEach((d) => {
      const dataItem = data[d]

      if (isObjectStrict(dataItem)) {
        const { contentType } = dataItem

        if (isStringStrict(contentType)) {
          dataItem.id = d
        }
      }
    })

    /* Internal props */

    resolveProps.data.forEach((d) => {
      resolveInternalLinks(data, data, [d], (prop: string, value: Generic) => {
        if (resolveProps.data.includes(prop)) {
          const newValue = undefineProps(value, excludeProps.data)

          return newValue
        }

        return value
      })
    })

    /* Filter data */

    if (isFunction(filterData)) {
      data = filterData(data)
    }

    /* Empty archive data */

    const archivePosts: any = {}
    // const archiveTerms: any = {}

    /* Set content */

    Object.keys(data).forEach((d) => {
      const dataItem = data[d]

      if (!isObjectStrict(dataItem)) {
        return
      }

      const { contentType } = dataItem

      if (!isStringStrict(contentType)) {
        return
      }

      const partial = allData[contentType]

      if (isArray(partial)) {
        partial.push(dataItem)
      }

      const whole = allData.content[contentType]

      if (isArray(whole)) {
        whole.push(dataItem)
      }

      /* Archive */

      if (config.archiveMeta[contentType] !== undefined) {
        const dataItemCopy = undefineProps(dataItem, excludeProps.archive.posts)

        if (archivePosts[contentType] === undefined) {
          archivePosts[contentType] = []
        }

        archivePosts[contentType].push(dataItemCopy)
      }
    })

    /* Term content */

    /*
    Object.keys(config.contentTypes.taxonomy).forEach((tax) => {
      const { contentTypes, props } = config.contentTypes.taxonomy[tax]

      if (archiveTerms.terms[tax] === undefined) {
        archiveTerms.terms[tax] = {}
      }

      contentTypes.forEach((ct, i) => {
        const contentData = allData.content[ct]

        if (isArrayStrict(contentData)) {
          if (archiveTerms.terms[tax][ct] === undefined) {
            archiveTerms.terms[tax][ct] = {}
          }

          contentData.forEach((cd) => {
            const prop = props[i]
            const terms = cd[prop] as Generic[]
            const dataCopy = undefineProps(cd, excludeProps.archive.terms)

            if (isArrayStrict(terms)) {
              terms.forEach((term) => {
                if (!isObjectStrict(term)) {
                  return
                }

                const termId = term.id

                if (!isStringStrict(termId)) {
                  return
                }

                if (archiveTerms[tax][ct][termId] === undefined) {
                  archiveTerms[tax][ct][termId] = []
                }

                const archiveTaxContentTypeTerm = archiveTerms[tax][ct][termId]

                if (isArray(archiveTaxContentTypeTerm)) {
                  archiveTaxContentTypeTerm.push(dataCopy)
                }
              })
            }
          })
        }
      })
    })
    */

    /* Filter all data */

    if (isFunction(filterAllData)) {
      allData = filterAllData(allData)
    }

    /* Output */

    return allData
  } catch (error) {
    console.error(config.console.red, '[SSF] Error getting all file data: ', error)

    /* Output */

    return undefined
  }
}

/* Exports */

export { getAllFileData }
