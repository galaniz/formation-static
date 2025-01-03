/**
 * Serverless - Reload
 */

/* Imports */

import type { ReloadQuery } from './ReloadTypes.js'
import type { ServerlessContext, ServerlessSetup } from '../serverlessTypes.js'
import type { getAllContentfulData } from '../../contentful/contentfulData.js'
import type { getAllWordPressData } from '../../wordpress/wordpressData.js'
import { isStringStrict } from '../../utils/string/string.js'
import { isObjectStrict } from '../../utils/object/object.js'
import { isFunction } from '../../utils/function/function.js'
import { print } from '../../utils/print/print.js'
import { render, renderHttpError } from '../../render/render.js'

/**
 * Error html output
 *
 * @private
 * @param {ServerlessContext} context
 * @param {ServerlessSetup} setupServerless
 * @param {number} status
 * @return {Promise<string>} html
 */
const getErrorHtml = async (
  context: ServerlessContext,
  setupServerless: ServerlessSetup,
  status: number
): Promise<string> => {
  try {
    setupServerless(context)

    if (isFunction(renderHttpError)) {
      return await renderHttpError({ code: status })
    }
  } catch (error) {
    print('[SSF] Error rendering http error', error)
  }

  return ''
}

/**
 * Output paginated and/or filtered page on browser reload
 *
 * @param {ServerlessContext} context
 * @param {ServerlessSetup} setupServerless
 * @param {function} getData - getAllContentfulData | getAllWordPressData
 * @return {Promise<Response>} Response
 */
const Reload = async (
  context: ServerlessContext,
  setupServerless: ServerlessSetup,
  getData: typeof getAllContentfulData | typeof getAllWordPressData
): Promise<Response> => {
  try {
    /* Query */

    const { request, next } = context
    const { searchParams, pathname } = new URL(request.url)
    const page = searchParams.get('page')
    const filters = searchParams.get('filters')
    const path = pathname
    const query: ReloadQuery = {}

    let noPage = false
    let noFilters = false

    if (isStringStrict(page)) {
      query.page = page
    } else {
      noPage = true
    }

    if (isStringStrict(filters)) {
      query.filters = filters
    } else {
      noFilters = true
    }

    /* No query move on to default page */

    if (noPage && noFilters) {
      return next() // eslint-disable-line @typescript-eslint/return-await
    }

    /* Setup */

    setupServerless(context)

    /* Data params */

    const serverlessData = { query, path }

    /* Output */

    const data = await render({
      serverlessData,
      allData: await getData({
        serverlessData
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

    return new Response(html, {
      status,
      headers: {
        'Content-Type': 'text/html;charset=UTF-8'
      }
    })
  } catch (error) {
    print('[SSF] Error with reload function', error)

    const status = 500
    const html = await getErrorHtml(context, setupServerless, status)

    return new Response(html, {
      status,
      headers: {
        'Content-Type': 'text/html;charset=UTF-8'
      }
    })
  }
}

/* Export */

export { Reload }
