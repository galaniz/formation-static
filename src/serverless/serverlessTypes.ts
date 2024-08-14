/**
 * Serverless - Types
 */

/* Imports */

import type { GenericStrings } from '../global/globalTypes.js'

/**
 * @typedef {object} AjaxActionInput
 * @prop {string} type
 * @prop {string} label
 * @prop {string|string[]} value
 * @prop {string} [legend]
 * @prop {boolean} [exclude]
 */
export interface AjaxActionInput {
  type: string
  label: string
  value: string | string[]
  legend?: string
  exclude?: boolean
}

/**
 * @typedef {object} AjaxActionData
 * @prop {string} id
 * @prop {string} action
 * @prop {Object.<string, AjaxActionInput>} inputs
 */
export interface AjaxActionData {
  id: string
  action: string
  inputs: {
    [key: string]: AjaxActionInput
  }
}

/**
 * @typedef AjaxActionArgs
 * @type {AjaxActionData}
 * @prop {GenericStrings} env
 * @prop {Request} request
 */
export interface AjaxActionArgs extends AjaxActionData {
  env: GenericStrings
  request: Request
}

/**
 * @typedef {object} AjaxActionReturn
 * @prop {object} [error]
 * @prop {string} error.message
 * @prop {Response} error.resp
 * @prop {object} [success]
 * @prop {string} success.message
 * @prop {GenericStrings} [headers]
 */
export interface AjaxActionReturn {
  error?: {
    message: string
    resp?: Response
  }
  success?: {
    message: string
    headers?: GenericStrings
  }
}
