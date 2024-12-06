/**
 * Components - Navigation Test
 */

/* Imports */

import type { NavigationBreadcrumbItem, NavigationProps } from '../NavigationTypes.js'
import { it, expect, describe, beforeEach, afterEach } from 'vitest'
import { Navigation } from '../Navigation.js'
import { setStore } from '../../../store/store.js'

/**
 * Remove all empty spaces from string
 *
 * @param {string} str
 * @return {string}
 */
const testMinify = (str: string): string => {
  return str.replace(/\s/g, '')
}

/**
 * Return nav props with specified current link and type
 *
 * @param {string} currentLink
 * @param {string} currentType
 * @return {NavigationProps}
 */
const testNavProps = (
  currentLink: string = '/',
  currentType: string = 'page'
): NavigationProps => {
  const homeItem = {
    title: 'Home',
    internalLink: {
      id: 'home',
      slug: '/'
    }
  }

  const blogItem = {
    title: 'Blog',
    internalLink: {
      id: 'blog',
      slug: 'blog'
    }
  }

  const aboutItem = {
    title: 'About',
    internalLink: {
      id: 'about',
      slug: 'about'
    },
    children: [
      blogItem,
      null
    ]
  }

  const externalItem = {
    title: 'External',
    externalLink: 'https://external.com/'
  }

  return {
    navigations: [
      {
        title: 'Home',
        location: 'header',
        items: [
          homeItem,
          aboutItem,
          externalItem
        ]
      },
      {
        title: 'Empty',
        location: 'empty',
        items: []
      },
      // @ts-expect-error (coverage)
      null
    ],
    items: [
      homeItem,
      blogItem,
      // @ts-expect-error
      aboutItem,
      externalItem,
      // @ts-expect-error (coverage)
      null
    ],
    currentLink,
    currentType
  }
}

/* Tests */

describe('Navigation', () => {
  let home: Navigation
  let about: Navigation
  let blog: Navigation
  let blogPost: Navigation

  afterEach(() => {
    setStore({
      archiveMeta: {}
    })
  })

  beforeEach(() => {
    setStore({
      archiveMeta: {
        blog: {
          id: 'blog'
        }
      }
    })

    home = new Navigation(testNavProps())
    about = new Navigation(testNavProps('/about/'))
    blog = new Navigation(testNavProps('/blog/'))
    blogPost = new Navigation(testNavProps('/blog-post/', 'blog'))
  })

  /* Test init */

  describe('Initialization', () => {
    it('should initialize with valid props', () => {
      expect(home.init).toBe(true)
      expect(home.navigations.length).toBe(3)
      expect(home.items.length).toBe(5)
    })

    it('should fail to initialize with undefined props', () => {
      // @ts-expect-error
      const nav = new Navigation(undefined)
      const result = nav.init
      const expectedResult = false

      expect(result).toBe(expectedResult)
    })

    it('should fail to initialize with empty props', () => {
      // @ts-expect-error
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

    it('should contain navigation items by id', () => {
      const items = home.getItemsById()

      expect(items.get('home')).toBeDefined()
      expect(items.get('about')).toBeDefined()
      expect(items.get('blog')).toBeDefined()
      expect(items.get('https://external.com/')).toBeDefined()
      expect(items.size).toBe(4)
    })

    it('should contain navigations with items by location', () => {
      const navs = home.getNavigationsByLocation()

      expect(navs.get('header')).toBeDefined()
      expect(navs.get('empty')).not.toBeDefined()
      expect(navs.size).toBe(1)
    })
  })

  /* Test getOutput */

  describe('getOutput()', () => {
    it('should return empty string for unknown location', () => {
      const result = home.getOutput('unknown')
      const expectedResult = ''

      expect(result).toBe(expectedResult)
    })

    it('should return empty string if null items', () => {
      const nav = new Navigation({
        navigations: [
          {
            title: 'Nav',
            location: 'nav',
            // @ts-expect-error
            items: [null, null]
          }
        ],
        items: [
          // @ts-expect-error (coverage)
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
      const res = home.getOutput('header')
      const expected = `
        <ul data-nav-depth="0">
          <li data-nav-depth="0" data-nav-current>
            <a data-nav-depth="0" href="/" data-nav-current aria-current="page">Home</a>
          </li>
          <li data-nav-depth="0">
            <a data-nav-depth="0" href="/about/">About</a>
            <ul data-nav-depth="1">
              <li data-nav-depth="1">
                <a data-nav-depth="1" href="/blog/">Blog</a>
              </li>
            </ul>
          </li>
          <li data-nav-depth="0">
            <a data-nav-depth="0" href="https://external.com/">External</a>
          </li>
        </ul>
      `

      const result = testMinify(res)
      const expectedResult = testMinify(expected)

      expect(result).toBe(expectedResult)
    })

    it('should return list markup string one level deep', () => {
      const res = home.getOutput('header', {}, 0)
      const expected = `
        <ul data-nav-depth="0">
          <li data-nav-depth="0" data-nav-current>
            <a data-nav-depth="0" href="/" data-nav-current aria-current="page">Home</a>
          </li>
          <li data-nav-depth="0">
            <a data-nav-depth="0" href="/about/">About</a>
          </li>
          <li data-nav-depth="0">
            <a data-nav-depth="0" href="https://external.com/">External</a>
          </li>
        </ul>
      `

      const result = testMinify(res)
      const expectedResult = testMinify(expected)

      expect(result).toBe(expectedResult)
    })

    it('should return list markup string with home as current and classes and attributes from args', () => {
      const res = home.getOutput('header', {
        listClass: 'x',
        listAttr: 'data-x',
        itemClass: 'y',
        itemAttr: 'data-y',
        linkClass: 'z',
        internalLinkClass: 'in',
        linkAttr: 'data-z'
      })

      const expected = `
        <ul data-nav-depth="0" class="x" data-x>
          <li data-nav-depth="0" class="y" data-y data-nav-current>
            <a data-nav-depth="0" class="z in" href="/" data-z data-nav-current aria-current="page">Home</a>
          </li>
          <li data-nav-depth="0" class="y" data-y>
            <a data-nav-depth="0" class="z in" href="/about/" data-z>About</a>
            <ul data-nav-depth="1" class="x" data-x>
              <li data-nav-depth="1" class="y" data-y>
                <a data-nav-depth="1" class="z in" href="/blog/" data-z>Blog</a>
              </li>
            </ul>
          </li>
          <li data-nav-depth="0" class="y" data-y>
            <a data-nav-depth="0" class="z" href="https://external.com/" data-z>External</a>
          </li>
        </ul>
      `

      const result = testMinify(res)
      const expectedResult = testMinify(expected)

      expect(result).toBe(expectedResult)
    })

    it('should return list markup string with classes and attributes from filter args', () => {
      const res = home.getOutput('header', {
        listClass: 'x',
        listAttr: 'data-x',
        itemClass: 'y',
        itemAttr: 'data-y',
        linkClass: 'z',
        internalLinkClass: 'in',
        linkAttr: 'data-z',
        filterBeforeList ({ args, output, items, depth }) {
          args.listClass = `x-${depth}-${items.length}`
          args.listAttr = `data-x-${depth}`
          output.html += '<!-- Before List -->'

          if (depth > 0) {
            items.forEach((item) => {
              item.link = ''
            })
          }
        },
        filterBeforeItem ({ args, item, output, index, items, depth }) {
          args.itemClass = `y-${depth}-${index}-${items.length}`
          args.itemAttr = `data-y="${item.title}"`
          output.html += '<!-- Before Item -->'
        },
        filterBeforeLink ({ args, item, output, index, items, depth }) {
          args.linkClass = `z-${depth}-${index}-${items.length}`
          args.linkAttr = `data-z="${item.title}"`
          output.html += '<!-- Before Link -->'
        },
        filterBeforeLinkText ({ args, item, output, index, items, depth }) {
          const linkClass = String(args.linkClass)
          output.html +=
            `<!-- Before Link Text: ${linkClass}-${item.title}-${index}-${items.length}-${depth} -->`
        },
        filterAfterLinkText ({ args, item, output, index, items, depth }) {
          const linkClass = String(args.linkClass)
          output.html +=
            `<!-- After Link Text: ${linkClass}-${item.title}-${index}-${items.length}-${depth} -->`
        },
        filterAfterLink ({ args, item, output, index, items, depth }) {
          const linkClass = String(args.linkClass)
          output.html +=
            `<!-- After Link: ${linkClass}-${item.title}-${index}-${items.length}-${depth} -->`
        },
        filterAfterItem ({ args, item, output, index, items, depth }) {
          const itemClass = String(args.itemClass)
          output.html +=
            `<!-- After Item: ${itemClass}-${item.title}-${index}-${items.length}-${depth} -->`
        },
        filterAfterList ({ args, output, depth }) {
          const listClass = String(args.listClass)
          output.html +=
            `<!-- After List: ${listClass}-${depth} -->`
        }
      })

      const expected = `
        <!-- Before List -->
        <ul data-nav-depth="0" class="x-0-3" data-x-0>
          <!-- Before Item -->
          <li data-nav-depth="0" class="y-0-0-3" data-y="Home" data-nav-current>
            <!-- Before Link -->
            <a
              data-nav-depth="0"
              class="z-0-0-3 in"
              href="/"
              data-z="Home"
              data-nav-current
              aria-current="page"
            >
              <!-- Before Link Text: z-0-0-3-Home-0-3-0 -->
              Home
              <!-- After Link Text: z-0-0-3-Home-0-3-0 -->
            </a>
            <!-- After Link: z-0-0-3-Home-0-3-0 -->
          </li>
          <!-- After Item: y-0-0-3-Home-0-3-0 -->
          <!-- Before Item -->
          <li data-nav-depth="0" class="y-0-1-3" data-y="About">
            <!-- Before Link -->
            <a data-nav-depth="0" class="z-0-1-3 in" href="/about/" data-z="About">
              <!-- Before Link Text: z-0-1-3-About-1-3-0 -->
              About
              <!-- After Link Text: z-0-1-3-About-1-3-0 -->
            </a>
            <!-- After Link: z-0-1-3-About-1-3-0 -->
            <!-- Before List -->
            <ul data-nav-depth="1" class="x-1-1" data-x-1>
              <!-- Before Item -->
              <li data-nav-depth="1" class="y-1-0-1" data-y="Blog">
                <!-- Before Link -->
                <button data-nav-depth="1" class="z-1-0-1 in" type="button" data-z="Blog">
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
          <!-- After Item: y-1-0-1-About-1-3-0 -->
          <!-- Before Item -->
          <li data-nav-depth="0" class="y-0-2-3" data-y="External">
            <!-- Before Link -->
            <a data-nav-depth="0" class="z-0-2-3" href="https://external.com/" data-z="External">
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
      const res = about.getOutput('header')
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
            <a data-nav-depth="0" href="https://external.com/">External</a>
          </li>
        </ul>
      `

      const result = testMinify(res)
      const expectedResult = testMinify(expected)

      expect(result).toBe(expectedResult)
    })

    it('should return list markup string with blog as current', () => {
      const res = blog.getOutput('header')
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
            <a data-nav-depth="0" href="https://external.com/">External</a>
          </li>
        </ul>
      `

      const result = testMinify(res)
      const expectedResult = testMinify(expected)

      expect(result).toBe(expectedResult)
    })

    it('should return list markup string with blog as archive current', () => {
      const res = blogPost.getOutput('header')
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
            <a data-nav-depth="0" href="https://external.com/">External</a>
          </li>
        </ul>
      `

      const result = testMinify(res)
      const expectedResult = testMinify(expected)

      expect(result).toBe(expectedResult)
    })
  })

  /* Test getBreadcrumbs */

  describe('getBreadcrumbs()', () => {
    const breadcrumbItems = [
      {
        title: 'Home',
        id: 'home',
        slug: 'index',
        contentType: 'page'
      },
      {
        title: 'About',
        id: 'about',
        slug: 'about',
        contentType: 'page'
      },
      {
        title: '',
        id: 'no',
        slug: 'no',
        contentType: 'page'
      },
      {
        title: 'Empty',
        id: 'empty',
        slug: null,
        contentType: 'page'
      }
    ] as NavigationBreadcrumbItem[]

    it('should return empty string if items are null', () => {
      // @ts-expect-error
      const result = home.getBreadcrumbs(null)
      const expectedResult = ''

      expect(result).toBe(expectedResult)
    })

    it('should return empty string if items are empty', () => {
      const result = home.getBreadcrumbs([])
      const expectedResult = ''

      expect(result).toBe(expectedResult)
    })

    it('should return ordered list markup', () => {
      const res = home.getBreadcrumbs(breadcrumbItems, 'Current Page')
      const expected = `
        <ol>
          <li>
            <a href="/">Home</a>
          </li>
          <li data-nav-last>
            <a href="/about/">About</a>
          </li>
          <li data-nav-current>
            <span>
              Current Page
              <span class="a-hide-vis"> (current page)</span>
            </span>
          </li>
        </ol>
      `

      const result = testMinify(res)
      const expectedResult = testMinify(expected)

      expect(result).toBe(expectedResult)
    })

    it('should return ordered list markup with classes and attributes from args', () => {
      const res = home.getBreadcrumbs(breadcrumbItems, 'Current Page', {
        listClass: 'x',
        listAttr: 'data-x',
        itemClass: 'y',
        itemAttr: 'data-y',
        linkClass: 'z',
        internalLinkClass: 'in',
        linkAttr: 'data-z',
        currentClass: 'c',
        a11yClass: ''
      })

      const expected = `
        <ol class="x" data-x>
          <li class="y" data-y>
            <a class="z in" href="/" data-z>Home</a>
          </li>
          <li class="y" data-y data-nav-last>
            <a class="z in" href="/about/" data-z>About</a>
          </li>
          <li class="y" data-y data-nav-current>
            <span class="c">
              Current Page
              <span> (current page)</span>
            </span>
          </li>
        </ol>
      `

      const result = testMinify(res)
      const expectedResult = testMinify(expected)

      expect(result).toBe(expectedResult)
    })

    it('should return ordered list markup with classes and attributes and filtered output', () => {
      const res = home.getBreadcrumbs(breadcrumbItems, 'Current Page', {
        listClass: 'x',
        listAttr: 'data-x',
        itemClass: 'y',
        itemAttr: 'data-y',
        linkClass: 'z',
        internalLinkClass: 'in',
        linkAttr: 'data-z',
        currentClass: 'c',
        a11yClass: '',
        filterBeforeLink ({ output, isLastLevel }) {
          output.html += `<!-- Before Link: ${isLastLevel.toString()} -->`
        },
        filterAfterLink ({ output, isLastLevel }) {
          output.html += `<!-- After Link: ${isLastLevel.toString()} -->`
        }
      })

      const expected = `
        <ol class="x" data-x>
          <li class="y" data-y>
            <!-- Before Link: false -->
            <a class="z in" href="/" data-z>Home</a>
            <!-- After Link: false -->
          </li>
          <li class="y" data-y data-nav-last>
            <!-- Before Link: true -->
            <a class="z in" href="/about/" data-z>About</a>
            <!-- After Link: true -->
          </li>
          <li class="y" data-y data-nav-current>
            <span class="c">
              Current Page
              <span> (current page)</span>
            </span>
          </li>
        </ol>
      `

      const result = testMinify(res)
      const expectedResult = testMinify(expected)

      expect(result).toBe(expectedResult)
    })
  })
})
