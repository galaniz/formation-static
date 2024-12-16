/**
 * Serverless - Types
 */

/* Imports */

import type { EventContext } from '@cloudflare/workers-types'
import type { Generic, GenericStrings } from '../global/globalTypes.js'

/**
 * @typedef {object} ServerlessRoute
 * @prop {string} path
 * @prop {string} [content]
 */
export interface ServerlessRoute {
  path: string
  content?: string
}

/**
 * @typedef {Object<string, ServerlessRoute[]>} ServerlessRoutes
 * @prop {ServerlessRoute[]} reload
 */
export interface ServerlessRoutes {
  reload: ServerlessRoute[]
  [key: string]: ServerlessRoute[]
}

/**
 * @typedef {EventContext} ServerlessContext
 */
export type ServerlessContext = EventContext<GenericStrings, string, unknown>

/**
 * @typedef {function} ServerlessSetup
 * @param {ServerlessContext} context
 * @return {void}
 */
export type ServerlessSetup = (context: ServerlessContext) => void

/**
 * @typedef ServerlessActionInput
 * @type {Generic}
 * @prop {string} type
 * @prop {string} label
 * @prop {string|string[]} value
 * @prop {string} [legend]
 * @prop {boolean} [exclude]
 */
export interface ServerlessActionInput extends Generic {
  type: string
  label: string
  value: string | string[]
  legend?: string
  exclude?: boolean
}

/**
 * @typedef {object} ServerlessActionData
 * @prop {string} id
 * @prop {string} action
 * @prop {Object<string, ServerlessActionInput>} inputs
 */
export interface ServerlessActionData {
  id: string
  action: string
  inputs: Record<string, ServerlessActionInput>
}

/**
 * @typedef {object} ServerlessActionReturn
 * @prop {object} [error]
 * @prop {string} error.message
 * @prop {Response} error.response
 * @prop {object} [success]
 * @prop {string} success.message
 * @prop {GenericStrings} [headers]
 */
export interface ServerlessActionReturn {
  error?: {
    message: string
    response?: Response
  }
  success?: {
    message: string
    headers?: GenericStrings
  }
}

/**
 * @typedef {function} ServerlessAction
 * @param {ServerlessActionData} args
 * @param {ServerlessContext} context
 * @return {Promise<ServerlessActionReturn>}
 */
export type ServerlessAction = (
  args: ServerlessActionData,
  context: ServerlessContext,
) => Promise<ServerlessActionReturn>

/**
 * @typedef {Object<string, ServerlessAction>} ServerlessActions
 */
export type ServerlessActions = Record<string, ServerlessAction>

/**
 * @typedef ServerlessApiKeys
 * @type {GenericStrings}
 * @prop {string} smtp2go
 */
export interface ServerlessApiKeys extends GenericStrings {
  smtp2go: string
}

/**
 * @typedef {object} ServerlessFilesArgs
 * @prop {string} [dataExport=getAllContentfulData]
 * @prop {string} [dataExportFile=@alanizcreative/static-site-formation/contentful/contentfulData.js]
 * @prop {string} [setupExportFile=setupServerless]
 * @prop {string} [setupExportFile=lib/setup/setupServerless.js]
 * @prop {string} [previewExportFile=@alanizcreative/static-site-formation/serverless/Preview/Preview.js]
 * @prop {string} [reloadExportFile=@alanizcreative/static-site-formation/serverless/Reload/Reload.js]
 * @prop {string} [ajaxExportFile=@alanizcreative/static-site-formation/serverless/Ajax/Ajax.js]
 * @prop {string} [ajaxFile=ajax/index.js]
 * @prop {string} [previewFile=_middleware.js]
 * @prop {string} [reloadFile=_middleware.js]
 */
export interface ServerlessFilesArgs {
  dataExport?: string
  dataExportFile?: string
  setupExport?: string
  setupExportFile?: string
  previewExportFile?: string
  reloadExportFile?: string
  ajaxExportFile?: string
  ajaxFile?: string
  previewFile?: string
  reloadFile?: string
  setupFile?: string
}

/**
 * @typedef {object} ServerlessArgs
 * @prop {ServerlessActions} actions
 * @prop {ServerlessRoutes} [routes]
 * @prop {ServerlessApiKeys} [apiKeys]
 */
export interface ServerlessArgs {
  actions: ServerlessActions
  routes?: ServerlessRoutes
  apiKeys?: ServerlessApiKeys
}
