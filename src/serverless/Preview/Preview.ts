/**
 * Serverless - Preview
 */

/* Imports */

import type { PreviewArgs } from './PreviewTypes.js'
import { setConfig, setConfigFilter } from '../../config/config.js'
import { getAllContentfulData } from '../../utils/contentful/contentfulData.js'
import { isObjectStrict } from '../../utils/object/object.js'
import { isStringStrict } from '../../utils/string/string.js'
import { setFilters } from '../../utils/filter/filter.js'
import { setActions } from '../../utils/action/action.js'
import { setShortcodes } from '../../utils/shortcode/shortcode.js'
import { getPathDepth } from '../../utils/path/path.js'
import { render } from '../../render/render.js'

/**
 * Output preview from contentful
 *
 * @param {PreviewArgs} args
 * @return {Promise<Response>} Response
 */
const Preview = async ({ request, functionPath, next, env, siteConfig }: PreviewArgs): Promise<Response> => {
  /* Params */

  const { searchParams } = new URL(request.url)
  const contentType = searchParams.get('content_type')
  const id = searchParams.get('preview')

  /* Preview id and content type required */

  if (!isStringStrict(id) || !isStringStrict(contentType)) {
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

  const previewData = { id, contentType }

  /* Output */

  const data = await render({
    previewData,
    allData: await getAllContentfulData({
      previewData
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
}

/* Export */

export { Preview }
