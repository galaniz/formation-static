/**
 * Serverless - Reload
 */

/* Imports */

import type { ReloadQuery } from './ReloadTypes.js'
import type { ServerlessContext, ServerlessSetup } from '../serverlessTypes.js'
import type { getAllContentfulData } from '../../contentful/contentfulData.js'
import type { getAllWordPressData } from '../../wordpress/wordpressData.js'
import { isString, isStringStrict } from '../../utils/string/string.js'
import { isObjectStrict } from '../../utils/object/object.js'
import { isFunction } from '../../utils/function/function.js'
import { print } from '../../utils/print/print.js'
import { render, renderHttpError } from '../../render/render.js'

/**
 * Output paginated and/or filtered page on browser reload
 *
 * @param {ServerlessContext} context
 * @param {ServerlessSetup} serverlessSetup
 * @param {function} getData - getAllContentfulData | getAllWordPressData
 * @return {Promise<Response>} Response
 */
const Reload = async (
  context: ServerlessContext,
  serverlessSetup: ServerlessSetup,
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

    if (noPage || noFilters) {
      return next()
    }

    /* Setup */

    serverlessSetup(context)

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

    if (isObjectStrict(data)) {
      const output = data.output

      html = isString(output) ? output : ''
    }

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html;charset=UTF-8'
      }
    })
  } catch (error) {
    print('[SSF] Error with reload function', error)

    const statusCode = 500

    let html = ''

    if (isFunction(renderHttpError)) {
      html = await renderHttpError({ code: statusCode })
    }

    return new Response(html, {
      status: statusCode,
      headers: {
        'Content-Type': 'text/html;charset=UTF-8'
      }
    })
  }
}

/* Export */

export { Reload }
