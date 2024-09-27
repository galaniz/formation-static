/**
 * Utils - WordPress Data Normal
 */

/* Imports */

import type { Block } from '@wordpress/block-serialization-spec-parser'
import type {
  WordPressDataFile,
  WordPressDataItem,
  WordPressDataRendered,
  WordPressDataEmbedded
} from './wordpressDataTypes.js'
import type { RenderItem, RenderFile } from '../../render/renderTypes.js'
import { parse } from '@wordpress/block-serialization-spec-parser'
import { getObjectEntries, getObjectKeys } from '../object/objectUtils.js'
import { isString, isStringStrict } from '../string/string.js'
import { isArrayStrict } from '../array/array.js'
import { isObjectStrict } from '../object/object.js'
import { isNumber } from '../number/number.js'
import { config } from '../../config/config.js'

/**
 * Reduce file props
 *
 * @private
 * @param {WordPressDataFile} file
 * @return {RenderFile}
 */
const _normalizeFile = (file: WordPressDataFile): RenderFile => {
  const {
    url,
    filename,
    alt,
    width,
    height,
    filesizeInBytes,
    subtype,
    type,
    sizes
  } = file

  let s: Record<number, string> | undefined

  if (isObjectStrict(sizes)) {
    s = {}

    for (const [, value] of Object.entries(sizes)) {
      const { width, url } = value

      if (!isNumber(width) || !isStringStrict(url)) {
        continue
      }

      s[width] = url
    }
  }

  return {
    url: isString(url) ? url : '',
    name: isString(filename) ? filename : '',
    alt: isString(alt) ? alt : '',
    width: isNumber(width) ? width : 0,
    height: isNumber(height) ? height : 0,
    size: isNumber(filesizeInBytes) ? filesizeInBytes : 0,
    format: subtype,
    type: isString(type) ? type : '',
    sizes: s
  }
}

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

    for (const [key, value] of Object.entries(attributes)) {
      if (!isObjectStrict(value)) {
        continue
      }

      const attrContentType = value.contentType

      if (attrContentType === 'file') {
        attributes[key] = _normalizeFile(value)
      }
    }

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

  for (const [key, value] of getObjectEntries(item)) {
    /* Value */

    let val = value

    /* Check types */

    const isObj = isObjectStrict(value)

    /* Id */

    if (key === 'id') {
      val = value?.toString()
    }

    /* Content type */

    if (key === 'type' && isStringStrict(value)) {
      newItem.contentType = value

      if (isString(config.renderTypes[value])) {
        newItem.renderType = config.renderTypes[value]
      }

      continue
    }

    /* Flatten rendered */

    if (isObj) {
      const { rendered } = value as WordPressDataRendered

      if (isString(rendered)) {
        val = rendered
      }
    }

    /* Excerpt */

    if (key === 'excerpt' && isString(val)) {
      val = val.replace(/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g, '')
    }

    /* Content */

    if (key === 'content' && isString(val)) {
      val = _normalizeBlocks(parse(val))
    }

    /* Embeded */

    if (key === '_embedded' && isObj) {
      const v = value as WordPressDataEmbedded

      getObjectKeys(v).forEach((k) => {
        const embedVal = v[k]

        if (k === 'wp:term' && isArrayStrict(embedVal)) {
          embedVal.forEach((e) => {
            if (isArrayStrict(e)) {
              e.forEach((ee) => {
                if (isObjectStrict(ee)) {
                  const {
                    id,
                    link,
                    name,
                    slug,
                    taxonomy
                  } = ee

                  const itemTaxonomy = item[taxonomy]

                  if (isArrayStrict(itemTaxonomy)) {
                    newItem[taxonomy] = itemTaxonomy.map((taxonomyId) => {
                      if (taxonomyId === id) {
                        return {
                          id,
                          link,
                          name,
                          slug,
                          taxonomy
                        }
                      }

                      return taxonomyId
                    })
                  }
                }
              })
            }
          })
        }
      })
    }

    /* Set value */

    newItem[key as keyof RenderItem] = val
  }

  /* Output */

  return newItem
}

/**
 * Transform WordPressData data into simpler objects
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
