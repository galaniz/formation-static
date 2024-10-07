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
import { dataSource } from '../dataSource/dataSource.js'

/**
 * Minify template strings
 *
 * @param {string} str
 * @return {string}
 */
const minify = (str: string): string => {
  return str
    .replace(/\s+/g, ' ')
    .replace(/;\s*}/g, ';}')
    .trim()
}

/**
 * Create files for serverless functions
 *
 * @return {Promise<void>}
 */
const createServerlessFiles = async (args?: FileServerlessArgs): Promise<void> => {
  try {
    /* Args */

    const {
      configExport = 'config',
      configFile = 'lib/config/config.js',
      dataExport = dataSource.isContentful() ? 'getAllContentfulData' : 'getAllWordPressData',
      dataFile = 'lib/serverless/serverlessData.js',
      previewExport = 'Preview',
      previewFile = 'lib/serverless/serverlessPreview.js',
      reloadExport = 'Reload',
      reloadFile = 'lib/serverless/serverlessReload.js',
      ajaxExport = 'Ajax',
      ajaxFile = 'lib/serverless/serverlessAjax.js'
    } = isObjectStrict(args) ? args : {}

    /* Serverless folder */

    const serverlessDir = config.serverlessDir

    if (!isStringStrict(serverlessDir)) {
      throw new Error('No serverlessDir in config')
    }

    await mkdir(resolve(serverlessDir), { recursive: true })

    /* Ajax file */

    const ajaxServerlessFile = config.serverlessFiles.ajax

    if (isStringStrict(ajaxServerlessFile)) {
      const pathDepth = getPathDepth(`${serverlessDir}/${ajaxServerlessFile}`)
      const content = `
        import { ${configExport} } from '${pathDepth}${configFile}';
        import { ${ajaxExport} } from '${pathDepth}${ajaxFile}';
        const render = async ({ request, functionPath, env }) => {
          return await Ajax({
            request,
            functionPath,
            env,
            siteConfig: ${configExport}
          })
        };
        export const onRequestPost = [render];
      `

      const path = resolve(serverlessDir, ajaxServerlessFile)
      const dir = dirname(path)

      await mkdir(resolve(serverlessDir, dir), { recursive: true })
      await writeFile(path, minify(content))

      print('[SSF] Successfully wrote', path, 'success')
    }

    /* Preview file */

    const previewServerlessFile = config.serverlessFiles.preview

    if (config.env.dev && isStringStrict(previewServerlessFile)) {
      const pathDepth = getPathDepth(`${serverlessDir}/${previewServerlessFile}`)
      const content = `
        import { ${configExport} } from '${pathDepth}${configFile}';
        import { ${dataExport} } from '${pathDepth}${dataFile}';
        import { ${previewExport} } from '${pathDepth}${previewFile}';
        const render = async ({ request, functionPath, next, env }) => {
          return await ${previewExport}({
            request,
            functionPath,
            next,
            env,
            siteConfig: ${configExport},
            getData: ${dataExport}
          })
        };
        export const onRequestGet = [render];
      `

      const path = resolve(serverlessDir, previewServerlessFile)
      const dir = dirname(path)

      await mkdir(resolve(serverlessDir, dir), { recursive: true })
      await writeFile(path, minify(content))

      print('[SSF] Successfully wrote', path, 'success')
    }

    /* Routes */

    const routes = Object.keys(config.serverlessRoutes)

    if (routes.length > 0) {
      const reloadServerlessFile = config.serverlessFiles.reload

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

          if (type === 'reload' && isStringStrict(reloadServerlessFile) && isStringStrict(path)) {
            path = `${path}/${reloadServerlessFile}`

            const pathDepth = getPathDepth(`${serverlessDir}/${path}`)

            content = `
              import { ${configExport} } from '${pathDepth}${configFile}';
              import { ${dataExport} } from '${pathDepth}${dataFile}';
              import { ${reloadExport} } from '${pathDepth}${reloadFile}';
              const render = async ({ request, functionPath, next, env }) => {
                return await ${reloadExport}({
                  request,
                  functionPath,
                  next,
                  env,
                  siteConfig: ${configExport},
                  getData: ${dataExport}
                })
              };
              export const onRequestGet = [render];
            `
          }

          if (isStringStrict(path) && isStringStrict(content)) {
            path = resolve(serverlessDir, path)

            const dir = dirname(path)

            await mkdir(resolve(serverlessDir, dir), { recursive: true })
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
