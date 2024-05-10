/**
 * Components - Navigation
 */

/* Imports */

import type {
  NavigationProps,
  Navigation as Navigations,
  NavigationByLocation,
  NavigationItem,
  NavigationItemsById,
  NavigationBreadcrumbItem,
  NavigationOutputArgs,
  NavigationBreadcrumbOutputArgs
} from './NavigationTypes'
import type { HtmlString } from '../../global/globalTypes'
import { getSlug } from '../../utils/getSlug/getSlug'
import { getPermalink } from '../../utils/getPermalink/getPermalink'
import { getLink } from '../../utils/getLink/getLink'
import { isArrayStrict } from '../../utils/isArray/isArray'
import { isObjectStrict } from '../../utils/isObject/isObject'
import { isStringStrict, isString } from '../../utils/isString/isString'
import { isFunction } from '../../utils/isFunction/isFunction'
import { normalizeContentType } from '../../utils/normalizeContentType/normalizeContentType'
import { config } from '../../config/config'

/**
 * Class - recursively generate navigation output
 */
class Navigation {
  /**
   * Store all navigations
   *
   * @type {import('./NavigationTypes').Navigations[]}
   */
  navigations: Navigations[] = []

  /**
   * Store all navigation items
   *
   * @type {import('./NavigationTypes').NavigationItem[]}
   */
  items: NavigationItem[] = []

  /**
   * Current link to compare against
   *
   * @type {string}
   */
  currentLink: string = ''

  /**
   * Current content type to compare against
   *
   * @type {string}
   */
  currentType: string = ''

  /**
   * Store initialize success
   *
   * @type {boolean}
   */
  init: boolean = false

  /**
   * Store navigation items by id
   *
   * @private
   * @type {import('./NavigationTypes').NavigationItemsById}
   */
  #itemsById: NavigationItemsById = {}

  /**
   * Store navigations by location
   *
   * @private
   * @type {import('./NavigationTypes').NavigationByLocation}
   */
  #navigationsByLocation: NavigationByLocation = {}

  /**
   * Set properties and initialize
   *
   * @param {import('./NavigationTypes').NavigationProps} props
   */
  constructor (props: NavigationProps) {
    this.init = this.#initialize(props)
  }

  /**
   * Initialize - check required props and set props
   *
   * @private
   * @param {import('./NavigationTypes').NavigationProps} props
   * @return {boolean}
   */
  #initialize (props: NavigationProps): boolean {
    /* Check props is object */

    if (!isObjectStrict(props)) {
      return false
    }

    /* Defaults */

    const {
      navigations = [],
      items = [],
      currentLink = '',
      currentType = ''
    } = props

    /* Check that required items exist */

    if (!isArrayStrict(navigations) || !isArrayStrict(items)) {
      return false
    }

    /* Set variables */

    this.navigations = navigations
    this.items = items
    this.currentLink = currentLink
    this.currentType = normalizeContentType(currentType)

    /* Items by id */

    this.items.forEach(item => {
      const info = this.#getItemInfo(item)

      if (info !== undefined && isStringStrict(info.id)) {
        this.#itemsById[info.id] = info
      }
    })

    /* Navigations by location */

    this.navigations.forEach(nav => {
      if (!isObjectStrict(nav)) {
        return
      }

      const {
        title = '',
        location = '',
        items = []
      } = nav

      if (isStringStrict(title) && isStringStrict(location) && isArrayStrict(items)) {
        this.#navigationsByLocation[location.toLowerCase().replace(/\s+/g, '')] = {
          title,
          items
        }
      }
    })

    /* Init successful */

    return true
  }

  /**
   * Normalize navigation item props
   *
   * @private
   * @param {import('./NavigationTypes').NavigationItem} item
   * @return {import('./NavigationTypes').NavigationItem|undefined}
   */
  #getItemInfo (item: NavigationItem): NavigationItem | undefined {
    if (!isObjectStrict(item)) {
      return
    }

    const {
      title = '',
      internalLink,
      externalLink = '',
      children
    } = item

    let id = isStringStrict(title) ? title : ''
    let external = false

    if (isStringStrict(externalLink)) {
      id = externalLink
      external = true
    }

    if (isObjectStrict(internalLink) && isStringStrict(internalLink.id)) {
      id = internalLink.id
    }

    const link = getLink(internalLink, externalLink)
    const props: NavigationItem = {
      id,
      title,
      link,
      external
    }

    if (isStringStrict(link) && !external) {
      props.current = props.link === this.currentLink
    }

    if (id === config.archiveMeta?.[this.currentType]?.id) {
      props.archiveCurrent = true
    }

    let descendentCurrent = false

    if (isArrayStrict(children)) {
      const storeChildren: NavigationItem[] = []

      descendentCurrent = this.#recurseItemChildren(children, storeChildren)

      props.children = storeChildren
    }

    if (descendentCurrent) {
      props.descendentCurrent = descendentCurrent
    }

    Object.keys(item).forEach((p) => {
      if (props[p] === undefined) {
        props[p] = item[p]
      }
    })

    return props
  }

  /**
   * Loop through items to check and set children
   *
   * @private
   * @param {import('./NavigationTypes').NavigationItem[]} children
   * @param {import('./NavigationTypes').NavigationItem[]} store
   * @return {boolean}
   */
  #recurseItemChildren (
    children: NavigationItem[] = [],
    store: NavigationItem[] = []
  ): boolean {
    let childCurrent = false

    children.forEach(child => {
      const info = this.#getItemInfo(child)

      if (info === undefined) {
        return
      }

      const { current = false } = info

      if (current) {
        childCurrent = true
      }

      store.push(info)
    })

    return childCurrent
  }

  /**
   * Return navigation items by id
   *
   * @private
   * @param {import('./NavigationTypes').NavigationItem[]} items
   * @return {import('./NavigationTypes').NavigationItem[]}
   */
  #getItems (items: NavigationItem[] = []): NavigationItem[] {
    if (items.length === 0) {
      return []
    }

    const resItems: NavigationItem[] = []

    items.forEach(item => {
      if (!isObjectStrict(item)) {
        return
      }

      const {
        title = '',
        internalLink,
        externalLink
      } = item

      let id = ''

      if (isStringStrict(title)) {
        id = title
      }

      if (isStringStrict(externalLink)) {
        id = externalLink
      }

      if (isObjectStrict(internalLink) && isStringStrict(internalLink.id)) {
        id = internalLink.id
      }

      const storedItem = this.#itemsById[id]

      if (storedItem !== undefined) {
        resItems.push(storedItem)
      }
    })

    return resItems
  }

  /**
   * Loop through items to create html
   *
   * @private
   * @param {import('./NavigationTypes').NavigationItem[]} items
   * @param {import('../../global/globalTypes').HtmlString} output
   * @param {import('./NavigationTypes').NavigationOutputArgs} args
   * @param {number} depth
   * @param {number} maxDepth
   * @return {void}
   */
  #recurseOutput = (
    items: NavigationItem[] = [],
    output: HtmlString,
    args: NavigationOutputArgs,
    depth: number = -1,
    maxDepth?: number
  ): void => {
    depth += 1

    if (maxDepth !== undefined && depth > maxDepth) {
      return
    }

    const listFilterArgs = { args, output, items, depth }

    if (isFunction(args.filterBeforeList)) {
      args.filterBeforeList(listFilterArgs)
    }

    const listClasses = isStringStrict(args.listClass) ? ` class="${args.listClass}"` : ''
    const listAttrs = isStringStrict(args.listAttr) ? ` ${args.listAttr}` : ''

    output.html += `<ul data-depth="${depth}"${listClasses}${listAttrs}>`

    items.forEach((item, index) => {
      const {
        title = '',
        link = '',
        external = false,
        children = [],
        current = false,
        descendentCurrent = false,
        archiveCurrent = false
      } = item

      /* Filters args */

      const filterArgs = { args, item, output, index, items, depth }

      /* Item start */

      if (isFunction(args.filterBeforeItem)) {
        args.filterBeforeItem(filterArgs)
      }

      const itemClasses = isStringStrict(args.itemClass) ? ` class="${args.itemClass}"` : ''
      let itemAttrs = isStringStrict(args.itemAttr) ? ` ${args.itemAttr}` : ''

      if (current) {
        itemAttrs += ' data-current="true"'
      }

      if (descendentCurrent) {
        itemAttrs += ' data-descendent-current="true"'
      }

      if (archiveCurrent) {
        itemAttrs += ' data-archive-current="true"'
      }

      output.html += `<li data-depth="${depth}"${itemClasses}${itemAttrs}>`

      /* Link start */

      if (isFunction(args.filterBeforeLink)) {
        args.filterBeforeLink(filterArgs)
      }

      const linkClassesArr: string[] = []

      if (isStringStrict(args.linkClass)) {
        linkClassesArr.push(args.linkClass)
      }

      if (!external && isStringStrict(args.internalLinkClass)) {
        linkClassesArr.push(args.internalLinkClass)
      }

      const linkClasses = (linkClassesArr.length > 0) ? ` class="${linkClassesArr.join(' ')}"` : ''
      const linkAttrsArr = [link !== '' ? `href="${link}"` : 'type="button"']

      if (isStringStrict(args.linkAttr)) {
        linkAttrsArr.push(args.linkAttr)
      }

      if (current) {
        linkAttrsArr.push('data-current="true"')

        if (link !== '') {
          linkAttrsArr.push('aria-current="page"')
        }
      }

      if (descendentCurrent) {
        linkAttrsArr.push('data-descendent-current="true"')
      }

      if (archiveCurrent) {
        linkAttrsArr.push('data-archive-current="true"')
      }

      const linkAttrs = (linkAttrsArr.length > 0) ? ` ${linkAttrsArr.join(' ')}` : ''
      const linkTag = link !== '' ? 'a' : 'button'

      output.html += `<${linkTag} data-depth="${depth}"${linkClasses}${linkAttrs}>`

      if (isFunction(args.filterBeforeLinkText)) {
        args.filterBeforeLinkText(filterArgs)
      }

      output.html += title

      if (isFunction(args.filterAfterLinkText)) {
        args.filterAfterLinkText(filterArgs)
      }

      /* Link end */

      output.html += `</${linkTag}>`

      if (isFunction(args.filterAfterLink)) {
        args.filterAfterLink(filterArgs)
      }

      /* Nested content */

      if (children.length > 0) {
        this.#recurseOutput(children, output, args, depth, maxDepth)
      }

      /* Item end */

      output.html += '</li>'

      if (isFunction(args.filterAfterItem)) {
        args.filterAfterItem(filterArgs)
      }
    })

    output.html += '</ul>'

    if (isFunction(args.filterAfterList)) {
      args.filterAfterList(listFilterArgs)
    }
  }

  /**
   * Return navigation html output
   *
   * @param {string} location
   * @param {import('./NavigationTypes').NavigationOutputArgs} args
   * @param {number} maxDepth
   * @return {string} HTML - ul
   */
  getOutput (
    location: string = '',
    args: NavigationOutputArgs,
    maxDepth?: number
  ): string {
    if (this.#navigationsByLocation[location] === undefined) {
      return ''
    }

    const items = this.#navigationsByLocation[location].items
    const normalizedItems = this.#getItems(items)

    args = Object.assign({
      listClass: '',
      listAttr: '',
      itemClass: '',
      itemAttr: '',
      linkClass: '',
      internalLinkClass: '',
      linkAttr: '',
      filterBeforeList: () => {},
      filterAfterList: () => {},
      filterBeforeItem: () => {},
      filterAfterItem: () => {},
      filterBeforeLink: () => {},
      filterAfterLink: () => {},
      filterBeforeLinkText: () => {},
      filterAfterLinkText: () => {}
    }, args)

    const output = { html: '' }

    this.#recurseOutput(normalizedItems, output, args, -1, maxDepth)

    return output.html
  }

  /**
   * Return breadcrumbs html output
   *
   * @param {import('./NavigationTypes').NavigationBreadcrumbItem[]} items
   * @param {import('./NavigationTypes').NavigationBreadcrumbOutputArgs} args
   * @param {string} current
   * @return {string} HTML - ol
   */
  getBreadcrumbs (
    items: NavigationBreadcrumbItem[] = [],
    args: NavigationBreadcrumbOutputArgs,
    current: string = ''
  ): string {
    /* Items required */

    if (!isArrayStrict(items)) {
      return ''
    }

    /* Args defaults */

    args = Object.assign({
      listClass: '',
      listAttr: '',
      itemClass: '',
      itemAttr: '',
      linkClass: '',
      internalLinkClass: '',
      linkAttr: '',
      currentClass: '',
      a11yClass: 'a-visually-hidden',
      filterBeforeLink: () => {},
      filterAfterLink: () => {}
    }, args)

    /* List attributes */

    const listClasses = isStringStrict(args.listClass) ? ` class="${args.listClass}"` : ''
    const listAttrs = isStringStrict(args.listAttr) ? ` ${args.listAttr}` : ''

    /* Loop through items */

    const itemClasses = isStringStrict(args.itemClass) ? ` class="${args.itemClass}"` : ''
    const itemAttrs = isStringStrict(args.itemAttr) ? ` ${args.itemAttr}` : ''
    const lastItemIndex = items.length - 1

    const itemsArr = items.map((item, index) => {
      const { title } = item

      /* Title required */

      if (!isStringStrict(title)) {
        return ''
      }

      /* Permalink required */

      const slug = getSlug({
        id: item.id,
        slug: item.slug,
        contentType: item.contentType,
        pageData: item.internalLink
      })

      const permalink = isString(slug) ? getPermalink(slug) : ''

      if (permalink === '') {
        return ''
      }

      /* Output store */

      const output = { html: '' }

      /* Check if last */

      const isLastLevel = lastItemIndex === index

      /* Filter args */

      const filterArgs = { output, isLastLevel }

      /* Item */

      output.html += `<li${itemClasses}${itemAttrs} data-last-level="${isLastLevel.toString()}">`

      /* Link */

      if (isFunction(args.filterBeforeLink)) {
        args.filterBeforeLink(filterArgs)
      }

      const linkClassesArr: string[] = []

      if (isStringStrict(args.linkClass)) {
        linkClassesArr.push(args.linkClass)
      }

      if (isStringStrict(args.internalLinkClass)) {
        linkClassesArr.push(args.internalLinkClass)
      }

      const linkClasses = (linkClassesArr.length > 0) ? ` class="${linkClassesArr.join(' ')}"` : ''
      const linkAttrs = isStringStrict(args.linkAttr) ? ` ${args.linkAttr}` : ''

      output.html += `<a${linkClasses} href="${permalink}"${linkAttrs}>${title}</a>`

      if (isFunction(args.filterAfterLink)) {
        args.filterAfterLink(filterArgs)
      }

      /* Close item */

      output.html += '</li>'

      return output.html
    })

    /* Output */

    const currentClasses = isStringStrict(args.currentClass) ? ` class="${args.currentClass}"` : ''
    const a11yClasses = isStringStrict(args.a11yClass) ? ` class="${args.a11yClass}"` : ''

    return `
      <ol${listClasses}${listAttrs}>
        ${itemsArr.join('')}
        <li${itemClasses}${itemAttrs} data-current="true">
          <span${currentClasses}>${current}<span${a11yClasses}> (current page)</span></span>
        </li>
      </ol>
    `
  }
}

/* Exports */

export { Navigation }
