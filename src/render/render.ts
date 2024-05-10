/**
 * Render
 */

/* Imports */

import type {
  RenderSlugs,
  RenderMetaArgs,
  RenderMetaReturn,
  RenderContentArgs,
  RenderFunctionArgs,
  RenderServerlessData,
  RenderContentTemplate,
  RenderItem,
  RenderItemArgs,
  RenderItemReturn,
  RenderItemStartActionArgs,
  RenderItemActionArgs,
  RenderLayoutArgs,
  RenderArgs,
  RenderReturn
} from './renderTypes'
import type {
  ConfigParents,
  ConfigFormMeta,
  ConfigParent,
  ConfigArchiveMeta
} from '../config/configTypes'
import type { GenericFunctions, GenericStrings, ParentArgs, HtmlString } from '../global/globalTypes'
import type { SlugArgs } from '../utils/getSlug/getSlugTypes'
import type { PaginationData } from '../components/Pagination/PaginationTypes'
import type { RichTextHeading } from '../text/RichText/RichTextTypes'
import type { Navigation, NavigationItem } from '../components/Navigation/NavigationTypes'
import { normalizeContentType } from '../utils/normalizeContentType/normalizeContentType'
import { doActions } from '../utils/actions/actions'
import { applyFilters } from '../utils/filters/filters'
import { getSlug } from '../utils/getSlug/getSlug'
import { getPermalink } from '../utils/getPermalink/getPermalink'
import { getPath } from '../utils/getPath/getPath'
import { getJsonFile } from '../utils/getJson/getJson'
import { isString, isStringStrict } from '../utils/isString/isString'
import { isArray, isArrayStrict } from '../utils/isArray/isArray'
import { isObject, isObjectStrict } from '../utils/isObject/isObject'
import { isNumber } from '../utils/isNumber/isNumber'
import { isFunction } from '../utils/isFunction/isFunction'
import { doShortcodes } from '../utils/shortcodes/shortcodes'
import { tagExists } from '../utils/tag/tag'
import { config } from '../config/config'
import { Container } from '../layouts/Container/Container'
import { Column } from '../layouts/Column/Column'
import { Form } from '../objects/Form/Form'
import { Field } from '../objects/Field/Field'
import { RichText } from '../text/RichText/RichText'

/**
 * Store slug data
 *
 * @private
 * @type {import('./RenderTypes').RenderSlugs}
 */
const _slugs: RenderSlugs = {}

/**
 * Function - normalize meta properties into one object
 *
 * @private
 * @param {import('./RenderTypes').RenderMetaArgs} args
 * @return {import('./RenderTypes').RenderMetaReturn}
 */
const _getMeta = (args: RenderMetaArgs): RenderMetaReturn => {
  const meta = {
    title: '',
    description: '',
    url: '',
    image: '',
    canonical: '',
    prev: '',
    next: '',
    noIndex: false,
    isIndex: false
  }

  if (!isObjectStrict(args)) {
    return meta
  }

  if (isObjectStrict(args.meta)) {
    return Object.assign(meta, args.meta)
  }

  if (isStringStrict(args.metaTitle)) {
    meta.title = args.metaTitle
  }

  if (isStringStrict(args.metaDescription)) {
    meta.description = args.metaDescription
  }

  if (isStringStrict(args?.metaImage?.url)) {
    meta.image = args.metaImage.url
  }

  return meta
}

/**
 * Function - add pagination data to meta object
 *
 * @private
 * @param {import('../components/Pagination/PaginationTypes').PaginationData} args
 * @return {void}
 */
const _setPaginationMeta = (args: PaginationData, slugArgs: SlugArgs, meta: RenderMetaReturn): void => {
  const {
    current = 0,
    currentFilters,
    prevFilters,
    nextFilters
  } = args

  slugArgs.page = current > 1 ? current : 0

  const s = getSlug(slugArgs)

  if (isObject(s)) {
    meta.canonical = `${getPermalink(s.slug, current === 1)}${isString(currentFilters) ? currentFilters : ''}`
  }

  if (isStringStrict(args.title)) {
    meta.paginationTitle = args.title
  }

  if (isNumber(args.prev)) {
    slugArgs.page = args.prev > 1 ? args.prev : 0

    const p = getSlug(slugArgs)

    if (isObject(p)) {
      meta.prev = `${getPermalink(p.slug, args.prev === 1)}${isString(prevFilters) ? prevFilters : ''}`
    }
  }

  if (isNumber(args.next) && args.next > 1) {
    slugArgs.page = args.next

    const n = getSlug(slugArgs)

    if (isObject(n)) {
      meta.next = `${getPermalink(n.slug, false)}${isString(nextFilters) ? nextFilters : ''}`
    }
  }
}

/**
 * Function - get content and templates in expected format to map
 *
 * @private
 * @param {import('./RenderTypes').RenderItem[]} content
 * @param {import('./RenderTypes').RenderItem[]} [_templates]
 * @return {import('./RenderTypes').RenderContentTemplate}
 */
const _getContentTemplate = (content: RenderItem[], _templates: RenderItem[] = []): RenderContentTemplate => {
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
 * Function - map out content slots to templates for contentTemplate
 *
 * @private
 * @param {import('./RenderTypes').RenderItem[]} templates
 * @param {import('./RenderTypes').RenderItem[]} [content]
 * @return {import('./RenderTypes').RenderItem[]}
 */
const _mapContentTemplate = (templates: RenderItem[], content: RenderItem[] = []): RenderItem[] => {
  /* Templates must be arrays */

  if (!isArrayStrict(templates)) {
    return templates
  }

  /* Recurse templates */

  const lastTemplateIndex = templates.length - 1

  templates.forEach((t, i) => {
    /* Remove template break */

    if (tagExists(content[0], 'templateBreak') && content.length >= 1) {
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

      if (repeatIndex !== -1 && repeat !== undefined) {
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

      if (fill !== undefined) {
        templates[i] = fill
      }

      return
    }

    /* Recurse children */

    if (isArray(children)) {
      templates[i].content = _mapContentTemplate(children, content)
    }
  })

  /* Output */

  return templates
}

/**
 * Function - get config and formation render functions
 *
 * @return {import('../global/globalTypes').GenericFunctions}
 */
const getRenderFunctions = (): GenericFunctions => {
  const renderFunctions = { ...config.renderFunctions }

  if (renderFunctions.container === undefined) {
    renderFunctions.container = Container
  }

  if (renderFunctions.column === undefined) {
    renderFunctions.column = Column
  }

  if (renderFunctions.form === undefined) {
    renderFunctions.form = Form
  }

  if (renderFunctions.field === undefined) {
    renderFunctions.field = Field
  }

  if (renderFunctions.richText === undefined) {
    renderFunctions.richText = RichText
  }

  return renderFunctions
}

/**
 * Function - recurse and output nested content
 *
 * @param {import('./RenderTypes').RenderContentArgs} args
 * @param {import('../global/globalTypes').HtmlString} [_output]
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
    navigations = {},
    renderFunctions = {}
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

  for (let i = 0; i < content.length; i += 1) {
    const item = content[i]

    if (!isObjectStrict(item)) {
      continue
    }

    /* Render props */

    const props = structuredClone(item)
    const renderType = isString(props.renderType) ? props.renderType : ''
    const contentType = isString(props.contentType) ? props.contentType : ''

    /* Check for nested content */

    let children = props.content

    /* Map out content to template */

    if (contentType === 'contentTemplate') {
      const contentTemplate = _getContentTemplate(isArray(props.content) ? props.content : [])
      const templates = _mapContentTemplate(contentTemplate.templates, contentTemplate.content)

      children = templates
    }

    /* Children array check */

    let childrenArr

    if (isArrayStrict(children) && renderType !== 'richText') {
      childrenArr = children
    }

    /* Render output */

    let renderObj = {
      start: '',
      end: ''
    }

    let filterType = ''
    let filterArgs = {}

    const renderFunction = renderFunctions[renderType]

    if (isFunction(renderFunction)) {
      const renderArgs: RenderFunctionArgs = {
        args: props,
        parents,
        pageData,
        pageContains,
        navigations,
        serverlessData
      }

      if (childrenArr !== undefined) {
        renderArgs.children = childrenArr
      }

      if (renderType === 'richText') {
        renderArgs.headings = pageHeadings[headingsIndex]
      }

      const renderOutput = await renderFunction(renderArgs)

      if (isString(renderOutput)) {
        renderObj.start = renderOutput
      } else {
        renderObj = renderOutput
      }

      pageContains.push(renderType)

      filterType = renderType
      filterArgs = {
        ...props,
        content: undefined
      }
    }

    let start = renderObj.start
    let end = renderObj.end

    /* Filter start and end output */

    const renderContentFilterArgs: ParentArgs = {
      renderType: filterType,
      args: filterArgs
    }

    if (start !== '' && end === '') {
      start = await applyFilters('renderContent', start, renderContentFilterArgs)
    } else {
      start = await applyFilters('renderContentStart', start, renderContentFilterArgs)
      end = await applyFilters('renderContentEnd', end, renderContentFilterArgs)
    }

    /* Add to output object */

    _output.html += start

    /* Recurse through children */

    if (childrenArr !== undefined) {
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
          renderFunctions,
          headingsIndex,
          depth: depth += 1
        },
        _output
      )
    }

    _output.html += end

    /* Additional rich text areas */

    if (renderType === 'content' && depth === 0) {
      headingsIndex = pageHeadings.push([])
    }
  }

  /* Output */

  return _output.html
}

/**
 * Function - output single post or page
 *
 * @param {import('./RenderTypes').RenderItemArgs} args
 * @return {import('./RenderTypes').RenderItemReturn}
 */
const renderItem = async (args: RenderItemArgs): Promise<RenderItemReturn> => {
  if (!isObjectStrict(args)) {
    return {}
  }

  const {
    item,
    contentType = 'page',
    serverlessData,
    renderFunctions
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

  /* Store components contained in page  */

  const pageContains: string[] = []

  /* Store rich text headings in page */

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

  await doActions('renderItemStart', renderItemStartArgs)

  /* Reset script and style files */

  config.scripts.item = {}
  config.styles.item = {}

  /* Meta */

  const title = item.title
  const meta = _getMeta(item)

  if (!isStringStrict(meta.title)) {
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

  const s = getSlug(slugArgs)

  let slug = ''
  let permalink = ''
  let parents: ConfigParent[] = []

  if (!isString(s)) {
    slug = s.slug
    parents = s.parents
    permalink = getPermalink(slug)

    item.basePermalink = getPermalink(slug)
  }

  meta.url = permalink
  meta.canonical = permalink

  /* Add to data by slugs store */

  let formattedSlug = slug !== 'index' && slug !== '' ? `/${slug}/` : '/'

  if (slug.includes('.html')) {
    formattedSlug = slug
  }

  _slugs[formattedSlug] = {
    contentType,
    id
  }

  /* Check if index */

  const index = item.slug === 'index'

  meta.isIndex = index

  /* Navigations */

  let navigations: GenericStrings = {}

  if (isFunction(renderFunctions.navigations)) {
    let currentType = contentType

    if (isObjectStrict(taxonomy)) {
      currentType = isStringStrict(taxonomy.contentType) ? taxonomy.contentType : contentType
    }

    navigations = renderFunctions.navigations({
      navigations: config.navigation,
      items: config.navigationItem,
      currentLink: permalink,
      currentType,
      title,
      parents
    })
  }

  /* Serverless data */

  let itemServerlessData: RenderServerlessData | undefined

  if (isObjectStrict(serverlessData)) {
    const serverlessPath = serverlessData.path !== undefined ? serverlessData.path : ''

    if (serverlessPath === formattedSlug && serverlessData.query !== undefined) {
      itemServerlessData = serverlessData
    } else { // Avoid re-rendering non dynamic pages
      return {
        serverlessRender: false
      }
    }
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
      navigations,
      renderFunctions
    })
  }

  contentOutput = await doShortcodes(contentOutput)

  /* Pagination variables for meta object */

  if (isObjectStrict(pageData.pagination)) {
    _setPaginationMeta(pageData.pagination, slugArgs, meta)

    serverlessRender = true
  }

  /* Output */

  let layoutOutput = ''

  if (isFunction(renderFunctions.layout)) {
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

    layoutOutput = await renderFunctions.layout(layoutArgs)
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

  layoutOutput = await applyFilters('renderItem', layoutOutput, renderItemFilterArgs)

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

  await doActions('renderItemEnd', renderItemEndArgs)

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
 * Function - loop through all content types to output pages and posts
 *
 * @param {import('./RenderTypes').RenderArgs} args
 * @return {Promise<import('./RenderTypes').RenderReturn[]|import('./RenderTypes').RenderReturn>}
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

  /* Start action */

  await doActions('renderStart', args)

  /* Reset script and style directories */

  config.scripts.build = {}
  config.styles.build = {}

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

  /* Store navigations and items */

  if (navigation !== undefined) {
    config.navigation = navigation
  }

  if (navigationItem !== undefined) {
    config.navigationItem = navigationItem
  }

  /* Add formation functions */

  const renderFunctions = getRenderFunctions()

  /* Store content data */

  const data: RenderReturn[] = []

  /* Loop through pages first to set meta info */

  if (serverlessData === undefined) {
    for (let i = 0; i < content.page.length; i += 1) {
      const item = content.page[i]
      const itemObj = isObjectStrict(item) ? item : {}

      const { parent, archive } = itemObj

      /* Id */

      const id = isStringStrict(item.id) ? item.id : ''

      /* Archive */

      const archiveType = normalizeContentType(archive)

      if (isStringStrict(archiveType) && id !== '') {
        const archiveSlug = item.slug
        const archiveTitle = item.title
        const archiveObj =
          isObjectStrict(config.archiveMeta[archiveType]) ? config.archiveMeta[archiveType] : {}

        config.archiveMeta[archiveType] = {
          id,
          slug: archiveSlug,
          title: archiveTitle,
          ...archiveObj
        }
      }

      /* Parent */

      if (isObjectStrict(parent) && id !== '') {
        const parentSlug = parent.slug
        const parentTitle = parent.title
        const parentId = parent.id

        if (isStringStrict(parentSlug) && isStringStrict(parentTitle) && isStringStrict(parentId)) {
          config.parents[id] = {
            id: parentId,
            slug: parentSlug,
            title: parentTitle,
            contentType: 'page'
          }
        }
      }
    }

    /* Redirect */

    if (isArrayStrict(redirect)) {
      redirect.forEach((r) => {
        if (!isObjectStrict(r)) {
          return
        }

        const { redirect: rr = [] } = r

        if (!isArrayStrict(rr)) {
          return
        }

        config.redirects.data = config.redirects.data.concat(rr)
      })
    }
  } else {
    const parentsData: ConfigParents | undefined = await getJsonFile(getPath('parents', 'store'))
    const archiveMetaData: ConfigArchiveMeta | undefined = await getJsonFile(getPath('archiveMeta', 'store'))
    const formMetaData: ConfigFormMeta | undefined = await getJsonFile(getPath('formMeta', 'store'))
    const navigationsData: Navigation[] | undefined = await getJsonFile(getPath('navigations', 'store'))
    const navigationItemsData: NavigationItem[] | undefined = await getJsonFile(getPath('navigationItems', 'store'))

    if (parentsData !== undefined) {
      Object.keys(parentsData).forEach((s) => {
        config.parents[s] = parentsData[s]
      })
    }

    if (archiveMetaData !== undefined) {
      config.archiveMeta = archiveMetaData
    }

    if (formMetaData !== undefined) {
      config.formMeta = formMetaData
    }

    if (navigationsData !== undefined) {
      config.navigation = navigationsData
    }

    if (navigationItemsData !== undefined) {
      config.navigationItem = navigationItemsData
    }
  }

  /* Empty serverless reload */

  Object.keys(config.serverless.routes).forEach((r) => {
    config.serverless.routes[r] = []
  })

  /* Loop through all content types */

  const contentTypes = Object.keys(content)

  for (let c = 0; c < contentTypes.length; c += 1) {
    const contentType = contentTypes[c]

    for (let i = 0; i < content[contentType].length; i += 1) {
      const item = await renderItem({
        item: content[contentType][i],
        contentType,
        serverlessData,
        renderFunctions
      })

      const {
        serverlessRender = false,
        data: itemData
      } = item

      if (itemData !== undefined) {
        data.push(itemData)

        if (serverlessRender && serverlessData === undefined) {
          config.serverless.routes.reload.push({
            path: itemData.slug.replace(/^\/|\/$/gm, '')
          })
        }
      }
    }
  }

  /* Files data */

  if (serverlessData === undefined && previewData === undefined) {
    config.store.files.slugs.data = JSON.stringify(_slugs)
    config.store.files.parents.data = JSON.stringify(config.parents)
    config.store.files.archiveMeta.data = JSON.stringify(config.archiveMeta)
    config.store.files.formMeta.data = JSON.stringify(config.formMeta)
    config.store.files.navigations.data = JSON.stringify(config.navigation)
    config.store.files.navigationItems.data = JSON.stringify(config.navigationItem)
  }

  /* Output */

  const output = serverlessData !== undefined || previewData !== undefined ? data[0] : data

  await doActions('renderEnd', { ...args, data: output })

  return output
}

/* Exports */

export {
  render,
  renderItem,
  renderContent,
  getRenderFunctions
}
