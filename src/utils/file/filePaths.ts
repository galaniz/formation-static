/**
 * Utils - File Paths
 */

/* Imports */

import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * Recurse directory to get all file paths in it
 *
 * @param {string} dir
 * @yield {string[]}
 */
const getFilePaths = async function * (dir: string): AsyncIterable<string> {
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
