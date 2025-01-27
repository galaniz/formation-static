/**
 * Text - Rich Text Test
 */

/* Imports */

import { it, expect, describe, vi, afterEach } from 'vitest'
import { addFilter, resetFilters } from '../../../utils/filter/filter.js'
import { RichText } from '../RichText.js'

/* Tests */

describe('RichText()', () => {
  afterEach(() => {
    resetFilters()
  })

  it('should return empty string if no props', () => {
    // @ts-expect-error - test undefined props
    const result = RichText()
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if no args', () => {
    // @ts-expect-error - test empty props
    const result = RichText({})
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if content is null', () => {
    const result = RichText({
      args: {
        // @ts-expect-error - test null content
        content: null
      }
    })

    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return hr', () => {
    const result = RichText({
      args: {
        tag: 'hr',
        content: 'test'
      }
    })

    const expectedResult = '<hr>'

    expect(result).toBe(expectedResult)
  })

  it('should return anchor', () => {
    const result = RichText({
      args: {
        tag: 'a',
        link: 'http://example.com/',
        content: 'link'
      }
    })

    const expectedResult = '<a data-rich="a" href="http://example.com/">link</a>'

    expect(result).toBe(expectedResult)
  })

  it('should return anchor with internal link', () => {
    const result = RichText({
      args: {
        tag: 'a',
        content: 'link',
        internalLink: {
          id: '1',
          contentType: 'page',
          slug: 'index',
          title: 'Home'
        }
      }
    })

    const expectedResult = '<a data-rich="a" href="/">link</a>'

    expect(result).toBe(expectedResult)
  })

  it('should return heading with id', () => {
    const result = RichText({
      args: {
        tag: 'h2',
        headingStyle: 'text',
        content: [
          {
            tag: '',
            content: 'Hello, World! This is a heading... With some special chars & symbols! '
          }
        ]
      }
    })

    const expectedResult = '<h2 data-rich="h2" id="hello-world-this-is-a-heading-with-some-special-chars" class="text">Hello, World! This is a heading... With some special chars & symbols! </h2>'

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if filtered props are null', () => {
    // @ts-expect-error - test filtered null props
    addFilter('richTextProps', () => {
      return null
    })

    const result = RichText({
      args: {
        tag: 'p',
        content: 'test'
      }
    })

    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if nested filtered item is null', () => {
    // @ts-expect-error - test filtered null item
    addFilter('richTextContentItem', () => {
      return null
    })

    const result = RichText({
      args: {
        tag: 'p',
        dataAttr: false,
        content: [
          {
            content: 'test'
          }
        ]
      }
    })

    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return paragraph with filtered props and output', () => {
    const richTextProps = vi.fn()
    const richTextOutput = vi.fn()

    const initArgs = {
      tag: 'p',
      content: 'test'
    }

    const filterArgs = {
      textStyle: 'style',
      classes: 'class',
      attr: 'data-attr="text"',
      style: 'color:black',
      align: 'align',
      dataAttr: false
    }

    addFilter('richTextProps', (props) => {
      richTextProps(props)
      const newProps = { ...props }
      const { args } = newProps

      newProps.args = {
        ...args,
        ...filterArgs
      }

      return newProps
    })

    addFilter('richTextOutput', (output, args) => {
      richTextOutput(args)
      return `<div>${output}</div>`
    })

    const result = RichText({
      args: { ...initArgs }
    })

    const expectedResult =
      '<div><p class="class style align" style="color:black" data-attr="text">test</p></div>'

    expect(result).toBe(expectedResult)
    expect(richTextProps).toHaveBeenCalledTimes(1)
    expect(richTextOutput).toHaveBeenCalledTimes(1)
    expect(richTextProps).toHaveBeenCalledWith({ args: { ...initArgs } })
    expect(richTextOutput).toHaveBeenCalledWith({
      props: {
        args: {
          ...initArgs,
          ...filterArgs,
          content: undefined
        }
      },
      element: {
        opening: '<p class="class style align" style="color:black" data-attr="text">',
        closing: '</p>',
        content: 'test'
      }
    })
  })

  it('should return shortcodes without tags', () => {
    const resultOne = RichText({
      args: {
        tag: 'p',
        content: [
          {
            content: '[shortcode]'
          }
        ]
      }
    })

    const resultTwo = RichText({
      args: {
        tag: '',
        content: [
          {
            tag: 'p',
            content: [
              {
                content: '[shortcode]'
              }
            ]
          },
          {
            tag: 'span',
            content: [
              {
                content: 'content'
              }
            ]
          },
          {
            tag: 'p',
            content: [
              {
                content: '[/shortcode]'
              }
            ]
          }
        ]
      }
    })

    expect(resultOne).toBe('[shortcode]')
    expect(resultTwo).toBe('[shortcode]<span data-rich="span">content</span>[/shortcode]')
  })

  it('should return paragraph with filtered nested props and output', () => {
    const richTextContentItem = vi.fn()
    const richTextContent = vi.fn()
    const richTextContentOutput = vi.fn()

    addFilter('richTextContentItem', (item, props) => {
      richTextContentItem({ item, props })
      return {
        ...item,
        attr: 'data-attr="test"'
      }
    })

    addFilter('richTextContent', (content, args) => {
      richTextContent(args)
      return `${content} example`
    })

    addFilter('richTextContentOutput', (output, args) => {
      richTextContentOutput(args)
      return `<span>${output}</span>`
    })

    const result = RichText({
      args: {
        tag: 'p',
        dataAttr: ['p'],
        content: [
          {
            tag: 'a',
            link: 'http://example.com/',
            content: 'test'
          }
        ]
      }
    })

    const expectedProps = {
      args: {
        tag: 'p',
        dataAttr: ['p'],
        content: undefined
      }
    }

    const expectedArgs = {
      tag: 'a',
      link: 'http://example.com/',
      content: 'test',
      attr: 'data-attr="test"'
    }

    const expectedResult =
      '<p data-rich="p"><span><a data-attr="test" href="http://example.com/">test example</a></span></p>'

    expect(result).toBe(expectedResult)
    expect(richTextContentItem).toHaveBeenCalledTimes(1)
    expect(richTextContent).toHaveBeenCalledTimes(1)
    expect(richTextContentOutput).toHaveBeenCalledTimes(1)
    expect(richTextContentItem).toHaveBeenCalledWith({
      props: expectedProps,
      item: {
        tag: 'a',
        link: 'http://example.com/',
        content: 'test'
      }
    })

    expect(richTextContent).toHaveBeenCalledWith({
      props: expectedProps,
      args: expectedArgs
    })

    expect(richTextContentOutput).toHaveBeenCalledWith({
      props: expectedProps,
      args: expectedArgs,
      element: {
        opening: '<a data-attr="test" href="http://example.com/">',
        closing: '</a>',
        content: 'test example'
      }
    })
  })

  it('should span with nested link and span', () => {
    const result = RichText({
      args: {
        tag: 'span',
        dataAttr: false,
        content: [
          {
            tag: 'a',
            internalLink: {
              id: '1',
              contentType: 'post',
              slug: 'post-1',
              title: 'Post'
            },
            content: [
              {
                tag: 'span',
                content: [
                  {
                    attr: 'data-none',
                    content: 'Post One'
                  }
                ]
              }
            ]
          }
        ]
      }
    })

    const expectedResult =
      '<span><a href="/post-1/"><span>Post One</span></a></span>'

    expect(result).toBe(expectedResult)
  })
})
