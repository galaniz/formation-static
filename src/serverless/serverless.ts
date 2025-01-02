/**
 * Serverless
 */

/* Import */

import type { ServerlessRoutes, ServerlessActions, ServerlessArgs } from './serverlessTypes.js'
import type { GenericStrings } from '../global/globalTypes.js'
import { isStringStrict } from '../utils/string/string.js'
import { isObjectStrict } from '../utils/object/object.js'

/**
 * Directory to write serverless files to
 *
 * @type {string}
 */
let serverlessDir: string = 'functions'

/**
 * Serverless routes to create files for
 *
 * @type {ServerlessRoutes}
 */
let serverlessRoutes: ServerlessRoutes = {
  reload: []
}

/**
 * Api keys for use in serverless functions
 *
 * @type {GenericStrings}
 */
let serverlessApiKeys: GenericStrings = {
  smtp2go: ''
}

/**
 * Actions to use in serverless functions
 *
 * @type {ServerlessActions}
 */
let serverlessActions: ServerlessActions = {}

/**
 * Set serverless options
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
    routes,
    apiKeys
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

  if (isObjectStrict(apiKeys)) {
    serverlessApiKeys = {
      ...{ smtp2go: '' },
      ...apiKeys
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
  serverlessApiKeys,
  serverlessActions,
  setServerless
}
