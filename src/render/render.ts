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
  RenderNavigations
} from './renderTypes.js'
import type { GenericStrings, ParentArgs, HtmlString } from '../global/globalTypes.js'
import type { PaginationData } from '../components/Pagination/PaginationTypes.js'
import type { RichTextHeading } from '../text/RichText/RichTextTypes.js'
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
import { setRedirectsData } from '../redirects/redirects.js'
import { serverlessRoutes } from '../serverless/serverless.js'
import { scripts, styles } from '../utils/scriptStyle/scriptStyle.js'
import { Container } from '../layouts/Container/Container.js'
import { Column } from '../layouts/Column/Column.js'
import { Form } from '../objects/Form/Form.js'
import { Field } from '../objects/Field/Field.js'
import { RichText } from '../text/RichText/RichText.js'

/**
 * Output elements in render content
 *
 * @type {RenderFunctions}
 */
let renderFunctions: RenderFunctions = {
  container: Container,
  column: Column,
  form: Form,
  field: Field,
  richText: RichText
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
let renderNavigations: RenderNavigations = () => ({})

/**
 * Set content, layout and navigation output functions
 *
 * @param {RenderFunctions} functions
 * @param {RenderLayout} layout
 * @param {RenderNavigations} navigations
 * @return {void}
 */
const setRenderFunctions = (
  functions: RenderFunctions,
  layout: RenderLayout,
  navigations: RenderNavigations,
  httpError: RenderHttpError
): void => {
  renderFunctions = Object.assign(renderFunctions, functions)
  renderLayout = layout
  renderNavigations = navigations
  renderHttpError = httpError
}

/**
 * Get content and templates in expected format to map
 *
 * @private
 * @param {RenderItem[]} content
 * @param {RenderItem[]} [_templates]
 * @return {RenderTemplate}
 */
const getContentTemplate = (
  content: RenderItem[],
  _templates: RenderItem[] = []
): RenderTemplate => {
  /* Content must be array */

  if (!isArrayStrict(content)) {
    return {
      content: [],
      templates: _templates
    }
  }

  /* One level loop */

  const _content = content.map((c) => {
    /* Check if template */

    if (tagExists(c, 'template')) {
      _templates.push(structuredClone(c))

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
    content: _content,
    templates: _templates
  }
}

/**
 * Map out content slots to templates
 *
 * @private
 * @param {RenderItem[]} templates
 * @param {RenderItem[]} [content]
 * @return {RenderItem[]}
 */
const mapContentTemplate = (
  templates: RenderItem[],
  content: RenderItem[] = []
): RenderItem[] => {
  /* Templates must be arrays */

  if (!isArrayStrict(templates)) {
    return templates
  }

  /* Recurse templates */

  const lastTemplateIndex = templates.length - 1

  templates.forEach((t, i) => {
    /* Remove template break */

    if (content[0] != null && tagExists(content[0], 'templateBreak') && content.length >= 1) {
      content.shift()
    }

    /* Check if optional - remove if no content */

    const isOptional = tagExists(t, 'templateOptional')

    if (isOptional && i === lastTemplateIndex && content.length === 0) {
      templates.pop()

      return
    }

    /* Check if slot */

    const isSlot = tagExists(t, 'templateSlot')

    /* Check for repeatable template item */

    const children = t.content

    if (isArrayStrict(children) && !isSlot) {
      let repeat: RenderItem | undefined

      const repeatIndex = children.findIndex((c) => {
        const isRepeat = tagExists(c, 'templateRepeat')

        if (isRepeat) {
          repeat = c
        }

        return isRepeat
      })

      if (repeatIndex !== -1 && repeat != null) {
        let breakIndex = content.findIndex((c) => {
          return tagExists(c, 'templateBreak')
        })

        breakIndex = breakIndex === -1 ? content.length : breakIndex

        let insertIndex = repeatIndex

        for (let j = insertIndex; j < breakIndex - 1; j += 1) {
          children.splice(insertIndex, 0, structuredClone(repeat))

          insertIndex = j
        }
      }
    }

    /* Replace slot with content */

    if (isSlot && content.length >= 1) {
      const fill = content.shift()

      if (fill != null) {
        templates[i] = fill
      }

      return
    }

    /* Recurse children */

    if (isArray(children) && templates[i] != null) {
      templates[i].content = mapContentTemplate(children, content)
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
  if (!isObjectStrict(args)) {
    return _output.html
  }

  const {
    content = [],
    serverlessData,
    pageData,
    pageContains = [],
    pageHeadings = [],
    navigations = {}
  } = args

  let {
    parents = [],
    headingsIndex = 0,
    depth = 0
  } = args

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

    const props = structuredClone(item)
    const renderType = isString(props.renderType) ? props.renderType : ''

    /* Check for nested content */

    let children = props.content

    /* Map out content to template */

    if (renderType === 'contentTemplate') {
      const template = getContentTemplate(isArray(props.content) ? props.content : [])
      const templates = mapContentTemplate(template.templates, template.content)

      children = templates
    }

    /* Children array check */

    let childrenArr

    if (isArrayStrict(children) && renderType !== 'richText') {
      childrenArr = children
    }

    /* Render output */

    let renderStart = ''
    let renderEnd = ''
    let filterType = ''
    let filterArgs = {}

    const renderFunction = renderFunctions[renderType]

    if (isFunction(renderFunction)) {
      const renderArgs: RenderFunctionArgs<any> = {
        args: props,
        parents,
        pageData,
        pageContains,
        navigations,
        serverlessData
      }

      if (childrenArr != null) {
        renderArgs.children = childrenArr
      }

      if (renderType === 'richText') {
        renderArgs.headings = pageHeadings[headingsIndex]
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

      pageContains.push(renderType)

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

    _output.html += renderStart

    /* Recurse through children */

    if (childrenArr != null) {
      const parentsCopy = [...parents]

      parentsCopy.unshift({
        renderType,
        args: {
          ...props,
          content: undefined,
          parents: undefined
        }
      })

      await renderContent(
        {
          content: childrenArr,
          serverlessData,
          parents: parentsCopy,
          pageData,
          pageContains,
          pageHeadings,
          navigations,
          headingsIndex,
          depth: depth += 1
        },
        _output
      )
    }

    _output.html += renderEnd

    /* Additional rich text areas */

    if (renderType === 'content' && depth === 0) {
      headingsIndex = pageHeadings.push([])
    }
  }

  /* Output */

  return _output.html
}

/**
 * Output single post or page
 *
 * @param {RenderItemArgs} args
 * @return {Promise<RenderItemReturn>}
 */
const renderItem = async (args: RenderItemArgs): Promise<RenderItemReturn> => {
  if (!isObjectStrict(args)) {
    return {}
  }

  const {
    item,
    contentType = 'page',
    serverlessData
  } = args

  /* Item must be object */

  if (!isObjectStrict(item)) {
    return {}
  }

  /* Taxonomy not page */

  if (contentType === 'taxonomy' && item.isPage !== true) {
    return {}
  }

  /* Item id required */

  const id = item.id

  if (!isStringStrict(id)) {
    return {}
  }

  /* Slug required */

  if (!isStringStrict(item.slug)) {
    return {}
  }

  /* Serverless render check */

  let serverlessRender = false

  /* Components contained in page  */

  const pageContains: string[] = []

  /* Rich text headings in page */

  const pageHeadings: RichTextHeading[][] = [[]]

  /* Start action */

  const renderItemStartArgs: RenderItemStartActionArgs = {
    id,
    pageData: item,
    contentType,
    pageContains,
    pageHeadings,
    serverlessData
  }

  await doActions('renderItemStart', renderItemStartArgs, true)

  /* Reset script and style files */

  scripts.deps.clear()
  scripts.item.clear()
  scripts.meta = {}
  styles.deps.clear()
  styles.item.clear()

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

  if (isStringStrict((item.metaImage as any)?.url)) {
    meta.image = (item.metaImage as any).url
  }

  if (!isStringStrict(meta.title) && isStringStrict(title)) {
    meta.title = title
  }

  /* Term taxonomy */

  const taxonomy = item.taxonomy

  /* Permalink */

  const slugArgs = {
    id,
    contentType,
    slug: item.slug,
    returnParents: true,
    pageData: item,
    page: 0
  }

  const s = getSlug(slugArgs, true)
  const slug = s.slug
  const permalink = getPermalink(slug)
  const parents = s.parents

  item.basePermalink = getPermalink(slug)
  meta.url = permalink
  meta.canonical = permalink

  /* Format and add to slug store */

  let formattedSlug = slug !== 'index' && slug !== '' ? `/${slug}/` : '/'

  if (slug.includes('.html')) {
    formattedSlug = slug
  }

  setStoreItem('slugs', { contentType, id }, formattedSlug)

  /* Check if index */

  const index = item.slug === 'index'

  meta.isIndex = index

  /* Navigations */

  let navigations: GenericStrings = {}

  if (isFunction(renderNavigations)) {
    let currentType = contentType

    if (isObjectStrict(taxonomy)) {
      currentType = isStringStrict(taxonomy.contentType) ? taxonomy.contentType : contentType
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

    if (!isServerless) { // Avoid re-rendering non dynamic pages
      return {
        serverlessRender: false
      }
    }

    itemServerlessData = serverlessData
  }

  /* Page data (props) for layout and actions */

  const pageData = { ...item }

  pageData.id = id
  pageData.parents = parents
  pageData.content = undefined

  /* Content loop */

  let contentOutput = ''

  const contentData = item.content

  if (isArrayStrict(contentData)) {
    contentOutput = await renderContent({
      content: contentData,
      serverlessData: itemServerlessData,
      parents: [],
      pageData,
      pageContains,
      pageHeadings,
      navigations
    })
  }

  contentOutput = await doShortcodes(contentOutput)

  /* Pagination variables for meta object */

  const pag = pageData.pagination as PaginationData

  if (isObjectStrict(pag)) {
    const {
      current = 0,
      currentFilters,
      prevFilters,
      nextFilters
    } = pag

    slugArgs.page = current > 1 ? current : 0

    const s = getSlug(slugArgs, true)
    meta.canonical = `${getPermalink(s.slug, current === 1)}${isString(currentFilters) ? currentFilters : ''}`

    if (isStringStrict(pag.title)) {
      meta.paginationTitle = pag.title
    }

    if (isNumber(pag.prev)) {
      slugArgs.page = pag.prev > 1 ? pag.prev : 0

      const p = getSlug(slugArgs, true)
      meta.prev = `${getPermalink(p.slug, pag.prev === 1)}${isString(prevFilters) ? prevFilters : ''}`
    }

    if (isNumber(pag.next) && pag.next > 1) {
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
      pageContains,
      pageHeadings,
      pageData,
      serverlessData
    }

    layoutOutput = await renderLayout(layoutArgs)
  }

  const renderItemFilterArgs: RenderItemActionArgs = {
    id,
    contentType,
    slug: formattedSlug,
    output: layoutOutput,
    pageData,
    pageContains,
    pageHeadings,
    serverlessData
  }

  layoutOutput = await applyFilters('renderItem', layoutOutput, renderItemFilterArgs, true)

  /* End action */

  const renderItemEndArgs: RenderItemActionArgs = {
    id,
    contentType,
    slug: formattedSlug,
    output: layoutOutput,
    pageData,
    pageContains,
    pageHeadings,
    serverlessData
  }

  await doActions('renderItemEnd', renderItemEndArgs, true)

  /* Output */

  return {
    serverlessRender,
    pageData,
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
  /* Fallback output */

  const fallback = [{
    slug: '',
    output: ''
  }]

  /* Props must be object */

  if (!isObjectStrict(args)) {
    return fallback
  }

  const {
    allData,
    serverlessData,
    previewData
  } = args

  /* Serverless */

  const isServerless = serverlessData != null
  const isPreview = previewData != null

  /* Start action */

  await doActions('renderStart', args, true)

  /* Reset script and style directories */

  scripts.deps.clear()
  scripts.item.clear()
  scripts.meta = {}
  styles.deps.clear()
  styles.item.clear()

  /* Data */

  if (!isObjectStrict(allData)) {
    return fallback
  }

  const {
    navigation,
    navigationItem,
    redirect,
    content
  } = allData

  /* Content data */

  const data: RenderReturn[] = []

  /* Store data */

  await setStoreData({
    navigation,
    navigationItem,
    content,
    serverless: isServerless
  })

  /* Redirects data */

  setRedirectsData(redirect)

  /* Empty serverless reload */

  serverlessRoutes.reload = []

  /* Loop through all content types */

  for (const [contentType, contentItems] of Object.entries(content)) {
    if (!isArrayStrict(contentItems)) {
      continue
    }

    for (const contentItem of contentItems) {
      const item = await renderItem({
        item: contentItem,
        contentType,
        serverlessData
      })

      const {
        serverlessRender = false,
        data: itemData
      } = item

      if (itemData == null) {
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
  const output = (isServerless || isPreview) && outputItem != null ? outputItem : data

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
