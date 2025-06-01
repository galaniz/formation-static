/**
 * Render - Inline Test
 */

/* Imports */

import { it, expect, describe, afterEach, beforeEach } from 'vitest'
import { setRenderFunctions } from '../render.js'
import { renderInlineContent, renderInlineItem } from '../renderInline.js'

/**
 * Reset render functions to default
 *
 * @return {void}
 */
const testResetRenderFunctions = (): void => {
  setRenderFunctions({
    functions: {},
    layout: () => '',
    navigation: () => undefined,
    httpError: () => ''
  })
}

/* Test renderInlineContent */

describe('renderInlineContent()', () => {
  it('should return empty string if no items', async () => {
    // @ts-expect-error - test undefined items
    const result = await renderInlineContent()
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return div wrapped rich text item', async () => {
    const result = await renderInlineContent([
      {
        renderType: 'container',
        content: [
          {
            renderType: 'richText',
            tag: 'p',
            content: 'test'
          }
        ]
      }
    ])

    const expectedResult = '<div><p data-rich="p">test</p></div>'

    expect(result).toBe(expectedResult)
  })

  it('should return heading with item data title', async () => {
    setRenderFunctions({
      functions: {
        test: ({ itemData }) => `<h1>${itemData?.title}</h1>`
      },
      layout: () => '',
      navigation: () => undefined,
      httpError: () => ''
    })

    const result = await renderInlineContent([
      {
        renderType: 'test'
      }
    ],
    {
      itemData: {
        title: 'Page title'
      }
    })

    const expectedResult = '<h1>Page title</h1>'

    expect(result).toBe(expectedResult)
  })
})

/* Test renderInlineItem */

describe('renderInlineItem()', () => {
  beforeEach(() => {
    setRenderFunctions({
      functions: {},
      layout: ({ content }) => content,
      navigation: () => undefined,
      httpError: () => ''
    })
  })

  afterEach(() => {
    testResetRenderFunctions()
  })

  it('should return empty string if no args', async () => {
    // @ts-expect-error - test undefined args
    const result = await renderInlineItem()
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if incomplete args', async () => {
    // @ts-expect-error - test incomplete item props
    const result = await renderInlineItem({
      id: '1',
      contentType: 'page',
      title: 'Test'
    })

    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return div wrapped rich text item', async () => {
    const result = await renderInlineItem({
      id: '1',
      contentType: 'page',
      title: 'Test',
      slug: 'test',
      content: [
        {
          renderType: 'container',
          content: [
            {
              renderType: 'richText',
              tag: 'p',
              content: 'test'
            }
          ]
        }
      ]
    })

    const expectedResult = '<div><p data-rich="p">test</p></div>'

    expect(result).toBe(expectedResult)
  })
})
