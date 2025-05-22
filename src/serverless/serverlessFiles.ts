/**
 * Serverless - Files
 */

/* Imports */

import type { ServerlessFilesArgs } from './serverlessTypes.js'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { getPathDepth } from '../utils/path/path.js'
import { isObjectStrict } from '../utils/object/object.js'
import { isArrayStrict } from '../utils/array/array.js'
import { isStringStrict } from '../utils/string/string.js'
import { dataSource } from '../utils/dataSource/dataSource.js'
import { print } from '../utils/print/print.js'
import { config } from '../config/config.js'
import { serverlessDir, serverlessRoutes } from './serverless.js'

/**
 * Minify template strings.
 *
 * @private
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
 * Create files for serverless functions.
 *
 * @param {ServerlessFilesArgs} [args]
 * @return {Promise<void>}
 */
const createServerlessFiles = async (args?: ServerlessFilesArgs): Promise<void> => {
  /* Defaults and args */

  let defaultDataExport = 'getAllContentfulData'
  let defaultDataFile = '@alanizcreative/formation-static/contentful/contentfulData.js'

  if (dataSource.isWordPress()) {
    defaultDataExport = 'getAllWordPressData'
    defaultDataFile = '@alanizcreative/formation-static/wordpress/wordpressData.js'
  }

  const defaults = {
    dataExport: defaultDataExport,
    dataExportFile: defaultDataFile,
    setupExport: 'setupServerless',
    setupExportFile: 'lib/setup/setupServerless.js',
    previewExportFile: '@alanizcreative/formation-static/serverless/Preview/Preview.js',
    reloadExportFile: '@alanizcreative/formation-static/serverless/Reload/Reload.js',
    ajaxExportFile: '@alanizcreative/formation-static/serverless/Ajax/Ajax.js',
    ajaxFile: 'ajax/index.js',
    previewFile: '_middleware.js',
    reloadFile: '_middleware.js'
  }

  const {
    dataExport,
    dataExportFile,
    setupExport,
    setupExportFile,
    previewExportFile,
    reloadExportFile,
    ajaxExportFile,
    ajaxFile,
    previewFile,
    reloadFile
  } = Object.assign(defaults, isObjectStrict(args) ? args : {})

  /* Serverless folder required */

  await mkdir(resolve(serverlessDir), { recursive: true })

  /* Ajax file */

  if (isStringStrict(ajaxFile)) {
    const pathDepth = getPathDepth(`${serverlessDir}/${ajaxFile}`)
    const content = `import { Ajax } from '${ajaxExportFile.startsWith('@') ? '' : pathDepth}${ajaxExportFile}';
import { ${setupExport} } from '${pathDepth}${setupExportFile}';
const render = async (context) => {
  return await Ajax(context, ${setupExport});
};
export const onRequestPost = [render];`

    const path = resolve(serverlessDir, ajaxFile)
    const dir = dirname(path)

    await mkdir(resolve(serverlessDir, dir), { recursive: true })
    await writeFile(path, minify(content))

    print('[FRM] Successfully wrote', path, 'success')
  }

  /* Preview file */

  if (config.env.dev && isStringStrict(previewFile)) {
    const pathDepth = getPathDepth(`${serverlessDir}/${previewFile}`)
    const content = `import { Preview } from '${previewExportFile.startsWith('@') ? '' : pathDepth}${previewExportFile}';
import { ${dataExport} } from '${dataExportFile.startsWith('@') ? '' : pathDepth}${dataExportFile}';
import { ${setupExport} } from '${pathDepth}${setupExportFile}';
const render = async (context) => {
  return await Preview(context, ${setupExport}, ${dataExport});
};
export const onRequestGet = [render];`

    const path = resolve(serverlessDir, previewFile)
    const dir = dirname(path)

    await mkdir(resolve(serverlessDir, dir), { recursive: true })
    await writeFile(path, minify(content))

    print('[FRM] Successfully wrote', path, 'success')
  }

  /* Routes */

  const newRoutes: Array<{ path: string, content: string }> = []
  const hasReloadFile = isStringStrict(reloadFile)

  for (const [type, routes] of Object.entries(serverlessRoutes)) {
    if (!isArrayStrict(routes)) {
      continue
    }

    for (const route of routes) {
      let { path, content } = route

      if (!isStringStrict(path)) {
        continue
      }

      if (type === 'reload' && hasReloadFile) {
        path = `${path}/${reloadFile}`

        const pathDepth = getPathDepth(`${serverlessDir}/${path}`)

        content = `import { Reload } from '${reloadExportFile.startsWith('@') ? '' : pathDepth}${reloadExportFile}';
import { ${dataExport} } from '${dataExportFile.startsWith('@') ? '' : pathDepth}${dataExportFile}';
import { ${setupExport} } from '${pathDepth}${setupExportFile}';
const render = async (context) => {
  return await Reload(context, ${setupExport}, ${dataExport});
};
export const onRequestGet = [render];`
      }

      if (!isStringStrict(content)) {
        continue
      }

      newRoutes.push({ path, content })
    }
  }

  for (const route of newRoutes) {
    const { path, content } = route
    const newPath = resolve(serverlessDir, path)
    const dir = dirname(newPath)

    await mkdir(resolve(serverlessDir, dir), { recursive: true })
    await writeFile(newPath, content)

    print('[FRM] Successfully wrote', newPath, 'success')
  }
}

/* Exports */

export { createServerlessFiles }
