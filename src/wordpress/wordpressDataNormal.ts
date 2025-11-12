/**
 * WordPress - Data Normal
 */

/* Imports */

import type { InternalLink, Taxonomy, Generic } from '../global/globalTypes.js'
import type {
  WordPressDataFile,
  WordPressDataItem,
  WordPressDataRendered,
  WordPressDataEmbedded,
  WordPressDataAuthor,
  WordPressDataFeaturedMedia,
  WordPressDataParent,
  WordPressDataMenuItem,
  WordPressDataMenuChild,
  WordPressDataMenu,
  WordPressDataMediaDetails,
  WordPressDataMeta
} from './wordpressDataTypes.js'
import type { RenderItem, RenderFile } from '../render/renderTypes.js'
import type { NavigationList, NavigationItem } from '../components/Navigation/NavigationTypes.js'
import { parse } from '@wordpress/block-serialization-default-parser'
import { normalizeContentType } from '../utils/contentType/contentType.js'
import { getObjectKeys } from '../utils/object/objectUtils.js'
import { getStoreItem, setStoreItem } from '../store/store.js'
import { isString, isStringStrict } from '../utils/string/string.js'
import { isArrayStrict } from '../utils/array/array.js'
import { isObjectStrict } from '../utils/object/object.js'
import { isNumber } from '../utils/number/number.js'
import { config } from '../config/config.js'

/**
 * Normalize WordPress routes.
 *
 * @type {Map<string, string>}
 */
const normalRoutes: Map<string, string> = new Map([
  ['page', 'pages'],
  ['post', 'posts'],
  ['taxonomy', 'taxonomies'],
  ['category', 'categories'],
  ['tag', 'tags'],
  ['attachment', 'media'],
  ['nav_menu', 'menus'],
  ['nav_menu_item', 'menu-items']
])

/**
 * Normalize WordPress meta keys.
 *
 * @type {Map<string, string>}
 */
const normalMetaKeys: Map<string, string> = new Map()

/**
 * Menu items grouped by menu ID.
 *
 * @private
 * @type {Map<string, WordPressDataMenuChild[]>}
 */
const menusById: Map<string, WordPressDataMenuChild[]> = new Map()

/**
 * Properties to exclude from item.
 *
 * @private
 * @type {string[]}
 */
const excludeProps: string[] = [
  '_links',
  'auto_add'
]

/**
 * Taxonomy from taxonomies given ID.
 *
 * @private
 * @param {string} id
 * @return {Taxonomy}
 */
const getTaxonomy = (id: string): Taxonomy => {
  const taxonomy = getStoreItem('taxonomies')[id]

  const {
    title = '',
    slug = '',
    contentTypes = []
  } = isObjectStrict(taxonomy) ? taxonomy : {}

  return {
    id,
    title,
    slug,
    contentTypes
    // usePrimaryContentTypeSlug
  }
}

/**
 * Reduce file props.
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
    mime,
    sizes
  } = file

  let newSizes: Record<number, string> | undefined

  if (isObjectStrict(sizes)) {
    newSizes = {}

    for (const [, value] of Object.entries(sizes)) {
      const {
        width,
        source_url: src
      } = value

      let { url } = value

      if (isStringStrict(src)) {
        url = src
      }

      if (!isNumber(width) || !isStringStrict(url)) {
        continue
      }

      newSizes[width] = url
    }
  }

  return {
    url: isString(url) ? url : '',
    name: isString(filename) ? filename : '',
    alt: isString(alt) ? alt : '',
    width: isNumber(width) ? width : 0,
    height: isNumber(height) ? height : 0,
    size: isNumber(filesizeInBytes) ? filesizeInBytes : 0,
    format: subtype === 'jpeg' ? 'jpg' : subtype,
    type: mime,
    sizes: newSizes
  }
}

/**
 * Link embeds to item parent, author, featured media or term.
 *
 * @private
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
  getObjectKeys(value).forEach(k => {
    const embeds = value[k]

    /* Must be array */

    if (!isArrayStrict(embeds)) {
      return
    }

    /* Author */

    if (k === 'author') {
      const exclude = [...excludeProps, 'id', 'avatar_urls']

      embeds.forEach(embed => {
        if (!isObjectStrict(embed)) {
          return
        }

        const { id } = embed as WordPressDataAuthor

        if (item.author !== id) {
          return
        }

        const newAuthor: Generic = {
          id: id.toString()
        }

        Object.entries(embed).forEach(([key, val]) => {
          if (exclude.includes(key)) {
            return
          }

          newAuthor[key] = val
        })

        newItem.author = newAuthor
      })
    }

    /* Parent */

    if (k === 'up') {
      embeds.forEach(embed => {
        if (!isObjectStrict(embed)) {
          return
        }

        const {
          id,
          title: parentTitle,
          name,
          type,
          taxonomy,
          slug
        } = embed as WordPressDataParent

        if (item.parent !== id) {
          return
        }

        let title = ''

        if (isString(parentTitle?.rendered)) {
          title = parentTitle.rendered
        }

        if (isString(name)) {
          title = name
        }

        newItem.parent = {
          id: id.toString(),
          contentType: isString(taxonomy) ? 'term' : type,
          title,
          slug
        }
      })
    }

    /* Featured media */

    if (k === 'wp:featuredmedia') {
      embeds.forEach(embed => {
        if (!isObjectStrict(embed)) {
          return
        }

        const {
          id,
          source_url: url,
          media_details: details,
          mime_type: mimeType,
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

        newItem.featured_media = normalizeFile({
          url,
          filename: file?.split('/').pop(),
          alt,
          width,
          height,
          filesizeInBytes: filesize,
          subtype: mimeType?.split('/').pop(),
          mime: mimeType,
          sizes
        })
      })
    }

    /* Term */

    if (k === 'wp:term') {
      const exclude = [...excludeProps, 'id', 'name', 'taxonomy']

      embeds.forEach(embed => {
        if (!isArrayStrict(embed)) {
          return
        }

        embed.forEach(e => {
          if (!isObjectStrict(e)) {
            return
          }

          const {
            id,
            name,
            taxonomy = ''
          } = e

          let taxonomyLookup = taxonomy

          if (taxonomy === 'category') {
            taxonomyLookup = 'categories'
          }

          if (taxonomy === 'post_tag') {
            taxonomyLookup = 'tags'
          }

          const itemTaxonomy = newItem[taxonomyLookup] ?? item[taxonomyLookup]

          if (!isArrayStrict(itemTaxonomy)) {
            return
          }

          newItem[taxonomyLookup] = itemTaxonomy.map(taxonomyId => {
            if (taxonomyId !== id) {
              return taxonomyId
            }

            const newTerm: Generic = {
              id: id.toString(),
              title: name,
              contentType: 'term',
              taxonomy: getTaxonomy(taxonomy)
            }

            Object.entries(e).forEach(([key, val]) => {
              if (exclude.includes(key)) {
                return
              }

              newTerm[key] = val
            })

            return newTerm
          })
        })
      })
    }
  })
}

/**
 * Convert blocks to flatter props.
 *
 * @private
 * @param {object[]} blocks
 * @return {RenderItem[]}
 */
const normalizeBlocks = (blocks: ReturnType<typeof parse>): RenderItem[] => {
  const newItems: RenderItem[] = []

  /* Recurse */

  type GenericBlock = ReturnType<typeof parse>[number] & { attrs: Generic }

  blocks.forEach(block => {
    const {
      blockName,
      attrs,
      innerBlocks
    } = block as GenericBlock

    const contentType = blockName

    if (!isStringStrict(contentType)) {
      return
    }

    const { isItem } = attrs
    const attrItemArr = (isStringStrict(isItem) ? isItem : '').split(',')
    const attrItemExists = attrItemArr.length

    for (const [key, value] of Object.entries(attrs)) {
      if (!isObjectStrict(value)) {
        continue
      }

      if (attrItemExists && attrItemArr.includes(key)) {
        const itemValue = normalizeItem(value as WordPressDataItem)
        itemValue.content = undefined
        attrs[key] = itemValue
      }

      if (isStringStrict((value as WordPressDataFile).mime)) {
        attrs[key] = normalizeFile(value as WordPressDataFile)
      }
    }

    const newItem: RenderItem = {
      contentType,
      ...attrs
    }

    const renderType = config.renderTypes[contentType]

    if (isString(renderType)) {
      newItem.renderType = renderType
    }

    if (isArrayStrict(innerBlocks)) {
      newItem.content = normalizeBlocks(innerBlocks)
    }

    return newItems.push(newItem)
  })

  /* Output */

  return newItems
}

/**
 * Transform item props to flatter structure.
 *
 * @private
 * @param {WordPressDataItem} item
 * @return {RenderItem}
 */
const normalizeItem = (item: WordPressDataItem): RenderItem => {
  const newItem: RenderItem = {}

  /* Loop item */

  for (const [key, value] of Object.entries(item)) {
    /* Skip prop */

    if (excludeProps.includes(key)) {
      continue
    }

    /* Value */

    let val = value

    /* Key */

    let k = key

    /* Check types */

    const isObj = isObjectStrict(value)
    const isStr = isStringStrict(value)

    /* Id */

    if (key === 'id' || k === 'object_id') {
      val = value?.toString()
    }

    /* Content type */

    if (key === 'type' && isStr) {
      newItem.contentType = normalizeContentType(value)

      if (isString(config.renderTypes[value])) {
        newItem.renderType = config.renderTypes[value]
      }

      continue
    }

    if (key === 'types') {
      k = 'contentTypes'
    }

    /* Flatten rendered */

    if (isObj) {
      const { rendered } = value as WordPressDataRendered

      if (isString(rendered)) {
        val = rendered
      }
    }

    /* Name as title */

    if (key === 'name') {
      k = 'title'
    }

    /* Embedded */

    if (key === '_embedded' && isObj) {
      normalizeEmbedded(value, item, newItem)
      continue
    }

    /* Excerpt, content and taxonomy */

    if (isStringStrict(val)) {
      if (key === 'excerpt') {
        val = val.replace(/<[^>]*>|\[.*?\]/g, '').trim()
      }

      if (key === 'content') {
        const normalVal = normalizeBlocks(parse(val as string))
        val = normalVal.length ? normalVal : val
      }

      if (key === 'taxonomy') {
        newItem.contentType = 'term'

        val = getTaxonomy(val as string)
      }
    }

    /* Meta */

    if (key === 'meta' && isObj) {
      for (const [metaKey, metaValue] of Object.entries(val as WordPressDataMeta)) {
        const normalKey = normalMetaKeys.get(metaKey) ?? metaKey
        newItem[normalKey] = metaValue
      }

      continue
    }

    /* Media details */

    if (k === 'media_details' && isObj) {
      const valObj = val as WordPressDataMediaDetails
      const valFull = valObj.sizes?.full
      const sourceUrl = item.source_url
      const mimeType = item.mime_type

      val = normalizeFile({
        url: sourceUrl,
        filename: sourceUrl?.split('/').pop(),
        alt: item.alt_text,
        width: valFull?.width,
        height: valFull?.height,
        filesizeInBytes: valObj.filesize,
        subtype: mimeType?.split('/')[1],
        mime: mimeType,
        sizes: valObj.sizes
      })
    }

    /* New value */

    newItem[k as keyof RenderItem] = val
  }

  /* Output */

  return newItem
}

/**
 * Transform WordPress menu items into navigation item objects.
 *
 * @private
 * @param {WordPressDataMenuItem[]} items
 * @return {NavigationItem[]}
 */
const normalizeWordPressMenuItems = (items: WordPressDataMenuItem[]): NavigationItem[] => {
  /* Add items to menus */

  const itemsObj = Object.fromEntries(items.map(item => [item.id, item])) as Record<string, WordPressDataMenuItem>

  menusById.clear()

  items.forEach(item => {
    const {
      id = '',
      title = '',
      menu_order = 0,
      menus = 0
    } = item

    const parent = item.parent as unknown as number
    const hasMenuOrder = isNumber(menu_order)

    if (hasMenuOrder && isObjectStrict(itemsObj[parent])) {
      if (itemsObj[parent].children == null) {
        itemsObj[parent].children = []
      }

      itemsObj[parent].children.push({ id, menu_order, title })
    }

    if (hasMenuOrder && isNumber(menus) && parent === 0) {
      const menuId = menus.toString()

      if (menusById.get(menuId) == null) {
        menusById.set(menuId, [])
      }

      menusById.get(menuId)?.push({ id, menu_order, title })
    }
  })

  /* Normalize items */

  const newItems: NavigationItem[] = []

  for (const [id, obj] of Object.entries(itemsObj)) {
    const {
      url = '',
      title = '',
      contentType = '',
      children = [],
      object = '',
      object_id = '',
      locale = ''
    } = obj

    if (!isString(url) || !isStringStrict(title)) { // Allow empty string for link
      continue
    }

    const newItem: NavigationItem = { id, title }

    /* Internal item */

    const isCustom = contentType === 'custom'

    if (!isCustom && isStringStrict(object) && isStringStrict(object_id)) {
      const slug = url.split('/').filter(Boolean).pop()
      const isTerm = contentType === 'taxonomy'
      const internalLink: InternalLink = {
        contentType: isTerm ? 'term' : object,
        id: object_id,
        slug
      }

      if (isTerm) {
        internalLink.taxonomy = getTaxonomy(object)
      }

      if (isStringStrict(locale)) {
        internalLink.locale = locale
      }

      newItem.link = url
      newItem.internalLink = internalLink
    }

    /* Custom/external item */

    if (isCustom) {
      const isExternal = url.startsWith('http') && !url.startsWith(config.env.prodUrl)

      if (isExternal) {
        newItem.externalLink = url
      } else {
        newItem.link = url
      }
    }

    /* Nested items */

    if (isArrayStrict(children)) {
      newItem.children = children.sort((a, b) => a.menu_order - b.menu_order)
    }

    /* Outstanding props (eg. rest api field) */

    const exclude = [
      ...excludeProps,
      'url',
      'type',
      'type_label',
      'object',
      'object_id',
      'invalid',
      'meta',
      'menu_order',
      'menus',
      'parent',
      'contentType',
      'status'
    ]

    Object.entries(obj).forEach(([key, val]) => {
      if (exclude.includes(key)) {
        return
      }

      newItem[key] = val
    })

    /* Append */

    newItems.push(newItem)
  }

  /* Output */

  return newItems
}

/**
 * Transform WordPress menus into navigation item objects.
 *
 * @private
 * @param {WordPressDataMenu[]} menus
 * @return {NavigationList[]}
 */
const normalizeWordPressMenus = (menus: WordPressDataMenu[]): NavigationList[] => {
  const newMenus: NavigationList[] = []

  menus.forEach(menu => {
    const {
      id = '',
      title = '',
      description = '',
      locations = [],
      meta = []
    } = menu

    const newMenu: NavigationList = {
      id,
      title,
      description,
      meta,
      location: locations,
      items: menusById.get(id)?.sort((a, b) => a.menu_order - b.menu_order) ?? []
    }

    newMenus.push(newMenu)
  })

  return newMenus
}

/**
 * Transform WordPress data into simpler objects.
 *
 * @param {WordPressDataItem[]} data
 * @param {string} [route]
 * @return {RenderItem[]}
 */
const normalizeWordPressData = (
  data: WordPressDataItem[],
  route?: string,
  _newData: RenderItem[] = []): RenderItem[] => {
  /* Data must be array */

  if (!isArrayStrict(data)) {
    return []
  }

  /* Taxonomies */

  if (route === 'taxonomies') {
    data = Object.entries(data[0] as Record<string, WordPressDataItem>).map(([key, value]) => ({
      id: key,
      type: 'taxonomy',
      ...value
    })) as WordPressDataItem[]
  }

  /* Recurse data */

  data.forEach(item => {
    if (!isObjectStrict(item)) {
      return
    }

    _newData.push(normalizeItem(item))
  })

  /* Customize by route */

  if (route === 'taxonomies') {
    _newData.forEach(item => {
      setStoreItem('taxonomies', item as Taxonomy, item.id)
    })
  }

  /* Output */

  return _newData
}

/* Exports */

export {
  normalizeWordPressData,
  normalizeWordPressMenuItems,
  normalizeWordPressMenus,
  normalRoutes,
  normalMetaKeys
}
