/**
 * Contentful - Data Normal
 */

/* Imports */

import type {
  ContentfulDataItem,
  ContentfulDataFields,
  ContentfulDataFile
} from './contentfulDataTypes.js'
import type { RenderItem, RenderFile } from '../render/renderTypes.js'
import type { GenericStrings, InternalLink } from '../global/globalTypes.js'
import { normalizeContentType } from '../utils/contentType/contentType.js'
import { isArrayStrict } from '../utils/array/array.js'
import { isObjectStrict } from '../utils/object/object.js'
import { isString, isStringStrict } from '../utils/string/string.js'
import { getObjectKeys } from '../utils/object/objectUtils.js'
import { isNumber } from '../utils/number/number.js'
import { config } from '../config/config.js'

/**
 * HTML tag from type.
 *
 * @private
 * @param {string} type
 * @return {string}
 */
const getTag = (type: string = 'text'): string => {
  const tags: GenericStrings = {
    br: 'br',
    hr: 'hr',
    paragraph: 'p',
    blockquote: 'blockquote',
    bold: 'b',
    italic: 'i',
    underline: 'u',
    superscript: 'sup',
    subscript: 'sub',
    code: 'code',
    hyperlink: 'a',
    'entry-hyperlink': 'a',
    'asset-hyperlink': 'a',
    'heading-1': 'h1',
    'heading-2': 'h2',
    'heading-3': 'h3',
    'heading-4': 'h4',
    'heading-5': 'h5',
    'heading-6': 'h6',
    'list-item': 'li',
    'unordered-list': 'ul',
    'ordered-list': 'ol',
    table: 'table',
    'table-row': 'tr',
    'table-cell': 'td',
    'table-header-cell': 'th'
  }

  return tags[type] || ''
}

/**
 * Convert rich text to flatter props.
 *
 * @private
 * @param {ContentfulDataItem[]} items
 * @return {RenderItem[]}
 */
const normalizeRichText = (items: ContentfulDataItem[]): RenderItem[] => {
  const newItems: RenderItem[] = []

  /* Recurse */

  items.forEach(item => {
    if (!isObjectStrict(item)) {
      return
    }

    const {
      nodeType,
      data,
      value,
      marks,
      content
    } = item

    /* Tag */

    const tag = getTag(nodeType)

    /* Content */

    let contentValue

    if (isStringStrict(value)) {
      contentValue = value
      contentValue = contentValue.replace(/\n/g, '<br>')

      if (isArrayStrict(marks)) {
        const markTags = marks.map(m => {
          return getTag(m.type)
        })

        const markStart = markTags.map(m => `<${m}>`).join('')
        const markEnd = markTags.map(m => `</${m}>`).join('')

        contentValue = `${markStart}${value}${markEnd}`
      }
    }

    if (isStringStrict(content)) {
      contentValue = content
    }

    if (isArrayStrict(content)) {
      const contentArr = normalizeRichText(content)

      if (contentArr.length) {
        contentValue = contentArr
      }
    }

    /* Link */

    let link: string | undefined
    let internalLink: ContentfulDataItem | undefined

    if (isObjectStrict(data)) {
      link = isString(data.uri) ? data.uri : ''

      if (isObjectStrict(data.target)) {
        const target = data.target

        if (nodeType === 'entry-hyperlink' || nodeType === 'embedded-entry-inline') {
          internalLink = target
        }

        const url = target.fields?.file?.url

        if (nodeType === 'asset-hyperlink' && isString(url)) {
          link = `https:${url}`
        }
      }
    }

    /* Output */

    if (!contentValue) {
      return
    }

    const newItem: RenderItem = {
      content: contentValue
    }

    if (isStringStrict(tag)) {
      newItem.tag = tag
    }

    if (isStringStrict(link)) {
      newItem.link = link
    }

    if (isObjectStrict(internalLink)) {
      newItem.internalLink = normalizeItem(internalLink, [], true) as InternalLink
    }

    return newItems.push(newItem)
  })

  /* Output */

  return newItems
}

/**
 * Flatten nested file props.
 *
 * @private
 * @param {ContentfulDataFile} file
 * @param {ContentfulDataFields} fields
 * @return {RenderFile}
 */
const normalizeFile = (file: ContentfulDataFile, fields: ContentfulDataFields): RenderFile => {
  const type = isString(file.contentType) ? file.contentType : ''
  const format = type ? type.split('/')[1] : ''

  return {
    url: isString(file.url) ? `https:${file.url}` : '',
    name: isString(file.fileName) ? file.fileName : '',
    alt: isString(fields.description) ? fields.description : '',
    width: isNumber(file.details?.image?.width) ? file.details.image.width : 0,
    height: isNumber(file.details?.image?.height) ? file.details.image.height : 0,
    size: isNumber(file.details?.size) ? file.details.size : 0,
    format: format === 'jpeg' ? 'jpg' : format,
    type
  }
}

/**
 * Transform item props to flatter structure.
 *
 * @private
 * @param {ContentfulDataItem} item
 * @param {RenderItem[]} data
 * @param {boolean} [isInternalLink]
 * @return {RenderItem}
 */
const normalizeItem = (item: ContentfulDataItem, data: RenderItem[], isInternalLink: boolean = false): RenderItem => {
  let newItem: RenderItem = {}

  /* Item */

  const itemCopy = { ...item }

  /* Id */

  if (isString(itemCopy.sys?.id)) {
    newItem.id = itemCopy.sys.id
  }

  /* Locale */

  if (isStringStrict(itemCopy.sys?.locale)) {
    newItem.locale = itemCopy.sys.locale
  }

  /* Type */

  let type = ''

  if (isString(itemCopy.sys?.type)) {
    type = itemCopy.sys.type
  }

  if (isString(itemCopy.sys?.contentType?.sys?.id)) {
    type = itemCopy.sys.contentType.sys.id
  }

  if (type && type !== 'Link') {
    newItem.contentType = normalizeContentType(type)

    if (isString(config.renderTypes[type])) {
      newItem.renderType = config.renderTypes[type]
    }
  }

  /* Metadata tags */

  if (isArrayStrict(itemCopy.metadata?.tags)) {
    newItem.metadata = {
      tags: itemCopy.metadata.tags.map(t => {
        return {
          id: isString(t.sys?.id) ? t.sys.id : ''
        }
      })
    }
  }

  /* Fields and file */

  if (isObjectStrict(itemCopy.fields)) {
    const fields = itemCopy.fields
    const file = fields.file

    if (isObjectStrict(file)) {
      return Object.assign(normalizeFile(file, fields), newItem)
    }

    getObjectKeys(fields).forEach(prop => {
      const field = fields[prop] as ContentfulDataItem[] | ContentfulDataItem | string

      if (prop === 'content' && isInternalLink) {
        return
      }

      if (isObjectStrict(field)) {
        if (field.nodeType === 'document') {
          const { content } = field

          if (isArrayStrict(content)) {
            newItem[prop] = content.map(c => {
              return isObjectStrict(c) ? normalizeItem(c, data, isInternalLink) : c
            })
          }
        } else {
          newItem[prop] = normalizeItem(field, data, prop === 'internalLink')
        }
      } else if (isArrayStrict(field)) {
        newItem[prop] = field.map(f => {
          return isObjectStrict(f) ? normalizeItem(f, data, isInternalLink) : f
        })
      } else {
        newItem[prop] = field
      }
    })
  }

  /* Rich text/nested content */

  if (isString(itemCopy.nodeType)) {
    const nodeType = itemCopy.nodeType

    if (nodeType === 'embedded-entry-block' || nodeType === 'embedded-asset-block') {
      const content = isObjectStrict(itemCopy.data?.target) ? itemCopy.data.target : {}

      newItem = normalizeItem(content, data, isInternalLink)
    } else {
      newItem.renderType = 'richText'
      newItem.tag = getTag(itemCopy.nodeType)

      if (isString(itemCopy.content)) {
        newItem.content = itemCopy.content
      }

      if (isArrayStrict(itemCopy.content)) {
        newItem.content = normalizeRichText(itemCopy.content)
      }
    }
  }

  /* Output */

  return newItem
}

/**
 * Transform Contentful data into simpler objects.
 *
 * @param {ContentfulDataItem[]} data
 * @return {RenderItem[]}
 */
const normalizeContentfulData = (data: ContentfulDataItem[], _newData: RenderItem[] = []): RenderItem[] => {
  if (!isArrayStrict(data)) {
    return []
  }

  /* Recurse data */

  data.forEach(item => {
    if (!isObjectStrict(item)) {
      return
    }

    _newData.push(normalizeItem(item, _newData))
  })

  /* Output */

  return _newData
}

/* Exports */

export { normalizeContentfulData }
