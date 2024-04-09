/**
 * Utils - Get File Data
 */

/* Imports */

import type { FileDataParams, FileDataReturn } from './getFileDataTypes'
import type { RenderItem } from '../../render/renderTypes'
import { readdir, readFile } from 'node:fs/promises'
import { extname, basename, resolve } from 'node:path'
import { applyFilters } from '../../utils/filters/filters'
import { isObject } from '../../utils/isObject/isObject'
import { isStringStrict } from '../../utils/isString/isString'
import { getJson } from '../../utils/getJson/getJson'
import { config } from '../../config/config'

/**
 * Function - get data from file or cache
 *
 * @param {string} key
 * @param {import('./getFileDataTypes').FileDataParams} params
 * @return {Promise<import('./getFileDataTypes').FileDataReturn>}
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
      const file = await readFile(resolve(config.static.dir, `${id}.json`), { encoding: 'utf8' })
      const fileJson: RenderItem | undefined = getJson(file)

      if (fileJson !== undefined) {
        data[id] = fileJson
      }
    }

    /* All files */

    if (!isStringStrict(id) && all) {
      const files = await readdir(resolve(config.static.dir))

      for (let i = 0; i < files.length; i += 1) {
        const file = files[i]
        const fileExt = extname(file)
        const fileName = basename(file, fileExt)

        if (fileExt === '.json') {
          const fileContents = await readFile(resolve(config.static.dir, file), { encoding: 'utf8' })
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
    console.error(config.console.red, '[SSF] Error getting file data: ', error)

    return {}
  }
}

/* Exports */

export { getFileData }
