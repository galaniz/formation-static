/**
 * Serverless - Ajax
 */

/* Imports */

import type { AjaxArgs, AjaxResOptions } from './AjaxTypes.js'
import type {
  AjaxActionData,
  AjaxActionReturn,
  AjaxActionArgs
} from '../serverlessTypes.js'
import { setConfig, setConfigFilter } from '../../config/config.js'
import { setActions } from '../../utils/action/action.js'
import { setShortcodes } from '../../utils/shortcode/shortcode.js'
import { applyFilters, setFilters } from '../../utils/filter/filter.js'
import { isObjectStrict } from '../../utils/object/object.js'
import { isStringStrict } from '../../utils/string/string.js'
import { isNumber } from '../../utils/number/number.js'
import { print } from '../../utils/print/print.js'
import { getPathDepth } from '../../utils/path/path.js'
import { ResponseError } from '../../utils/ResponseError/ResponseError.js'
import { SendForm } from '../SendForm/SendForm.js'

/**
 * Set env variables, normalize request body, check for required props and call actions
 *
 * @param {AjaxArgs} args
 * @return {Promise<Response>} Response
 */
const Ajax = async ({ request, functionPath, env, siteConfig }: AjaxArgs): Promise<Response> => {
  try {
    /* Config */

    setConfig(siteConfig)

    await setConfigFilter(env)

    siteConfig.env.dir = getPathDepth(functionPath)

    setFilters(siteConfig.filters)
    setActions(siteConfig.actions)
    setShortcodes(siteConfig.shortcodes)

    /* Get form data */

    const data = await request.json() as AjaxActionData | undefined

    /* Data must be object */

    if (!isObjectStrict(data)) {
      throw new Error('Data not an object')
    }

    /* Inputs required */

    if (data.inputs === undefined) {
      throw new Error('No inputs')
    }

    /* Honeypot check */

    const honeypotName = `${siteConfig.namespace}_asi`

    if (data.inputs[honeypotName] !== undefined) {
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

    /* Id required */

    if (!isStringStrict(data.id)) {
      throw new Error('No id')
    }

    /* Action required */

    const action = data.action !== undefined ? data.action : ''

    if (!isStringStrict(action)) {
      throw new Error('No action')
    }

    /* Call functions by action */

    let res: AjaxActionReturn | null = null

    if (action === 'sendForm') {
      res = await SendForm({ ...data, env, request })
    }

    if (siteConfig.ajaxFunctions[action] !== undefined) {
      res = await siteConfig.ajaxFunctions[action]({ ...data, env, request })
    }

    const ajaxResFilterArgs: AjaxActionArgs = {
      ...data,
      action,
      env,
      request
    }

    res = await applyFilters('ajaxRes', res, ajaxResFilterArgs)

    /* Result error */

    if (res === null) {
      throw new Error('No result')
    }

    if (res.error !== undefined) {
      throw new ResponseError(res.error.message, res.error.resp)
    }

    /* Result success */

    const options: AjaxResOptions = {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    let message = ''

    if (res.success !== undefined) {
      const {
        message: successMessage,
        headers
      } = res.success

      if (successMessage !== undefined) {
        message = successMessage
      }

      if (headers !== undefined) {
        options.headers = { ...options.headers, ...headers }
      }
    }

    return new Response(JSON.stringify({ success: message }), options)
  } catch (error) {
    print('[SSF] Error with ajax function', error)

    let statusCode = 500
    let message = ''

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
