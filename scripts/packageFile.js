// @ts-check

/**
 * Build - Package File
 */

/* Imports */

import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

/**
 * Create package json files for lib and cjs folders
 *
 * @return {Promise<void>}
 */
const init = async () => {
  try {
    const libDir = resolve('lib')
    const cjsDir = resolve('cjs')

    await writeFile(`${libDir}/package.json`, '{"type": "module"}')
    await writeFile(`${cjsDir}/package.json`, '{"type": "commonjs"}')

    console.info('[FRM] Success creating package json files')
  } catch (error) {
    console.error('[FRM] Error creating package json files: ', error)
  }
}

init()
