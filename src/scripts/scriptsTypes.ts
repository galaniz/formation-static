/**
 * Utils - Scripts Types
 */

/* Imports */

import type { Generic } from '../global/globalTypes.js'

/**
 * @typedef {'high'|'low'} ScriptsPriority
 */
export type ScriptsPriority = 'high' | 'low'

/**
 * @typedef {object} Scripts
 * @prop {Map<string, string>} item - Current render item scripts or styles.
 * @prop {Map<string, string>} build
 * @prop {Map<string, Set<string>>} deps
 * @prop {Map<string, ScriptsPriority>} priority
 * @prop {Generic} meta
 */
export interface Scripts {
  item: Map<string, string>
  build: Map<string, string>
  deps: Map<string, Set<string>>
  priority: Map<string, ScriptsPriority>
  meta: Generic
}

/**
 * @typedef {object} Styles
 * @prop {Map<string, string>} item - Current render item scripts or styles.
 * @prop {Map<string, string>} build
 * @prop {Map<string, Set<string>>} deps
 * @prop {Map<string, ScriptsPriority>} priority
 */
export interface Styles {
  item: Map<string, string>
  build: Map<string, string>
  deps: Map<string, Set<string>>
  priority: Map<string, ScriptsPriority>
}
