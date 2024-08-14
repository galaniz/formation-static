/**
 * Utils - WordPress Data Normal
 */

/* Imports */

import type { Block } from '@wordpress/block-serialization-spec-parser'
import type { WordPressDataItem } from './wordpressDataTypes.js'
import type { RenderItem } from '../../render/renderTypes.js'
import { parse } from '@wordpress/block-serialization-spec-parser'
import { isString, isStringStrict } from '../string/string.js'
import { isArrayStrict } from '../array/array.js'
import { isObjectStrict } from '../object/object.js'
import { config } from '../../config/config.js'

/**
 * Convert blocks to flatter props
 *
 * @private
 * @param {Block[]} blocks
 * @return {RenderItem[]}
 */
const _normalizeBlocks = (blocks?: readonly Block[]): RenderItem[] => {
  const newItems: RenderItem[] = []

  /* Blocks must be array */

  if (!isArrayStrict(blocks)) {
    return []
  }

  /* Recurse */

  blocks.forEach((block) => {
    if (!isObjectStrict(block)) {
      return
    }

    const {
      blockName,
      attrs,
      innerBlocks
    } = block

    const contentType = blockName

    if (!isStringStrict(contentType)) {
      return
    }

    const attributes = isObjectStrict(attrs) ? attrs : {}

    const newItem: RenderItem = {
      contentType,
      ...attributes
    }

    if (isString(config.renderTypes[contentType])) {
      newItem.renderType = config.renderTypes[contentType]
    }

    if (isArrayStrict(innerBlocks)) {
      newItem.content = _normalizeBlocks(innerBlocks)
    }

    return newItems.push(newItem)
  })

  /* Output */

  return newItems
}

/**
 * Transform item props to flatter structure
 *
 * @private
 * @param {WordPressDataItem} item
 * @return {RenderItem}
 */
const _normalizeItem = (item: WordPressDataItem): RenderItem => {
  const newItem: RenderItem = {}

  /* Loop item */

  for (const [key, value] of Object.entries(item)) {
    /* Value */

    let val = value

    /* Content type */

    if (key === 'type' && isStringStrict(value)) {
      newItem.contentType = value

      if (isString(config.renderTypes[value])) {
        newItem.renderType = config.renderTypes[value]
      }

      continue
    }

    /* Flatten rendered */

    if (isObjectStrict(value) && isString(value.rendered)) {
      val = value.rendered
    }

    /* Excerpt */

    if (key === 'excerpt') {
      val = val.replace(/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g, '')
    }

    /* Content */

    if (key === 'content' && isString(val)) {
      val = _normalizeBlocks(parse(val))
    }

    /* Set value */

    newItem[key] = val
  }

  /* Output */

  return newItem
}

/**
 * Transform wordpress data into simpler objects
 *
 * @param {WordPressDataItem[]} data
 * @param {RenderItem[]} [_newData]
 * @return {RenderItem[]}
 */
const normalizeWordPressData = (data: WordPressDataItem[], _newData: RenderItem[] = []): RenderItem[] => {
  if (!isArrayStrict(data)) {
    return []
  }

  /* Recurse data */

  data.forEach((item) => {
    if (!isObjectStrict(item)) {
      return
    }

    _newData.push(_normalizeItem(item))
  })

  /* Output */

  return _newData
}

/* Exports */

export { normalizeWordPressData }
