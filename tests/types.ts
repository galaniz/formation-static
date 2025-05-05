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
 * @typedef {function} MockFetchText
 * @return {Promise<string>}
 */
export type MockFetchText = () => Promise<string>

/**
 * @typedef {function} MockFetchJson
 * @return {Promise<object>}
 */
export type MockFetchJson = () => Promise<object>

/**
 * @typedef {function} MockFetchArrayBuffer
 * @return {Promise<ArrayBuffer>}
 */
export type MockFetchArrayBuffer = () => Promise<ArrayBuffer>

/**
 * @typedef {object} MockFetchResult
 * @prop {boolean} ok
 * @prop {number} status
 * @prop {Headers} headers
 * @prop {string} body
 * @prop {MockFetchText} text
 * @prop {MockFetchJson} json
 */
export interface MockFetchResult {
  ok: boolean
  status: number
  headers: Headers
  body: string
  text: MockFetchText
  json: MockFetchJson
}

/**
 * @typedef {object} MockFetchImageResult
 * @prop {boolean} ok
 * @prop {number} status
 * @prop {MockFetchArrayBuffer} arrayBuffer
 */
export interface MockFetchImageResult {
  ok: boolean
  status: number
  arrayBuffer: MockFetchArrayBuffer
}

/**
 * @typedef {object} MockErrorMessage
 * @prop {string} data
 * @prop {string} route
 * @prop {string} contentType
 * @prop {string} auth
 * @prop {string} body
 */
export const mockFetchErrorMessage: {
  data: string
  route: string
  contentType: string
  auth: string
  body: string
} = {
  data: 'Data not found',
  route: 'Route does not exist',
  contentType: 'Content type does not exist',
  auth: 'Authorization is invalid',
  body: 'Body is not a string'
}
