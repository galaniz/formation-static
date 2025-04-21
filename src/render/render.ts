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
  RenderNavigations,
  RenderFunctionsArgs
} from './renderTypes.js'
import type { ParentArgs, HtmlString } from '../global/globalTypes.js'
import type { RichTextHeading } from '../text/RichText/RichTextTypes.js'
import type { Navigation } from '../components/Navigation/Navigation.js'
import { doActions } from '../utils/action/action.js'
import { applyFilters } from '../utils/filter/filter.js'
import { getSlug, getPermalink } from '../utils/link/link.js'
import { isString, isStringStrict } from '../utils/string/string.js'
import { isArray, isArrayStrict } from '../utils/array/array.js'
import { isObjectStrict } from '../utils/object/object.js'
import { isNumber } from '../utils/number/number.js'
import { isFunction } from '../utils/function/function.js'
import { doShortcodes } from '../utils/shortcode/shortcode.js'
import { tagExists } from '../utils/tag/tag.js'
import { setStoreData, setStoreItem, getStoreItem } from '../store/store.js'
import { setRedirects } from '../redirects/redirects.js'
import { serverlessRoutes } from '../serverless/serverless.js'
import { scripts, styles } from '../utils/scriptStyle/scriptStyle.js'
import { Container } from '../layouts/Container/Container.js'
import { Column } from '../layouts/Column/Column.js'
import { Form } from '../objects/Form/Form.js'
import { FormField } from '../objects/Form/FormField.js'
import { FormOption } from '../objects/Form/FormOption.js'
import { RichText } from '../text/RichText/RichText.js'

/**
 * Default render functions
 *
 * @type {RenderFunctions}
 */
const defaultRenderFunctions: RenderFunctions = {
  container: Container,
  column: Column,
  form: Form,
  formField: FormField,
  formOption: FormOption,
  richText: RichText
}

/**
 * Output elements in render content
 *
 * @type {RenderFunctions}
 */
let renderFunctions: RenderFunctions = {
  ...defaultRenderFunctions
}

/**
 * Output html element
 *
 * @type {RenderLayout}
 */
let renderLayout: RenderLayout = () => ''

/**
 * Output http error page
 *
 * @type {RenderHttpError}
 */
let renderHttpError: RenderHttpError = () => ''

/**
 * Navigations output for use in render functions
 *
 * @type {RenderNavigations}
 */
let renderNavigations: RenderNavigations = () => undefined

/**
 * Content, layout and navigation output functions
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
    navigations,
    httpError
  } = args

  if (!isObjectStrict(functions) || !isFunction(layout)) {
    return false
  }

  renderFunctions = {
    ...defaultRenderFunctions,
    ...functions
  }

  renderLayout = layout

  if (isFunction(navigations)) {
    renderNavigations = navigations
  }

  if (isFunction(httpError)) {
    renderHttpError = httpError
  }

  return true
}

/**
 * Content and templates in expected format to map
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
      templates
    }
  }

  /* Named content */

  const namedContent: Record<string, RenderItem> = {}

  /* One level loop */

  const newContent = content.map(c => {
    /* Check name */

    if (named && isString(c.name)) {
      namedContent[c.name] = { ...c }
    }

    /* Check if template */

    if (tagExists(c, 'template')) {
      templates.push({ ...c })

      /* Replace template with template break */

      return {
        metadata: {
          tags: [
            {
              id: 'templateBreak',
              name: ''
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
    content: newContent,
    namedContent,
    templates
  }
}

/**
 * Map out content slots to templates
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

    if (isArrayStrict(children) && !isSlot) {
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
          newChildren.splice(insertIndex, 0, { ...repeat })

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
 * Recurse and output nested content
 *
 * @param {RenderContentArgs} args
 * @param {HtmlString} [_output]
 * @return {Promise<string>}
 */
const renderContent = async (
  args: RenderContentArgs,
  _output: HtmlString = { html: '' }
): Promise<string> => {
  /* Args required */

  if (!isObjectStrict(args)) {
    return _output.html
  }

  const {
    content = [],
    serverlessData,
    previewData,
    itemData,
    itemContains = [],
    itemHeadings = [],
    navigations,
    parents = [],
    depth = 0
  } = args

  let { headingsIndex = -1 } = args

  /* Content must be array */

  if (!isArrayStrict(content)) {
    return _output.html
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
    const contentAttr = props.contentIsAttribute
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

    /* Content is attribute */

    if (isStringStrict(contentAttr)) {
      props[contentAttr] = children
      props.content = undefined
      childrenArr = undefined
    }

    /* Render output */

    let renderStart = ''
    let renderEnd = ''
    let filterType = ''
    let filterArgs = {}

    const renderFunction = renderFunctions[renderType]

    if (isFunction(renderFunction)) {
      const renderArgs: RenderFunctionArgs = {
        args: props,
        parents,
        itemData,
        itemContains,
        navigations,
        serverlessData,
        previewData
      }

      if (childrenArr) {
        renderArgs.children = childrenArr
      }

      if (renderType === 'richText') {
        renderArgs.headings = itemHeadings[headingsIndex]
      }

      let renderOutput = await renderFunction(renderArgs)

      if (isArrayStrict(renderOutput)) {
        if (renderOutput.length === 1) {
          renderOutput = renderOutput[0]?.split('%content') ?? ['', '']
        }

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
      }

      itemContains.push(renderType)

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

    if (isString(filterRenderStart)) {
      renderStart = filterRenderStart
    }

    if (isString(filterRenderEnd)) {
      renderEnd = filterRenderEnd
    }

    /* Add to output object */

    _output.html += renderStart + childrenStr

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
          navigations,
          headingsIndex,
          depth: depth + 1
        },
        _output
      )
    }

    _output.html += renderEnd
  }

  /* Output */

  return _output.html
}

/**
 * Output single post or page
 *
 * @param {RenderItemArgs} args
 * @param {string} [_contentType] - Rest content type
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

  /* Item id required */

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

  const itemContains: string[] = []

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
    itemContains: [],
    itemHeadings: [],
    serverlessData,
    previewData
  }

  await doActions('renderItemStart', renderItemStartArgs, true)

  /* Meta */

  const title = item.title
  const meta = {
    title: '',
    description: '',
    url: '',
    image: '',
    canonical: '',
    prev: '',
    next: '',
    noIndex: false,
    isIndex: false,
    ...item.meta
  }

  if (isStringStrict(item.metaTitle)) {
    meta.title = item.metaTitle
  }

  if (isStringStrict(item.metaDescription)) {
    meta.description = item.metaDescription
  }

  if (isStringStrict((item as { metaImage?: { url?: string } }).metaImage?.url)) { // Cast one off for contentful image
    meta.image = (item as { metaImage: { url: string } }).metaImage.url
  }

  if (!isStringStrict(meta.title) && isStringStrict(title)) {
    meta.title = title
  }

  /* Term taxonomy */

  const taxonomy = contentType === 'term' ? item.taxonomy : contentType === 'taxonomy' ? item : {}

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
  const slugIsHtml = slug.includes('.html')
  const permalink = getPermalink(slug, !slugIsHtml)
  const parents = s.parents

  item.baseUrl = permalink
  meta.url = permalink
  meta.canonical = permalink

  /* Format and add to slug store */

  let formattedSlug = slug !== 'index' && slug !== '' ? `/${slug}/` : '/'

  if (slugIsHtml) {
    formattedSlug = slug
  }

  setStoreItem(
    'slugs',
    {
      id,
      contentType: isStringStrict(_contentType) ? _contentType : contentType
    },
    slugIsHtml ? `/${slug}` : formattedSlug
  )

  /* Check if index */

  const index = item.slug === 'index'

  meta.isIndex = index

  /* Navigations */

  let navigations: Navigation | undefined

  if (isFunction(renderNavigations)) {
    let currentType: string | string[] = contentType

    if (isObjectStrict(taxonomy) && isArrayStrict(taxonomy.contentTypes)) {
      currentType = taxonomy.contentTypes
    }

    navigations = await renderNavigations({
      navigations: getStoreItem('navigations'),
      items: getStoreItem('navigationItems'),
      currentLink: permalink,
      currentType,
      title,
      parents
    })
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
      navigations,
      previewData
    })
  }

  contentOutput = await doShortcodes(contentOutput, itemData)

  /* Pagination variables for meta object */

  const pag = itemData.pagination

  if (isObjectStrict(pag)) {
    const {
      current = 0,
      total = 1,
      currentFilters,
      prevFilters,
      nextFilters
    } = pag

    meta.canonicalParams =
      `${current > 1 ? `?page=${current}` : ''}${isString(currentFilters) ? currentFilters : ''}`

    if (isStringStrict(pag.title)) {
      meta.paginationTitle = pag.title
    }

    if (isNumber(pag.prev) && pag.prev >= 1) {
      slugArgs.page = pag.prev

      const p = getSlug(slugArgs, true)
      meta.prev = `${getPermalink(p.slug, pag.prev === 1)}${isString(prevFilters) ? prevFilters : ''}`
    }

    if (isNumber(pag.next) && pag.next > 1 && pag.next < total) {
      slugArgs.page = pag.next

      const n = getSlug(slugArgs, true)
      meta.next = `${getPermalink(n.slug, false)}${isString(nextFilters) ? nextFilters : ''}`
    }

    serverlessRender = true
  }

  /* Output */

  let layoutOutput = ''

  if (isFunction(renderLayout)) {
    const layoutArgs: RenderLayoutArgs = {
      id,
      meta,
      navigations,
      contentType,
      content: contentOutput,
      slug: formattedSlug,
      itemContains,
      itemHeadings,
      itemData,
      serverlessData,
      previewData
    }

    layoutOutput = await renderLayout(layoutArgs)
  }

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
 * Loop through all content types to output pages and posts
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

  /* Redirects data */

  setRedirects(redirect)

  /* Empty serverless reload */

  serverlessRoutes.reload = []

  /* Loop through all content types */

  for (const [contentType, contentItems] of Object.entries(content)) {
    if (!isArrayStrict(contentItems)) {
      continue
    }

    for (const contentItem of contentItems) {
      const item = await renderItem({
        item: await applyFilters('renderItemData', contentItem, { contentType }, true),
        serverlessData
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
        serverlessRoutes.reload.push({
          path: itemData.slug.replace(/^\/|\/$/gm, '')
        })
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
  renderContent,
  renderFunctions,
  renderLayout,
  renderNavigations,
  renderHttpError,
  setRenderFunctions
}
