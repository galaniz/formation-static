/**
 * Serverless - Preview Types
 */

/* Imports */

import type { GenericStrings } from '../../global/globalTypes.js'
import type { Config } from '../../config/configTypes.js'
import type { getAllContentfulData } from '../../utils/contentful/contentfulData.js'
import type { getAllWordPressData } from '../../utils/wordpress/wordpressData.js'

/**
 * @typedef {object} PreviewArgs
 * @prop {Request} request
 * @prop {string} functionPath
 * @prop {function} next
 * @prop {GenericStrings} env
 * @prop {Config} siteConfig
 * @prop {function} getData - getAllContentfulData | getAllWordPressData
 */
export interface PreviewArgs {
  request: Request
  functionPath: string
  next: Function
  env: GenericStrings
  siteConfig: Config
  getData: typeof getAllContentfulData | typeof getAllWordPressData
}
