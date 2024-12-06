/**
 * Render - Inline
 */

/* Imports */

import type { RenderItem, RenderInlineItemArgs } from './renderTypes.js'
import { renderContent, renderItem } from './render.js'
import { isObjectStrict } from '../utils/object/object.js'
import { isString } from '../utils/string/string.js'

/**
 * Convenience wrapper for render content
 *
 * @param {RenderItem[]} items
 * @return {Promise<string>}
 */
const renderInlineContent = async (items: RenderItem[]): Promise<string> => {
  return await renderContent({
    content: items,
    parents: [],
    pageData: {},
    pageContains: [],
    pageHeadings: [],
    navigations: {}
  })
}

/**
 * Convenience wrapper for render item
 *
 * @param {RenderInlineItemArgs} args
 * @return {Promise<string>}
 */
const renderInlineItem = async (args: RenderInlineItemArgs): Promise<string> => {
  if (!isObjectStrict(args)) {
    return ''
  }

  const { contentType } = args

  const res = await renderItem({
    item: args,
    contentType
  })

  if (isString(res?.data?.output)) {
    return res.data.output
  }

  return ''
}

/* Exports */

export {
  renderInlineContent,
  renderInlineItem
}
