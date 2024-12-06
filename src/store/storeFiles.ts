/**
 * Store - Files
 */

/* Imports */

import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { isStringStrict } from '../utils/string/string.js'
import { print } from '../utils/print/print.js'
import { storeDir, store } from './store.js'

/**
 * Create files from store object
 *
 * @return {Promise<void>}
 */
const createStoreFiles = async (): Promise<void> => {
  try {
    if (!isStringStrict(storeDir)) {
      throw new Error('No store directory')
    }

    await mkdir(resolve(storeDir), { recursive: true })

    for (const [key, data] of Object.entries(store)) {
      const fileName = `${key}.json`
      const path = resolve(storeDir, fileName)

      await writeFile(path, JSON.stringify(data))

      print('[SSF] Successfully wrote', path, 'success')
    }
  } catch (error) {
    print('[SSF] Error writing store files', error)
  }
}

/* Exports */

export { createStoreFiles }
