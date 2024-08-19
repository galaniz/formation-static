/**
 * Components - Navigation Test
 */

/* Imports */

import type { NavigationBreadcrumbItem, NavigationProps } from '../NavigationTypes.js'
import { it, expect, describe, beforeEach, afterEach } from 'vitest'
import { Navigation } from '../Navigation.js'
import { setConfig } from '../../../config/config.js'

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
    setConfig({
      archiveMeta: {}
    })
  })

  beforeEach(() => {
    setConfig({
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

    it('should store navigation items by id', () => {
      const items = home.getItemsById()

      expect(items.home).toBeDefined()
      expect(items.about).toBeDefined()
      expect(items.blog).toBeDefined()
      expect(items['https://external.com/']).toBeDefined()
      expect(Object.keys(items).length).toBe(4)
    })

    it('should store navigations with items by location', () => {
      const navs = home.getNavigationsByLocation()

      expect(navs.header).toBeDefined()
      expect(navs.empty).not.toBeDefined()
      expect(Object.keys(navs).length).toBe(1)
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
        <ul data-depth="0">
          <li data-depth="0" data-current="true">
            <a data-depth="0" href="/" data-current="true" aria-current="page">Home</a>
          </li>
          <li data-depth="0">
            <a data-depth="0" href="/about/">About</a>
            <ul data-depth="1">
              <li data-depth="1">
                <a data-depth="1" href="/blog/">Blog</a>
              </li>
            </ul>
          </li>
          <li data-depth="0">
            <a data-depth="0" href="https://external.com/">External</a>
          </li>
        </ul>
      `

      const result = testMinify(res)
      const expectedResult = testMinify(expected)

      expect(result).toContain(expectedResult)
    })

    it('should return list markup string one level deep', () => {
      const res = home.getOutput('header', {}, 0)
      const expected = `
        <ul data-depth="0">
          <li data-depth="0" data-current="true">
            <a data-depth="0" href="/" data-current="true" aria-current="page">Home</a>
          </li>
          <li data-depth="0">
            <a data-depth="0" href="/about/">About</a>
          </li>
          <li data-depth="0">
            <a data-depth="0" href="https://external.com/">External</a>
          </li>
        </ul>
      `

      const result = testMinify(res)
      const expectedResult = testMinify(expected)

      expect(result).toContain(expectedResult)
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
        <ul data-depth="0" class="x" data-x>
          <li data-depth="0" class="y" data-y data-current="true">
            <a data-depth="0" class="z in" href="/" data-z data-current="true" aria-current="page">Home</a>
          </li>
          <li data-depth="0" class="y" data-y>
            <a data-depth="0" class="z in" href="/about/" data-z>About</a>
            <ul data-depth="1" class="x" data-x>
              <li data-depth="1" class="y" data-y>
                <a data-depth="1" class="z in" href="/blog/" data-z>Blog</a>
              </li>
            </ul>
          </li>
          <li data-depth="0" class="y" data-y>
            <a data-depth="0" class="z" href="https://external.com/" data-z>External</a>
          </li>
        </ul>
      `

      const result = testMinify(res)
      const expectedResult = testMinify(expected)

      expect(result).toContain(expectedResult)
    })

    it('should return list markup string with about as current', () => {
      const res = about.getOutput('header')
      const expected = `
        <ul data-depth="0">
          <li data-depth="0">
            <a data-depth="0" href="/">Home</a>
          </li>
          <li data-depth="0" data-current="true">
            <a data-depth="0" href="/about/" data-current="true" aria-current="page">About</a>
            <ul data-depth="1">
              <li data-depth="1">
                <a data-depth="1" href="/blog/">Blog</a>
              </li>
            </ul>
          </li>
          <li data-depth="0">
            <a data-depth="0" href="https://external.com/">External</a>
          </li>
        </ul>
      `

      const result = testMinify(res)
      const expectedResult = testMinify(expected)

      expect(result).toContain(expectedResult)
    })

    it('should return list markup string with blog as current', () => {
      const res = blog.getOutput('header')
      const expected = `
        <ul data-depth="0">
          <li data-depth="0">
            <a data-depth="0" href="/">Home</a>
          </li>
          <li data-depth="0" data-descendent-current="true">
            <a data-depth="0" href="/about/" data-descendent-current="true">About</a>
            <ul data-depth="1">
              <li data-depth="1" data-current="true">
                <a data-depth="1" href="/blog/" data-current="true" aria-current="page">Blog</a>
              </li>
            </ul>
          </li>
          <li data-depth="0">
            <a data-depth="0" href="https://external.com/">External</a>
          </li>
        </ul>
      `

      const result = testMinify(res)
      const expectedResult = testMinify(expected)

      expect(result).toContain(expectedResult)
    })

    it('should return list markup string with blog as archive current', () => {
      const res = blogPost.getOutput('header')
      const expected = `
        <ul data-depth="0">
          <li data-depth="0">
            <a data-depth="0" href="/">Home</a>
          </li>
          <li data-depth="0" data-descendent-current="true">
            <a data-depth="0" href="/about/" data-descendent-current="true">About</a>
            <ul data-depth="1">
              <li data-depth="1" data-archive-current="true">
                <a data-depth="1" href="/blog/" data-archive-current="true">Blog</a>
              </li>
            </ul>
          </li>
          <li data-depth="0">
            <a data-depth="0" href="https://external.com/">External</a>
          </li>
        </ul>
      `

      const result = testMinify(res)
      const expectedResult = testMinify(expected)

      expect(result).toContain(expectedResult)
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
          <li data-last-level="false">
            <a href="/">Home</a>
          </li>
          <li data-last-level="true">
            <a href="/about/">About</a>
          </li>
          <li data-current="true">
            <span>
              Current Page
              <span class="a-hide-vis"> (current page)</span>
            </span>
          </li>
        </ol>
      `

      const result = testMinify(res)
      const expectedResult = testMinify(expected)

      expect(result).toContain(expectedResult)
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
          <li class="y" data-y data-last-level="false">
            <a class="z in" href="/" data-z>Home</a>
          </li>
          <li class="y" data-y data-last-level="true">
            <a class="z in" href="/about/" data-z>About</a>
          </li>
          <li class="y" data-y data-current="true">
            <span class="c">
              Current Page
              <span> (current page)</span>
            </span>
          </li>
        </ol>
      `

      const result = testMinify(res)
      const expectedResult = testMinify(expected)

      expect(result).toContain(expectedResult)
    })
  })
})
