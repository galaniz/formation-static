/**
 * Serverless - Ajax
 */

/* Imports */

import type { AjaxResultOptions, AjaxResultFilterArgs } from './AjaxTypes.js'
import type { ServerlessActionData, ServerlessActionReturn } from '../serverlessTypes.js'
import type { Generic, GenericStrings } from '../../global/globalTypes.js'
import { ResponseError } from '../../utils/ResponseError/ResponseError.js'
import { applyFilters } from '../../utils/filter/filter.js'
import { isObjectStrict } from '../../utils/object/object.js'
import { isStringStrict } from '../../utils/string/string.js'
import { isNumber } from '../../utils/number/number.js'
import { isFunction } from '../../utils/function/function.js'
import { print } from '../../utils/print/print.js'
import { serverlessActions } from '../serverless.js'

/**
 * Handle ajax requests by processing data and calling serverless actions.
 *
 * @param {Request} request
 * @param {Generic} env
 * @param {GenericStrings} [headers]
 * @param {string} [honeypotName]
 * @return {Promise<Response>}
 */
const Ajax = async (
  request: Request,
  env: Generic,
  headers?: GenericStrings,
  honeypotName?: string
): Promise<Response> => {
  const ajaxHeaders = {
    'Content-Type': 'application/json',
    ...headers
  }

  try {
    /* Request must be post */

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: ajaxHeaders
      })
    }

    /* Form data */

    const data = await request.json() as ServerlessActionData | undefined

    /* Data must be object */

    if (!isObjectStrict(data)) {
      throw new Error('Data not an object')
    }

    /* Honeypot check */

    if (isStringStrict(honeypotName) && isObjectStrict(data.inputs?.[honeypotName])) { // eslint-disable-line @typescript-eslint/no-unnecessary-condition
      const honeypotValue = data.inputs[honeypotName].value

      if (isStringStrict(honeypotValue)) {
        return new Response(JSON.stringify({ success: 'Form successully sent' }), {
          status: 200,
          headers: ajaxHeaders
        })
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
      headers: ajaxHeaders
    }

    let message = ''

    if (res.success) {
      const {
        message: successMessage,
        headers: successHeaders
      } = res.success

      if (isStringStrict(successMessage)) {
        message = successMessage
      }

      if (isObjectStrict(successHeaders)) {
        options.headers = { ...options.headers, ...successHeaders }
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

    return new Response(JSON.stringify({ error: message }), {
      status: statusCode,
      headers: ajaxHeaders
    })
  }
}

/* Exports */

export { Ajax }
