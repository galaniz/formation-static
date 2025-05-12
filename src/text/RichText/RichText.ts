/**
 * Text - Rich Text
 */

/* Imports */

import type {
  RichTextProps,
  RichTextOutputFilterArgs,
  RichTextContentProps,
  RichTextContentFilterArgs,
  RichTextContentOutputFilterArgs,
  RichTextContent
} from './RichTextTypes.js'
import { getLink } from '../../utils/link/link.js'
import { getExcerpt } from '../../utils/excerpt/excerpt.js'
import { applyFilters } from '../../utils/filter/filter.js'
import { isString, isStringStrict } from '../../utils/string/string.js'
import { isArray, isArrayStrict } from '../../utils/array/array.js'
import { isObjectStrict } from '../../utils/object/object.js'
import { isHeading } from '../../utils/heading/heading.js'

/**
 * Check if string contains shortcode
 *
 * @private
 * @param {string} tag
 * @param {string} content
 * @return {boolean}
 */
const containsShortcode = (tag: string, content: string): boolean => {
  if (tag === 'p' && content.charAt(0) === '[' && content.charAt(content.length - 1) === ']') {
    return true
  }

  return false
}

/**
 * Check if data rich attribute should be added
 *
 * @private
 * @param {boolean|string[]} dataAttr
 * @param {string} tag
 * @return {boolean}
 */
const addDataAttr = (dataAttr: boolean | string[] = true, tag: string = ''): boolean => {
  if (isArrayStrict(dataAttr)) {
    return dataAttr.includes(tag)
  }

  return dataAttr
}

/**
 * Recursively output content
 *
 * @private
 * @param {RichTextContentProps} args
 * @return {string}
 */
const getContent = (args: RichTextContentProps): string => {
  const {
    content = [],
    props,
    dataAttr = false
  } = args

  let { _output = '' } = args

  for (const item of content) {
    const newItem = applyFilters('richTextContentItem', item, props)
    const itemObj = isObjectStrict(newItem) ? newItem : {}

    const {
      link,
      attr,
      internalLink,
      content: itemContent
    } = itemObj

    let { tag = '' } = itemObj
    let newContent = itemContent

    /* Single tag */

    const isSingleTag = tag === 'br' || tag === 'hr'

    /* Nested content */

    if (isArrayStrict(itemContent)) {
      newContent = getContent({
        content: itemContent,
        props,
        dataAttr
      })
    }

    /* Attributes */

    const attrs: string[] = []

    if (addDataAttr(dataAttr, tag)) {
      attrs.push(`data-rich="${tag}"`)
    }

    if (isStringStrict(attr)) {
      attrs.push(attr)
    }

    if (isObjectStrict(attr)) {
      Object.entries(attr).forEach(([key, value]) => {
        attrs.push(`${key}="${value}"`)
      })
    }

    /* Link */

    if (tag === 'a') {
      let anchorLink = link

      if (internalLink) {
        anchorLink = getLink(internalLink)
      }

      if (isStringStrict(anchorLink)) {
        attrs.push(`href="${anchorLink}"`)
      }
    }

    /* Filter output */

    let outputStr = ''

    if (isString(newContent)) {
      const richTextContentFilterArgs: RichTextContentFilterArgs = {
        args: newItem,
        props
      }

      const filteredContent = applyFilters('richTextContent', newContent, richTextContentFilterArgs)

      if (isString(filteredContent)) {
        newContent = filteredContent
      }

      outputStr += newContent
    }

    if (containsShortcode(tag, outputStr)) {
      tag = ''
    }

    /* Output */

    let opening = ''
    let closing = ''
    let inner = ''

    if (isStringStrict(tag) && outputStr.trim() && !isSingleTag) {
      opening = `<${tag}${attrs.length ? ` ${attrs.join(' ')}` : ''}>`
      closing = `</${tag}>`
      inner = outputStr
      outputStr = `${opening}${outputStr}${closing}`
    }

    if (isSingleTag) {
      outputStr = `<${tag}>`
    }

    const richTextContentOutputArgs: RichTextContentOutputFilterArgs = {
      args: newItem,
      props,
      element: {
        opening,
        closing,
        content: inner
      }
    }

    outputStr = applyFilters('richTextContentOutput', outputStr, richTextContentOutputArgs)

    _output += outputStr
  }

  /* Output */

  return _output
}

/**
 * Rich text content as plain text string
 *
 * @param {RichTextContent|RichTextContent[]|string|undefined} args
 * @return {string}
 */
const getPlainText = (
  args: RichTextContent | RichTextContent[] | string | undefined,
  _output: string = ''
): string => {
  if (isString(args)) {
    return args
  }

  const content = isObjectStrict(args) ? args.content : args

  if (!isArrayStrict(content)) {
    return _output
  }

  for (const item of content) {
    const { content: itemContent } = isObjectStrict(item) ? item : {}

    if (isString(itemContent)) {
      _output += itemContent
    }

    if (isArrayStrict(itemContent)) {
      _output = getPlainText({ content: itemContent }, _output)
    }
  }

  return _output
}

/**
 * Output rich text
 *
 * @param {RichTextProps} props
 * @return {string}
 */
const RichText = (props: RichTextProps): string => {
  /* Props required */

  if (!isObjectStrict(props)) {
    return ''
  }

  props = applyFilters('richTextProps', props)

  /* Filtered props required */

  if (!isObjectStrict(props)) {
    return ''
  }

  const { args } = props

  if (!isObjectStrict(args)) {
    return ''
  }

  const {
    content = [],
    classes,
    link,
    internalLink,
    textStyle,
    headingStyle,
    align,
    style,
    attr,
    dataAttr = true
  } = args

  let { tag = '' } = args

  /* Single tag */

  if (tag === 'hr' || tag === 'br') {
    return `<${tag}>`
  }

  /* Check if heading */

  const isSectionHeading = isHeading(tag)

  /* Classes */

  const classesArr: string[] = []

  if (isStringStrict(classes)) {
    classesArr.push(classes)
  }

  if (isStringStrict(textStyle)) {
    classesArr.push(textStyle)
  }

  if (isStringStrict(headingStyle) && isSectionHeading) {
    classesArr.push(headingStyle)
  }

  if (isStringStrict(align)) {
    classesArr.push(align)
  }

  /* Simpler props */

  const filterProps = {
    ...props
  }

  filterProps.args.content = undefined

  /* Generate output */

  let output = ''
  let headingStr = ''
  let headingObj

  if (isStringStrict(content)) {
    output = content
    headingStr = content
  }

  if (isArrayStrict(content)) {
    headingObj = content

    output = getContent({
      content,
      props: filterProps,
      dataAttr
    })
  }

  /* Attributes */

  const attrs: string[] = []

  if (addDataAttr(dataAttr, tag)) {
    attrs.push(`data-rich="${tag}"`)
  }

  if (isSectionHeading) {
    const headingContents = getExcerpt({
      limit: 10,
      limitExcerpt: true,
      excerpt: headingStr,
      content: headingObj
    })

    const id = headingContents
      .trim()
      .replace(/&hellip;/g, '')
      .replace(/[^\w\s]|_/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()

    if (headingContents && id) {
      attrs.push(`id="${id}"`)

      if (isArray(props.headings)) {
        props.headings.push({
          id,
          title: headingContents,
          type: tag
        })
      }
    }
  }

  if (tag === 'a') {
    let anchorLink = link

    const inLink = getLink(internalLink)

    if (isStringStrict(inLink)) {
      anchorLink = inLink
    }

    if (isStringStrict(anchorLink)) {
      attrs.push(`href="${anchorLink}"`)
    }
  }

  if (classesArr.length) {
    attrs.push(`class="${classesArr.join(' ')}"`)
  }

  if (isStringStrict(style)) {
    attrs.push(`style="${style}"`)
  }

  if (isStringStrict(attr)) {
    attrs.push(attr)
  }

  if (isObjectStrict(attr)) {
    Object.entries(attr).forEach(([key, value]) => {
      attrs.push(`${key}="${value}"`)
    })
  }

  /* Output */

  if (containsShortcode(tag, output)) {
    tag = ''
  }

  let opening = ''
  let closing = ''
  let inner = ''

  if (isStringStrict(tag) && output.trim()) {
    opening = `<${tag}${attrs.length ? ` ${attrs.join(' ')}` : ''}>`
    closing = `</${tag}>`
    inner = output
    output = `${opening}${output}${closing}`
  }

  const richTextOutputArgs: RichTextOutputFilterArgs = {
    props: filterProps,
    element: {
      opening,
      closing,
      content: inner
    }
  }

  output = applyFilters('richTextOutput', output, richTextOutputArgs)

  return output
}

/* Exports */

export {
  RichText,
  getPlainText
}
