/**
 * Utils - File Data
 */

/* Imports */

import type {
  FileDataParams,
  FileDataReturn,
  AllFileDataArgs
} from './fileDataTypes.js'
import type { RenderItem, RenderAllData } from '../../render/renderTypes.js'
import type { Generic } from '../../global/globalTypes.js'
import type { ImagesStore } from '../image/imageTypes.js'
import { readdir, readFile } from 'node:fs/promises'
import { extname, basename, resolve } from 'node:path'
import { applyFilters } from '../filter/filter.js'
import { isObject, isObjectStrict } from '../object/object.js'
import { isStringStrict } from '../string/string.js'
import { getJson } from '../json/json.js'
import { print } from '../print/print.js'
import { config } from '../../config/config.js'
import { resolveInternalLinks, undefineProps } from './fileDataNormal.js'
import { isArray } from '../array/array.js'
import { isFunction } from '../function/function.js'

/**
 * Get data from file or cache
 *
 * @param {string} key
 * @param {FileDataParams} params
 * @return {Promise<FileDataReturn>}
 */
const getFileData = async (
  key: string = '',
  params: FileDataParams = {}
): Promise<FileDataReturn> => {
  try {
    /* Key required for cache */

    if (!isStringStrict(key)) {
      throw new Error('No key')
    }

    /* Check cache */

    if (config.env.cache) {
      let cacheData: FileDataReturn = {}

      const cacheDataFilterArgs = {
        key,
        type: 'get'
      }

      cacheData = await applyFilters('cacheData', cacheData, cacheDataFilterArgs)

      if (isObject(cacheData) && Object.keys(cacheData).length > 0) {
        return structuredClone(cacheData)
      }
    }

    /* Params */

    const { all = true, id = '' } = params

    /* Store data */

    const data: FileDataReturn = {}

    /* Single file */

    if (isStringStrict(id) && !all) {
      const file = await readFile(resolve(config.staticDir, `${id}.json`), { encoding: 'utf8' })
      const fileJson: RenderItem | undefined = getJson(file)

      if (fileJson !== undefined) {
        data[id] = fileJson
      }
    }

    /* All files */

    if (!isStringStrict(id) && all) {
      const files = await readdir(resolve(config.staticDir))

      for (const file of files) {
        const fileExt = extname(file)
        const fileName = basename(file, fileExt)

        if (fileExt === '.json') {
          const fileContents = await readFile(resolve(config.staticDir, file), { encoding: 'utf8' })
          const fileJson: RenderItem | undefined = getJson(fileContents)

          if (fileJson !== undefined) {
            data[fileName] = fileJson
          }
        }
      }
    }

    /* Data not empty check */

    if (Object.keys(data).length === 0) {
      throw new Error('No file data')
    }

    /* Store in cache */

    if (config.env.cache) {
      const cacheDataFilterArgs = {
        key,
        type: 'set',
        data
      }

      await applyFilters('cacheData', data, cacheDataFilterArgs)
    }

    /* Output */

    return data
  } catch (error) {
    print('[SSF] Error getting file data', error)

    return {}
  }
}

/**
 * Get data from file system
 *
 * @param {AllFileDataArgs} args
 * @return {Promise<RenderAllData|undefined>}
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

    if (isStringStrict(config.image.dataFile)) {
      const imageDataContents = await readFile(resolve(config.image.dataFile), { encoding: 'utf8' })
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
    print('[SSF] Error getting all file data', error)

    /* Output */

    return undefined
  }
}

/* Exports */

export {
  getFileData,
  getAllFileData
}
