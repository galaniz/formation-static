/**
 * Serverless - Ajax Types
 */

/* Imports */

import type { Generic, GenericStrings } from '../../global/globalTypes.js'
import type { ServerlessActionData, ServerlessActionReturn } from '../serverlessTypes.js'

/**
 * @typedef {object} AjaxResultOptions
 * @prop {number} status
 * @prop {GenericStrings} [headers]
 */
export interface AjaxResultOptions {
  status: number
  headers?: GenericStrings
}

/**
 * @typedef {object} AjaxResultFilterArgs
 * @prop {ServerlessActionData} data
 * @prop {Request} request
 * @prop {Generic} env
 */
export interface AjaxResultFilterArgs {
  data: ServerlessActionData
  request: Request
  env: Generic
}

/**
 * @typedef {function} AjaxResultFilter
 * @param {ServerlessActionReturn|null} res
 * @param {AjaxResultFilterArgs} args
 * @return {Promise<ServerlessActionReturn|null>}
 */
export type AjaxResultFilter = (
  res: ServerlessActionReturn | null,
  args: AjaxResultFilterArgs
) => Promise<ServerlessActionReturn | null>
