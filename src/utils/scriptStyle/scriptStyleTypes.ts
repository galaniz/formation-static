/**
 * Utils - Script Style Types
 */

/* Imports */

import type { Generic } from '../../global/globalTypes.js'

/**
 * @typedef {object} Scripts
 * @prop {Map<string, Set<string>>} deps
 * @prop {Map<string, string>} item - Current render item scripts or styles
 * @prop {Map<string, string>} build
 * @prop {Generic} meta
 */
export interface Scripts {
  deps: Map<string, Set<string>>
  item: Map<string, string>
  build: Map<string, string>
  meta: Generic
}

/**
 * @typedef {object} Styles
 * @prop {Map<string, Set<string>>} deps
 * @prop {Map<string, string>} item - Current render item scripts or styles
 * @prop {Map<string, string>} build
 */
export interface Styles {
  deps: Map<string, Set<string>>
  item: Map<string, string>
  build: Map<string, string>
}
