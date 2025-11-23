/**
 * Utils - Paths
 */

/* Imports */

import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { isStringStrict } from '../string/string.js'

/**
 * Recurse directory to get all file paths in it.
 *
 * @param {string} dir
 * @yield {string[]}
 */
const getFilePaths = async function * (dir: string): AsyncGenerator<string> {
  if (!isStringStrict(dir)) {
    throw new Error('No directory provided')
  }

  const files = await readdir(dir, { withFileTypes: true })

  for (const file of files) {
    if (file.isDirectory()) {
      yield * getFilePaths(join(dir, file.name))
    } else {
      yield join(dir, file.name)
    }
  }
}

/* Exports */

export { getFilePaths }
