/**
 * Utils - Get Path
 */

/* Imports */

import type { ConfigServerlessFiles } from '../../config/configTypes'
import { config } from '../../config/config'
import { isStringStrict } from '../isString/isString'

/**
 * Function - get absolute path to file or file from config
 *
 * @param {string} file
 * @param {string} [type]
 * @return {string}
 */
const getPath = (file: string = '', type: string = ''): string => {
  const root = config.env.dir

  if (!isStringStrict(root) || !isStringStrict(file)) {
    return ''
  }

  let append = file

  if (type === 'store') {
    const dir = config.store.dir
    const name = config.store.files[file].name

    if (isStringStrict(dir) && isStringStrict(name)) {
      append = `${dir}/${name}`
    }
  }

  if (file === 'image') {
    if (type === 'data') {
      const dataFile = config.static.image.dataFile

      if (isStringStrict(dataFile)) {
        append = dataFile
      }
    }

    if (type === 'input' || type === 'output') {
      const dirName = type === 'input' ? 'inputDir' : 'outputDir'
      const dir = config.static.image[dirName]

      if (isStringStrict(dir)) {
        append = `${dir}/${file}`
      }
    }
  }

  if (type === 'serverless') {
    const dir = config.serverless.dir
    const name = config.serverless.files[file as keyof ConfigServerlessFiles]

    if (isStringStrict(dir) && isStringStrict(name)) {
      append = `${dir}/${name}`
    }
  }

  return `${root}${root.endsWith('/') ? '' : '/'}${append}`
}

/* Exports */

export { getPath }
