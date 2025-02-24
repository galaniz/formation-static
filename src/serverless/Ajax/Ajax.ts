/**
 * Serverless - Ajax
 */

/* Imports */

import type { AjaxResultOptions, AjaxResultFilterArgs } from './AjaxTypes.js'
import type {
  ServerlessContext,
  ServerlessSetup,
  ServerlessActionData,
  ServerlessActionReturn
} from '../serverlessTypes.js'
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
 * Handle ajax requests by processing data and calling serverless actions
 *
 * @param {ServerlessContext} context
 * @param {ServerlessSetup} setupServerless
 * @return {Promise<Response>} Response
 */
const Ajax = async (context: ServerlessContext, setupServerless: ServerlessSetup): Promise<Response> => {
  try {
    /* Setup */

    await setupServerless(context, 'ajax')

    /* Get form data */

    const request = context.request
    const data: ServerlessActionData | undefined = await request.json()

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

      data.inputs[honeypotName].exclude = true
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
      res = await ajaxFn(data, context)
    }

    const ajaxResultFilterArgs: AjaxResultFilterArgs = {
      data,
      context
    }

    res = await applyFilters('ajaxResult', res, ajaxResultFilterArgs, true)

    /* Result error */

    if (res == null) {
      throw new Error('No result')
    }

    if (res.error != null) {
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

    if (res.success != null) {
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
    print('[SSF] Error with ajax function', error)

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
