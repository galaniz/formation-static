/**
 * Serverless - Reload Types
 */

/* Imports */

import type { Generic } from '../../global/globalTypes.js'

/**
 * @typedef ReloadQuery
 * @type {Generic}
 * @prop {string} [page]
 * @prop {string} [filters]
 */
export interface ReloadQuery extends Generic {
  page?: string
  filters?: string
}
