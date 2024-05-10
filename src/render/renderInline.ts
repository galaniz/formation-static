/**
 * Render - Inline
 */

/* Imports */

import type { RenderItem, RenderInlineItemArgs } from './renderTypes'
import { renderContent, renderItem, getRenderFunctions } from './render'
import { isObjectStrict } from '../utils/isObject/isObject'
import { isString } from '../utils/isString/isString'

/**
 * Function - convenience wrapper for render content
 *
 * @param {import('./renderTypes').RenderItem[]} items
 * @return {Promise<string>}
 */
const renderInlineContent = async (items: RenderItem[]): Promise<string> => {
  return await renderContent({
    content: items,
    parents: [],
    pageData: {},
    pageContains: [],
    pageHeadings: [],
    navigations: {},
    renderFunctions: getRenderFunctions()
  })
}

/**
 * Function - convenience wrapper for render item
 *
 * @param {import('./renderTypes').RenderInlineItemArgs} args
 * @return {Promise<string>}
 */
const renderInlineItem = async (args: RenderInlineItemArgs): Promise<string> => {
  if (!isObjectStrict(args)) {
    return ''
  }

  const { contentType } = args

  const res = await renderItem({
    item: args,
    contentType,
    renderFunctions: getRenderFunctions()
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
