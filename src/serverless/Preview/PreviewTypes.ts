/**
 * Serverless - Preview Types
 */

/* Imports */

import type { GenericStrings } from '../../global/globalTypes.js'
import type { Config } from '../../config/configTypes.js'

/**
 * @typedef {object} PreviewArgs
 * @prop {Request} request
 * @prop {string} functionPath
 * @prop {function} next
 * @prop {GenericStrings} env
 * @prop {Config} siteConfig
 */
export interface PreviewArgs {
  request: Request
  functionPath: string
  next: Function
  env: GenericStrings
  siteConfig: Config
}
