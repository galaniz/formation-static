/**
 * Local - Data
 */

/* Imports */

import type { LocalData, LocalDataParams, AllLocalDataArgs } from './localDataTypes.js'
import type { RenderItem, RenderAllData } from '../render/renderTypes.js'
import type { AllDataFilterArgs } from '../utils/filter/filterTypes.js'
import { readdir, readFile } from 'node:fs/promises'
import { extname, basename, resolve } from 'node:path'
import { applyFilters } from '../utils/filter/filter.js'
import { getStoreItem } from '../store/store.js'
import { isObject, isObjectStrict } from '../utils/object/object.js'
import { isStringStrict } from '../utils/string/string.js'
import { isArray } from '../utils/array/array.js'
import { getJson } from '../utils/json/json.js'
import { config } from '../config/config.js'
import { resolveInternalLinks, undefineProps } from './localDataNormal.js'

/**
 * Get data from file or cache
 *
 * @param {string} key
 * @param {LocalDataParams} params
 * @return {Promise<LocalData | null>}
 */
const getLocalData = async (
  key: string = '',
  params: LocalDataParams = {}
): Promise<LocalData | null> => {
  /* Key required for cache */

  if (!isStringStrict(key)) {
    throw new Error('No key')
  }

  /* Check cache */

  if (config.env.cache) {
    const cacheDataFilterArgs = {
      key,
      type: 'get'
    }

    const cacheData = await applyFilters('cacheData', undefined as LocalData | undefined, cacheDataFilterArgs, true)

    if (isObject(cacheData)) {
      return structuredClone(cacheData)
    }
  }

  /* Directory */

  const dir = config.local.dir

  /* Params */

  const { all = true, id = '' } = params

  /* Data */

  const data: LocalData = {}
  let hasData = false

  /* Single file */

  if (isStringStrict(id) && !all) {
    const file = await readFile(resolve(dir, `${id}.json`), { encoding: 'utf8' })
    const fileJson: RenderItem | undefined = getJson(file)

    if (fileJson != null) {
      data[id] = fileJson
      hasData = true
    }
  }

  /* All files */

  if (!isStringStrict(id) && all) {
    const files = await readdir(resolve(dir))

    for (const file of files) {
      const fileExt = extname(file)
      const fileName = basename(file, fileExt)

      if (fileExt === '.json') {
        const fileContents = await readFile(resolve(dir, file), { encoding: 'utf8' })
        const fileJson: RenderItem | undefined = getJson(fileContents)

        if (fileJson != null) {
          data[fileName] = fileJson
          hasData = true
        }
      }
    }
  }

  /* Data not empty check */

  if (!hasData) {
    throw new Error('No file data')
  }

  /* Add to cache */

  if (config.env.cache) {
    const cacheDataFilterArgs = {
      key,
      type: 'set',
      data
    }

    await applyFilters('cacheData', data, cacheDataFilterArgs, true)
  }

  /* Output */

  return data
}

/**
 * Get data from file system
 *
 * @param {AllLocalDataArgs} args
 * @return {Promise<RenderAllData|undefined>}
 */
const getAllLocalData = async (
  args: AllLocalDataArgs
): Promise<RenderAllData | undefined> => {
  /* Args */

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
    }
  } = args

  /* Get data */

  let data = await getLocalData('all_file_data', { all: true })

  /* Data must be object */

  if (!isObjectStrict(data)) {
    throw new Error('No file data')
  }

  /* All data */

  let allData: RenderAllData = {
    navigationItem: [],
    navigation: [],
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

  /* Image data */

  const imageMeta = getStoreItem('imageMeta')

  resolveInternalLinks(imageMeta, data, resolveProps.image)

  /* Set id */

  Object.entries(data).forEach(([key, item]) => {
    if (!isObjectStrict(item)) {
      return
    }

    const { contentType } = item

    if (isStringStrict(contentType)) {
      item.id = key
    }
  })

  /* Internal props */

  resolveProps.data.forEach((d) => {
    resolveInternalLinks(data, data, [d], (prop, value) => {
      if (resolveProps.data.includes(prop as string)) {
        const newValue = undefineProps(value, excludeProps.data)

        return newValue
      }

      return value
    })
  })

  /* Filter data */

  data = applyFilters('localData', data)

  /* Empty archive data */

  const archivePosts: Record<string, RenderItem[]> = {}
  // const archiveTerms: Record<string, Record<string, RenderItem[]>> = {}

  /* Set content */

  Object.entries(data).forEach(([, item]) => {
    if (!isObjectStrict(item)) {
      return
    }

    const { contentType } = item

    if (!isStringStrict(contentType)) {
      return
    }

    const partial = allData[contentType]

    if (isArray(partial)) {
      partial.push(item)
    }

    const whole = allData.content[contentType]

    if (isArray(whole)) {
      whole.push(item)
    }

    /* Archive */

    if (getStoreItem('archiveMeta')[contentType] != null) {
      const dataItemCopy = undefineProps(item, excludeProps.archive.posts)

      if (archivePosts[contentType] == null) {
        archivePosts[contentType] = []
      }

      archivePosts[contentType].push(dataItemCopy)
    }
  })

  /* Term content */

  /*
  Object.keys(config.contentTypes.taxonomy).forEach((tax) => {
    const { contentTypes, props } = config.contentTypes.taxonomy[tax]

    if (archiveTerms.terms[tax] == null) {
      archiveTerms.terms[tax] = {}
    }

    contentTypes.forEach((ct, i) => {
      const contentData = allData.content[ct]

      if (isArrayStrict(contentData)) {
        if (archiveTerms.terms[tax][ct] == null) {
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

              if (archiveTerms[tax][ct][termId] == null) {
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

  const allDataFilterArgs: AllDataFilterArgs = {
    type: 'local'
  }

  allData = applyFilters('allData', allData, allDataFilterArgs)

  /* Output */

  return allData
}

/* Exports */

export {
  getLocalData,
  getAllLocalData
}
