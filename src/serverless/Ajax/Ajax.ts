/**
 * Serverless - Ajax
 */

/* Imports */

import type { AjaxArgs, AjaxCustomErrorArgs, AjaxResOptions } from './AjaxTypes'
import type { AjaxActionReturn, AjaxActionArgs, CustomErrorObject } from '../serverlessTypes'
import { setConfig, setConfigFilter } from '../../config/config'
import { setActions } from '../../utils/actions/actions'
import { setShortcodes } from '../../utils/shortcodes/shortcodes'
import { applyFilters, setFilters } from '../../utils/filters/filters'
import { isObjectStrict } from '../../utils/isObject/isObject'
import { isStringStrict } from '../../utils/isString/isString'
import { isNumber } from '../../utils/isNumber/isNumber'
import { getPathDepth } from '../../utils/getPathDepth/getPathDepth'
import { SendForm } from '../SendForm/SendForm'

/**
 * Class - custom exception to include status code
 *
 * @private
 */
class _CustomError extends Error {
  /**
   * Store message
   *
   * @type {string}
   */
  message: string

  /**
   * Store status code
   *
   * @type {number}
   */
  httpStatusCode: number

  /**
   * Set properties
   *
   * @param {import('./AjaxTypes').AjaxCustomErrorArgs} args
   */
  constructor (args: AjaxCustomErrorArgs) {
    if (!isObjectStrict(args)) {
      args = {}
    }

    const {
      message = '',
      code = 500
    } = args

    super(message)
    this.message = message
    this.httpStatusCode = code
  }
}

/**
 * Function - set env variables, normalize request body, check for required props and call actions
 *
 * @param {import('./AjaxTypes').AjaxArgs} args
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

    const data = await request.json()

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
      action,
      ...data,
      env,
      request
    }

    res = await applyFilters('ajaxRes', res, ajaxResFilterArgs)

    /* Result error */

    if (res === null) {
      throw new Error('No result')
    }

    if (res.error !== undefined) {
      throw new _CustomError(res.error)
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
    console.error(siteConfig.console.red, '[SSF] Error with ajax function: ', error)

    let statusCode = 500
    let message = ''

    if (isObjectStrict(error)) {
      const err: CustomErrorObject = error

      if (isNumber(err.httpStatusCode)) {
        statusCode = err.httpStatusCode
      }

      if (isStringStrict(err.message)) {
        message = err.message
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
