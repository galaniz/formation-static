/**
 * Serverless - Preview
 */

/* Imports */

import type { ServerlessContext, ServerlessSetup } from '../serverlessTypes.js'
import type { getAllContentfulData } from '../../contentful/contentfulData.js'
import type { getAllWordPressData } from '../../wordpress/wordpressData.js'
import { isString, isStringStrict } from '../../utils/string/string.js'
import { isObjectStrict } from '../../utils/object/object.js'
import { render } from '../../render/render.js'

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
    return next() // eslint-disable-line @typescript-eslint/return-await
  }

  /* Setup */

  setupServerless(context)

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
}

/* Export */

export { Preview }
