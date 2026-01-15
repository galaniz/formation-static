/**
 * Local - Data
 */

/* Imports */

import type { LocalData, LocalDataArgs, AllLocalDataArgs } from './localDataTypes.js'
import type { RenderItem, RenderAllData } from '../render/renderTypes.js'
import type { AllDataFilterArgs, CacheData } from '../filters/filtersTypes.js'
import { readdir, readFile } from 'node:fs/promises'
import { extname, basename, resolve } from 'node:path'
import { isObject, isObjectStrict } from '../utils/object/object.js'
import { isStringStrict } from '../utils/string/string.js'
import { applyFilters } from '../filters/filters.js'
import { getJson } from '../utils/json/json.js'
import { config } from '../config/config.js'
import { normalizeLocalData } from './localDataNormal.js'

/**
 * Data from local files or cache.
 *
 * @param {LocalDataArgs} args
 * @return {Promise<LocalData>}
 */
const getLocalData = async (args: LocalDataArgs): Promise<LocalData> => {
  /* Args required */

  if (!isObjectStrict(args)) {
    throw new Error('No args')
  }

  const {
    key,
    refProps,
    imageProps,
    unsetProps
  } = args

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

    const cacheData = await applyFilters('cacheData', undefined as CacheData | undefined, cacheDataFilterArgs, true)
    const cacheItems = cacheData?.data

    if (isObject(cacheItems)) {
      return structuredClone(cacheItems)
    }
  }

  /* Directory */

  const dir = config.local.dir

  /* Data */

  const data: LocalData = {}
  let hasData = false

  /* All files */

  const files = await readdir(resolve(dir))

  for (const file of files) {
    const fileExt = extname(file)
    const fileName = basename(file, fileExt)

    if (fileExt !== '.json') {
      continue
    }

    const fileContents = await readFile(resolve(dir, file), { encoding: 'utf8' })

    data[fileName] = getJson<RenderItem>(fileContents)
    hasData = true
  }

  /* Data not empty check */

  if (!hasData) {
    throw new Error('No data')
  }

  /* Normalize data */

  const newData = normalizeLocalData(data, refProps, imageProps, unsetProps)

  /* Add to cache */

  if (config.env.cache) {
    const cacheDataFilterArgs = {
      key,
      type: 'set',
      data
    }

    await applyFilters('cacheData', { data: newData }, cacheDataFilterArgs, true)
  }

  /* Output */

  return newData
}

/**
 * All data from file system.
 *
 * @param {AllLocalDataArgs} [args]
 * @return {Promise<RenderAllData|undefined>}
 */
const getAllLocalData = async (args?: AllLocalDataArgs): Promise<RenderAllData | undefined> => {
  /* Data */

  const data = await getLocalData({
    key: 'all_file_data',
    refProps: args?.refProps,
    imageProps: args?.imageProps,
    unsetProps: args?.unsetProps
  })

  /* All data */

  let allData: RenderAllData = {
    navigationItem: [],
    navigation: [],
    content: {
      page: []
    }
  }

  /* Append data to all data */

  for (const [, value] of Object.entries(data)) {
    const { contentType } = value

    if (!isStringStrict(contentType)) {
      continue
    }

    const isPartial = config.partialTypes.includes(contentType)
    const isWhole = config.wholeTypes.includes(contentType)

    if (!isPartial && !isWhole) {
      continue
    }

    const val = applyFilters('localData', value)

    if (isPartial) {
      if (allData[contentType] == null) {
        allData[contentType] = []
      }

      (allData[contentType] as RenderItem[]).push(val)
    }

    if (isWhole) {
      if (allData.content[contentType] == null) {
        allData.content[contentType] = []
      }

      allData.content[contentType].push(val)
    }
  }

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
