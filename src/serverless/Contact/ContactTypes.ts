/**
 * Serverless - Contact Types
 */

/* Imports */

import type { ServerlessActionData, ServerlessActionReturn } from '../serverlessTypes.js'

/**
 * @typedef {Object<string, string[]|ContactData>} ContactData
 */
export interface ContactData {
  [key: string]: string[] | ContactData
}

/**
 * @typedef {object} ContactBody
 * @extends {ServerlessActionData}
 * @prop {string[]} to
 * @prop {string} sender
 * @prop {string} subject
 * @prop {string} text
 * @prop {string} html
 * @prop {string} [replyTo]
 */
export interface ContactBody extends ServerlessActionData {
  to: string[]
  sender: string
  subject: string
  text: string
  html: string
  replyTo?: string
}

/**
 * @typedef {function} ContactResultFilter
 * @param {ServerlessActionReturn|null} res
 * @param {ContactBody} args
 * @return {Promise<ServerlessActionReturn|null>}
 */
export type ContactResultFilter = (
  res: ServerlessActionReturn | null,
  args: ContactBody
) => Promise<ServerlessActionReturn | null>
