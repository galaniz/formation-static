/**
 * Store - Files
 */

/* Imports */

import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { print } from '../utils/print/print.js'
import { storeDir, store } from './store.js'

/**
 * Create files from store object
 *
 * @return {Promise<void>}
 */
const createStoreFiles = async (): Promise<void> => {
  await mkdir(resolve(storeDir), { recursive: true })

  for (const [key, data] of Object.entries(store)) {
    const fileName = `${key}.json`
    const path = resolve(storeDir, fileName)

    await writeFile(path, JSON.stringify(data))

    print('[SSF] Successfully wrote', path, 'success')
  }
}

/* Exports */

export { createStoreFiles }
