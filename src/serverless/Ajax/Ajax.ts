/**
 * Serverless - Ajax
 */

/* Imports */

import type { AjaxResultOptions, AjaxResultFilterArgs } from './AjaxTypes.js'
import type { ServerlessActionData, ServerlessActionReturn } from '../serverlessTypes.js'
import type { Generic } from '../../global/globalTypes.js'
import { ResponseError } from '../../utils/ResponseError/ResponseError.js'
import { applyFilters } from '../../utils/filter/filter.js'
import { isObjectStrict } from '../../utils/object/object.js'
import { isStringStrict } from '../../utils/string/string.js'
import { isNumber } from '../../utils/number/number.js'
import { isFunction } from '../../utils/function/function.js'
import { print } from '../../utils/print/print.js'
import { config } from '../../config/config.js'
import { serverlessActions } from '../serverless.js'

/**
 * Handle ajax requests by processing data and calling serverless actions.
 *
 * @param {Request} request
 * @param {Generic} env
 * @return {Promise<Response>}
 */
const Ajax = async (request: Request, env: Generic): Promise<Response> => {
  try {
    const { method, json } = request

    /* Request must be post */

    if (method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    /* Form data */

    const data = await json() as ServerlessActionData | undefined

    /* Data must be object */

    if (!isObjectStrict(data)) {
      throw new Error('Data not an object')
    }

    /* Honeypot check */

    const honeypotName = `${config.namespace}_asi`

    if (isObjectStrict(data.inputs?.[honeypotName])) { // eslint-disable-line @typescript-eslint/no-unnecessary-condition
      const honeypotValue = data.inputs[honeypotName].value

      if (isStringStrict(honeypotValue)) {
        const options = {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }

        return new Response(JSON.stringify({ success: 'Form successully sent' }), options)
      }

      delete data.inputs[honeypotName] // eslint-disable-line @typescript-eslint/no-dynamic-delete
    }

    /* Action required */

    const action = data.action

    if (!isStringStrict(action)) {
      throw new Error('No action')
    }

    /* Call functions by action */

    let res: ServerlessActionReturn | null = null

    const ajaxFn = serverlessActions[action]

    if (isFunction(ajaxFn)) {
      res = await ajaxFn(data, request, env)
    }

    const ajaxResultFilterArgs: AjaxResultFilterArgs = {
      data,
      request,
      env
    }

    res = await applyFilters('ajaxResult', res, ajaxResultFilterArgs, true)

    /* Result error */

    if (!res) {
      throw new Error('No result')
    }

    if (res.error) {
      throw new ResponseError(res.error.message, res.error.response)
    }

    /* Result success */

    const options: AjaxResultOptions = {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    let message = ''

    if (res.success) {
      const {
        message: successMessage,
        headers
      } = res.success

      if (isStringStrict(successMessage)) {
        message = successMessage
      }

      if (isObjectStrict(headers)) {
        options.headers = { ...options.headers, ...headers }
      }
    }

    return new Response(JSON.stringify({ success: message }), options)
  } catch (error) {
    print('[FRM] Error with ajax function', error)

    let statusCode = 500
    let message = error instanceof Error ? error.message : 'Unknown error'

    if (error instanceof ResponseError) {
      if (isNumber(error.response?.status)) {
        statusCode = error.response.status
      }

      if (isStringStrict(error.message)) {
        message = error.message
      }
    }

    const options = {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    return new Response(JSON.stringify({ error: message }), options)
  }
}

/* Exports */

export { Ajax }
