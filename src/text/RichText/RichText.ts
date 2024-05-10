/**
 * Text - Rich Text
 */

/* Imports */

import type {
  RichTextProps,
  RichTextOutputFilterArgs,
  RichTextContentProps,
  RichTextContentFilterArgs,
  RichTextContentOutputFilterArgs
} from './RichTextTypes'
import { getLink } from '../../utils/getLink/getLink'
import { getExcerpt } from '../../utils/getExcerpt/getExcerpt'
import { applyFilters } from '../../utils/filters/filters'
import { isString, isStringStrict } from '../../utils/isString/isString'
import { isArray, isArrayStrict } from '../../utils/isArray/isArray'
import { isObjectStrict } from '../../utils/isObject/isObject'
import { isHeading } from '../../utils/isHeading/isHeading'

/**
 * Function - check if string contains shortcode
 *
 * @private
 * @param {string} tag
 * @param {string} content
 * @return {boolean}
 */
const _containsShortcode = (tag: string = '', content: string = ''): boolean => {
  if (tag === 'p' && content.charAt(0) === '[' && content.charAt(content.length - 1) === ']') {
    return true
  }

  return false
}

/**
 * Function - check if data rich attribute should be added
 *
 * @private
 * @param {boolean|string[]} dataAttr
 * @param {string} tag
 * @return {boolean}
 */
const _addDataAttr = (dataAttr: boolean | string[] = true, tag: string = ''): boolean => {
  if (isArrayStrict(dataAttr)) {
    return dataAttr.includes(tag)
  }

  return dataAttr
}

/**
 * Function - recursively output content
 *
 * @private
 * @param {import('./RichTextTypes').RichTextContentProps} args
 * @return {Promise<string>}
 */
const _getContent = async (args: RichTextContentProps): Promise<string> => {
  const {
    content = [],
    props,
    dataAttr = false
  } = args

  let {
    _output = ''
  } = args

  for (let i = 0; i < content.length; i += 1) {
    let item = content[i]

    item = await applyFilters('richTextContentItem', item, props)

    const {
      link = '',
      attr = '',
      internalLink,
      content: c
    } = item

    let {
      tag = ''
    } = item

    let cc = c

    /* Nested content */

    if (isArrayStrict(c)) {
      cc = await _getContent({
        content: c,
        props,
        dataAttr
      })
    }

    /* Attributes */

    const attrs: string[] = []

    if (_addDataAttr(dataAttr, tag)) {
      attrs.push(`data-rich="${tag}"`)
    }

    if (isStringStrict(attr)) {
      attrs.push(attr)
    }

    /* Link */

    if (tag === 'a') {
      let anchorLink = link

      if (internalLink !== undefined) {
        anchorLink = getLink(internalLink)
      }

      if (anchorLink !== '') {
        attrs.push(`href="${anchorLink}"`)
      }
    }

    /* Filter output */

    let outputStr = ''

    if (isString(cc)) {
      const richTextContentFilterArgs: RichTextContentFilterArgs = {
        args: item,
        props
      }

      const ccc = await applyFilters('richTextContent', cc, richTextContentFilterArgs)

      if (isString(ccc)) {
        cc = ccc
      }

      outputStr += cc
    }

    if (_containsShortcode(tag, outputStr)) {
      tag = ''
    }

    /* Output */

    let opening = ''
    let closing = ''
    let inner = ''

    if (isStringStrict(tag) && outputStr.trim() !== '') {
      opening = `<${tag}${(attrs.length > 0) ? ` ${attrs.join(' ')}` : ''}>`
      closing = `</${tag}>`
      inner = outputStr
      outputStr = `${opening}${outputStr}${closing}`
    }

    const richTextContentOutputArgs: RichTextContentOutputFilterArgs = {
      args: item,
      props,
      element: {
        opening,
        closing,
        content: inner
      }
    }

    outputStr = await applyFilters('richTextContentOutput', outputStr, richTextContentOutputArgs)

    _output += outputStr
  }

  /* Output */

  return _output
}

/**
 * Function - output rich text
 *
 * @param {import('./RichTextTypes').RichTextProps} props
 * @return {Promise<string>}
 */
const RichText = async (props: RichTextProps): Promise<string> => {
  /* Props must be object */

  if (!isObjectStrict(props)) {
    return ''
  }

  props = await applyFilters('richTextProps', props, { renderType: 'richText' })

  /* Filtered props must be object */

  if (!isObjectStrict(props)) {
    return ''
  }

  let { args } = props

  args = isObjectStrict(args) ? args : {}

  const {
    content = [],
    classes = '',
    link = '',
    internalLink,
    textStyle = '',
    headingStyle = '',
    align = '',
    style = '',
    attr = '',
    dataAttr = true
  } = args

  let {
    tag = ''
  } = args

  /* Hr */

  if (tag === 'hr') {
    return '<hr>'
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

    output = await _getContent({
      content,
      props: filterProps,
      dataAttr
    })
  }

  /* Attributes */

  const attrs: string[] = []

  if (_addDataAttr(dataAttr, tag)) {
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
      .replace('&hellip;', '')
      .replace(/[^\w\s]|_/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()

    if (headingContents !== '' && id !== '') {
      attrs.push(`id=${id}`)

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

    if (anchorLink !== '') {
      attrs.push(`href="${anchorLink}"`)
    }
  }

  if (classesArr.length > 0) {
    attrs.push(`class="${classesArr.join(' ')}"`)
  }

  if (isStringStrict(style)) {
    attrs.push(`style="${style}"`)
  }

  if (isStringStrict(attr)) {
    attrs.push(attr)
  }

  /* Output */

  if (_containsShortcode(tag, output)) {
    tag = ''
  }

  let opening = ''
  let closing = ''
  let inner = ''

  if (tag !== '' && output.trim() !== '') {
    opening = `<${tag}${(attrs.length > 0) ? ` ${attrs.join(' ')}` : ''}>`
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

  output = await applyFilters('richTextOutput', output, richTextOutputArgs)

  return output
}

/* Exports */

export { RichText }
