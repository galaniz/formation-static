/**
 * Render - Test
 */

/* Imports */

import type { RenderAllData, RenderFunctionArgs, RenderItem, RenderReturn } from '../renderTypes.js'
import type { Scripts, Styles } from '../../utils/scriptStyle/scriptStyleTypes.js'
import type { ParentArgs } from '../../global/globalTypes.js'
import { it, expect, describe, vi, beforeEach, afterEach } from 'vitest'
import { testMinify, testResetRenderFunctions, testResetStore } from '../../../tests/utils.js'
import { Navigation } from '../../components/Navigation/Navigation.js'
import { Container } from '../../layouts/Container/Container.js'
import { Column } from '../../layouts/Column/Column.js'
import { RichText } from '../../text/RichText/RichText.js'
import { addAction, resetActions } from '../../utils/action/action.js'
import { addFilter, resetFilters } from '../../utils/filter/filter.js'
import { getStoreItem } from '../../store/store.js'
import { setRedirects, redirects } from '../../redirects/redirects.js'
import { isStringStrict } from '../../utils/string/string.js'
import { addScript, addStyle, scripts, styles } from '../../utils/scriptStyle/scriptStyle.js'
import { config } from '../../config/config.js'
import {
  render,
  renderItem,
  renderContent,
  renderFunctions,
  renderLayout,
  renderNavigation,
  renderHttpError,
  setRenderFunctions
} from '../render.js'

/**
 * @typedef {object} TestArgs
 * @prop {string} testAttr
 */
interface TestArgs {
  testAttr: string
}

/**
 * @typedef {object} TestChildArgs
 * @prop {string} id
 */
interface TestChildArgs {
  id: string
}

/**
 * @typedef {object} TestChildChildrenArgs
 * @prop {string} content
 */
interface TestChildChildrenArgs {
  content: string
}

/**
 * Minify render return item output.
 *
 * @param {RenderReturn[]} items
 * @return {RenderReturn[]}
 */
const testMinifyOutput = (items: RenderReturn[]): RenderReturn[] => {
  return items.map(item => {
    item.output = testMinify(item.output)
    return item
  })
}

/* Test setRenderFunctions */

describe('setRenderFunctions()', () => {
  afterEach(() => {
    testResetRenderFunctions()
  })

  it('should return false and not set any functions', () => {
    // @ts-expect-error - test undefined args
    const result = setRenderFunctions()
    // @ts-expect-error - test undefined args
    const resultLayout = renderLayout()
    // @ts-expect-error - test undefined args
    const resultHttpError = renderHttpError()
    // @ts-expect-error - test undefined args
    const resultNavigation = renderNavigation()

    const expectedResult = false
    const expectedRenderFunctions = {}
    const expectedLayout = ''
    const expectedHttpError = ''
    const expectedNavigation = undefined

    expect(result).toBe(expectedResult)
    expect(renderFunctions).toEqual(expectedRenderFunctions)
    expect(resultLayout).toBe(expectedLayout)
    expect(resultHttpError).toBe(expectedHttpError)
    expect(resultNavigation).toEqual(expectedNavigation)
  })

  it('should return false and not set any functions if no functions or layout', () => {
    // @ts-expect-error - test empty args
    const result = setRenderFunctions({})
    // @ts-expect-error - test undefined args
    const resultLayout = renderLayout()
    // @ts-expect-error - test undefined args
    const resultHttpError = renderHttpError()
    // @ts-expect-error - test undefined args
    const resultNavigation = renderNavigation()

    const expectedResult = false
    const expectedRenderFunctions = {}
    const expectedLayout = ''
    const expectedHttpError = ''
    const expectedNavigation = undefined

    expect(result).toBe(expectedResult)
    expect(renderFunctions).toEqual(expectedRenderFunctions)
    expect(resultLayout).toBe(expectedLayout)
    expect(resultHttpError).toBe(expectedHttpError)
    expect(resultNavigation).toEqual(expectedNavigation)
  })

  it('should return true and set render functions', () => {
    const test = (): string => 'test'
    const layout = (): string => 'layout'
    const httpError = (): string => 'http'
    const navigation = () => undefined

    const result = setRenderFunctions({
      functions: { test },
      layout,
      navigation,
      httpError
    })

    const expectedResult = true
    const expectedRenderFunctions = { test }

    expect(result).toBe(expectedResult)
    expect(renderFunctions).toEqual(expectedRenderFunctions)
    expect(renderLayout).toEqual(layout)
    expect(renderHttpError).toEqual(httpError)
    expect(renderNavigation).toEqual(navigation)
  })
})

/* Test renderContent - most coverage in render() */

describe('renderContent()', () => {
  it('should return empty string if no args', async () => {
    // @ts-expect-error - test undefined args
    const result = await renderContent()
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if content is null', async () => {
    const result = await renderContent({
      // @ts-expect-error - test null content
      content: null,
      serverlessData: undefined,
      previewData: undefined,
      itemData: {},
      itemContains: new Set(),
      itemHeadings: [],
      navigations: undefined,
      parents: []
    })

    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if content is empty array', async () => {
    const result = await renderContent({
      content: [],
      serverlessData: undefined,
      previewData: undefined,
      itemData: {},
      itemContains: new Set(),
      itemHeadings: [],
      parents: []
    })

    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })
})

/* Test renderItem - most coverage in render() */

describe('renderItem()', () => {
  it('should return null if no args', async () => {
    // @ts-expect-error - test undefined args
    const result = await renderItem()
    const expectedResult = null

    expect(result).toBe(expectedResult)
  })

  it('should return null if item is null', async () => {
    const result = await renderItem({
      contentType: 'page',
      // @ts-expect-error - test null item
      item: null
    })

    const expectedResult = null

    expect(result).toBe(expectedResult)
  })

  it('should return null if item is taxononmy and not a page', async () => {
    const result = await renderItem({
      item: {
        contentType: 'taxonomy',
        contentTypes: ['post'],
        isPage: false
      }
    })

    const expectedResult = null

    expect(result).toBe(expectedResult)
  })

  it('should return null if item id is null', async () => {
    const result = await renderItem({
      contentType: 'page',
      item: {
        contentType: 'page',
        // @ts-expect-error - test null id
        id: null
      }
    })

    const expectedResult = null

    expect(result).toBe(expectedResult)
  })

  it('should return null if item content type is null', async () => {
    const result = await renderItem({
      contentType: 'page',
      item: {
        // @ts-expect-error - test null content type
        contentType: null
      }
    })

    const expectedResult = null

    expect(result).toBe(expectedResult)
  })

  it('should return null if item slug is empty string', async () => {
    const result = await renderItem({
      item: {
        contentType: 'page',
        id: '123',
        slug: ''
      }
    })

    const expectedResult = null

    expect(result).toBe(expectedResult)
  })
})

/* Test render */

describe('render()', () => {
  let navInstance: Navigation | undefined

  beforeEach(() => {
    config.hierarchicalTypes = ['page']
    setRenderFunctions({
      functions: {
        container: Container,
        column: Column,
        richText: RichText,
        test (props: RenderFunctionArgs<TestArgs>) {
          const { args } = props
          const { testAttr = '' } = args
          return [
            `<ul data-test="${testAttr}">`,
            '</ul>'
          ]
        },
        testChild (props: RenderFunctionArgs<TestChildArgs, RenderItem, ParentArgs, TestChildChildrenArgs>) {
          const { args, children } = props
          const { id } = args
          const innerContent = children?.[0]?.content // Test skipping content loop if string returned

          return `<li id="${id}">test: ${isStringStrict(innerContent) ? innerContent : ''}</li>`
        },
        // @ts-expect-error - test null output
        testEmpty () {
          return [null]
        },
        testScript () {
          addScript('test/script.js', ['test/dep.js'])
          addStyle('test/style.css', ['test/dep.css'])

          scripts.meta = {
            test: 'test'
          }

          return ''
        }
      },
      layout: (args) => {
        const { content, meta, itemData } = args
        const {
          title = '',
          paginationTitle = '',
          description = '',
          image = '',
          canonical = '',
          canonicalParams = '',
          prev = '',
          next = ''
        } = meta

        const isPag = paginationTitle !== ''
        const paginationMeta = isPag ? ` - ${paginationTitle}` : ''
        const descriptionMeta = description ? `<meta name="description" content="${description}">` : ''
        const imageMeta = image ? `<meta property="og:image" content="${image}">` : ''
        const prevMeta = prev ? `<link rel="prev" href="${prev}">` : ''
        const nextMeta = next ? `<link rel="next" href="${next}">` : ''
        const canonicalMeta =
          canonical && isPag ? `<link rel="canonical" href="${canonical}${canonicalParams}">` : ''

        const primary = navInstance?.getOutput('primary', {
          currentLink: itemData.baseUrl,
          currentType: itemData.baseType
        })

        const nav = isStringStrict(primary) ? `<nav>${primary}</nav>` : ''

        return `
          <!DOCTYPE html>
          <html>
            <head>
              <title>${title}${paginationMeta}</title>
              ${descriptionMeta}
              ${imageMeta}
              ${canonicalMeta}
              ${prevMeta}
              ${nextMeta}
            </head>
            <body>${nav}${content}</body>
          </html>
        `
      },
      navigation: (args) => {
        const { navigations, items } = args

        navInstance = new Navigation({ navigations, items })
      },
      httpError: ({ code }) => `${code}`
    })
  })

  afterEach(() => {
    config.hierarchicalTypes = []
    config.cms.locales = undefined
    testResetRenderFunctions()
    resetActions()
    resetFilters()
    testResetStore()
    setRedirects([])
  })

  it('should return empty array if no args', async () => {
    // @ts-expect-error - test undefined args
    const result = await render()
    const expectedResult: RenderReturn[] = []

    expect(result).toEqual(expectedResult)
  })

  it('should return empty array if all data is null', async () => {
    const renderArgs = {
      allData: null
    }

    // @ts-expect-error - test null all data
    const result = await render(renderArgs)
    const expectedResult: RenderReturn[] = []

    expect(result).toEqual(expectedResult)
  })

  it('should return empty array if content data is invalid or empty', async () => {
    const result = await render({
      allData: {
        content: {
          empty: [],
          // @ts-expect-error - test null content
          null: [null]
        }
      }
    })

    const expectedResult: RenderReturn[] = []

    expect(result).toEqual(expectedResult)
  })

  it('should store navigation data and output in item', async () => {
    const navigations = [
      {
        id: '1',
        title: 'Primary',
        location: [
          'primary'
        ],
        items: [
          {
            id: '1',
            title: 'Home',
            menuOrder: 1
          },
          {
            id: '2',
            title: 'Example',
            menuOrder: 2
          }
        ]
      }
    ]

    const navigationItems = [
      {
        id: '1',
        title: 'Home',
        link: '/home/',
        contentType: 'navigationItem',
        internalLink: {
          contentType: 'page',
          slug: 'home',
          id: '7'
        }
      },
      {
        id: '2',
        title: 'Example',
        externalLink: 'http://example.com',
        contentType: 'navigationItem'
      }
    ]

    const result = await render({
      allData: {
        navigation: navigations,
        navigationItem: navigationItems,
        redirect: [
          {
            redirect: [
              '/trailing /trailing/ 301'
            ]
          },
          {
            redirect: [
              '/test /test/ 302'
            ]
          }
        ],
        content: {
          page: [
            {
              id: '1',
              slug: 'test',
              title: 'Test',
              contentType: 'page'
            }
          ]
        }
      }
    }) as RenderReturn[]

    const expectedResult = [
      {
        slug: '/test/',
        output: `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Test</title>
            </head>
            <body>
              <nav>
                <ul>
                  <li>
                    <a href="/home/">Home</a>
                  </li>
                  <li>
                    <a href="http://example.com">Example</a>
                  </li>
                </ul>
              </nav>
            </body>
          </html>
        `
      }
    ]

    const resultMin = testMinifyOutput(result)
    const expectedResultMin = testMinifyOutput(expectedResult)

    expect(resultMin).toEqual(expectedResultMin)
    expect(getStoreItem('navigations')).toEqual(navigations)
    expect(getStoreItem('navigationItems')).toEqual(navigationItems)
    expect(redirects).toEqual([
      '/trailing /trailing/ 301',
      '/test /test/ 302'
    ])
  })

  it('should run all render actions and filters and clear scripts and styles', async () => {
    const renderStart = vi.fn()
    const renderEnd = vi.fn()
    const renderItemStart = vi.fn()
    const renderItemEnd = vi.fn()
    const renderItem = vi.fn()
    const renderItemData = vi.fn()
    const renderContent = vi.fn()

    let scriptsStart: Scripts | undefined
    let scriptsEnd: Scripts | undefined
    let scriptsItemStart: Scripts | undefined
    let scriptsItemEnd: Scripts | undefined
    let stylesStart: Styles | undefined
    let stylesEnd: Styles | undefined
    let stylesItemStart: Styles | undefined
    let stylesItemEnd: Styles | undefined

    const initialOutput = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Page Test</title>
        </head>
        <body>
          <section>
            <ul data-test="">test</ul>
          </section>
        </body>
      </html>
    `

    const expectedOutput = `
      <!DOCTYPE html>
      <html lang="en-CA">
        <head>
          <title>Page Test</title>
        </head>
        <body>
          <section>
            <ul data-test="">test</ul>
          </section>
        </body>
      </html>
    `

    const allData: RenderAllData = {
      content: {
        page: [
          {
            id: '123',
            slug: 'page',
            contentType: 'page',
            title: 'Page',
            content: [
              {
                id: '456',
                renderType: 'test',
                content: 'test'
              },
              {
                renderType: 'testScript',
                content: ''
              }
            ]
          }
        ]
      }
    }

    addAction('renderStart', (args) => {
      renderStart(args)
      scriptsStart = structuredClone(scripts)
      stylesStart = structuredClone(styles)
    })

    addAction('renderEnd', (args) => {
      renderEnd(args)
      scriptsEnd = structuredClone(scripts)
      stylesEnd = structuredClone(styles)
    })

    addAction('renderItemStart', (args) => {
      renderItemStart(args)
      scriptsItemStart = structuredClone(scripts)
      stylesItemStart = structuredClone(styles)
    })

    addFilter('renderItem', (output, args) => {
      renderItem({ ...args, output: testMinify(output) })
      return output.replace('<html>', '<html lang="en-CA">')
    })

    addFilter('renderItemData', (item, args) => {
      renderItemData({ item, args })

      if (args.contentType === 'page') {
        return { ...item, title: 'Page Test' }
      }

      return item
    })

    addAction('renderItemEnd', (args) => {
      renderItemEnd({ ...args, output: testMinify(expectedOutput) })
      scriptsItemEnd = structuredClone(scripts)
      stylesItemEnd = structuredClone(styles)
    })

    addFilter('renderContent', (output, args) => {
      renderContent(args)
      const [start = '', end = ''] = output

      if (start === '') {
        return ['', '']
      }

      return [
        `<section>${start}`,
        `${end}</section>`
      ]
    })

    const result = await render({ allData }) as RenderReturn[]
    const expectedResult = [{ slug: '/page/', output: expectedOutput }]
    const resultMin = testMinifyOutput(result)
    const expectedResultMin = testMinifyOutput(expectedResult)
    const expectedScriptsMeta = { test: 'test' }

    expect(resultMin).toEqual(expectedResultMin)
    expect(scriptsStart?.deps.size).toBe(0)
    expect(scriptsEnd?.deps.size).toBe(1)
    expect(scriptsItemStart?.deps.size).toBe(0)
    expect(scriptsItemEnd?.deps.size).toBe(1)
    expect(stylesStart?.deps.size).toBe(0)
    expect(stylesEnd?.deps.size).toBe(1)
    expect(stylesItemStart?.deps.size).toBe(0)
    expect(stylesItemEnd?.deps.size).toBe(1)
    expect(scriptsStart?.item.size).toBe(0)
    expect(scriptsEnd?.item.size).toBe(2)
    expect(scriptsItemStart?.item.size).toBe(0)
    expect(scriptsItemEnd?.item.size).toBe(2)
    expect(stylesStart?.item.size).toBe(0)
    expect(stylesEnd?.item.size).toBe(2)
    expect(stylesItemStart?.item.size).toBe(0)
    expect(stylesItemEnd?.item.size).toBe(2)
    expect(scriptsStart?.meta).toEqual({})
    expect(scriptsEnd?.meta).toEqual(expectedScriptsMeta)
    expect(scriptsItemStart?.meta).toEqual({})
    expect(scriptsItemEnd?.meta).toEqual(expectedScriptsMeta)
    expect(renderStart).toHaveBeenCalledTimes(1)
    expect(renderEnd).toHaveBeenCalledTimes(1)
    expect(renderItemStart).toHaveBeenCalledTimes(1)
    expect(renderItemEnd).toHaveBeenCalledTimes(1)
    expect(renderItem).toHaveBeenCalledTimes(1)
    expect(renderItemData).toHaveBeenCalledTimes(1)
    expect(renderContent).toHaveBeenCalledTimes(2)
    expect(renderStart).toHaveBeenCalledWith({ allData })
    expect(renderEnd).toHaveBeenCalledWith({ allData, data: expectedResult })
    expect(renderItemData).toHaveBeenCalledWith({
      args: {
        contentType: 'page'
      },
      item: {
        id: '123',
        slug: 'page',
        contentType: 'page',
        title: 'Page',
        content: [
          {
            id: '456',
            renderType: 'test',
            content: 'test'
          },
          {
            renderType: 'testScript',
            content: ''
          }
        ]
      }
    })

    expect(renderItem).toHaveBeenCalledWith({
      id: '123',
      contentType: 'page',
      slug: '/page/',
      output: testMinify(initialOutput),
      itemData: {
        id: '123',
        slug: 'page',
        contentType: 'page',
        title: 'Page Test',
        baseUrl: '/page/',
        baseType: 'page',
        parents: [],
        content: undefined
      },
      itemContains: new Set([
        'test',
        'testScript'
      ]),
      itemHeadings: [],
      serverlessData: undefined,
      previewData: undefined
    })

    expect(renderItemEnd).toHaveBeenCalledWith({
      id: '123',
      contentType: 'page',
      slug: '/page/',
      output: testMinify(expectedOutput),
      itemData: {
        id: '123',
        slug: 'page',
        contentType: 'page',
        title: 'Page Test',
        baseUrl: '/page/',
        baseType: 'page',
        parents: [],
        content: undefined
      },
      itemContains: new Set([
        'test',
        'testScript'
      ]),
      itemHeadings: [],
      serverlessData: undefined,
      previewData: undefined
    })

    expect(renderItemStart).toHaveBeenCalledWith({
      id: '123',
      itemData: {
        id: '123',
        slug: 'page',
        contentType: 'page',
        title: 'Page Test',
        content: [
          {
            id: '456',
            renderType: 'test',
            content: 'test'
          },
          {
            renderType: 'testScript',
            content: ''
          }
        ]
      },
      contentType: 'page',
      itemContains: new Set(),
      itemHeadings: [],
      serverlessData: undefined,
      previewData: undefined
    })

    expect(renderContent).toHaveBeenCalledWith({
      renderType: 'test',
      args: {
        id: '456',
        renderType: 'test',
        content: undefined
      }
    })
  })

  it('should return one item with empty body if nested content is null', async () => {
    const result = await render({
      allData: {
        content: {
          page: [
            {
              id: '1',
              contentType: 'page',
              slug: 'test',
              content: [
                // @ts-expect-error - test null content
                null
              ]
            }
          ]
        }
      }
    }) as RenderReturn[]

    const expectedResult = [
      {
        slug: '/test/',
        output: `
          <!DOCTYPE html>
          <html>
            <head>
              <title></title>
            </head>
            <body></body>
          </html>
        `
      }
    ]

    const resultMin = testMinifyOutput(result)
    const expectedResultMin = testMinifyOutput(expectedResult)

    expect(resultMin).toEqual(expectedResultMin)
  })

  it('should return term and taxonomy output items', async () => {
    const result = await render({
      allData: {
        content: {
          page: [],
          taxonomy: [
            {
              id: '11',
              title: 'Category',
              contentType: 'taxonomy',
              contentTypes: ['post'],
              slug: 'categories'
            },
            {
              id: '32',
              title: 'Tags',
              contentType: 'taxonomy',
              contentTypes: ['post'],
              slug: 'tags',
              isPage: true
            }
          ],
          term: [
            {
              id: '21',
              title: 'Term',
              contentType: 'term',
              slug: 'term',
              taxonomy: {
                id: '11',
                title: 'Category',
                contentTypes: ['post'],
                slug: 'categories'
              }
            }
          ]
        }
      }
    }) as RenderReturn[]

    const expectedResult = [
      {
        slug: '/tags/',
        output: `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Tags</title>
            </head>
            <body></body>
          </html>
        `
      },
      {
        slug: '/categories/term/',
        output: `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Term</title>
            </head>
            <body></body>
          </html>
        `
      }
    ]

    const resultMin = testMinifyOutput(result)
    const expectedResultMin = testMinifyOutput(expectedResult)

    expect(resultMin).toEqual(expectedResultMin)
  })

  it('should return parent and child output items with rich text content', async () => {
    const itemHeadingsTest = vi.fn()

    addAction('renderItemEnd', (args) => {
      const { id, itemHeadings } = args

      if (id !== '1') {
        return
      }

      itemHeadingsTest(itemHeadings)
    })

    const result = await render({
      allData: {
        content: {
          page: [
            {
              id: '3',
              slug: 'parent',
              title: 'Parent',
              contentType: 'page',
              metaTitle: 'Meta title',
              metaDescription: 'Meta description',
              metaImage: {
                url: 'http://test.com/meta.png'
              }
            },
            {
              id: '1',
              title: 'Child',
              contentType: 'page',
              slug: 'child',
              parent: {
                id: '3',
                title: 'Parent',
                contentType: 'page',
                slug: 'parent'
              },
              content: [
                {
                  renderType: 'richText',
                  tag: 'h1',
                  content: 'Test One'
                },
                {
                  renderType: 'content',
                  content: [
                    {
                      renderType: 'richText',
                      tag: 'h2',
                      content: 'Test Two'
                    }
                  ]
                },
                {
                  renderType: 'content',
                  content: [
                    {
                      renderType: 'richText',
                      tag: 'h2',
                      content: 'Test Three'
                    },
                    {
                      renderType: 'richText',
                      tag: 'h3',
                      content: 'Test Four'
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    }) as RenderReturn[]

    const expectedResult = [
      {
        slug: '/parent/',
        output: `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Meta title</title>
              <meta name="description" content="Meta description">
              <meta property="og:image" content="http://test.com/meta.png">
            </head>
            <body></body>
          </html>
        `
      },
      {
        slug: '/parent/child/',
        output: `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Child</title>
            </head>
            <body>
              <h1 data-rich="h1" id="test-one">Test One</h1>
              <h2 data-rich="h2" id="test-two">Test Two</h2>
              <h2 data-rich="h2" id="test-three">Test Three</h2>
              <h3 data-rich="h3" id="test-four">Test Four</h3>
            </body>
          </html>
        `
      }
    ]

    const resultMin = testMinifyOutput(result)
    const expectedResultMin = testMinifyOutput(expectedResult)
    const slugs = getStoreItem('slugs')
    const expectedSlugs = {
      '/parent/': ['3', 'page'],
      '/parent/child/': ['1', 'page']
    }

    expect(slugs).toEqual(expectedSlugs)
    expect(resultMin).toEqual(expectedResultMin)
    expect(itemHeadingsTest).toHaveBeenCalledWith([
      [
        {
          id: 'test-two',
          title: 'Test Two',
          tag: 'h2'
        }
      ],
      [
        {
          id: 'test-three',
          title: 'Test Three',
          tag: 'h2'
        },
        {
          id: 'test-four',
          title: 'Test Four',
          tag: 'h3'
        }
      ]
    ])
  })

  it('should return item with unformatted slug and store slug data', async () => {
    config.cms.locales = ['en-CA', 'fr-CA']

    const result = await render({
      allData: {
        content: {
          page: [
            {
              id: '7',
              title: 'Lorem',
              contentType: 'page',
              slug: 'lorem.html',
              content: 'lorem',
              locale: 'fr-CA'
            }
          ]
        }
      }
    }) as RenderReturn[]

    const expectedResult = [
      {
        slug: 'lorem.html',
        output: `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Lorem</title>
            </head>
            <body>lorem</body>
          </html>
        `
      }
    ]

    const resultMin = testMinifyOutput(result)
    const expectedResultMin = testMinifyOutput(expectedResult)
    const slugs = getStoreItem('slugs')
    const expectedSlugs = {
      '/lorem.html': ['7', 'page', 'fr-CA']
    }

    expect(resultMin).toEqual(expectedResultMin)
    expect(slugs).toEqual(expectedSlugs)
  })

  it('should return item output with linked content template', async () => {
    const result = await render({
      allData: {
        content: {
          page: [
            {
              id: '2',
              title: 'Home',
              contentType: 'page',
              slug: 'index',
              content: [
                {
                  renderType: 'container',
                  tag: 'section',
                  content: [
                    {
                      renderType: 'test',
                      testAttr: 'test',
                      content: [
                        {
                          id: '4',
                          renderType: 'testChild',
                          content: [
                            {
                              id: '9',
                              renderType: 'testEmpty',
                              content: 'child'
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  renderType: 'contentTemplate',
                  content: []
                },
                {
                  renderType: 'contentTemplate',
                  // @ts-expect-error - test null content
                  content: null
                },
                {
                  renderType: 'contentTemplate',
                  content: [
                    {
                      renderType: 'container',
                      metadata: {
                        tags: [
                          {
                            id: 'template'
                          }
                        ]
                      },
                      content: [
                        {
                          renderType: 'container',
                          tag: 'span',
                          metadata: {
                            tags: [
                              {
                                id: 'templateRepeat'
                              }
                            ]
                          },
                          content: [
                            {
                              metadata: {
                                tags: [
                                  {
                                    id: 'templateSlot'
                                  }
                                ]
                              }
                            }
                          ]
                        }
                      ]
                    },
                    {
                      content: '[1]'
                    },
                    {
                      content: '[2]'
                    },
                    {
                      content: '[3]'
                    }
                  ]
                },
                {
                  renderType: 'contentTemplate',
                  content: [
                    {
                      renderType: 'container',
                      tag: 'section',
                      metadata: {
                        tags: [
                          {
                            id: 'template'
                          }
                        ]
                      },
                      content: [
                        {
                          renderType: 'column',
                          metadata: {
                            tags: [
                              {
                                id: 'templateRepeat'
                              }
                            ]
                          },
                          content: [
                            {
                              metadata: {
                                tags: [
                                  {
                                    id: 'templateSlot'
                                  }
                                ]
                              }
                            }
                          ]
                        }
                      ]
                    },
                    {
                      content: '[one]'
                    },
                    {
                      content: '[two]'
                    },
                    {
                      content: '[three]'
                    },
                    {
                      content: '[four]'
                    },
                    {
                      renderType: 'container',
                      tag: 'figure',
                      metadata: {
                        tags: [
                          {
                            id: 'template'
                          }
                        ]
                      },
                      content: [
                        {
                          renderType: 'container',
                          metadata: {
                            tags: [
                              {
                                id: 'templateSlot'
                              }
                            ]
                          }
                        },
                        {
                          renderType: 'container',
                          tag: 'figcaption',
                          metadata: {
                            tags: [
                              {
                                id: 'templateSlot'
                              },
                              {
                                id: 'templateOptional'
                              }
                            ]
                          }
                        }
                      ]
                    },
                    {
                      content: '[five]'
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    }) as RenderReturn[]

    const expectedResult = [
      {
        slug: '/',
        output: `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Home</title>
            </head>
            <body>
              <section>
                <ul data-test="test">
                  <li id="4">test: child</li>
                </ul>
              </section>
              <div>
                <span>[1]</span>
                <span>[2]</span>
                <span>[3]</span>
              </div>
              <section>
                <div>[one]</div>
                <div>[two]</div>
                <div>[three]</div>
                <div>[four]</div>
              </section>
              <figure>[five]</figure>
            </body>
          </html>
        `
      }
    ]

    const resultMin = testMinifyOutput(result)
    const expectedResultMin = testMinifyOutput(expectedResult)

    expect(resultMin).toEqual(expectedResultMin)
  })

  it('should return item output with linked content template of repeating columns', async () => {
    const result = await render({
      allData: {
        content: {
          page: [
            {
              id: '2',
              title: 'Home',
              contentType: 'page',
              slug: 'index',
              content: [
                {
                  renderType: 'container',
                  tag: 'section',
                  content: [
                    {
                      renderType: 'test',
                      testAttr: 'test',
                      content: [
                        {
                          id: '4',
                          renderType: 'testChild',
                          content: [
                            {
                              id: '9',
                              renderType: 'testEmpty',
                              content: 'child'
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  renderType: 'contentTemplate',
                  content: [
                    {
                      renderType: 'container',
                      metadata: {
                        tags: [
                          {
                            id: 'template'
                          }
                        ]
                      },
                      content: [
                        {
                          metadata: {
                            tags: [
                              {
                                id: 'templateRepeat'
                              }
                            ]
                          },
                          content: [
                            {
                              renderType: 'container',
                              tag: 'span',
                              content: [
                                {
                                  metadata: {
                                    tags: [
                                      {
                                        id: 'templateSlot'
                                      }
                                    ]
                                  }
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      content: '[1]'
                    },
                    {
                      content: '[2]'
                    },
                    {
                      content: '[3]'
                    }
                  ]
                },
                {
                  renderType: 'contentTemplate',
                  content: [
                    {
                      metadata: {
                        tags: [
                          {
                            id: 'template'
                          }
                        ]
                      },
                      content: [
                        {
                          renderType: 'container',
                          content: [
                            {
                              metadata: {
                                tags: [
                                  {
                                    id: 'templateSlot'
                                  }
                                ]
                              }
                            }
                          ]
                        },
                        {
                          renderType: 'container',
                          tag: 'section',
                          content: [
                            {
                              metadata: {
                                tags: [
                                  {
                                    id: 'templateRepeat'
                                  }
                                ]
                              },
                              content: [
                                {
                                  renderType: 'column',
                                  content: [
                                    {
                                      metadata: {
                                        tags: [
                                          {
                                            id: 'templateSlot'
                                          }
                                        ]
                                      }
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      content: 'Title'
                    },
                    {
                      content: '[one]'
                    },
                    {
                      content: '[two]'
                    },
                    {
                      content: '[three]'
                    },
                    {
                      content: '[four]'
                    },
                    {
                      renderType: 'container',
                      tag: 'figure',
                      metadata: {
                        tags: [
                          {
                            id: 'template'
                          }
                        ]
                      },
                      content: [
                        {
                          renderType: 'container',
                          metadata: {
                            tags: [
                              {
                                id: 'templateSlot'
                              }
                            ]
                          }
                        },
                        {
                          renderType: 'container',
                          tag: 'figcaption',
                          metadata: {
                            tags: [
                              {
                                id: 'templateSlot'
                              },
                              {
                                id: 'templateOptional'
                              }
                            ]
                          }
                        }
                      ]
                    },
                    {
                      content: '[five]'
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    }) as RenderReturn[]

    const expectedResult = [
      {
        slug: '/',
        output: `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Home</title>
            </head>
            <body>
              <section>
                <ul data-test="test">
                  <li id="4">test: child</li>
                </ul>
              </section>
              <div>
                <span>[1]</span>
                <span>[2]</span>
                <span>[3]</span>
              </div>
              <div>Title</div>
              <section>
                <div>[one]</div>
                <div>[two]</div>
                <div>[three]</div>
                <div>[four]</div>
              </section>
              <figure>[five]</figure>
            </body>
          </html>
        `
      }
    ]

    const resultMin = testMinifyOutput(result)
    const expectedResultMin = testMinifyOutput(expectedResult)

    expect(resultMin).toEqual(expectedResultMin)
  })

  it('should return item output with named content template', async () => {
    const result = await render({
      allData: {
        content: {
          page: [
            {
              id: '3',
              title: 'Page',
              contentType: 'page',
              slug: 'page',
              content: [
                {
                  renderType: 'contentTemplate',
                  metadata: {
                    tags: [
                      {
                        id: 'templateNamed'
                      }
                    ]
                  },
                  content: [
                    {
                      renderType: 'container',
                      tag: '',
                      metadata: {
                        tags: [
                          {
                            id: 'template'
                          }
                        ]
                      },
                      content: [
                        {
                          renderType: 'container',
                          tag: 'header',
                          content: 'Test'
                        },
                        {
                          renderType: 'container',
                          tag: 'section',
                          content: [
                            {
                              renderType: 'richText',
                              tag: 'h2',
                              content: [
                                {
                                  content: 'Fallback [1]',
                                  name: 'custom-name-1',
                                  metadata: {
                                    tags: [
                                      {
                                        id: 'templateSlot'
                                      }
                                    ]
                                  }
                                }
                              ]
                            }
                          ]
                        },
                        {
                          renderType: 'container',
                          tag: 'section',
                          content: [
                            {
                              renderType: 'richText',
                              tag: 'h2',
                              content: [
                                {
                                  content: 'Fallback [2]',
                                  name: 'custom-name-2',
                                  metadata: {
                                    tags: [
                                      {
                                        id: 'templateSlot'
                                      }
                                    ]
                                  }
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      content: '[2.5]' // Test skipping non-named content
                    },
                    {
                      content: '[2]',
                      name: 'custom-name-2'
                    },
                    {
                      content: '[2.5]' // Test skipping non-named content
                    },
                    {
                      content: '[4]',
                      name: 'custom-name-2' // Test overriding named content
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    }) as RenderReturn[]

    const expectedResult = [
      {
        slug: '/page/',
        output: `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Page</title>
            </head>
            <body>
              <header>Test</header>
              <section>
                <h2 data-rich="h2" id="fallback-1">Fallback [1]</h2>
              </section>
              <section>
                <h2 data-rich="h2" id="4">[4]</h2>
              </section>
            </body>
          </html>
        `
      }
    ]

    const resultMin = testMinifyOutput(result)
    const expectedResultMin = testMinifyOutput(expectedResult)

    expect(resultMin).toEqual(expectedResultMin)
  })

  it('should return item output with nested content templates', async () => {
    const result = await render({
      allData: {
        content: {
          page: [
            {
              id: '7',
              title: 'Test',
              contentType: 'page',
              slug: 'test',
              content: [
                {
                  renderType: 'contentTemplate',
                  metadata: {
                    tags: [
                      {
                        id: 'templateNamed'
                      }
                    ]
                  },
                  content: [
                    {
                      metadata: {
                        tags: [
                          {
                            id: 'template'
                          }
                        ]
                      },
                      content: [
                        {
                          renderType: 'container',
                          content: [
                            {
                              name: 'named',
                              metadata: {
                                tags: [
                                  {
                                    id: 'templateSlot'
                                  }
                                ]
                              }
                            }
                          ]
                        },
                        {
                          renderType: 'contentTemplate',
                          content: [
                            {
                              metadata: {
                                tags: [
                                  {
                                    id: 'template'
                                  }
                                ]
                              },
                              content: [
                                {
                                  renderType: 'container',
                                  content: [
                                    {
                                      metadata: {
                                        tags: [
                                          {
                                            id: 'templateSlot'
                                          }
                                        ]
                                      }
                                    }
                                  ]
                                },
                                {
                                  renderType: 'container',
                                  tag: 'section',
                                  content: [
                                    {
                                      metadata: {
                                        tags: [
                                          {
                                            id: 'templateRepeat'
                                          }
                                        ]
                                      },
                                      content: [
                                        {
                                          renderType: 'column',
                                          content: [
                                            {
                                              name: 'named-repeat',
                                              metadata: {
                                                tags: [
                                                  {
                                                    id: 'templateSlot'
                                                  }
                                                ]
                                              }
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            },
                            {
                              content: 'Title'
                            },
                            {
                              content: '[one]'
                            },
                            {
                              content: '[two]'
                            },
                            {
                              content: '[three]'
                            }
                          ]
                        },
                        {
                          renderType: 'container',
                          content: [
                            {
                              name: 'named-2',
                              metadata: {
                                tags: [
                                  {
                                    id: 'templateSlot'
                                  }
                                ]
                              }
                            }
                          ]
                        }
                      ]
                    },
                    {
                      content: 'Hello',
                      name: 'named'
                    },
                    {
                      content: 'Bye',
                      name: 'named-2'
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    }) as RenderReturn[]

    const expectedResult = [
      {
        slug: '/test/',
        output: `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Test</title>
            </head>
            <body>
              <div>Hello</div>
              <div>Title</div>
              <section>
                <div>[one]</div>
                <div>[two]</div>
                <div>[three]</div>
              </section>
              <div>Bye</div>
            </body>
          </html>
        `
      }
    ]

    const resultMin = testMinifyOutput(result)
    const expectedResultMin = testMinifyOutput(expectedResult)

    expect(resultMin).toEqual(expectedResultMin)
  })

  it('should return item output with content template in slotted content', async () => {
    const result = await render({
      allData: {
        content: {
          page: [
            {
              id: '7',
              title: 'Test',
              contentType: 'page',
              slug: 'test',
              content: [
                {
                  renderType: 'contentTemplate',
                  metadata: {
                    tags: [
                      {
                        id: 'templateNamed'
                      }
                    ]
                  },
                  content: [
                    {
                      metadata: {
                        tags: [
                          {
                            id: 'template'
                          }
                        ]
                      },
                      content: [
                        {
                          renderType: 'container',
                          content: [
                            {
                              name: 'named',
                              metadata: {
                                tags: [
                                  {
                                    id: 'templateSlot'
                                  }
                                ]
                              }
                            }
                          ]
                        },
                        {
                          name: 'named-2',
                          metadata: {
                            tags: [
                              {
                                id: 'templateSlot'
                              }
                            ]
                          }
                        },
                        {
                          renderType: 'container',
                          content: [
                            {
                              name: 'named-3',
                              metadata: {
                                tags: [
                                  {
                                    id: 'templateSlot'
                                  }
                                ]
                              }
                            }
                          ]
                        }
                      ]
                    },
                    {
                      content: 'Hello',
                      name: 'named'
                    },
                    {
                      name: 'named-2',
                      content: [
                        {
                          renderType: 'contentTemplate',
                          content: [
                            {
                              metadata: {
                                tags: [
                                  {
                                    id: 'template'
                                  }
                                ]
                              },
                              content: [
                                {
                                  renderType: 'container',
                                  content: [
                                    {
                                      metadata: {
                                        tags: [
                                          {
                                            id: 'templateSlot'
                                          }
                                        ]
                                      }
                                    }
                                  ]
                                },
                                {
                                  renderType: 'container',
                                  tag: 'section',
                                  content: [
                                    {
                                      metadata: {
                                        tags: [
                                          {
                                            id: 'templateRepeat'
                                          }
                                        ]
                                      },
                                      content: [
                                        {
                                          renderType: 'column',
                                          content: [
                                            {
                                              name: 'named-repeat',
                                              metadata: {
                                                tags: [
                                                  {
                                                    id: 'templateSlot'
                                                  }
                                                ]
                                              }
                                            }
                                          ]
                                        }
                                      ]
                                    },
                                    {
                                      renderType: 'container',
                                      tag: 'span',
                                      content: [
                                        {
                                          metadata: {
                                            tags: [
                                              {
                                                id: 'templateSlot'
                                              }
                                            ]
                                          }
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            },
                            {
                              content: 'Title'
                            },
                            {
                              content: '[one]'
                            },
                            {
                              content: '[two]'
                            },
                            {
                              metadata: {
                                tags: [
                                  {
                                    id: 'templateBreak'
                                  }
                                ]
                              }
                            },
                            {
                              content: '[three]'
                            }
                          ]
                        }
                      ]
                    },
                    {
                      content: 'Bye',
                      name: 'named-3'
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    }) as RenderReturn[]

    const expectedResult = [
      {
        slug: '/test/',
        output: `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Test</title>
            </head>
            <body>
              <div>Hello</div>
              <div>Title</div>
              <section>
                <div>[one]</div>
                <div>[two]</div>
                <span>[three]</span>
              </section>
              <div>Bye</div>
            </body>
          </html>
        `
      }
    ]

    const resultMin = testMinifyOutput(result)
    const expectedResultMin = testMinifyOutput(expectedResult)

    expect(resultMin).toEqual(expectedResultMin)
  })

  it('should return single item corresponding to serverless data', async () => {
    const result = await render({
      serverlessData: {
        path: '/blog/',
        query: {
          page: '2',
          filters: 'cat'
        }
      },
      allData: {
        content: {
          page: [
            {
              id: '1',
              title: 'Home',
              contentType: 'page',
              slug: 'index'
            },
            {
              id: '4',
              title: 'Blog',
              contentType: 'page',
              slug: 'blog',
              pagination: {
                current: 2,
                total: 5,
                prevParams: {
                  filters: 'cat'
                },
                nextParams: {
                  page: '3',
                  filters: 'cat'
                },
                currentParams: {
                  page: '2',
                  filters: 'cat'
                },
                title: 'Page 2 of 5',
                next: 3,
                prev: 1
              }
            }
          ]
        }
      }
    }) as RenderReturn

    const expectedResult = {
      slug: '/blog/',
      output: testMinify(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Blog - Page 2 of 5</title>
            <link rel="canonical" href="/blog/?page=2&filters=cat">
            <link rel="prev" href="/blog/?filters=cat">
            <link rel="next" href="/blog/?page=3&filters=cat">
          </head>
          <body></body>
        </html>
      `)
    }

    const resultMin = { ...result, output: testMinify(result.output) }

    expect(resultMin).toEqual(expectedResult)
  })

  it('should return items with pagination meta information', async () => {
    const result = await render({
      allData: {
        content: {
          page: [
            {
              id: '4',
              title: 'Blog',
              contentType: 'page',
              slug: 'blog',
              pagination: {
                current: 1,
                total: 5,
                nextParams: {
                  page: '2'
                },
                title: 'Page 1 of 5',
                next: 2
              }
            },
            {
              id: '6',
              title: 'Blog',
              contentType: 'page',
              slug: 'blog',
              pagination: {
                current: 2,
                total: 5,
                nextParams: {
                  page: '3'
                },
                currentParams: {
                  page: '2'
                },
                title: 'Page 2 of 5',
                next: 3,
                prev: 1
              }
            },
            {
              id: '5',
              title: 'Blog',
              contentType: 'page',
              slug: 'blog',
              pagination: {
                current: 2,
                total: 2,
                currentParams: {
                  page: '2'
                },
                title: 'Page 2 of 2',
                prev: 1
              }
            },
            {
              id: '7',
              title: 'Blog Filters',
              contentType: 'page',
              slug: 'blog',
              pagination: {
                current: 1,
                total: 5,
                nextParams: {
                  page: '2',
                  filters: 'cat'
                },
                currentParams: {
                  filters: 'cat'
                },
                title: 'Page 1 of 5',
                next: 2
              }
            },
            {
              id: '8',
              title: 'Blog Filters',
              contentType: 'page',
              slug: 'blog',
              pagination: {
                current: 2,
                total: 5,
                prevParams: {
                  filters: 'cat'
                },
                nextParams: {
                  page: '3',
                  filters: 'cat'
                },
                currentParams: {
                  page: '2',
                  filters: 'cat'
                },
                title: 'Page 2 of 5',
                next: 3,
                prev: 1
              }
            },
            {
              id: '9',
              title: 'Blog Filters',
              contentType: 'page',
              slug: 'blog',
              pagination: {
                current: 2,
                total: 2,
                prevParams: {
                  filters: 'cat'
                },
                currentParams: {
                  page: '2',
                  filters: 'cat'
                },
                title: 'Page 2 of 2',
                prev: 1
              }
            }
          ]
        }
      }
    }) as RenderReturn[]

    const expectedResult = [
      {
        slug: '/blog/',
        output: `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Blog - Page 1 of 5</title>
              <link rel="canonical" href="/blog/">
              <link rel="next" href="/blog/?page=2">
            </head>
            <body></body>
          </html>
        `
      },
      {
        slug: '/blog/',
        output: `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Blog - Page 2 of 5</title>
              <link rel="canonical" href="/blog/?page=2">
              <link rel="prev" href="/blog/">
              <link rel="next" href="/blog/?page=3">
            </head>
            <body></body>
          </html>
        `
      },
      {
        slug: '/blog/',
        output: `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Blog - Page 2 of 2</title>
              <link rel="canonical" href="/blog/?page=2">
              <link rel="prev" href="/blog/">
            </head>
            <body></body>
          </html>
        `
      },
      {
        slug: '/blog/',
        output: `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Blog Filters - Page 1 of 5</title>
              <link rel="canonical" href="/blog/?filters=cat">
              <link rel="next" href="/blog/?page=2&filters=cat">
            </head>
            <body></body>
          </html>
        `
      },
      {
        slug: '/blog/',
        output: `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Blog Filters - Page 2 of 5</title>
              <link rel="canonical" href="/blog/?page=2&filters=cat">
              <link rel="prev" href="/blog/?filters=cat">
              <link rel="next" href="/blog/?page=3&filters=cat">
            </head>
            <body></body>
          </html>
        `
      },
      {
        slug: '/blog/',
        output: `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Blog Filters - Page 2 of 2</title>
              <link rel="canonical" href="/blog/?page=2&filters=cat">
              <link rel="prev" href="/blog/?filters=cat">
            </head>
            <body></body>
          </html>
        `
      }
    ]

    const resultMin = testMinifyOutput(result)
    const expectedResultMin = testMinifyOutput(expectedResult)

    expect(resultMin).toEqual(expectedResultMin)
  })
})
