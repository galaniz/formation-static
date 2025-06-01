/**
 * Render - Inline
 */

/* Imports */

import type { RenderItem, RenderContentArgs, RenderInlineItem } from './renderTypes.js'
import { renderContent, renderItem } from './render.js'
import { isObjectStrict } from '../utils/object/object.js'
import { isString } from '../utils/string/string.js'

/**
 * Convenience wrapper for render content.
 *
 * @param {RenderItem[]} content
 * @param {RenderContentArgs} [args]
 * @return {Promise<string>}
 */
const renderInlineContent = async (
  content: RenderItem[],
  args?: Partial<Omit<RenderContentArgs, 'content'>>
): Promise<string> => {
  return await renderContent({
    content,
    parents: [],
    itemData: {},
    itemContains: new Set(),
    itemHeadings: [],
    ...args
  })
}

/**
 * Convenience wrapper for render item.
 *
 * @param {RenderInlineItem} item
 * @return {Promise<string>}
 */
const renderInlineItem = async (item: RenderInlineItem): Promise<string> => {
  if (!isObjectStrict(item)) {
    return ''
  }

  const res = await renderItem({
    item
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
