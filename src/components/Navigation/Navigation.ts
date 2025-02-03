/**
 * Components - Navigation
 */

/* Imports */

import type {
  NavigationProps,
  NavigationList,
  NavigationByLocation,
  NavigationItem,
  NavigationItemsById,
  NavigationBreadcrumbItem,
  NavigationOutputArgs,
  NavigationBreadcrumbOutputArgs
} from './NavigationTypes.js'
import type { HtmlString } from '../../global/globalTypes.js'
import { getSlug, getPermalink, getLink } from '../../utils/link/link.js'
import { isArrayStrict } from '../../utils/array/array.js'
import { isObjectStrict } from '../../utils/object/object.js'
import { isStringStrict, isString } from '../../utils/string/string.js'
import { isFunction } from '../../utils/function/function.js'
import { isNumber } from '../../utils/number/number.js'
import { normalizeContentType } from '../../utils/contentType/contentType.js'
import { getStoreItem } from '../../store/store.js'

/**
 * Recursively generate navigation output
 */
class Navigation<L extends string = string> {
  /**
   * All navigations
   *
   * @type {NavigationList[]}
   */
  navigations: NavigationList[] = []

  /**
   * All navigation items
   *
   * @type {NavigationItem[]}
   */
  items: NavigationItem[] = []

  /**
   * Current link to compare against
   *
   * @type {string}
   */
  currentLink: string = ''

  /**
   * Current content type(s) to compare against
   *
   * @type {string[]}
   */
  currentType: string[] = []

  /**
   * Initialize success
   *
   * @type {boolean}
   */
  init: boolean = false

  /**
   * Navigation items by id
   *
   * @private
   * @type {NavigationItemsById}
   */
  #itemsById: NavigationItemsById = new Map()

  /**
   * Navigations by location
   *
   * @private
   * @type {NavigationByLocation}
   */
  #navigationsByLocation: NavigationByLocation<L> = new Map()

  /**
   * Set properties and initialize
   *
   * @param {NavigationProps} props
   */
  constructor (props: NavigationProps) {
    this.init = this.#initialize(props)
  }

  /**
   * Initialize - check required props and set props
   *
   * @private
   * @param {NavigationProps} props
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

    const typesArr = isArrayStrict(currentType) ? currentType : [currentType]

    this.currentType = typesArr.map(type => normalizeContentType(type))

    /* Items by id */

    this.items.forEach(item => {
      if (item == null) { // eslint-disable-line @typescript-eslint/no-unnecessary-condition
        return
      }

      this.#itemsById.set(item.id, item)
    })

    this.items.forEach(item => {
      const info = this.#getItemInfo(item)

      if (info != null) {
        this.#itemsById.set(info.id, info)
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

      const locations = isArrayStrict(location) ? location : [location]

      if (!isStringStrict(title) || !isArrayStrict(items)) {
        return
      }

      locations.forEach(loc => {
        this.#navigationsByLocation.set(loc as L, {
          title,
          items
        })
      })
    })

    /* Init successful */

    return true
  }

  /**
   * Normalize navigation item props
   *
   * @private
   * @param {NavigationItem} item
   * @return {NavigationItem|undefined}
   */
  #getItemInfo (item: NavigationItem | undefined): NavigationItem | undefined {
    if (!isObjectStrict(item)) {
      return
    }

    const {
      id,
      title = '',
      link,
      internalLink,
      externalLink = '',
      children
    } = item

    let external = false

    if (isStringStrict(externalLink)) {
      external = true
    }

    const props: NavigationItem = {
      id,
      title,
      link: isStringStrict(link) ? link : getLink(internalLink, externalLink),
      external
    }

    if (isStringStrict(props.link) && !external) {
      props.current = props.link === this.currentLink
    }

    const internalId = internalLink?.id

    if (isStringStrict(internalId)) {
      let isArchiveCurrent = false

      for (const type of this.currentType) {
        const hasArchive = internalId === getStoreItem('archiveMeta')[type]?.id

        if (hasArchive) {
          isArchiveCurrent = true
          break
        }
      }

      props.archiveCurrent = isArchiveCurrent
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

    return {
      ...item,
      ...props
    }
  }

  /**
   * Check if any children match current link
   *
   * @private
   * @param {NavigationItem[]} children
   * @param {NavigationItem[]} output
   * @return {boolean}
   */
  #recurseItemChildren (
    children: NavigationItem[] = [],
    output: NavigationItem[] = []
  ): boolean {
    let childCurrent = false

    children.forEach(child => {
      const info = this.#getItemInfo(this.#itemsById.get(child?.id)) // eslint-disable-line @typescript-eslint/no-unnecessary-condition

      if (info == null) {
        return
      }

      const {
        current = false,
        archiveCurrent = false
      } = info

      if (current || archiveCurrent) {
        childCurrent = true
      }

      output.push(info)
    })

    return childCurrent
  }

  /**
   * Return navigation items by id
   *
   * @private
   * @param {NavigationItem[]} items
   * @return {NavigationItem[]}
   */
  #getItems (items: NavigationItem[] = []): NavigationItem[] {
    const resItems: NavigationItem[] = []

    items.forEach(item => {
      if (!isObjectStrict(item)) {
        return
      }

      const { id } = item
      const storedItem = this.#itemsById.get(id)

      if (storedItem != null) {
        resItems.push(storedItem)
      }
    })

    return resItems
  }

  /**
   * Loop through items to create html
   *
   * @private
   * @param {NavigationItem[]} items
   * @param {HtmlString} output
   * @param {NavigationOutputArgs} args
   * @param {number} depth
   * @param {number} maxDepth
   * @return {void}
   */
  #recurseOutput = (
    items: NavigationItem[] = [],
    output: HtmlString,
    args: NavigationOutputArgs,
    depth: number = 0,
    maxDepth?: number
  ): void => {
    if (isNumber(maxDepth) && depth > maxDepth) {
      return
    }

    /* Data attributes */

    const dataAttr = isStringStrict(args.dataAttr) ? args.dataAttr : 'data-nav'
    const depthAttr = args.depthAttr ? ` ${dataAttr}-depth="${depth}"` : ''

    /* List start */

    const listFilterArgs = { args, output, items, depth }

    if (isFunction(args.filterBeforeList)) {
      args.filterBeforeList(listFilterArgs)
    }

    const listClasses = isStringStrict(args.listClass) ? ` class="${args.listClass}"` : ''
    const listAttrs = isStringStrict(args.listAttr) ? ` ${args.listAttr}` : ''
    const listTag = isStringStrict(args.listTag) ? args.listTag : 'ul'

    output.html += `<${listTag}${depthAttr}${listClasses}${listAttrs}>`

    /* Items */

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
      const itemTag = isStringStrict(args.itemTag) ? args.itemTag : 'li'
      let itemAttrs = isStringStrict(args.itemAttr) ? ` ${args.itemAttr}` : ''

      if (current) {
        itemAttrs += ` ${dataAttr}-current`
      }

      if (descendentCurrent) {
        itemAttrs += ` ${dataAttr}-descendent-current`
      }

      if (archiveCurrent) {
        itemAttrs += ` ${dataAttr}-archive-current`
      }

      output.html += `<${itemTag}${depthAttr}${itemClasses}${itemAttrs}>`

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

      const hasLink = isStringStrict(link)
      const linkClasses = (linkClassesArr.length > 0) ? ` class="${linkClassesArr.join(' ')}"` : ''
      const linkAttrsArr = [hasLink ? `href="${link}"` : 'type="button"']

      if (isStringStrict(args.linkAttr)) {
        linkAttrsArr.push(args.linkAttr)
      }

      if (current) {
        linkAttrsArr.push(`${dataAttr}-current`)

        if (hasLink) {
          linkAttrsArr.push('aria-current="page"')
        }
      }

      if (descendentCurrent) {
        linkAttrsArr.push(`${dataAttr}-descendent-current`)
      }

      if (archiveCurrent) {
        linkAttrsArr.push(`${dataAttr}-archive-current`)
      }

      const linkAttrs = ` ${linkAttrsArr.join(' ')}`
      const linkTag = hasLink ? 'a' : 'button'

      output.html += `<${linkTag}${depthAttr}${linkClasses}${linkAttrs}>`

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
        this.#recurseOutput(children, output, args, depth + 1, maxDepth)
      }

      /* Item end */

      output.html += `</${itemTag}>`

      if (isFunction(args.filterAfterItem)) {
        args.filterAfterItem(filterArgs)
      }
    })

    /* List end */

    output.html += `</${listTag}>`

    if (isFunction(args.filterAfterList)) {
      args.filterAfterList(listFilterArgs)
    }
  }

  /**
   * Return navigation html output
   *
   * @param {string} location
   * @param {NavigationOutputArgs} args
   * @param {number} maxDepth
   * @return {string} HTMLUListElement
   */
  getOutput (
    location: L,
    args?: NavigationOutputArgs,
    maxDepth?: number
  ): string {
    const nav = this.#navigationsByLocation.get(location)

    if (nav == null) {
      return ''
    }

    const items = nav.items
    const normalizedItems = this.#getItems(items)

    if (normalizedItems.length === 0) {
      return ''
    }

    args = Object.assign({
      listTag: 'ul',
      listClass: '',
      listAttr: '',
      itemTag: 'li',
      itemClass: '',
      itemAttr: '',
      linkClass: '',
      internalLinkClass: '',
      linkAttr: '',
      dataAttr: '',
      depthAttr: false,
      filterBeforeList: () => {},
      filterAfterList: () => {},
      filterBeforeItem: () => {},
      filterAfterItem: () => {},
      filterBeforeLink: () => {},
      filterAfterLink: () => {},
      filterBeforeLinkText: () => {},
      filterAfterLinkText: () => {}
    }, isObjectStrict(args) ? args : {})

    const output = { html: '' }

    this.#recurseOutput(normalizedItems, output, args, 0, maxDepth)

    return output.html
  }

  /**
   * Return breadcrumbs html output
   *
   * @param {NavigationBreadcrumbItem[]} items
   * @param {string} current
   * @param {NavigationBreadcrumbOutputArgs} [args]
   * @return {string} HTMLOListElement
   */
  getBreadcrumbs (
    items: NavigationBreadcrumbItem[],
    current: string = '',
    args?: NavigationBreadcrumbOutputArgs
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
      a11yClass: 'a-hide-vis',
      dataAttr: '',
      filterBeforeLink: () => {},
      filterAfterLink: () => {}
    }, isObjectStrict(args) ? args : {})

    /* Data attributes */

    const dataAttr = isStringStrict(args.dataAttr) ? args.dataAttr : 'data-nav'

    /* List attributes */

    const listClasses = isStringStrict(args.listClass) ? ` class="${args.listClass}"` : ''
    const listAttrs = isStringStrict(args.listAttr) ? ` ${args.listAttr}` : ''

    /* Remove items that do not have title or slug */

    const filteredItems = items.filter((item) => {
      if (!isStringStrict(item.title)) {
        return false
      }

      if (!isString(item.slug)) {
        return false
      }

      item.slug = getSlug({
        id: item.id,
        slug: item.slug,
        contentType: item.contentType,
        pageData: item.internalLink
      })

      return true
    })

    /* Loop through items */

    const itemClasses = isStringStrict(args.itemClass) ? ` class="${args.itemClass}"` : ''
    const itemAttrs = isStringStrict(args.itemAttr) ? ` ${args.itemAttr}` : ''
    const lastItemIndex = filteredItems.length - 1

    const itemsArr = filteredItems.map((item, index) => {
      const { title, slug } = item

      /* Link */

      const link = getPermalink(slug)

      /* Output store */

      const output = { html: '' }

      /* Check if last */

      const lastLevel = lastItemIndex === index

      /* Filter args */

      const filterArgs = { output, lastLevel }

      /* Item */

      output.html += `<li${itemClasses}${itemAttrs}${lastLevel ? ` ${dataAttr}-last` : ''}>`

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

      output.html += `<a${linkClasses} href="${link}"${linkAttrs}>${title}</a>`

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
        <li${itemClasses}${itemAttrs} ${dataAttr}-current>
          <span${currentClasses}>${current}<span${a11yClasses}> (current page)</span></span>
        </li>
      </ol>
    `
  }

  /**
   * Return object of items stored by id
   *
   * @return {NavigationItemsById}
   */
  getItemsById (): NavigationItemsById {
    return this.#itemsById
  }

  /**
   * Return object of navigations stored by location
   *
   * @return {NavigationByLocation}
   */
  getNavigationsByLocation (): NavigationByLocation<L> {
    return this.#navigationsByLocation
  }
}

/* Exports */

export { Navigation }
