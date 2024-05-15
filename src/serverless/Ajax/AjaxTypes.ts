/**
 * Serverless - Ajax Types
 */

import type { GenericStrings } from '../../global/globalTypes'
import type { AjaxActionReturn, AjaxActionArgs } from '../serverlessTypes'
import type { Config } from '../../config/configTypes'

/**
 * @typedef {object} AjaxArgs
 * @prop {Request} request
 * @prop {string} functionPath
 * @prop {import('../../global/globalTypes').GenericStrings} env
 * @prop {import(../../config/configTypes').Config} siteConfig
 */
export interface AjaxArgs {
  request: Request
  functionPath: string
  env: GenericStrings
  siteConfig: Config
}

/**
 * @typedef {object} AjaxCustomErrorArgs
 * @prop {string} [message]
 * @prop {number} [code]
 */
export interface AjaxCustomErrorArgs {
  message?: string
  code?: number
}

/**
 * @typedef {object} AjaxResOptions
 * @prop {number} status
 * @prop {import('../../global/globalTypes').GenericStrings} [headers]
 */
export interface AjaxResOptions {
  status: number
  headers?: GenericStrings
}

/**
 * @typedef {function} AjaxResFilter
 * @param {import('../serverlessTypes').AjaxActionReturn|null} res
 * @param {import('../serverlessTypes').AjaxActionArgs} args
 * @return {Promise<import('../serverlessTypes').AjaxActionReturn|null>}
 */
export type AjaxResFilter = (res: AjaxActionReturn | null, args: AjaxActionArgs) => Promise<AjaxActionReturn | null>
