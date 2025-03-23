/**
 * Redirects - File
 */

/* Imports */

import { mkdir, writeFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { print } from '../utils/print/print.js'
import { redirects } from './redirects.js'

/**
 * Create redirects file from redirects array
 *
 * @param {string} path
 * @return {Promise<void>}
 */
const createRedirectsFile = async (path: string = 'site/_redirects'): Promise<void> => {
  const redirectsPath = resolve(path)
  const redirectsDir = dirname(redirectsPath)

  await mkdir(redirectsDir, { recursive: true })
  await writeFile(redirectsPath, redirects.join('\n').trimEnd())

  print('[FRM] Successfully wrote', redirectsPath, 'success')
}

/* Exports */

export { createRedirectsFile }
