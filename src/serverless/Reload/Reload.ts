/**
 * Serverless - Reload
 */

/* Imports */

import type { ReloadArgs, ReloadQuery } from './ReloadTypes.js'
import { config, setConfig, setConfigFilter } from '../../config/config.js'
import { getAllContentfulData } from '../../utils/contentful/contentfulData.js'
import { isObjectStrict } from '../../utils/object/object.js'
import { isStringStrict } from '../../utils/string/string.js'
import { isFunction } from '../../utils/function/function.js'
import { setFilters } from '../../utils/filters/filters.js'
import { setActions } from '../../utils/actions/actions.js'
import { setShortcodes } from '../../utils/shortcodes/shortcodes.js'
import { getPathDepth } from '../../utils/path/path.js'
import { print } from '../../utils/print/print.js'
import { render } from '../../render/render.js'

/**
 * Output paginated and/or filtered page on browser reload
 *
 * @param {ReloadArgs} args
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
    print('[SSF] Error with reload function', error)

    const statusCode = 500

    let html = ''

    if (isFunction(config.renderHttpError)) {
      html = await config.renderHttpError({ code: statusCode })
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
