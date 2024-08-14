/**
 * Serverless - Ajax Types
 */

/* Imports */

import type { GenericStrings } from '../../global/globalTypes.js'
import type { Config } from '../../config/configTypes.js'
import type { AjaxActionReturn, AjaxActionArgs } from '../serverlessTypes.js'

/**
 * @typedef {object} AjaxArgs
 * @prop {Request} request
 * @prop {string} functionPath
 * @prop {GenericStrings} env
 * @prop {Config} siteConfig
 */
export interface AjaxArgs {
  request: Request
  functionPath: string
  env: GenericStrings
  siteConfig: Config
}

/**
 * @typedef {object} AjaxResOptions
 * @prop {number} status
 * @prop {GenericStrings} [headers]
 */
export interface AjaxResOptions {
  status: number
  headers?: GenericStrings
}

/**
 * @typedef {function} AjaxResFilter
 * @param {AjaxActionReturn|null} res
 * @param {AjaxActionArgs} args
 * @return {Promise<AjaxActionReturn|null>}
 */
export type AjaxResFilter = (res: AjaxActionReturn | null, args: AjaxActionArgs) => Promise<AjaxActionReturn | null>
