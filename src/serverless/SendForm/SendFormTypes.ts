/**
 * Serverless - Send Form Types
 */

/**
 * @typedef {Object.<string, (string[]|SendFormOutputData)>} SendFormOutputData
 */
export interface SendFormOutputData {
  [key: string]: string[] | SendFormOutputData
}

/**
 * @typedef {object} SendFormRequestBody
 * @prop {string} api_key
 * @prop {string[]} to
 * @prop {string} sender
 * @prop {string} subject
 * @prop {string} text_body
 * @prop {string} html_body
 * @prop {Generic[]} custom_headers
 */
export interface SendFormRequestBody {
  api_key: string
  to: string[]
  sender: string
  subject: string
  text_body: string
  html_body: string
  custom_headers?: unknown[]
}

/**
 * @typedef {object} SendFormRequestRes
 * @prop {object} data
 * @prop {number} data.succeeded
 */
export interface SendFormRequestRes {
  data: {
    succeeded: number
  }
}
