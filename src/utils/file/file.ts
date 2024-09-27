/**
 * Utils - File
 */

/* Imports */

import type { FileServerlessArgs } from './fileTypes.js'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { getPathDepth } from '../path/path.js'
import { isObjectStrict } from '../object/object.js'
import { isArrayStrict } from '../array/array.js'
import { isStringStrict } from '../string/string.js'
import { print } from '../print/print.js'
import { config } from '../../config/config.js'

/**
 * Create files for serverless functions
 *
 * @return {Promise<void>}
 */
const createServerlessFiles = async (args?: FileServerlessArgs): Promise<void> => {
  try {
    /* Args */

    const {
      packageDir = 'lib',
      configName = 'config',
      configFile = 'lib/config/config.js'
    } = isObjectStrict(args) ? args : {}

    /* Package */

    const formationPackage = `@alanizcreative/static-site-formation/${packageDir}/serverless/`

    /* Serverless folder */

    if (isStringStrict(config.serverlessDir)) {
      await mkdir(resolve(config.serverlessDir), { recursive: true })
    }

    /* Ajax file */

    if (isStringStrict(config.serverlessFiles.ajax)) {
      const content = `import { ${configName} } from '${getPathDepth(`${config.serverlessDir}/${config.serverlessFiles.ajax}`)}${configFile}'\nimport { Ajax } from '${formationPackage}Ajax/Ajax'\nconst render = async ({ request, functionPath, env }) => { return await Ajax({ request, functionPath, env, siteConfig: ${configName} }) }\nexport const onRequestPost = [render]\n`

      const path = resolve(config.serverlessDir, config.serverlessFiles.ajax)
      const dir = dirname(path)

      await mkdir(resolve(config.serverlessDir, dir), { recursive: true })
      await writeFile(path, content)

      print('[SSF] Successfully wrote', path, 'success')
    }

    /* Preview file */

    if (config.env.dev && isStringStrict(config.serverlessFiles.preview)) {
      const content = `import { ${configName} } from '${getPathDepth(`${config.serverlessDir}/${config.serverlessFiles.preview}`)}${configFile}'\nimport { Preview } from '${formationPackage}Preview/Preview'\nconst render = async ({ request, functionPath, next, env }) => { return await Preview({ request, functionPath, next, env, siteConfig: ${configName} }) }\nexport const onRequestGet = [render]\n`

      const path = resolve(config.serverlessDir, config.serverlessFiles.preview)
      const dir = dirname(path)

      await mkdir(resolve(config.serverlessDir, dir), { recursive: true })
      await writeFile(path, content)

      print('[SSF] Successfully wrote', path, 'success')
    }

    /* Routes */

    const routes = Object.keys(config.serverlessRoutes)

    if (routes.length > 0) {
      const reloadFile = config.serverlessFiles.reload

      for (const type of routes) {
        const routesArr = config.serverlessRoutes[type]

        if (!isArrayStrict(routesArr)) {
          continue
        }

        for (const route of routesArr) {
          let {
            path = '',
            content = ''
          } = route

          if (type === 'reload' && isStringStrict(reloadFile) && isStringStrict(path)) {
            path = `${path}/${reloadFile}`

            content = `import { ${configName} } from '${getPathDepth(`${config.serverlessDir}/${path}`)}${configFile}'\nimport { Reload } from '${formationPackage}Reload/Reload'\nconst render = async ({ request, functionPath, next, env }) => { return await Reload({ request, functionPath, next, env, siteConfig: ${configName} }) }\nexport const onRequestGet = [render]\n`
          }

          if (isStringStrict(path) && isStringStrict(content)) {
            path = resolve(config.serverlessDir, path)

            const dir = dirname(path)

            await mkdir(resolve(config.serverlessDir, dir), { recursive: true })
            await writeFile(path, content)

            print('[SSF] Successfully wrote', path, 'success')
          }
        }
      }
    }
  } catch (error) {
    print('[SSF] Error writing serverless files', error)
  }
}

/**
 * Create redirects file from config redirects array
 *
 * @return {Promise<void>}
 */
const createRedirectsFile = async (): Promise<void> => {
  try {
    const redirects = config.redirects.data
    const path = resolve(config.redirects.file)

    let redirectsData = ''

    if (redirects.length > 0) {
      redirects.forEach((r) => {
        redirectsData += `${r}\n`
      })
    }

    await writeFile(path, redirectsData)

    print('[SSF] Successfully wrote', path, 'success')
  } catch (error) {
    print('[SSF] Error writing redirects file', error)
  }
}

/**
 * Create files from config store object
 *
 * @return {Promise<void>}
 */
const createStoreFiles = async (): Promise<void> => {
  try {
    const files = config.storeFiles

    await mkdir(resolve(config.storeDir), { recursive: true })

    for (const [, file] of Object.entries(files)) {
      const path = resolve(config.storeDir, file.name)

      await writeFile(path, file.data)

      print('[SSF] Successfully wrote', path, 'success')
    }
  } catch (error) {
    print('[SSF] Error writing store files', error)
  }
}

/* Exports */

export {
  createServerlessFiles,
  createRedirectsFile,
  createStoreFiles
}
