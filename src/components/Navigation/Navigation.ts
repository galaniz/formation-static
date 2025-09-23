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
  NavigationBreadcrumbOutputArgs,
  NavigationByLocationItem
} from './NavigationTypes.js'
import type { RefString } from '../../global/globalTypes.js'
import { getSlug, getPermalink, getLink } from '../../utils/link/link.js'
import { isArrayStrict } from '../../utils/array/array.js'
import { isObjectStrict } from '../../utils/object/object.js'
import { isStringStrict, isString } from '../../utils/string/string.js'
import { isFunction } from '../../utils/function/function.js'
import { isNumber } from '../../utils/number/number.js'
import { normalizeContentType } from '../../utils/contentType/contentType.js'
import { getArchiveMeta } from '../../utils/archive/archive.js'

/**
 * Handles navigation data and recursively generating output.
 */
class Navigation<L extends string = string> {
  /**
   * All navigations.
   *
   * @type {NavigationList[]}
   */
  navigations: NavigationList[] = []

  /**
   * All navigation items.
   *
   * @type {NavigationItem[]}
   */
  items: NavigationItem[] = []

  /**
   * Initialize success.
   *
   * @type {boolean}
   */
  init: boolean = false

  /**
   * Navigation items by id.
   *
   * @private
   * @type {NavigationItemsById}
   */
  #itemsById: NavigationItemsById = new Map()

  /**
   * Navigations by location.
   *
   * @private
   * @type {NavigationByLocation}
   */
  #navigationsByLocation: NavigationByLocation<L> = new Map()

  /**
   * Create new instance with given props.
   *
   * @param {NavigationProps} props
   */
  constructor (props: NavigationProps) {
    this.init = this.#initialize(props)
  }

  /**
   * Init check required props and set props.
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

    const { navigations, items } = props

    /* Check that required items exist */

    if (!isArrayStrict(navigations) || !isArrayStrict(items)) {
      return false
    }

    /* Props */

    this.navigations = navigations
    this.items = items

    /* Items by id */

    this.items.forEach(item => {
      if (!isObjectStrict(item)) {
        return
      }

      this.#itemsById.set(item.id, item)
    })

    /* Navigations by location */

    this.navigations.forEach(nav => {
      if (!isObjectStrict(nav)) {
        return
      }

      const {
        title,
        location,
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
   * Check if any children match current.
   *
   * @private
   * @param {NavigationItem[]} children
   * @param {NavigationItem[]} output
   * @param {string} [currentLink]
   * @param {string[]} [currentType]
   * @return {boolean}
   */
  #recurseItemChildren (
    children: NavigationItem[],
    output: NavigationItem[],
    currentLink: string = '',
    currentType: string | string[] = []
  ): boolean {
    let childCurrent = false

    children.forEach(child => {
      const newItem = this.#getItem(this.#itemsById.get(child?.id || ''), currentLink, currentType) // eslint-disable-line @typescript-eslint/no-unnecessary-condition

      if (!newItem) {
        return
      }

      const { current, archiveCurrent } = newItem

      if (current || archiveCurrent) {
        childCurrent = true
      }

      output.push(newItem)
    })

    return childCurrent
  }

  /**
   * Normalize item props.
   *
   * @private
   * @param {NavigationItem|undefined} item
   * @param {string} [currentLink]
   * @param {string[]} [currentType=[]]
   * @return {NavigationItem|undefined}
   */
  #getItem (
    item: NavigationItem | undefined,
    currentLink?: string,
    currentType: string | string[] = []
  ): NavigationItem | undefined {
    /* Item required */

    if (!isObjectStrict(item)) {
      return
    }

    const {
      id,
      title,
      link,
      internalLink,
      externalLink,
      children
    } = item

    /* External */

    let external = false

    if (isStringStrict(externalLink)) {
      external = true
    }

    /* Link */

    const newLink = isStringStrict(link) ? link : getLink(internalLink, externalLink)

    /* Props */

    const newItem: NavigationItem = {
      ...item,
      id,
      title,
      link: newLink,
      external
    }

    /* Current */

    if (newLink && !external) {
      newItem.current = newLink === currentLink
    }

    /* Archive current */

    const internalId = internalLink?.id

    if (isStringStrict(internalId)) {
      let archiveCurrent = false

      for (const type of currentType) {
        const hasArchive = internalId === getArchiveMeta(type, internalLink?.locale as string).id

        if (hasArchive) {
          archiveCurrent = true
          break
        }
      }

      newItem.archiveCurrent = archiveCurrent
    }

    /* Descendent current */

    let descendentCurrent = false

    if (isArrayStrict(children)) {
      const newChildren: NavigationItem[] = []
      descendentCurrent = this.#recurseItemChildren(children, newChildren, currentLink, currentType)
      newItem.children = newChildren
    }

    if (descendentCurrent) {
      newItem.descendentCurrent = descendentCurrent
    }

    /* Result */

    return newItem
  }

  /**
   * Process items with current link and type.
   *
   * @private
   * @param {NavigationItem[]} items
   * @param {string} [currentLink]
   * @param {string[]} [currentType]
   * @return {NavigationItem[]}
   */
  #getItems (
    items: NavigationItem[] = [],
    currentLink?: string,
    currentType?: string | string[]
  ): NavigationItem[] {
    const resItems: NavigationItem[] = []

    items.forEach(item => {
      const newItem = this.#getItem(this.#itemsById.get(item?.id || ''), currentLink, currentType) // eslint-disable-line @typescript-eslint/no-unnecessary-condition

      if (!newItem) {
        return
      }

      resItems.push(newItem)
    })

    return resItems
  }

  /**
   * Loop through items to create html.
   *
   * @private
   * @param {NavigationItem[]} items
   * @param {RefString} output
   * @param {NavigationOutputArgs} args
   * @param {number} depth
   * @param {number} maxDepth
   * @return {void}
   */
  #recurseOutput = (
    items: NavigationItem[],
    output: RefString,
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

    output.ref += `<${listTag}${depthAttr}${listClasses}${listAttrs}>`

    /* Items */

    items.forEach((item, index) => {
      /* Filters args */

      const filterArgs = { args, item, output, index, items, depth }

      /* Item start */

      if (isFunction(args.filterBeforeItem)) {
        args.filterBeforeItem(filterArgs)
      }

      const {
        title,
        link,
        external = false,
        children,
        current = false,
        descendentCurrent = false,
        archiveCurrent = false
      } = item

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

      output.ref += `<${itemTag}${depthAttr}${itemClasses}${itemAttrs}>`

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
      const linkClasses = linkClassesArr.length ? ` class="${linkClassesArr.join(' ')}"` : ''
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

      output.ref += `<${linkTag}${depthAttr}${linkClasses}${linkAttrs}>`

      if (isFunction(args.filterBeforeLinkText)) {
        args.filterBeforeLinkText(filterArgs)
      }

      output.ref += title

      if (isFunction(args.filterAfterLinkText)) {
        args.filterAfterLinkText(filterArgs)
      }

      /* Link end */

      output.ref += `</${linkTag}>`

      if (isFunction(args.filterAfterLink)) {
        args.filterAfterLink(filterArgs)
      }

      /* Nested content */

      if (isArrayStrict(children)) {
        this.#recurseOutput(children, output, args, depth + 1, maxDepth)
      }

      /* Item end */

      output.ref += `</${itemTag}>`

      if (isFunction(args.filterAfterItem)) {
        args.filterAfterItem(filterArgs)
      }
    })

    /* List end */

    output.ref += `</${listTag}>`

    if (isFunction(args.filterAfterList)) {
      args.filterAfterList(listFilterArgs)
    }
  }

  /**
   * Navigation html output.
   *
   * @param {string} location
   * @param {NavigationOutputArgs} [args]
   * @param {number} [maxDepth]
   * @return {string} HTMLUListElement
   */
  getOutput (location: L, args?: NavigationOutputArgs, maxDepth?: number): string {
    const nav = this.#navigationsByLocation.get(location)

    if (!nav) {
      return ''
    }

    args = Object.assign({ depthAttr: false }, args || {})

    const items = nav.items
    const { currentLink, currentType } = args
    const currLink = isStringStrict(currentLink) ? currentLink : ''
    const currType = (isArrayStrict(currentType) ? currentType : [currentType]).map(type => normalizeContentType(type))
    const normalizedItems = this.#getItems(items, currLink, currType)

    if (!normalizedItems.length) {
      return ''
    }

    const output = { ref: '' }

    this.#recurseOutput(normalizedItems, output, args, 0, maxDepth)

    return output.ref
  }

  /**
   * Breadcrumbs html output.
   *
   * @param {NavigationBreadcrumbItem[]} items
   * @param {NavigationBreadcrumbOutputArgs} [args]
   * @return {string} HTMLOListElement
   */
  getBreadcrumbs (
    items: NavigationBreadcrumbItem[],
    args?: NavigationBreadcrumbOutputArgs
  ): string {
    /* Items required */

    if (!isArrayStrict(items)) {
      return ''
    }

    /* Args defaults */

    args = Object.assign({ a11yClass: 'a-hide-vis' }, args || {})

    /* Current */

    const current = args.current

    /* Data attributes */

    const dataAttr = isStringStrict(args.dataAttr) ? args.dataAttr : 'data-nav'

    /* List attributes */

    const listClasses = isStringStrict(args.listClass) ? ` class="${args.listClass}"` : ''
    const listAttrs = isStringStrict(args.listAttr) ? ` ${args.listAttr}` : ''

    /* Remove items that do not have title or slug */

    const filteredItems = items.filter(item => {
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
        itemData: item.internalLink
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

      /* Output */

      const output = { ref: '' }

      /* Check if last */

      const lastLevel = lastItemIndex === index

      /* Filter args */

      const filterArgs = { output, lastLevel }

      /* Item */

      output.ref += `<li${itemClasses}${itemAttrs}${lastLevel ? ` ${dataAttr}-last` : ''}>`

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

      const linkClasses = linkClassesArr.length ? ` class="${linkClassesArr.join(' ')}"` : ''
      const linkAttrs = isStringStrict(args.linkAttr) ? ` ${args.linkAttr}` : ''

      output.ref += `<a${linkClasses} href="${link}"${linkAttrs}>${title}</a>`

      if (isFunction(args.filterAfterLink)) {
        args.filterAfterLink(filterArgs)
      }

      /* Close item */

      output.ref += '</li>'

      return output.ref
    })

    /* Current item */

    const currentLabel = isStringStrict(args.currentLabel) ? args.currentLabel : '(current page)'
    const currentClasses = isStringStrict(args.currentClass) ? ` class="${args.currentClass}"` : ''
    const a11yClasses = isStringStrict(args.a11yClass) ? ` class="${args.a11yClass}"` : ''
    const currentItem = isStringStrict(current) ? `
      <li${itemClasses}${itemAttrs} ${dataAttr}-current>
        <span${currentClasses}>${current}<span${a11yClasses}> ${currentLabel}</span></span>
      </li>
    ` : ''

    /* Output */

    return `
      <ol${listClasses}${listAttrs}>
        ${itemsArr.join('')}
        ${currentItem}
      </ol>
    `
  }

  /**
   * Items stored by id.
   *
   * @return {NavigationItemsById}
   */
  getItemsById (): NavigationItemsById {
    return this.#itemsById
  }

  /**
   * All navigations stored by location.
   *
   * @return {NavigationByLocation}
   */
  getNavigationsByLocation (): NavigationByLocation<L> {
    return this.#navigationsByLocation
  }

  /**
   * Single navigation by location.
   *
   * @param {string} location
   * @return {NavigationByLocationItem|undefined}
   */
  getNavigationByLocation (location: L): NavigationByLocationItem | undefined {
    return this.#navigationsByLocation.get(location)
  }
}

/* Exports */

export { Navigation }
