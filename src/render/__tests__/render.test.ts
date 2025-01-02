/**
 * Render - Test
 */

/* Imports */

import type { RenderAllData, RenderFunctionArgs, RenderFunctions, RenderReturn } from '../renderTypes.js'
import type { GenericStrings } from '../../global/globalTypes.js'
import type { Store } from '../../store/storeTypes.js'
import { it, expect, describe, vi, beforeEach, afterEach } from 'vitest'
import { testMinify } from '../../../tests/utils.js'
import { Container } from '../../layouts/Container/Container.js'
import { Column } from '../../layouts/Column/Column.js'
import { Form } from '../../objects/Form/Form.js'
import { Field } from '../../objects/Field/Field.js'
import { RichText } from '../../text/RichText/RichText.js'
import { Navigation } from '../../components/Navigation/Navigation.js'
import { addAction, resetActions } from '../../utils/action/action.js'
import { addFilter, resetFilters } from '../../utils/filter/filter.js'
import { store, setStore, getStoreItem } from '../../store/store.js'
import { setRedirects, redirects } from '../../redirects/redirects.js'
import { isStringStrict } from '../../utils/string/string.js'
import {
  render,
  renderItem,
  renderContent,
  renderFunctions,
  renderLayout,
  renderNavigations,
  renderHttpError,
  setRenderFunctions
} from '../render.js'

/**
 * Get default store object
 *
 * @return {Store}
 */
const getDefaultStore = (): Store => {
  return {
    slugs: {},
    parents: {},
    navigations: [],
    navigationItems: [],
    formMeta: {},
    archiveMeta: {},
    imageMeta: {}
  }
}

/**
 * Reset store to default properties
 *
 * @return {void}
 */
const resetStore = (): void => {
  for (const [key] of Object.entries(store)) {
    delete store[key] // eslint-disable-line @typescript-eslint/no-dynamic-delete
  }

  setStore(getDefaultStore(), 'lib/store')
}

/**
 * Minify render return item output
 *
 * @param {RenderReturn[]} items
 * @return {RenderReturn[]}
 */
const minifyOutput = (items: RenderReturn[]): RenderReturn[] => {
  return items.map(item => {
    item.output = testMinify(item.output)
    return item
  })
}

/**
 * Reset render functions to default
 *
 * @return {void}
 */
const resetRenderFunctions = (): void => {
  setRenderFunctions({
    functions: getDefaultRenderFunctions(),
    layout: () => '',
    navigations: () => ({}),
    httpError: () => ''
  })
}

/**
 * Get default render functions object
 *
 * @return {RenderFunctions}
 */
const getDefaultRenderFunctions = (): RenderFunctions => {
  return {
    container: Container,
    column: Column,
    form: Form,
    field: Field,
    richText: RichText
  }
}

/* Test setRenderFunctions */

describe('setRenderFunctions()', () => {
  afterEach(() => {
    resetRenderFunctions()
  })

  it('should return false and not set any functions', () => {
    // @ts-expect-error
    const result = setRenderFunctions()
    // @ts-expect-error
    const resultLayout = renderLayout()
    // @ts-expect-error
    const resultHttpError = renderHttpError()
    // @ts-expect-error
    const resultNavigations = renderNavigations()

    const expectedResult = false
    const expectedRenderFunctions = getDefaultRenderFunctions()
    const expectedLayout = ''
    const expectedHttpError = ''
    const expectedNavigations = {}

    expect(result).toBe(expectedResult)
    expect(renderFunctions).toEqual(expectedRenderFunctions)
    expect(resultLayout).toBe(expectedLayout)
    expect(resultHttpError).toBe(expectedHttpError)
    expect(resultNavigations).toEqual(expectedNavigations)
  })

  it('should return false and not set any functions if no functions or layout', () => {
    // @ts-expect-error
    const result = setRenderFunctions({})
    // @ts-expect-error
    const resultLayout = renderLayout()
    // @ts-expect-error
    const resultHttpError = renderHttpError()
    // @ts-expect-error
    const resultNavigations = renderNavigations()

    const expectedResult = false
    const expectedRenderFunctions = getDefaultRenderFunctions()
    const expectedLayout = ''
    const expectedHttpError = ''
    const expectedNavigations = {}

    expect(result).toBe(expectedResult)
    expect(renderFunctions).toEqual(expectedRenderFunctions)
    expect(resultLayout).toBe(expectedLayout)
    expect(resultHttpError).toBe(expectedHttpError)
    expect(resultNavigations).toEqual(expectedNavigations)
  })

  it('should return true and set render functions', async () => {
    const test = (): string => 'test'
    const layout = (): string => 'layout'
    const httpError = (): string => 'http'
    const navigations = (): GenericStrings => {
      return {
        test: ''
      }
    }

    const result = setRenderFunctions({
      functions: { test },
      layout,
      navigations,
      httpError
    })

    const expectedResult = true
    const expectedRenderFunctions = {
      ...getDefaultRenderFunctions(),
      test
    }

    expect(result).toBe(expectedResult)
    expect(renderFunctions).toEqual(expectedRenderFunctions)
    expect(renderLayout).toEqual(layout)
    expect(renderHttpError).toEqual(httpError)
    expect(renderNavigations).toEqual(navigations)
  })
})

/* Test renderContent - most coverage in render() */

describe('renderContent()', () => {
  it('should return empty string if no args', async () => {
    // @ts-expect-error
    const result = await renderContent()
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if content is null', async () => {
    const result = await renderContent({
      // @ts-expect-error
      content: null,
      serverlessData: undefined,
      pageData: {},
      pageContains: [],
      pageHeadings: [],
      navigations: {},
      parents: []
    })

    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if content is empty array', async () => {
    const result = await renderContent({
      content: [],
      serverlessData: undefined,
      pageData: {},
      pageContains: [],
      pageHeadings: [],
      navigations: {},
      parents: []
    })

    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })
})

/* Test renderItem - most coverage in render() */

describe('renderItem()', () => {
  it('should return null if no args', async () => {
    // @ts-expect-error
    const result = await renderItem()
    const expectedResult = null

    expect(result).toBe(expectedResult)
  })

  it('should return null if item is null', async () => {
    const result = await renderItem({
      contentType: 'page',
      // @ts-expect-error
      item: null
    })

    const expectedResult = null

    expect(result).toBe(expectedResult)
  })

  it('should return null if item is taxononmy and not a page', async () => {
    const result = await renderItem({
      contentType: 'taxonomy',
      item: {
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
        // @ts-expect-error
        id: null
      }
    })

    const expectedResult = null

    expect(result).toBe(expectedResult)
  })

  it('should return null if item slug is empty string', async () => {
    const result = await renderItem({
      contentType: 'page',
      item: {
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
  beforeEach(() => {
    setRenderFunctions({
      functions: {
        test (props: RenderFunctionArgs<{ testAttr: string }>) {
          const { args } = props
          const { testAttr = '' } = args
          return [
            `<ul data-test="${testAttr}">%content</ul>`
          ]
        },
        testChild (props: RenderFunctionArgs<{ id: string }>) {
          const { args } = props
          const { id } = args
          return [
            `<li id="${id}">`,
            '</li>'
          ]
        },
        // @ts-expect-error
        testEmpty () {
          return [null]
        }
      },
      layout: (args) => {
        const { content, meta, navigations } = args
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
        const descriptionMeta = description !== '' ? `<meta name="description" content="${description}">` : ''
        const imageMeta = image !== '' ? `<meta property="og:image" content="${image}">` : ''
        const prevMeta = prev !== '' ? `<link rel="prev" href="${prev}">` : ''
        const nextMeta = next !== '' ? `<link rel="next" href="${next}">` : ''
        const canonicalMeta =
          canonical !== '' && isPag ? `<link rel="canonical" href="${canonical}${canonicalParams}">` : ''

        let nav = ''

        if (isStringStrict(navigations?.primary)) {
          nav = `<nav>${navigations.primary}</nav>`
        }

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
      navigations: (args) => {
        const {
          navigations,
          items,
          currentLink,
          currentType
        } = args

        if (navigations.length > 0 && items.length > 0) {
          const nav = new Navigation({ navigations, items, currentLink, currentType })

          return {
            primary: nav.getOutput('primary')
          }
        }

        return {
          primary: ''
        }
      },
      httpError: ({ code }) => `${code}`
    })
  })

  afterEach(() => {
    resetRenderFunctions()
    resetActions()
    resetFilters()
    resetStore()
    setRedirects([])
  })

  it('should return empty array if no args', async () => {
    // @ts-expect-error
    const result = await render()
    const expectedResult = []

    expect(result).toEqual(expectedResult)
  })

  it('should return empty array if all data is null', async () => {
    const renderArgs = {
      allData: null
    }

    // @ts-expect-error
    const result = await render(renderArgs)
    const expectedResult = []

    expect(result).toEqual(expectedResult)
  })

  it('should return empty array if content data is invalid or empty', async () => {
    const result = await render({
      allData: {
        content: {
          empty: [],
          // @ts-expect-error
          null: [null]
        }
      }
    })

    const expectedResult = []

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
                <ul data-nav-depth="0">
                  <li data-nav-depth="0">
                    <a data-nav-depth="0" href="/home/">Home</a>
                  </li>
                  <li data-nav-depth="0">
                    <a data-nav-depth="0" href="http://example.com">Example</a>
                  </li>
                </ul>
              </nav>
            </body>
          </html>
        `
      }
    ]

    const resultMin = minifyOutput(result)
    const expectedResultMin = minifyOutput(expectedResult)

    expect(resultMin).toEqual(expectedResultMin)
    expect(getStoreItem('navigations')).toEqual(navigations)
    expect(getStoreItem('navigationItems')).toEqual(navigationItems)
    expect(redirects).toEqual([
      '/trailing /trailing/ 301',
      '/test /test/ 302'
    ])
  })

  it('should run all render actions and filters', async () => {
    const renderStart = vi.fn()
    const renderEnd = vi.fn()
    const renderItemStart = vi.fn()
    const renderItemEnd = vi.fn()
    const renderItem = vi.fn()
    const renderContent = vi.fn()

    const initialOutput = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Page</title>
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
          <title>Page</title>
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
              }
            ]
          }
        ]
      }
    }

    addAction('renderStart', async (args) => { renderStart(args) })
    addAction('renderEnd', async (args) => { renderEnd(args) })
    addAction('renderItemStart', async (args) => { renderItemStart(args) })
    addFilter('renderItem', async (output, args) => {
      renderItem({ ...args, output: testMinify(output) })
      return output.replace('<html>', '<html lang="en-CA">')
    })

    addAction('renderItemEnd', async (args) => {
      renderItemEnd({ ...args, output: testMinify(expectedOutput) })
    })

    addFilter('renderContent', async (output, args) => {
      renderContent(args)
      const [start = '', end = ''] = output
      return [
        `<section>${start}`,
        `${end}</section>`
      ]
    })

    const result = await render({ allData }) as RenderReturn[]
    const expectedResult = [{ slug: '/page/', output: expectedOutput }]
    const resultMin = minifyOutput(result)
    const expectedResultMin = minifyOutput(expectedResult)

    expect(resultMin).toEqual(expectedResultMin)
    expect(renderStart).toHaveBeenCalledTimes(1)
    expect(renderEnd).toHaveBeenCalledTimes(1)
    expect(renderItemStart).toHaveBeenCalledTimes(1)
    expect(renderItemEnd).toHaveBeenCalledTimes(1)
    expect(renderItem).toHaveBeenCalledTimes(1)
    expect(renderContent).toHaveBeenCalledTimes(1)
    expect(renderStart).toHaveBeenCalledWith({ allData })
    expect(renderEnd).toHaveBeenCalledWith({ allData, data: expectedResult })
    expect(renderItem).toHaveBeenCalledWith({
      id: '123',
      contentType: 'page',
      slug: '/page/',
      output: testMinify(initialOutput),
      pageData: {
        id: '123',
        slug: 'page',
        contentType: 'page',
        title: 'Page',
        basePermalink: '/page/',
        parents: [],
        content: undefined
      },
      pageContains: ['test'],
      pageHeadings: [],
      serverlessData: undefined
    })

    expect(renderItemEnd).toHaveBeenCalledWith({
      id: '123',
      contentType: 'page',
      slug: '/page/',
      output: testMinify(expectedOutput),
      pageData: {
        id: '123',
        slug: 'page',
        contentType: 'page',
        title: 'Page',
        basePermalink: '/page/',
        parents: [],
        content: undefined
      },
      pageContains: ['test'],
      pageHeadings: [],
      serverlessData: undefined
    })

    expect(renderItemStart).toHaveBeenCalledWith({
      id: '123',
      pageData: {
        id: '123',
        slug: 'page',
        contentType: 'page',
        title: 'Page',
        content: [
          {
            id: '456',
            renderType: 'test',
            content: 'test'
          }
        ]
      },
      contentType: 'page',
      pageContains: [],
      pageHeadings: [],
      serverlessData: undefined
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
                // @ts-expect-error
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

    const resultMin = minifyOutput(result)
    const expectedResultMin = minifyOutput(expectedResult)

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

    const resultMin = minifyOutput(result)
    const expectedResultMin = minifyOutput(expectedResult)

    expect(resultMin).toEqual(expectedResultMin)
  })

  it('should return parent and child output items with rich text content', async () => {
    const pageHeadingsTest = vi.fn()

    addAction('renderItemEnd', async (args) => {
      const { id, pageHeadings } = args

      if (id !== '1') {
        return
      }

      pageHeadingsTest(pageHeadings)
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

    const resultMin = minifyOutput(result)
    const expectedResultMin = minifyOutput(expectedResult)

    expect(resultMin).toEqual(expectedResultMin)
    expect(pageHeadingsTest).toHaveBeenCalledWith([
      [
        {
          id: 'test-two',
          title: 'Test Two',
          type: 'h2'
        }
      ],
      [
        {
          id: 'test-three',
          title: 'Test Three',
          type: 'h2'
        },
        {
          id: 'test-four',
          title: 'Test Four',
          type: 'h3'
        }
      ]
    ])
  })

  it('should return item with unformatted slug', async () => {
    const result = await render({
      allData: {
        content: {
          page: [
            {
              id: '7',
              title: 'Lorem',
              contentType: 'page',
              slug: 'lorem.html',
              content: 'lorem'
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

    const resultMin = minifyOutput(result)
    const expectedResultMin = minifyOutput(expectedResult)

    expect(resultMin).toEqual(expectedResultMin)
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
                  // @ts-expect-error
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
                            id: 'template',
                            name: 'Template'
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
                                id: 'templateRepeat',
                                name: 'Template Repeat'
                              }
                            ]
                          },
                          content: [
                            {
                              metadata: {
                                tags: [
                                  {
                                    id: 'templateSlot',
                                    name: 'Template Slot'
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
                            id: 'template',
                            name: 'Template'
                          }
                        ]
                      },
                      content: [
                        {
                          renderType: 'column',
                          metadata: {
                            tags: [
                              {
                                id: 'templateRepeat',
                                name: 'Template Repeat'
                              }
                            ]
                          },
                          content: [
                            {
                              metadata: {
                                tags: [
                                  {
                                    id: 'templateSlot',
                                    name: 'Template Slot'
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
                            id: 'template',
                            name: 'Template'
                          }
                        ]
                      },
                      content: [
                        {
                          renderType: 'container',
                          metadata: {
                            tags: [
                              {
                                id: 'templateSlot',
                                name: 'Template Slot'
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
                                id: 'templateSlot',
                                name: 'Template Slot'
                              },
                              {
                                id: 'templateOptional',
                                name: 'Template Optional'
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
                  <li id="4">child</li>
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

    const resultMin = minifyOutput(result)
    const expectedResultMin = minifyOutput(expectedResult)

    expect(resultMin).toEqual(expectedResultMin)
  })

  it('should return single item corresponding to serverless data', async () => {
    const result = await render({
      serverlessData: {
        path: '/blog/',
        query: {
          page: '3',
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
                prevFilters: '?filters=cat',
                nextFilters: '&filters=cat',
                currentFilters: '&filters=cat',
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

  it('should items with pagination meta information', async () => {
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
                prevFilters: undefined,
                nextFilters: undefined,
                currentFilters: undefined,
                title: 'Page 1 of 5',
                next: 2,
                prev: 0
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
                prevFilters: undefined,
                nextFilters: undefined,
                currentFilters: undefined,
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
                prevFilters: undefined,
                nextFilters: undefined,
                currentFilters: undefined,
                title: 'Page 2 of 2',
                next: 0,
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
                prevFilters: undefined,
                nextFilters: '&filters=cat',
                currentFilters: '?filters=cat',
                title: 'Page 1 of 5',
                next: 2,
                prev: 0
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
                prevFilters: '?filters=cat',
                nextFilters: '&filters=cat',
                currentFilters: '&filters=cat',
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
                prevFilters: '?filters=cat',
                nextFilters: undefined,
                currentFilters: '&filters=cat',
                title: 'Page 2 of 2',
                next: 0,
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

    const resultMin = minifyOutput(result)
    const expectedResultMin = minifyOutput(expectedResult)

    expect(resultMin).toEqual(expectedResultMin)
  })

  // TODO: check scripts and styles reset and slugs set
})
