/**
 * Utils - Action Types
 */

/* Imports */

import type { GenericFunctions } from '../../global/globalTypes.js'
import type {
  RenderStartAction,
  RenderEndAction,
  RenderItemStartAction,
  RenderItemEndAction
} from '../../render/renderTypes.js'

/**
 * @typedef Actions
 * @type {GenericFunctions}
 * @prop {RenderStartAction} renderStart
 * @prop {RenderEndAction} renderEnd
 * @prop {RenderItemStartAction} renderItemStart
 * @prop {RenderItemEndAction} renderItemEnd
 */
export interface Actions extends GenericFunctions {
  renderStart: RenderStartAction
  renderEnd: RenderEndAction
  renderItemStart: RenderItemStartAction
  renderItemEnd: RenderItemEndAction
}

/**
 * @typedef ActionsFunctions
 * @type {Object.<string, function[]>}
 * @prop {RenderStartAction[]} renderStart
 * @prop {RenderEndAction[]} renderEnd
 * @prop {RenderItemStartAction[]} renderItemStart
 * @prop {RenderItemEndAction[]} renderItemEnd
 */
export interface ActionsFunctions {
  renderStart: RenderStartAction[]
  renderEnd: RenderEndAction[]
  renderItemStart: RenderItemStartAction[]
  renderItemEnd: RenderItemEndAction[]
  [key: string]: Function[]
}
