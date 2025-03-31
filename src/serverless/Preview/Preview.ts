/**
 * Serverless - Preview
 */

/* Imports */

import type { ServerlessContext, ServerlessSetup } from '../serverlessTypes.js'
import type { getAllContentfulData } from '../../contentful/contentfulData.js'
import type { getAllWordPressData } from '../../wordpress/wordpressData.js'
import { isStringStrict } from '../../utils/string/string.js'
import { isObjectStrict } from '../../utils/object/object.js'
import { isFunction } from '../../utils/function/function.js'
import { render, renderHttpError } from '../../render/render.js'
import { minify } from '../../utils/minify/minify.js'

/**
 * Output preview from contentful or wordpress
 *
 * @param {ServerlessContext} context
 * @param {ServerlessSetup} setupServerless
 * @param {function} getData - getAllContentfulData | getAllWordPressData
 * @return {Promise<Response>} Response
 */
const Preview = async (
  context: ServerlessContext,
  setupServerless: ServerlessSetup,
  getData: typeof getAllContentfulData | typeof getAllWordPressData
): Promise<Response> => {
  /* Params */

  const { request, next } = context
  const { searchParams } = new URL(request.url)
  const contentType = searchParams.get('content_type')
  const id = searchParams.get('preview')

  /* Preview id and content type required */

  if (!isStringStrict(id) || !isStringStrict(contentType)) {
    return next()
  }

  /* Setup */

  await setupServerless(context, 'preview')

  /* Data params */

  const previewData = { id, contentType }

  /* Output */

  const data = await render({
    previewData,
    allData: await getData({
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
}

/* Export */

export { Preview }
