/**
 * Utils - Path
 */

/* Imports */

import { isStringStrict } from '../string/string.js'
import { config } from '../../config/config.js'
import { storeDir } from '../../store/store.js'
import { serverlessDir } from '../../serverless/serverless.js'

/**
 * Get absolute path to file or file from config
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
    const dir = storeDir

    if (isStringStrict(dir)) {
      append = `${dir}/${file}.json`
    }
  }

  if (type === 'serverless') {
    const dir = serverlessDir

    if (isStringStrict(dir)) {
      append = `${dir}/${file}.js`
    }
  }

  return `${root}${root.endsWith('/') ? '' : '/'}${append}`
}

/**
 * Relative ascendent path as string
 *
 * @param {string} path
 * @return {string}
 */
const getPathDepth = (path: string = ''): string => {
  if (!isStringStrict(path)) {
    return ''
  }

  let pathDepth = path.split('/')

  pathDepth.pop()

  pathDepth = pathDepth.map(() => {
    return '../'
  })

  return pathDepth.join('')
}

/* Exports */

export {
  getPath,
  getPathDepth
}
