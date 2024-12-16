/**
 * Tests - Types
 */

/**
 * @typedef {object} MockFetchOptions
 * @prop {string} method
 * @prop {Headers} headers
 * @prop {string|FormData} body
 */
export interface MockFetchOptions {
  method: string
  headers: Headers
  body: string | FormData
}

/**
 * @typedef {object} MockFetchResult
 * @prop {boolean} ok
 * @prop {number} status
 * @prop {Headers} headers
 * @prop {string} body
 * @prop {function} text
 * @prop {function} json
 */
export interface MockFetchResult {
  ok: boolean
  status: number
  headers: Headers
  body: string
  text: Function
  json: Function
}

/**
 * @typedef {object} MockErrorMessage
 * @prop {string} url
 * @prop {string} data
 * @prop {string} route
 */
export const mockFetchErrorMessage: {
  url: string
  data: string
  route: string
  auth: string
} = {
  url: 'URL not valid',
  data: 'Data not found',
  route: 'Route does not exist',
  auth: 'Authorization is invalid'
}
