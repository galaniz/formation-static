/**
 * Serverless
 */

/* Import */

import type { ServerlessActions } from './serverlessTypes.js'
import type { RenderPreviewData, RenderServerlessData } from '../render/renderTypes.js'
import type { getAllContentfulData } from '../contentful/contentfulData.js'
import type { getAllWordPressData } from '../wordpress/wordpressData.js'
import { isStringStrict } from '../utils/string/string.js'
import { isObjectStrict } from '../utils/object/object.js'
import { isFunction } from '../utils/function/function.js'
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
  const { method, url } = request

  /* Request must be get */

  if (method !== 'GET') {
    return
  }

  /* Params */

  const { searchParams } = new URL(url)
  const contentType = searchParams.get('content_type')
  const locale = searchParams.get('locale')
  const env = searchParams.get('env')
  const id = searchParams.get('preview')

  /* Id and content type required */

  if (!isStringStrict(id) || !isStringStrict(contentType)) {
    return
  }

  /* Result */

  const previewData: RenderPreviewData = { id, contentType }

  if (isStringStrict(locale)) {
    previewData.locale = locale
  }

  if (isStringStrict(env)) {
    previewData.env = env
  }

  return previewData
}

/**
 * Check if request is a paginated and/or filtered page.
 *
 * @param {Request} request
 * @return {RenderServerlessData|undefined}
 */
const serverlessReload = (request: Request): RenderServerlessData | undefined => {
  const { url, method } = request

  /* Request must be get */

  if (method !== 'GET') {
    return
  }

  /* Query */

  const { searchParams, pathname } = new URL(url)
  const page = searchParams.get('page')
  const filters = searchParams.get('filters')
  const path = pathname
  const query: Record<string, string> = {}

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

/* Exports */

export {
  serverlessActions,
  serverlessPreview,
  serverlessReload,
  serverlessRender,
  setServerless
}
