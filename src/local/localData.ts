/**
 * Local - Data
 */

/* Imports */

import type { LocalData, LocalDataArgs, AllLocalDataArgs } from './localDataTypes.js'
import type { RenderItem, RenderAllData } from '../render/renderTypes.js'
import type { AllDataFilterArgs } from '../utils/filter/filterTypes.js'
import { readdir, readFile } from 'node:fs/promises'
import { extname, basename, resolve } from 'node:path'
import { applyFilters } from '../utils/filter/filter.js'
import { isObject, isObjectStrict } from '../utils/object/object.js'
import { isStringStrict } from '../utils/string/string.js'
import { getJson } from '../utils/json/json.js'
import { config } from '../config/config.js'
import { normalizeLocalData } from './localDataNormal.js'

/**
 * Data from local files or cache
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

    const cacheData = await applyFilters('cacheData', undefined as LocalData | undefined, cacheDataFilterArgs, true)

    if (isObject(cacheData)) {
      return structuredClone(cacheData)
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
    const fileJson: RenderItem | undefined = getJson(fileContents)

    if (fileJson) {
      data[fileName] = fileJson
      hasData = true
    }
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
      data: newData
    }

    await applyFilters('cacheData', newData, cacheDataFilterArgs, true)
  }

  /* Output */

  return newData
}

/**
 * Data from file system
 *
 * @param {AllLocalDataArgs} [args]
 * @return {Promise<RenderAllData|undefined>}
 */
const getAllLocalData = async (args?: AllLocalDataArgs): Promise<RenderAllData | undefined> => {
  /* Data */

  let data = await getLocalData({
    key: 'all_file_data',
    refProps: args?.refProps,
    imageProps: args?.imageProps,
    unsetProps: args?.unsetProps
  })

  /* All data */

  let allData: RenderAllData = {
    navigationItem: [],
    navigation: [],
    redirect: [],
    content: {
      page: []
    }
  }

  /* Filter data */

  data = applyFilters('localData', data)

  console.log(data)

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
