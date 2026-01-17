/**
 * Render
 */

/* Imports */

import type {
  RenderContentArgs,
  RenderFunctionArgs,
  RenderServerlessData,
  RenderTemplate,
  RenderItem,
  RenderItemArgs,
  RenderItemReturn,
  RenderItemStartActionArgs,
  RenderItemActionArgs,
  RenderLayoutArgs,
  RenderArgs,
  RenderReturn,
  RenderFunctions,
  RenderLayout,
  RenderHttpError,
  RenderNavigation,
  RenderFunctionsArgs,
  RenderMeta
} from './renderTypes.js'
import type { ParentArgs, RefString } from '../global/globalTypes.js'
import type { RichTextHeading } from '../text/RichText/RichTextTypes.js'
import { doActions } from '../actions/actions.js'
import { applyFilters } from '../filters/filters.js'
import { getSlug, getPermalink } from '../utils/link/link.js'
import { isString, isStringStrict } from '../utils/string/string.js'
import { isArray, isArrayStrict } from '../utils/array/array.js'
import { isObjectStrict } from '../utils/object/object.js'
import { isFunction } from '../utils/function/function.js'
import { doShortcodes } from '../shortcodes/shortcodes.js'
import { tagExists } from '../utils/tag/tag.js'
import { setStoreData, setStoreItem, getStoreItem } from '../store/store.js'
import { setRedirects } from '../redirects/redirects.js'
import { scripts, styles } from '../scripts/scripts.js'
import { config } from '../config/config.js'

/**
 * Output elements in render content.
 *
 * @type {RenderFunctions}
 */
let renderFunctions: RenderFunctions = {}

/**
 * Output HTML element.
 *
 * @type {RenderLayout}
 */
let renderLayout: RenderLayout = () => ''

/**
 * Output HTTP error page.
 *
 * @type {RenderHttpError}
 */
let renderHttpError: RenderHttpError = () => ''

/**
 * Navigation instance for use in render functions.
 *
 * @type {RenderNavigation}
 */
let renderNavigation: RenderNavigation = () => undefined

/**
 * Content, layout and navigation functions.
 *
 * @param {RenderFunctionsArgs} args
 * @return {boolean}
 */
const setRenderFunctions = (args: RenderFunctionsArgs): boolean => {
  if (!isObjectStrict(args)) {
    return false
  }

  const {
    functions,
    layout,
    navigation,
    httpError
  } = args

  if (!isObjectStrict(functions) || !isFunction(layout)) {
    return false
  }

  renderFunctions = { ...functions }
  renderLayout = layout

  if (isFunction(navigation)) {
    renderNavigation = navigation
  }

  if (isFunction(httpError)) {
    renderHttpError = httpError
  }

  return true
}

/**
 * Content and templates in expected format to map.
 *
 * @private
 * @param {RenderItem[]} content
 * @param {RenderItem[]} [templates]
 * @param {boolean} [named]
 * @return {RenderTemplate}
 */
const getContentTemplate = (
  content: RenderItem[],
  templates: RenderItem[] = [],
  named: boolean = false
): RenderTemplate => {
  /* Content must be array */

  if (!isArrayStrict(content)) {
    return {
      content: [],
      namedContent: {},
      templates: []
    }
  }

  /* Named content */

  const namedContent: Record<string, RenderItem> = {}

  /* One level loop */

  const newContent = content.map(c => {
    /* Check name */

    const { name } = c

    if (named && isString(name)) {
      namedContent[name] = { ...c }
    }

    /* Check if template */

    if (tagExists(c, 'template')) {
      templates.push({ ...c })

      /* Replace template with template break */

      return {
        metadata: {
          tags: [
            {
              id: 'templateBreak'
            }
          ]
        }
      }
    }

    /* Output */

    return c
  })

  /* Output */

  return {
    namedContent,
    content: newContent,
    templates: structuredClone(templates)
  }
}

/**
 * Map out content slots to templates.
 *
 * @private
 * @param {RenderItem[]} templates
 * @param {RenderItem[]} [content]
 * @param {Object<string, RenderItem>} [namedContent]
 * @param {boolean} [named]
 * @return {RenderItem[]}
 */
const mapContentTemplate = (
  templates: RenderItem[],
  content: RenderItem[] = [],
  namedContent: Record<string, RenderItem> = {},
  named: boolean = false
): RenderItem[] => {
  /* Templates must be arrays */

  if (!isArrayStrict(templates)) {
    return templates
  }

  /* Recurse templates */

  const lastTemplateIndex = templates.length - 1

  templates.forEach((t, i) => {
    /* Remove template break */

    if (content[0] && tagExists(content[0], 'templateBreak') && content.length >= 1) {
      content.shift()
    }

    /* Check if optional - remove if no content */

    const isOptional = tagExists(t, 'templateOptional')

    if (isOptional && i === lastTemplateIndex && !content.length) {
      templates.pop()

      return
    }

    /* Check if slot */

    const isSlot = tagExists(t, 'templateSlot')

    /* Check for repeatable template item */

    let children = t.content

    if (isArrayStrict(children) && !isSlot && !named) {
      let repeat: RenderItem | undefined
      const newChildren = [...children]

      const repeatIndex = children.findIndex((c) => {
        const isRepeat = tagExists(c, 'templateRepeat')

        if (isRepeat) {
          repeat = c
        }

        return isRepeat
      })

      if (repeatIndex !== -1 && repeat) {
        let breakIndex = content.findIndex((c) => {
          return tagExists(c, 'templateBreak')
        })

        breakIndex = breakIndex === -1 ? content.length : breakIndex
        let insertIndex = repeatIndex

        for (let j = insertIndex; j < breakIndex - 1; j += 1) {
          newChildren.splice(insertIndex, 0, structuredClone(repeat))

          insertIndex = j
        }
      }

      children = newChildren
    }

    /* Replace slot with content */

    if (isSlot && content.length >= 1) {
      let fill = null

      if (named) {
        fill = namedContent[t.name as string]
      } else {
        fill = content.shift()
      }

      if (fill) {
        templates[i] = fill
      }

      return
    }

    /* Recurse children */

    if (isArray(children) && templates[i]) {
      templates[i].content = mapContentTemplate(children, content, namedContent, named)
    }
  })

  /* Output */

  return templates
}

/**
 * Recurse and output nested content.
 *
 * @param {RenderContentArgs} args
 * @return {Promise<string>}
 */
const renderContent = async (args: RenderContentArgs, _html: RefString = { ref: '' }): Promise<string> => {
  /* Args required */

  if (!isObjectStrict(args)) {
    return _html.ref
  }

  const {
    content,
    serverlessData,
    previewData,
    itemData,
    itemContains,
    itemHeadings,
    parents,
    depth = 0
  } = args

  let { headingsIndex = -1 } = args

  /* Content must be array */

  if (!isArrayStrict(content)) {
    return _html.ref
  }

  /* Loop */

  for (const item of content) {
    /* Item must be object */

    if (!isObjectStrict(item)) {
      continue
    }

    /* Render props */

    const props = { ...item }
    const renderType = isString(props.renderType) ? props.renderType : ''
    const isRichText = renderType === 'richText'

    /* Check for nested content */

    let children = props.content

    /* Map out content to template */

    if (renderType === 'contentTemplate') {
      const isNamed = tagExists(item, 'templateNamed')
      const template = getContentTemplate(isArray(props.content) ? props.content : [], [], isNamed)
      const templates = mapContentTemplate(
        template.templates,
        template.content,
        template.namedContent,
        isNamed
      )

      children = templates
    }

    /* Children check */

    let childrenArr: undefined | RenderItem[]
    let childrenStr = ''

    if (isArrayStrict(children) && !isRichText) {
      childrenArr = children
    }

    if (isStringStrict(children) && !isRichText) {
      childrenStr = children
    }

    /* Rich text area headings */

    if (renderType === 'content' && depth === 0) {
      headingsIndex = itemHeadings.push([]) - 1
    }

    /* Render output */

    let renderStart = ''
    let renderEnd = ''
    let filterType = ''
    let filterArgs = {}

    const renderFunction = renderFunctions[renderType]

    if (isFunction(renderFunction)) {
      if (childrenArr) {
        props.content = undefined
      }

      const renderArgs: RenderFunctionArgs = {
        args: props,
        parents,
        itemData,
        itemContains,
        serverlessData,
        previewData
      }

      if (childrenArr) {
        renderArgs.children = childrenArr
      }

      if (renderType === 'richText') {
        renderArgs.headings = itemHeadings[headingsIndex]
      }

      const renderOutput = await renderFunction(renderArgs)

      if (isArrayStrict(renderOutput)) {
        const [start, end] = renderOutput

        if (isString(start)) {
          renderStart = start
        }

        if (isString(end)) {
          renderEnd = end
        }
      }

      if (isString(renderOutput)) {
        renderStart = renderOutput
        childrenArr = undefined
      }

      itemContains.add(renderType)

      filterType = renderType
      filterArgs = {
        ...props,
        content: undefined
      }
    }

    /* Filter content output */

    const renderContentFilterArgs: ParentArgs = {
      renderType: filterType,
      args: filterArgs
    }

    const [filterRenderStart, filterRenderEnd] =
      await applyFilters('renderContent', [renderStart, renderEnd], renderContentFilterArgs, true)

    renderStart = filterRenderStart
    renderEnd = filterRenderEnd

    /* Add to output object */

    _html.ref += renderStart + childrenStr

    /* Recurse through children */

    if (childrenArr) {
      const parentsCopy = [...parents]

      if (renderType) { // Skip non rendering parents
        parentsCopy.unshift({
          renderType,
          args: {
            ...props,
            content: undefined,
            parents: undefined
          }
        })
      }

      await renderContent(
        {
          content: childrenArr,
          serverlessData,
          previewData,
          parents: parentsCopy,
          itemData,
          itemContains,
          itemHeadings,
          headingsIndex,
          depth: depth + 1
        },
        _html
      )
    }

    _html.ref += renderEnd
  }

  /* Output */

  return _html.ref
}

/**
 * Single item meta data.
 *
 * @param {RenderItem} item
 * @return {RenderMeta}
 */
const renderMeta = (item: RenderItem): RenderMeta => {
  const {
    title,
    slug,
    baseUrl,
    pagination
  } = item

  const meta = {
    title,
    description: '',
    url: baseUrl,
    image: '',
    canonical: baseUrl,
    prev: '',
    next: '',
    index: true,
    isIndex: slug === 'index',
    ...item.meta
  }

  if (isStringStrict(item.metaTitle)) {
    meta.title = item.metaTitle
  }

  if (isStringStrict(item.metaDescription)) {
    meta.description = item.metaDescription
  }

  // @ts-expect-error - nested image URL
  if (isStringStrict(item.metaImage?.url)) {
    // @ts-expect-error - nested image URL
    meta.image = item.metaImage.url as unknown as string
  }

  if (!isObjectStrict(pagination)) {
    return meta
  }

  const {
    title: paginationTitle,
    prev: paginationPrev,
    next: paginationNext,
    currentParams,
    prevParams,
    nextParams
  } = pagination

  const currentParamsStr = new URLSearchParams(currentParams).toString()

  if (currentParamsStr) {
    meta.canonical = `${baseUrl}?${currentParamsStr}`
  }

  if (isStringStrict(paginationTitle)) {
    meta.paginationTitle = paginationTitle
  }

  if (paginationPrev) {
    const prevParamsStr = new URLSearchParams(prevParams).toString()

    meta.prev = `${baseUrl}${prevParamsStr ? `?${prevParamsStr}` : ''}`
  }

  if (paginationNext) {
    const nextParamsStr = new URLSearchParams(nextParams).toString()

    meta.next = `${baseUrl}?${nextParamsStr}`
  }

  return meta
}

/**
 * Output single post or page.
 *
 * @param {RenderItemArgs} args
 * @return {Promise<RenderItemReturn|null>}
 */
const renderItem = async (args: RenderItemArgs, _contentType?: string): Promise<RenderItemReturn | null> => {
  /* Args required */

  if (!isObjectStrict(args)) {
    return null
  }

  const {
    item,
    serverlessData,
    previewData
  } = args

  /* Item must be object */

  if (!isObjectStrict(item)) {
    return null
  }

  /* Content type required */

  const contentType = item.contentType

  if (!isStringStrict(contentType)) {
    return null
  }

  /* Taxonomy not page */

  if (contentType === 'taxonomy' && item.isPage !== true) {
    return null
  }

  /* Item ID required */

  const id = item.id

  if (!isStringStrict(id)) {
    return null
  }

  /* Slug required */

  if (!isStringStrict(item.slug)) {
    return null
  }

  /* Serverless render check */

  let serverlessRender = false

  /* Components contained in page  */

  const itemContains: Set<string> = new Set()

  /* Rich text headings in page */

  const itemHeadings: RichTextHeading[][] = []

  /* Reset script and style files */

  scripts.deps.clear()
  scripts.item.clear()
  scripts.meta = {}
  styles.deps.clear()
  styles.item.clear()

  /* Start action */

  const renderItemStartArgs: RenderItemStartActionArgs = {
    id,
    itemData: { ...item },
    contentType,
    itemContains: new Set(),
    itemHeadings: [],
    serverlessData,
    previewData
  }

  await doActions('renderItemStart', renderItemStartArgs, true)

  /* Permalink */

  const slugArgs = {
    id,
    contentType,
    slug: item.slug,
    returnParents: true,
    itemData: item,
    page: 0
  }

  const s = getSlug(slugArgs, true)
  const slug = s.slug
  const slugIsHtml = slug.endsWith('.html')
  const permalink = getPermalink(slug, !slugIsHtml)
  const parents = s.parents

  /* Base */

  const taxonomy = contentType === 'term' ? item.taxonomy : contentType === 'taxonomy' ? item : null

  item.baseUrl = permalink
  item.baseType = isObjectStrict(taxonomy) && isArrayStrict(taxonomy.contentTypes) ? taxonomy.contentTypes : contentType

  /* Format slug */

  let formattedSlug = slug !== 'index' && slug !== '' ? `/${slug}/` : '/'

  if (slugIsHtml) {
    formattedSlug = slug
  }

  /* Serverless data */

  let itemServerlessData: RenderServerlessData | undefined

  if (isObjectStrict(serverlessData)) {
    const serverlessPath = serverlessData.path
    const isServerless = serverlessPath === formattedSlug && serverlessData.query != null

    if (!isServerless) { // Avoid re-rendering non dynamic pages (eg. first page of archive)
      return {
        serverlessRender: false
      }
    }

    itemServerlessData = serverlessData
  }

  /* Item data (props) for layout and actions */

  const itemData = { ...item }

  itemData.id = id
  itemData.parents = parents
  itemData.content = undefined

  /* Content loop */

  let contentOutput = ''

  const contentData = item.content

  if (isStringStrict(contentData)) {
    contentOutput = contentData
  }

  if (isArrayStrict(contentData)) {
    contentOutput = await renderContent({
      content: contentData,
      serverlessData: itemServerlessData,
      parents: [],
      itemData,
      itemContains,
      itemHeadings,
      previewData
    })
  }

  contentOutput = await doShortcodes(contentOutput, itemData)

  /* Pagination serverless */

  if (isObjectStrict(itemData.pagination)) {
    serverlessRender = true
  }

  /* Add slug to store */

  const cmsLocales = config.cms.locales
  const slugData = [id, isStringStrict(_contentType) ? _contentType : contentType] as [string, string, string?]

  if (isStringStrict(item.locale) && cmsLocales) {
    const locale = item.locale

    if (cmsLocales.includes(locale) && locale !== cmsLocales[0]) {
      slugData.push(locale)
    }
  }

  if (config.env.dev || (config.env.prod && serverlessRender)) {
    setStoreItem('slugs', slugData, slugIsHtml ? `/${slug}` : formattedSlug)
  }

  /* Output */

  const layoutArgs: RenderLayoutArgs = {
    id,
    meta: renderMeta(itemData),
    contentType,
    content: contentOutput,
    slug: formattedSlug,
    itemContains,
    itemHeadings,
    itemData,
    serverlessData,
    previewData
  }

  let layoutOutput = await renderLayout(layoutArgs)

  const renderItemFilterArgs: RenderItemActionArgs = {
    id,
    contentType,
    slug: formattedSlug,
    output: layoutOutput,
    itemData,
    itemContains,
    itemHeadings,
    serverlessData,
    previewData
  }

  layoutOutput = await applyFilters('renderItem', layoutOutput, renderItemFilterArgs, true)

  /* End action */

  const renderItemEndArgs: RenderItemActionArgs = {
    id,
    contentType,
    slug: formattedSlug,
    output: layoutOutput,
    itemData,
    itemContains,
    itemHeadings,
    serverlessData,
    previewData
  }

  await doActions('renderItemEnd', renderItemEndArgs, true)

  /* Output */

  return {
    serverlessRender,
    itemData,
    data: {
      slug: formattedSlug,
      output: layoutOutput
    }
  }
}

/**
 * Loop through all content types to output pages and posts.
 *
 * @param {RenderArgs} args
 * @return {Promise<RenderReturn[]|RenderReturn>}
 */
const render = async (args: RenderArgs): Promise<RenderReturn[] | RenderReturn> => {
  /* Props required */

  if (!isObjectStrict(args)) {
    return []
  }

  const {
    allData,
    serverlessData,
    previewData
  } = args

  /* Serverless */

  const isServerless = serverlessData != null
  const isPreview = previewData != null

  /* Reset script and style directories */

  scripts.deps.clear()
  scripts.item.clear()
  scripts.meta = {}
  styles.deps.clear()
  styles.item.clear()

  /* Data */

  if (!isObjectStrict(allData)) {
    return []
  }

  const { redirect, content } = allData

  /* Start action */

  await doActions('renderStart', args, true)

  /* Content data */

  const data: RenderReturn[] = []

  /* Store data */

  if (!isServerless) {
    setStoreData(allData)
  }

  /* Navigation */

  await renderNavigation({
    navigations: getStoreItem('navigations'),
    items: getStoreItem('navigationItems')
  })

  /* Redirects data */

  setRedirects(redirect)

  /* Loop through all content types */

  for (const [contentType, contentItems] of Object.entries(content)) {
    if (!isArrayStrict(contentItems)) {
      continue
    }

    for (const contentItem of contentItems) {
      const item = await renderItem({
        item: await applyFilters('renderItemData', contentItem, { contentType }, true),
        serverlessData,
        previewData
      }, contentType)

      if (!item) {
        continue
      }

      const {
        serverlessRender = false,
        data: itemData
      } = item

      if (!itemData) {
        continue
      }

      data.push(itemData)

      if (serverlessRender && !isServerless) {
        setStoreItem('serverless', ['reload'], itemData.slug)
      }
    }
  }

  /* Output */

  const [outputItem] = data
  const output = (isServerless || isPreview) && outputItem ? outputItem : data

  await doActions('renderEnd', { ...args, data: output }, true)

  return output
}

/* Exports */

export {
  render,
  renderItem,
  renderMeta,
  renderContent,
  renderFunctions,
  renderLayout,
  renderNavigation,
  renderHttpError,
  setRenderFunctions
}
