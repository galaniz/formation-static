/**
 * Serverless
 */

/* Import */

import type { ServerlessRoutes, ServerlessActions, ServerlessArgs } from './serverlessTypes.js'
import { isStringStrict } from '../utils/string/string.js'
import { isObjectStrict } from '../utils/object/object.js'

/**
 * Directory to write serverless files to.
 *
 * @type {string}
 */
let serverlessDir: string = 'functions'

/**
 * Serverless routes to create files for.
 *
 * @type {ServerlessRoutes}
 */
let serverlessRoutes: ServerlessRoutes = {
  reload: []
}

/**
 * Actions to use in serverless functions.
 *
 * @type {ServerlessActions}
 */
let serverlessActions: ServerlessActions = {}

/**
 * Serverless options.
 *
 * @param {ServerlessArgs} args
 * @param {string} [dir]
 */
const setServerless = (
  args: ServerlessArgs,
  dir: string = 'functions'
): boolean => {
  if (!isObjectStrict(args)) {
    return false
  }

  const {
    actions,
    routes
  } = args

  if (isObjectStrict(actions)) {
    serverlessActions = { ...actions }
  }

  if (isObjectStrict(routes)) {
    serverlessRoutes = {
      ...{ reload: [] },
      ...routes
    }
  }

  if (isStringStrict(dir)) {
    serverlessDir = dir
  }

  return true
}

/* Exports */

export {
  serverlessDir,
  serverlessRoutes,
  serverlessActions,
  setServerless
}
