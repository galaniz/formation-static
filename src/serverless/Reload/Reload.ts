/**
 * Serverless - Reload
 */

/* Imports */

import type { ReloadArgs, ReloadQuery } from './ReloadTypes'
import type { CustomErrorObject } from '../serverlessTypes'
import { config, setConfig, setConfigFilter } from '../../config/config'
import { getAllContentfulData } from '../../utils/getAllContentfulData/getAllContentfulData'
import { isObjectStrict } from '../../utils/isObject/isObject'
import { isStringStrict } from '../../utils/isString/isString'
import { isNumber } from '../../utils/isNumber/isNumber'
import { isFunction } from '../../utils/isFunction/isFunction'
import { setFilters } from '../../utils/filters/filters'
import { setActions } from '../../utils/actions/actions'
import { setShortcodes } from '../../utils/shortcodes/shortcodes'
import { getPathDepth } from '../../utils/getPathDepth/getPathDepth'
import { render } from '../../render/render'

/**
 * Function - output paginated and/or filtered page on browser reload
 *
 * @param {import('./ReloadTypes').ReloadArgs} args
 * @return {Promise<Response>} Response
 */
const Reload = async ({ request, functionPath, next, env, siteConfig }: ReloadArgs): Promise<Response> => {
  try {
    /* Query */

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

    /* Config */

    setConfig(siteConfig)

    await setConfigFilter(env)

    siteConfig.env.dir = getPathDepth(functionPath)

    setFilters(siteConfig.filters)
    setActions(siteConfig.actions)
    setShortcodes(siteConfig.shortcodes)

    /* Data params */

    const serverlessData = { query, path }

    /* Output */

    const data = await render({
      serverlessData,
      allData: await getAllContentfulData({
        serverlessData
      })
    })

    let html = ''

    if (isObjectStrict(data)) {
      html = data.output !== undefined ? data.output : ''
    }

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html;charset=UTF-8'
      }
    })
  } catch (error) {
    console.error(config.console.red, '[SSF] Error with reload function: ', error)

    let statusCode = 500

    if (isObjectStrict(error)) {
      const err: CustomErrorObject = error

      if (isNumber(err.httpStatusCode)) {
        statusCode = err.httpStatusCode
      }
    }

    let html = ''

    if (isFunction(config.renderFunctions.httpError)) {
      html = await config.renderFunctions.httpError(statusCode)
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
