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
  NavigationOutputArgs,
  NavigationByLocationItem
} from './NavigationTypes.js'
import type { RefString } from '../../global/globalTypes.js'
import { getLink } from '../../utils/link/link.js'
import { isArrayStrict } from '../../utils/array/array.js'
import { isObjectStrict } from '../../utils/object/object.js'
import { isStringStrict } from '../../utils/string/string.js'
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
   * Navigation items by ID.
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

    /* Items by ID */

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
        items
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
   * Loop through items to create HTML.
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
   * Navigation HTML output.
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

    const newArgs = {
      depthAttr: false,
      ...args
    }

    const items = nav.items
    const { currentLink, currentType } = newArgs
    const currLink = isStringStrict(currentLink) ? currentLink : ''
    const currType = (isArrayStrict(currentType) ? currentType : [currentType]).map(type => normalizeContentType(type))
    const normalizedItems = this.#getItems(items, currLink, currType)

    if (!normalizedItems.length) {
      return ''
    }

    const output = { ref: '' }

    this.#recurseOutput(normalizedItems, output, newArgs, 0, maxDepth)

    return output.ref
  }

  /**
   * Items stored by ID.
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
