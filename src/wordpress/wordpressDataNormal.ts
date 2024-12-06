/**
 * Utils - WordPress Data Normal
 */

/* Imports */

import type { Block } from '@wordpress/block-serialization-spec-parser'
import type {
  WordPressDataFile,
  WordPressDataItem,
  WordPressDataRendered,
  WordPressDataEmbedded,
  WordPressDataAuthor,
  WordPressDataFeaturedMedia,
  WordPressDataParent,
  WordPressDataRichText
} from './wordpressDataTypes.js'
import type { RenderItem, RenderFile } from '../render/renderTypes.js'
import { parse } from '@wordpress/block-serialization-spec-parser'
import { getObjectKeys } from '../utils/object/objectUtils.js'
import { isString, isStringStrict } from '../utils/string/string.js'
import { isArrayStrict } from '../utils/array/array.js'
import { isObjectStrict } from '../utils/object/object.js'
import { isNumber } from '../utils/number/number.js'
import { config } from '../config/config.js'

/**
 * Camel case version of prop names
 *
 * @type {Object<string, string>}
 */
const camelCaseKeys: Record<string, string> = {
  date_gmt: 'dataGmt',
  modified_gmt: 'modifiedGmt',
  featured_media: 'featuredMedia',
  menu_order: 'menuOrder',
  comment_status: 'commentStatus',
  ping_status: 'pingStatus',
  class_list: 'classList'
}

/**
 * Remove #text tags and set attr
 *
 * @param {WordPressDataRichText} item
 * @return {RenderItem}
 */
const normalizeRichText = (item: WordPressDataRichText): RenderItem => {
  const { tag, content, attrs } = item

  if (tag === '#text') {
    item.tag = ''
  }

  if (isObjectStrict(attrs)) {
    const attr: string[] = []

    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'href') {
        item.link = v
        continue
      }

      attr.push(`${k}="${v}"`)
    }

    if (attr.length > 0) {
      item.attr = attr.join(' ')
      item.attrs = undefined
    }
  }

  if (isArrayStrict(content)) {
    const newContent = content.map((c) => {
      return normalizeRichText(c)
    })

    item.content = newContent
  }

  return item
}

/**
 * Reduce file props
 *
 * @private
 * @param {WordPressDataFile} file
 * @return {RenderFile}
 */
const normalizeFile = (file: WordPressDataFile): RenderFile => {
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
      let {
        width,
        url,
        source_url: src
      } = value

      if (isStringStrict(src)) {
        url = src
      }

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
 * Link embeds to item parent, author, featured media or term
 *
 * @param {WordPressDataEmbedded} value
 * @param {WordPressDataItem} item
 * @param {RenderItem} newItem
 * @return {void}
 */
const normalizeEmbedded = (
  value: WordPressDataEmbedded,
  item: WordPressDataItem,
  newItem: RenderItem
): void => {
  getObjectKeys(value).forEach((k) => {
    const embeds = value[k]

    /* Must be array */

    if (!isArrayStrict(embeds)) {
      return
    }

    /* Author */

    if (k === 'author') {
      embeds.forEach((embed) => {
        if (!isObjectStrict(embed)) {
          return
        }

        const {
          id,
          name,
          url,
          description,
          link,
          slug
        } = embed as WordPressDataAuthor

        if (item.author !== id) {
          return
        }

        newItem.author = {
          id: id.toString(),
          name,
          url,
          description,
          link,
          slug
        }
      })
    }

    /* Parent */

    if (k === 'up') {
      embeds.forEach((embed) => {
        if (!isObjectStrict(embed)) {
          return
        }

        const {
          id,
          link,
          title,
          excerpt,
          type,
          slug
        } = embed as WordPressDataParent

        if (item.parent !== id) {
          return
        }

        newItem.parent = {
          id: id.toString(),
          contentType: type,
          title: isString(title.rendered) ? title.rendered : '',
          excerpt: isString(excerpt.rendered) ? excerpt.rendered : '',
          slug,
          link
        }
      })
    }

    /* Featured media */

    if (k === 'wp:featuredmedia') {
      embeds.forEach((embed) => {
        if (!isObjectStrict(embed)) {
          return
        }

        const {
          id,
          source_url: url,
          media_details: details,
          mime_type: mimeType,
          media_type: type,
          alt_text: alt
        } = embed as WordPressDataFeaturedMedia

        if (!isObjectStrict(details)) {
          return
        }

        const {
          file,
          filesize,
          width,
          height,
          sizes
        } = details

        if (item.featured_media !== id) {
          return
        }

        newItem.featuredMedia = normalizeFile({
          url,
          filename: file.split('/').pop(),
          alt,
          width,
          height,
          filesizeInBytes: filesize,
          subtype: mimeType.split('/').pop(),
          type,
          sizes
        })
      })
    }

    /* Term */

    if (k === 'wp:term') {
      embeds.forEach((embed) => {
        if (!isArrayStrict(embed)) {
          return
        }

        embed.forEach((e) => {
          if (!isObjectStrict(e)) {
            return
          }

          const {
            id,
            link,
            name,
            slug,
            taxonomy
          } = e

          let taxonomyLookup = taxonomy

          if (taxonomy === 'category') {
            taxonomyLookup = 'categories'
          }

          if (taxonomy === 'tag') {
            taxonomyLookup = 'tags'
          }

          const itemTaxonomy = item[taxonomyLookup]

          if (!isArrayStrict(itemTaxonomy)) {
            return
          }

          newItem[taxonomyLookup] = itemTaxonomy.map((taxonomyId) => {
            if (taxonomyId !== id) {
              return taxonomyId
            }

            return {
              id: id.toString(),
              link,
              name,
              slug,
              taxonomy
            }
          })
        })
      })
    }
  })
}

/**
 * Convert blocks to flatter props
 *
 * @private
 * @param {Block[]} blocks
 * @return {RenderItem[]}
 */
const normalizeBlocks = (blocks?: readonly Block[]): RenderItem[] => {
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

    const {
      contentIsAttribute,
      attributeIsItem
    } = attributes

    const attrItemArr = (isStringStrict(attributeIsItem) ? attributeIsItem : '').split(',')
    const attrItemExists = attrItemArr.length > 0

    for (const [key, value] of Object.entries(attributes)) {
      if (!isObjectStrict(value)) {
        continue
      }

      if (attrItemExists && attrItemArr.includes(key)) {
        const itemValue = normalizeItem(value)
        itemValue.content = undefined

        attributes[key] = itemValue
      }

      const attrContentType = value.contentType

      if (attrContentType === 'file') {
        attributes[key] = normalizeFile(value)
      }
    }

    let newItem: RenderItem = {
      contentType,
      ...attributes
    }

    const renderType = config.renderTypes[contentType]

    if (isString(renderType)) {
      newItem.renderType = renderType
    }

    if (renderType === 'richText') {
      newItem = normalizeRichText(newItem)
    }

    if (isArrayStrict(innerBlocks)) {
      const contentAttr = isStringStrict(contentIsAttribute) ? contentIsAttribute : 'content'

      newItem[contentAttr] = normalizeBlocks(innerBlocks)
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
const normalizeItem = (item: WordPressDataItem): RenderItem => {
  const newItem: RenderItem = {}

  /* Loop item */

  for (const [key, value] of Object.entries(item)) {
    /* Value */

    let val = value

    /* Key */

    const k = camelCaseKeys[key] != null ? camelCaseKeys[key] : key

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
      val = normalizeBlocks(parse(val))
    }

    /* Links */

    if (key === '_links') {
      continue
    }

    /* Embeded */

    if (key === '_embedded' && isObj) {
      normalizeEmbedded(value, item, newItem)
      continue
    }

    /* Set value */

    newItem[k as keyof RenderItem] = val
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

    _newData.push(normalizeItem(item))
  })

  /* Output */

  return _newData
}

/* Exports */

export { normalizeWordPressData }
