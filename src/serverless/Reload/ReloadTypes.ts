/**
 * Serverless - Reload Types
 */

/* Imports */

import type { Generic } from '../../global/globalTypes.js'

/**
 * @typedef {object} ReloadQuery
 * @extends {Generic}
 * @prop {string} [page]
 * @prop {string} [filters]
 */
export interface ReloadQuery extends Generic {
  page?: string
  filters?: string
}
