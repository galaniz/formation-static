/**
 * Serverless - Types
 */

/* Imports */

import type { Generic, GenericStrings } from '../global/globalTypes.js'

/**
 * @typedef {object} ServerlessRoute
 * @prop {string} path
 * @prop {string} [content]
 */
export interface ServerlessRoute {
  path: string
  content?: string
}

/**
 * @typedef {string|number|boolean|File} ServerlessActionPrimitive
 */
export type ServerlessActionPrimitive = string | number | boolean | File

/**
 * @typedef {object} ServerlessActionInput
 * @extends {Generic}
 * @prop {ServerlessActionPrimitive|ServerlessActionPrimitive[]} value
 * @prop {string|string[]} type
 * @prop {string} [label]
 * @prop {string} [legend]
 */
export interface ServerlessActionInput extends Generic {
  value: ServerlessActionPrimitive | ServerlessActionPrimitive[]
  type: string | string[]
  label?: string
  legend?: string
}

/**
 * @typedef {object} ServerlessActionData
 * @prop {string} id
 * @prop {string} action
 * @prop {Object<string, ServerlessActionInput>} inputs
 */
export interface ServerlessActionData {
  id: string
  action: string
  inputs: Record<string, ServerlessActionInput>
}

/**
 * @typedef {object} ServerlessActionError
 * @prop {string} message
 * @prop {Response} [response]
 */
export interface ServerlessActionError {
  message: string
  response?: Response
}

/**
 * @typedef {object} ServerlessActionSuccess
 * @prop {string} message
 * @prop {GenericStrings} [headers]
 */
export interface ServerlessActionSuccess {
  message: string
  headers?: GenericStrings
}

/**
 * @typedef {object} ServerlessActionReturn
 * @prop {ServerlessActionError} [error]
 * @prop {ServerlessActionSuccess} [success]
 */
export interface ServerlessActionReturn {
  error?: ServerlessActionError
  success?: ServerlessActionSuccess
}

/**
 * @typedef {function} ServerlessAction
 * @param {ServerlessActionData} args
 * @param {Request} request
 * @param {object} env
 * @return {ServerlessActionReturn|Promise<ServerlessActionReturn>}
 */
export type ServerlessAction<E extends object = object> = (
  args: ServerlessActionData,
  request: Request,
  env: E
) => Promise<ServerlessActionReturn> | ServerlessActionReturn

/**
 * @typedef {Object<string, ServerlessAction>} ServerlessActions
 */
export type ServerlessActions<E extends object = object> = Record<string, ServerlessAction<E>>

/**
 * @typedef {object} ServerlessResultOptions
 * @prop {number} status
 * @prop {GenericStrings} [headers]
 */
export interface ServerlessResultOptions {
  status: number
  headers?: GenericStrings
}

/**
 * @typedef {object} ServerlessResultFilterArgs
 * @prop {ServerlessActionData} data
 * @prop {Request} request
 * @prop {object} env
 */
export interface ServerlessResultFilterArgs<E extends object = object> {
  data: ServerlessActionData
  request: Request
  env: E
}

/**
 * @typedef {function} ServerlessResultFilter
 * @param {ServerlessActionReturn|null} res
 * @param {ServerlessResultFilterArgs} args
 * @return {Promise<ServerlessActionReturn|null>}
 */
export type ServerlessResultFilter<E extends object = object> = (
  res: ServerlessActionReturn | null,
  args: ServerlessResultFilterArgs<E>
) => Promise<ServerlessActionReturn | null>
