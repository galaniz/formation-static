/**
 * Serverless
 */

/* Import */

import type {
  ServerlessActions,
  ServerlessActionData,
  ServerlessActionReturn,
  ServerlessResultFilterArgs,
  ServerlessResultOptions
} from './serverlessTypes.js'
import type { RenderPreviewData, RenderServerlessData } from '../render/renderTypes.js'
import type { Generic, GenericStrings } from '../global/globalTypes.js'
import type { getAllContentfulData } from '../contentful/contentfulData.js'
import type { getAllWordPressData } from '../wordpress/wordpressData.js'
import { ResponseError } from '../utils/ResponseError/ResponseError.js'
import { isStringSafe, isStringStrict } from '../utils/string/string.js'
import { isObjectStrict } from '../utils/object/object.js'
import { isFunction } from '../utils/function/function.js'
import { applyFilters } from '../filters/filters.js'
import { render, renderHttpError } from '../render/render.js'
import { minify } from '../utils/minify/minify.js'
import { print } from '../utils/print/print.js'

/**
 * Actions to use in serverless functions.
 *
 * @type {ServerlessActions}
 */
let serverlessActions: ServerlessActions = {}

/**
 * Check if request is a preview.
 *
 * @param {Request} request
 * @return {RenderPreviewData|undefined}
 */
const serverlessPreview = (request: Request): RenderPreviewData | undefined => {
  /* Params */

  const { url } = request
  const { searchParams } = new URL(url)
  const contentType = searchParams.get('content_type')
  const locale = searchParams.get('locale')
  const id = searchParams.get('preview')

  /* ID and content type required */

  if (!isStringStrict(id) || !isStringStrict(contentType)) {
    return
  }

  /* Result */

  const previewData: RenderPreviewData = { id, contentType }

  if (isStringStrict(locale)) {
    previewData.locale = locale
  }

  return previewData
}

/**
 * Check if request is a paginated and/or filtered page.
 *
 * @param {Request} request
 * @param {string[]} [allowedParams]
 * @return {RenderServerlessData|undefined}
 */
const serverlessReload = (
  request: Request,
  allowedParams: string[] = ['page', 'filters']
): RenderServerlessData | undefined => {
  /* Query */

  const { url } = request
  const { searchParams, pathname } = new URL(url)
  const path = pathname
  const query: Record<string, string> = {}

  let hasParams = false

  for (const param of allowedParams) {
    const value = searchParams.get(param)

    if (isStringSafe(param) && isStringStrict(value) ) {
      query[param] = value
      hasParams = true
    }
  }

  /* No params */

  if (!hasParams) {
    return
  }

  /* Result */

  return { query, path }
}

/**
 * Re-render with serverless or preview data.
 *
 * @param {getAllContentfulData|getAllWordPressData} getData
 * @param {RenderServerlessData} [serverlessData]
 * @param {RenderPreviewData} [previewData]
 * @return {Promise<Response>}
 */
const serverlessRender = async (
  getData: typeof getAllContentfulData | typeof getAllWordPressData,
  serverlessData?: RenderServerlessData,
  previewData?: RenderPreviewData
): Promise<Response> => {
  try {
    const data = await render({
      serverlessData,
      previewData,
      allData: await getData({
        serverlessData,
        previewData
      })
    })

    let html = ''
    let status = 200

    if (isObjectStrict(data)) {
      html = data.output
    }

    const isEmpty = html === ''

    if (isEmpty) {
      status = 404
    }

    if (isEmpty && isFunction(renderHttpError)) {
      html = await renderHttpError({ code: status })
    }

    return new Response(minify(html), {
      status,
      headers: {
        'Content-Type': 'text/html;charset=UTF-8'
      }
    })
  } catch (error) {
    print('[FRM] Error on serverless render', error)
  
    const status = 500
    const html = await renderHttpError({ code: status })

    return new Response(html, {
      status,
      headers: {
        'Content-Type': 'text/html;charset=UTF-8'
      }
    })
  }
}

/**
 * Set serverless actions.
 *
 * @param {ServerlessActions} [actions]
 * @return {void}
 */
const setServerless = (actions?: ServerlessActions): void => {
  if (!isObjectStrict(actions)) {
    return
  }

  serverlessActions = { ...actions }
}

/**
 * Handle POST requests to serverless action.
 *
 * @param {Request} request
 * @param {Generic} env
 * @param {GenericStrings} [headers]
 * @param {string} [honeypotName]
 * @return {Promise<Response>}
 */
const doServerlessAction = async (
  request: Request,
  env: Generic,
  headers?: GenericStrings,
  honeypotName?: string
): Promise<Response> => {
  const serverlessHeaders = {
    'Content-Type': 'application/json',
    ...headers
  }

  try {
    /* Request must be post */

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: serverlessHeaders
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
        return new Response(JSON.stringify({ success: '' }), {
          status: 200,
          headers: serverlessHeaders
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

    const serverlessAction = serverlessActions[action]

    if (isFunction(serverlessAction)) {
      res = await serverlessAction(data, request, env)
    }

    const serverlessResultFilterArgs: ServerlessResultFilterArgs = {
      data,
      request,
      env
    }

    res = await applyFilters('serverlessResult', res, serverlessResultFilterArgs, true)

    /* Result error */

    if (!res) {
      throw new Error('No result')
    }

    if (res.error) {
      const errorMessage = res.error.message
      throw res.error.response ? new ResponseError(errorMessage, res.error.response) : new Error(errorMessage)
    }

    /* Result success */

    const options: ServerlessResultOptions = {
      status: 200,
      headers: serverlessHeaders
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
    print('[FRM] Error with serverless action', error)

    let statusCode = 500
    let message = error instanceof Error ? error.message : 'Unknown error'

    if (error instanceof ResponseError) {
      statusCode = error.response.status
      message = error.message
    }

    return new Response(JSON.stringify({ error: message }), {
      status: statusCode,
      headers: serverlessHeaders
    })
  }
}

/* Exports */

export {
  serverlessActions,
  serverlessPreview,
  serverlessReload,
  serverlessRender,
  setServerless,
  doServerlessAction
}
