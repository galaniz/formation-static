/**
 * Utils - Write Serverless Files
 */

/* Imports */

import type { ServerlessFilesArgs } from './writeServerlessFilesTypes'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { getPathDepth } from '../getPathDepth/getPathDepth'
import { isObjectStrict } from '../isObject/isObject'
import { isStringStrict } from '../isString/isString'
import { config } from '../../config/config'

/**
 * Function - write files from serverless
 *
 * @return {Promise<void>}
 */
const writeServerlessFiles = async (args?: ServerlessFilesArgs): Promise<void> => {
  try {
    /* Args */

    const {
      packageDir = 'lib',
      configName = 'config',
      configFile = 'src/config/config.js'
    } = isObjectStrict(args) ? args : {}

    /* Package */

    const formationPackage = `@alanizcreative/static-site-formation/${packageDir}/serverless/`

    /* Serverless folder */

    if (isStringStrict(config.serverless.dir)) {
      await mkdir(resolve(config.serverless.dir), { recursive: true })
    }

    /* Ajax file */

    if (isStringStrict(config.serverless.files.ajax)) {
      const content = `import { ${configName} } from '${getPathDepth(`${config.serverless.dir}/${config.serverless.files.ajax}`)}${configFile}'\nimport { Ajax } from '${formationPackage}Ajax/Ajax'\nconst render = async ({ request, functionPath, env }) => { return await Ajax({ request, functionPath, env, siteConfig: ${configName} }) }\nexport const onRequestPost = [render]\n`

      const path = resolve(config.serverless.dir, config.serverless.files.ajax)
      const dir = dirname(path)

      await mkdir(resolve(config.serverless.dir, dir), { recursive: true })
      await writeFile(path, content)

      console.info(config.console.green, `[SSF] Successfully wrote ${path}`)
    }

    /* Preview file */

    if (config.env.dev && isStringStrict(config.serverless.files.preview)) {
      const content = `import { ${configName} } from '${getPathDepth(`${config.serverless.dir}/${config.serverless.files.preview}`)}${configFile}'\nimport { Preview } from '${formationPackage}Preview/Preview'\nconst render = async ({ request, functionPath, next, env }) => { return await Preview({ request, functionPath, next, env, siteConfig: ${configName} }) }\nexport const onRequestGet = [render]\n`

      const path = resolve(config.serverless.dir, config.serverless.files.preview)
      const dir = dirname(path)

      await mkdir(resolve(config.serverless.dir, dir), { recursive: true })
      await writeFile(path, content)

      console.info(config.console.green, `[SSF] Successfully wrote ${path}`)
    }

    /* Routes */

    const routes = Object.keys(config.serverless.routes)

    if (routes.length > 0) {
      const reloadFile = config.serverless.files.reload

      for (let i = 0; i < routes.length; i += 1) {
        const type = routes[i]
        const routesArr = config.serverless.routes[type]

        for (let r = 0; r < routesArr.length; r += 1) {
          let { path = '', content = '' } = routesArr[r]

          if (type === 'reload' && isStringStrict(reloadFile) && isStringStrict(path)) {
            path = `${path}/${reloadFile}`

            content = `import { ${configName} } from '${getPathDepth(`${config.serverless.dir}/${path}`)}${configFile}'\nimport { Reload } from '${formationPackage}Reload/Reload'\nconst render = async ({ request, functionPath, next, env }) => { return await Reload({ request, functionPath, next, env, siteConfig: ${configName} }) }\nexport const onRequestGet = [render]\n`
          }

          if (isStringStrict(path) && isStringStrict(content)) {
            path = resolve(config.serverless.dir, path)

            const dir = dirname(path)

            await mkdir(resolve(config.serverless.dir, dir), { recursive: true })
            await writeFile(path, content)

            console.info(config.console.green, `[SSF] Successfully wrote ${path}`)
          }
        }
      }
    }
  } catch (error) {
    console.error(config.console.red, '[SSF] Error writing serverless files: ', error)
  }
}

/* Exports */

export { writeServerlessFiles }
