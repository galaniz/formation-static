/**
 * Utils - Action Types
 */

/* Imports */

import type { GenericFunction } from '../../global/globalTypes.js'
import type {
  RenderStartAction,
  RenderEndAction,
  RenderItemStartAction,
  RenderItemEndAction
} from '../../render/renderTypes.js'

/**
 * @typedef {Object<string, GenericFunction>} Actions
 * @prop {RenderStartAction} renderStart
 * @prop {RenderEndAction} renderEnd
 * @prop {RenderItemStartAction} renderItemStart
 * @prop {RenderItemEndAction} renderItemEnd
 */
export interface Actions extends Record<string, GenericFunction> {
  renderStart: RenderStartAction
  renderEnd: RenderEndAction
  renderItemStart: RenderItemStartAction
  renderItemEnd: RenderItemEndAction
}

/**
 * @typedef {Map<string, Set<GenericFunction>>} ActionMap
 * @prop {Set<RenderStartAction>} renderStart
 * @prop {Set<RenderEndAction>} renderEnd
 * @prop {Set<RenderItemStartAction>} renderItemStart
 * @prop {Set<RenderItemEndAction>} renderItemEnd
 */
export type ActionMap = Map<string, Set<GenericFunction>> & Map<
'renderStart' |
'renderEnd' |
'renderItemStart' |
'renderItemEnd',
Set<
RenderStartAction |
RenderEndAction |
RenderItemStartAction |
RenderItemEndAction
>
>

/**
 * @typedef {void|Promise<void>} ActionReturnType
 */
export type ActionReturnType<V extends false | true> = V extends true ? Promise<void> : undefined
