/**
 * Components - Navigation Test
 */

/* Imports */

import type { NavigationProps } from '../NavigationTypes.js'
import { it, expect, describe, beforeEach, afterEach } from 'vitest'
import { testMinify, testResetStore } from '../../../../tests/utils.js'
import { Navigation } from '../Navigation.js'
import { setStore } from '../../../store/store.js'

/**
 * Nav props with specified current link and type.
 *
 * @return {NavigationProps}
 */
const testNavProps = (): NavigationProps => {
  const homeItem = {
    id: '1',
    title: 'Home',
    internalLink: {
      id: 'home',
      slug: '/'
    }
  }

  const blogItem = {
    id: '2',
    title: 'Blog',
    internalLink: {
      id: 'blog',
      slug: 'blog',
      locale: 'en-CA'
    }
  }

  const aboutItem = {
    id: '3',
    title: 'About',
    internalLink: {
      id: 'about',
      slug: 'about'
    },
    children: [
      {
        id: blogItem.id,
        title: blogItem.title
      },
      null
    ]
  }

  const externalItem = {
    id: '4',
    title: 'External',
    externalLink: 'http://external.com/'
  }

  return {
    navigations: [
      {
        id: '5',
        title: 'Home',
        location: [
          'header',
          'footer'
        ],
        items: [
          {
            id: homeItem.id,
            title: homeItem.title
          },
          // @ts-expect-error - test null children
          aboutItem,
          externalItem
        ]
      },
      {
        id: '6',
        title: 'Empty',
        location: 'empty',
        items: []
      },
      // @ts-expect-error - test invalid nav
      null
    ],
    items: [
      homeItem,
      // @ts-expect-error - test null children
      aboutItem,
      externalItem,
      blogItem,
      // @ts-expect-error - test invalid item
      null
    ]
  }
}

/* Tests */

describe('Navigation', () => {
  let primary: Navigation

  afterEach(() => {
    testResetStore()
  })

  beforeEach(() => {
    setStore({
      archiveMeta: {
        blog: {
          'en-CA': {
            id: 'blog'
          }
        }
      }
    })

    primary = new Navigation(testNavProps())
  })

  /* Test init */

  describe('Initialization', () => {
    it('should initialize with valid props', () => {
      expect(primary.init).toBe(true)
      expect(primary.navigations.length).toBe(3)
      expect(primary.items.length).toBe(5)
    })

    it('should fail to initialize with undefined props', () => {
      // @ts-expect-error - test undefined props
      const nav = new Navigation(undefined)
      const result = nav.init
      const expectedResult = false

      expect(result).toBe(expectedResult)
    })

    it('should fail to initialize with empty props', () => {
      // @ts-expect-error - test empty props
      const nav = new Navigation({})
      const result = nav.init
      const expectedResult = false

      expect(result).toBe(expectedResult)
    })

    it('should fail to initialize with empty navigations or navigation items', () => {
      const nav = new Navigation({
        navigations: [],
        items: []
      })

      const result = nav.init
      const expectedResult = false

      expect(result).toBe(expectedResult)
    })

    it('should contain navigation items by ID', () => {
      const items = primary.getItemsById()

      expect(items.get('1')).toBeDefined()
      expect(items.get('2')).toBeDefined()
      expect(items.get('3')).toBeDefined()
      expect(items.get('4')).toBeDefined()
      expect(items.size).toBe(4)
    })

    it('should contain navigations with items by location', () => {
      const navs = primary.getNavigationsByLocation()

      expect(navs.get('header')).toBeDefined()
      expect(navs.get('footer')).toBeDefined()
      expect(navs.get('empty')).not.toBeDefined()
      expect(navs.size).toBe(2)
    })

    it('should return single navigation by location', () => {
      const nav = primary.getNavigationByLocation('header')
      const expectedNav = {
        title: 'Home',
        items: [
          {
            id: '1',
            title: 'Home'
          },
          {
            id: '3',
            title: 'About',
            internalLink: {
              id: 'about',
              slug: 'about'
            },
            children: [
              {
                id: '2',
                title: 'Blog'
              },
              null
            ]
          },
          {
            id: '4',
            title: 'External',
            externalLink: 'http://external.com/'
          }
        ]
      }

      expect(nav).toEqual(expectedNav)
    })
  })

  /* Test getOutput */

  describe('getOutput()', () => {
    it('should return empty string for unknown location', () => {
      const result = primary.getOutput('unknown', {
        currentLink: '/',
        currentType: ['page']
      })

      const expectedResult = ''

      expect(result).toBe(expectedResult)
    })

    it('should return empty string if null items', () => {
      const nav = new Navigation({
        navigations: [
          {
            title: 'Nav',
            location: 'nav',
            // @ts-expect-error - test null items
            items: [null, null]
          }
        ],
        items: [
          // @ts-expect-error - test invalid internal link
          {
            internalLink: {
              id: 'empty'
            }
          }
        ]
      })

      const result = nav.getOutput('nav')
      const expectedResult = ''

      expect(result).toBe(expectedResult)
    })

    it('should return list markup string with home as current', () => {
      const res = primary.getOutput('header', {
        currentLink: '/',
        currentType: ['page']
      })

      const expected = `
        <ul>
          <li data-nav-current>
            <a href="/" data-nav-current aria-current="page">Home</a>
          </li>
          <li>
            <a href="/about/">About</a>
            <ul>
              <li>
                <a href="/blog/">Blog</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="http://external.com/">External</a>
          </li>
        </ul>
      `

      const result = testMinify(res)
      const expectedResult = testMinify(expected)

      expect(result).toBe(expectedResult)
    })

    it('should return list markup string one level deep', () => {
      const res = primary.getOutput('header', {
        depthAttr: true,
        currentLink: '/',
        currentType: ['page']
      }, 0)

      const expected = `
        <ul data-nav-depth="0">
          <li data-nav-depth="0" data-nav-current>
            <a data-nav-depth="0" href="/" data-nav-current aria-current="page">Home</a>
          </li>
          <li data-nav-depth="0">
            <a data-nav-depth="0" href="/about/">About</a>
          </li>
          <li data-nav-depth="0">
            <a data-nav-depth="0" href="http://external.com/">External</a>
          </li>
        </ul>
      `

      const result = testMinify(res)
      const expectedResult = testMinify(expected)

      expect(result).toBe(expectedResult)
    })

    it('should return list markup string with home as current and classes and attributes from args', () => {
      const res = primary.getOutput('header', {
        listClass: 'x',
        listAttr: 'data-x',
        itemClass: 'y',
        itemAttr: 'data-y',
        linkClass: 'z',
        internalLinkClass: 'in',
        linkAttr: 'data-z',
        itemTag: 'div',
        listTag: 'div',
        dataAttr: 'data-test',
        depthAttr: true,
        currentLink: '/',
        currentType: ['page']
      })

      const expected = `
        <div data-test-depth="0" class="x" data-x>
          <div data-test-depth="0" class="y" data-y data-test-current>
            <a data-test-depth="0" class="z in" href="/" data-z data-test-current aria-current="page">Home</a>
          </div>
          <div data-test-depth="0" class="y" data-y>
            <a data-test-depth="0" class="z in" href="/about/" data-z>About</a>
            <div data-test-depth="1" class="x" data-x>
              <div data-test-depth="1" class="y" data-y>
                <a data-test-depth="1" class="z in" href="/blog/" data-z>Blog</a>
              </div>
            </div>
          </div>
          <div data-test-depth="0" class="y" data-y>
            <a data-test-depth="0" class="z" href="http://external.com/" data-z>External</a>
          </div>
        </div>
      `

      const result = testMinify(res)
      const expectedResult = testMinify(expected)

      expect(result).toBe(expectedResult)
    })

    it('should return list markup string with classes and attributes from filter args', () => {
      const res = primary.getOutput('header', {
        currentLink: '/blog/',
        currentType: ['page'],
        listClass: 'x',
        listAttr: 'data-x',
        itemClass: 'y',
        itemAttr: 'data-y',
        linkClass: 'z',
        internalLinkClass: 'in',
        linkAttr: 'data-z',
        depthAttr: true,
        filterBeforeList ({ args, output, items, depth }) {
          args.listClass = `x-${depth}-${items.length}`
          args.listAttr = `data-x-${depth}`
          output.ref += '<!-- Before List -->'

          if (depth > 0) {
            items.forEach(item => {
              item.link = ''
            })
          }
        },
        filterBeforeItem ({ args, item, output, index, items, depth }) {
          if (item.link === '/about/') {
            item.link = '/about-us/'
            item.title = 'About Us'
          }

          args.itemClass = `y-${depth}-${index}-${items.length}`
          args.itemAttr = `data-y="${item.title}"`
          output.ref += '<!-- Before Item -->'
        },
        filterBeforeLink ({ args, item, output, index, items, depth }) {
          args.linkClass = `z-${depth}-${index}-${items.length}`
          args.linkAttr = `data-z="${item.title}"`
          output.ref += '<!-- Before Link -->'
        },
        filterBeforeLinkText ({ args, item, output, index, items, depth }) {
          const linkClass = String(args.linkClass)
          output.ref +=
            `<!-- Before Link Text: ${linkClass}-${item.title}-${index}-${items.length}-${depth} -->`
        },
        filterAfterLinkText ({ args, item, output, index, items, depth }) {
          const linkClass = String(args.linkClass)
          output.ref +=
            `<!-- After Link Text: ${linkClass}-${item.title}-${index}-${items.length}-${depth} -->`
        },
        filterAfterLink ({ args, item, output, index, items, depth }) {
          const linkClass = String(args.linkClass)
          output.ref +=
            `<!-- After Link: ${linkClass}-${item.title}-${index}-${items.length}-${depth} -->`
        },
        filterAfterItem ({ args, item, output, index, items, depth }) {
          const itemClass = String(args.itemClass)
          output.ref +=
            `<!-- After Item: ${itemClass}-${item.title}-${index}-${items.length}-${depth} -->`
        },
        filterAfterList ({ args, output, depth }) {
          const listClass = String(args.listClass)
          output.ref +=
            `<!-- After List: ${listClass}-${depth} -->`
        }
      })

      const expected = `
        <!-- Before List -->
        <ul data-nav-depth="0" class="x-0-3" data-x-0>
          <!-- Before Item -->
          <li data-nav-depth="0" class="y-0-0-3" data-y="Home">
            <!-- Before Link -->
            <a
              data-nav-depth="0"
              class="z-0-0-3 in"
              href="/"
              data-z="Home"
            >
              <!-- Before Link Text: z-0-0-3-Home-0-3-0 -->
              Home
              <!-- After Link Text: z-0-0-3-Home-0-3-0 -->
            </a>
            <!-- After Link: z-0-0-3-Home-0-3-0 -->
          </li>
          <!-- After Item: y-0-0-3-Home-0-3-0 -->
          <!-- Before Item -->
          <li data-nav-depth="0" class="y-0-1-3" data-y="About Us" data-nav-descendent-current>
            <!-- Before Link -->
            <a data-nav-depth="0" class="z-0-1-3 in" href="/about-us/" data-z="About Us" data-nav-descendent-current>
              <!-- Before Link Text: z-0-1-3-About Us-1-3-0 -->
              About Us
              <!-- After Link Text: z-0-1-3-About Us-1-3-0 -->
            </a>
            <!-- After Link: z-0-1-3-About Us-1-3-0 -->
            <!-- Before List -->
            <ul data-nav-depth="1" class="x-1-1" data-x-1>
              <!-- Before Item -->
              <li data-nav-depth="1" class="y-1-0-1" data-y="Blog" data-nav-current>
                <!-- Before Link -->
                <button data-nav-depth="1" class="z-1-0-1 in" type="button" data-z="Blog" data-nav-current>
                  <!-- Before Link Text: z-1-0-1-Blog-0-1-1 -->
                  Blog
                  <!-- After Link Text: z-1-0-1-Blog-0-1-1 -->
                </button>
                <!-- After Link: z-1-0-1-Blog-0-1-1 -->
              </li>
              <!-- After Item: y-1-0-1-Blog-0-1-1 -->
            </ul>
            <!-- After List: x-1-1-1 -->
          </li>
          <!-- After Item: y-1-0-1-AboutUs-1-3-0 -->
          <!-- Before Item -->
          <li data-nav-depth="0" class="y-0-2-3" data-y="External">
            <!-- Before Link -->
            <a data-nav-depth="0" class="z-0-2-3" href="http://external.com/" data-z="External">
              <!-- Before Link Text: z-0-2-3-External-2-3-0 -->
              External
              <!-- After Link Text: z-0-2-3-External-2-3-0 -->
            </a>
            <!-- After Link: z-0-2-3-External-2-3-0 -->
          </li>
          <!-- After Item: y-0-2-3-External-2-3-0 -->
        </ul>
        <!-- After List: x-1-1-0 -->
      `

      const result = testMinify(res)
      const expectedResult = testMinify(expected)

      expect(result).toBe(expectedResult)
    })

    it('should return list markup string with about as current', () => {
      const res = primary.getOutput('header', {
        depthAttr: true,
        currentLink: '/about/',
        currentType: ['page']
      })

      const expected = `
        <ul data-nav-depth="0">
          <li data-nav-depth="0">
            <a data-nav-depth="0" href="/">Home</a>
          </li>
          <li data-nav-depth="0" data-nav-current>
            <a data-nav-depth="0" href="/about/" data-nav-current aria-current="page">About</a>
            <ul data-nav-depth="1">
              <li data-nav-depth="1">
                <a data-nav-depth="1" href="/blog/">Blog</a>
              </li>
            </ul>
          </li>
          <li data-nav-depth="0">
            <a data-nav-depth="0" href="http://external.com/">External</a>
          </li>
        </ul>
      `

      const result = testMinify(res)
      const expectedResult = testMinify(expected)

      expect(result).toBe(expectedResult)
    })

    it('should return list markup string with blog as current', () => {
      const res = primary.getOutput('header', {
        depthAttr: true,
        currentLink: '/blog/',
        currentType: ['page']
      })

      const expected = `
        <ul data-nav-depth="0">
          <li data-nav-depth="0">
            <a data-nav-depth="0" href="/">Home</a>
          </li>
          <li data-nav-depth="0" data-nav-descendent-current>
            <a data-nav-depth="0" href="/about/" data-nav-descendent-current>About</a>
            <ul data-nav-depth="1">
              <li data-nav-depth="1" data-nav-current>
                <a data-nav-depth="1" href="/blog/" data-nav-current aria-current="page">Blog</a>
              </li>
            </ul>
          </li>
          <li data-nav-depth="0">
            <a data-nav-depth="0" href="http://external.com/">External</a>
          </li>
        </ul>
      `

      const result = testMinify(res)
      const expectedResult = testMinify(expected)

      expect(result).toBe(expectedResult)
    })

    it('should return list markup string with localized blog as archive current', () => {
      const res = primary.getOutput('header', {
        depthAttr: true,
        currentLink: '/blog-post/',
        currentType: ['blog', 'page']
      })

      const expected = `
        <ul data-nav-depth="0">
          <li data-nav-depth="0">
            <a data-nav-depth="0" href="/">Home</a>
          </li>
          <li data-nav-depth="0" data-nav-descendent-current>
            <a data-nav-depth="0" href="/about/" data-nav-descendent-current>About</a>
            <ul data-nav-depth="1">
              <li data-nav-depth="1" data-nav-archive-current>
                <a data-nav-depth="1" href="/blog/" data-nav-archive-current>Blog</a>
              </li>
            </ul>
          </li>
          <li data-nav-depth="0">
            <a data-nav-depth="0" href="http://external.com/">External</a>
          </li>
        </ul>
      `

      const result = testMinify(res)
      const expectedResult = testMinify(expected)

      expect(result).toBe(expectedResult)
    })
  })
})
