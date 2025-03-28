/**
 * Serverless - Send Form Mock
 */

/* Imports */

import type { MockFetchResult, MockFetchOptions } from '../../../../tests/types.js'
import type { SendFormRequestBody } from '../SendFormTypes.js'
import { mockFetchErrorMessage } from '../../../../tests/types.js'
import { vi } from 'vitest'
import { isStringStrict } from '../../../utils/string/string.js'
import { isArrayStrict } from '../../../utils/array/array.js'

/**
 * Mock fetch function
 *
 * @param {string} url
 * @param {MockFetchOptions} options
 * @return {Promise<MockFetchResult>}
 */
const mockSendFormFetch = vi.fn(async (
  url: string,
  options: MockFetchOptions
): Promise<MockFetchResult> => {
  return await new Promise((resolve) => {
    /* Status */

    let status = 200

    /* Headers */

    const headers = new Headers()

    /* Data */

    let data: undefined | {
      data: {
        succeeded?: number
        error?: string
      }
    }

    /* Url check */

    if (url !== 'https://api.smtp2go.com/v3/email/send') {
      status = 400
      data = {
        data: {
          error: mockFetchErrorMessage.url
        }
      }
    }

    /* Body */

    const { body } = options
    const isBodyString = isStringStrict(body)

    if (isBodyString) {
      const {
        api_key: apiKey,
        to: toEmails,
        sender: senderEmail,
        subject,
        text_body: textBody,
        html_body: htmlBody
      } = JSON.parse(body) as SendFormRequestBody

      /* Check if api key is correct */

      if (apiKey !== 'test' && !data) {
        status = 401
        data = {
          data: {
            error: mockFetchErrorMessage.auth
          }
        }
      }

      /* Check to emails */

      if ((!isArrayStrict(toEmails) && !isStringStrict(toEmails)) && !data) {
        status = 400
        data = {
          data: {
            error: 'No to email(s)'
          }
        }
      }

      /* Check sender email */

      if (!isStringStrict(senderEmail) && !data) {
        status = 400
        data = {
          data: {
            error: 'No sender email'
          }
        }
      }

      /* Check subject */

      if (!isStringStrict(subject) && !data) {
        status = 400
        data = {
          data: {
            error: 'No subject'
          }
        }
      }

      /* Check text body */

      if ((!isStringStrict(textBody) && !isStringStrict(htmlBody)) && !data) {
        status = 400
        data = {
          data: {
            error: 'No email body'
          }
        }
      }
    }

    if (!isBodyString && !data) {
      status = 402
      data = {
        data: {
          error: mockFetchErrorMessage.body
        }
      }
    }

    /* Result */

    if (!data) {
      data = {
        data: {
          succeeded: 1
        }
      }
    }

    const ok = status === 200
    const res = JSON.stringify(data)

    resolve({
      ok,
      status,
      headers,
      body: '',
      text: async () => {
        return await new Promise((resolve) => {
          resolve(res)
        })
      },
      json: async () => {
        return await new Promise((resolve) => {
          resolve(data)
        })
      }
    })
  })
})

/* Exports */

export { mockSendFormFetch }
