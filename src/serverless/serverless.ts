/**
 * Serverless
 */

/* Import */

import type {
  ServerlessApiKeys,
  ServerlessRoutes,
  ServerlessActions,
  ServerlessArgs
} from './serverlessTypes.js'
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
 * @type {ServerlessApiKeys}
 */
let serverlessApiKeys: ServerlessApiKeys = {
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

  serverlessActions = Object.assign(serverlessActions, actions)
  serverlessRoutes = Object.assign(serverlessRoutes, routes)
  serverlessApiKeys = Object.assign(serverlessApiKeys, apiKeys)

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
