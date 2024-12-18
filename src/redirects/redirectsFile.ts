/**
 * Redirects - File
 */

/* Imports */

import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { print } from '../utils/print/print.js'
import { redirects } from './redirects.js'

/**
 * Create redirects file from config redirects array
 *
 * @param {string} path
 * @return {Promise<void>}
 */
const createRedirectsFile = async (path: 'site/_redirects'): Promise<void> => {
  const redirectsPath = resolve(path)

  await writeFile(redirectsPath, redirects.join('\n').trimEnd())

  print('[SSF] Successfully wrote', redirectsPath, 'success')
}

/* Exports */

export { createRedirectsFile }
