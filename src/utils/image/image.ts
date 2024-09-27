/**
 * Utils - Image
 */

/* Imports */

import type {
  ImageArgs,
  ImageReturn,
  ImageMaxWidthArgs
} from './imageTypes.js'
import { config } from '../../config/config.js'
import { isString, isStringStrict } from '../string/string.js'
import { isArrayStrict } from '../array/array.js'
import { isNumber } from '../number/number.js'
import { isObjectStrict } from '../object/object.js'
import { dataSource } from '../dataSource/dataSource.js'

/**
 * Get responsive image output
 *
 * @param {ImageArgs} args
 * @return {ImageReturn|string}
 */
const getImage = (args: ImageArgs = {}): ImageReturn | string => {
  const {
    data = undefined,
    classes = '',
    attr = '',
    width = 'auto',
    height = 'auto',
    returnDetails = false,
    lazy = true,
    picture = false,
    quality = config.image.quality,
    source = config.source,
    maxWidth = 1200,
    viewportWidth = 100
  } = isObjectStrict(args) ? args : {}

  /* Data required */

  if (!isObjectStrict(data)) {
    return ''
  }

  const {
    path = '',
    alt = '',
    width: naturalWidth = 1,
    height: naturalHeight = 1,
    format = 'jpg'
  } = data

  let { url = '' } = data

  /* Source */

  const isStatic = source === 'static'
  const isContentful = dataSource.isContentful(source)
  const isWordpress = dataSource.isWordPress(source)

  /* Static url */

  if (isStatic && isStringStrict(path)) {
    url = `${config.image.url}${path}`
  }

  /* Dimensions */

  const aspectRatio = naturalHeight / naturalWidth
  const aspectRatioReverse = naturalWidth / naturalHeight

  let w = naturalWidth
  let h = naturalHeight

  if (isNumber(width)) {
    w = width
    h = isString(height) ? w * aspectRatio : height
  }

  if (isNumber(height)) {
    h = height
    w = isString(width) ? h * aspectRatioReverse : width
  }

  if (w > maxWidth) {
    w = Math.round(maxWidth)
    h = Math.round(w * aspectRatio)
  }

  /* Src and sizes attributes */

  let src = url
  let srcFallback = url

  if (dataSource.isStatic(source)) {
    src = `${url}.webp`
    srcFallback = `${url}.${format}`
  }

  if (isContentful) {
    const common = `&q=${quality}&w=${w}&h=${h}`

    src = `${url}?fm=webp${common}`
    srcFallback = `${url}?fm=${format}${common}`
  }

  const sizes = `(min-width: ${w / 16}rem) ${w / 16}rem, ${viewportWidth}vw`
  const srcsetFallback: string[] = []

  let srcset: number[] = [...config.image.sizes]

  if (!srcset.includes(w)) {
    srcset.push(w)
  }

  srcset = srcset.filter(s => s <= w)

  srcset.sort((a, b) => a - b)

  const srcsetStr: string[] = []

  srcset.forEach(s => {
    if (isStatic) {
      const common = `${url}${s !== naturalWidth ? `@${s}` : ''}`

      srcsetFallback.push(`${common}.${format} ${s}w`)
      srcsetStr.push(`${common}.webp ${s}w`)
    }

    if (isContentful) {
      const common = `&q=${quality}&w=${s}&h=${Math.round(s * aspectRatio)} ${s}w`

      srcsetFallback.push(`${url}?fm=${format}${common}`)
      srcsetStr.push(`${url}?fm=webp${common}`)
    }

    if (isWordpress) {
      const sizeUrl = data?.sizes?.[s]

      if (isStringStrict(sizeUrl)) {
        srcsetStr.push(`${sizeUrl} ${s}w`)
      }
    }
  })

  /* Output */

  let sourceOutput = ''

  if (picture) {
    sourceOutput = `<source srcset="${srcsetStr.join(', ')}" sizes="${sizes}" type="image/webp">`
  }

  let eagerHackOutput = ''

  if (!lazy) {
    eagerHackOutput = `
      <img
        alt=""
        role="presentation"
        aria-hidden="true"
        src="data:image/svg+xml;charset=utf-8,%3Csvg height='${h}' width='${w}' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E" style="pointerEvents: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%"
      >
    `
  }

  const output = `
    ${eagerHackOutput}
    ${sourceOutput}
    <img
      ${classes !== '' ? ` class="${classes}"` : ''}
      alt="${alt}"
      src="${picture ? srcFallback : src}"
      srcset="${picture ? srcsetFallback.join(', ') : srcsetStr.join(', ')}"
      sizes="${sizes}"
      width="${w}"
      height="${h}"
      ${attr !== '' ? ` ${attr}` : ''}
      ${lazy ? ' loading="lazy" decoding="async"' : ' loading="eager"'}
    >
  `

  if (returnDetails) {
    return {
      output,
      aspectRatio,
      naturalWidth,
      naturalHeight,
      src,
      srcFallback,
      srcset: srcsetStr,
      sizes
    }
  }

  return output
}

/**
 * Get closest value in config sizes
 *
 * @param {number} size
 * @return {number}
 */
const getImageClosestSize = (size: number): number => {
  return [...config.image.sizes].reduce((prev, curr) => {
    return Math.abs(curr - size) <= Math.abs(prev - size) ? curr : prev
  })
}

/**
 * Calculate max width from column and container parents
 *
 * @param {ImageMaxWidthArgs} args
 * @return {number}
 */
const getImageMaxWidth = ({
  parents,
  widths,
  maxWidths,
  breakpoints,
  source = config.source
}: ImageMaxWidthArgs): number => {
  if (!isArrayStrict(parents)) {
    return 0
  }

  /* Widths as floats */

  const w = [1, 1, 1, 1]

  /* Store max width */

  let m = 0

  /* Width strings to numbers */

  parents.forEach((parent) => {
    const { renderType, args } = parent

    if (!isObjectStrict(args)) {
      return
    }

    if (renderType === 'column') {
      const {
        width = 'None',
        widthSmall = 'None',
        widthMedium = 'None',
        widthLarge = 'None'
      } = args

      w[0] = isNumber(widths[width]) && widths[width] > 0 ? widths[width] : 1
      w[1] = isNumber(widths[widthSmall]) && widths[widthSmall] > 0 ? widths[widthSmall] : w[0]
      w[2] = isNumber(widths[widthMedium]) && widths[widthMedium] > 0 ? widths[widthMedium] : w[1]
      w[3] = isNumber(widths[widthLarge]) && widths[widthLarge] > 0 ? widths[widthLarge] : w[2]
    }

    if (renderType === 'container') {
      const { maxWidth = 'None' } = args

      m = isNumber(maxWidths[maxWidth]) ? maxWidths[maxWidth] : 0
    }
  })

  /* Convert to fixed widths */

  const bk = [...breakpoints]
  const calc = []

  let lastW = 1

  bk.forEach((b, i) => {
    const wd = w[i]

    if (wd === undefined) {
      return
    }

    lastW = wd

    if (m > 0 && b > m) {
      calc.push(wd * m)
      return
    }

    calc.push(wd * b)
  })

  if (m > 0) {
    calc.push(lastW * m)
  }

  /* Output */

  const res = Math.max(...calc) * 2

  if (source === 'static') {
    return getImageClosestSize(res)
  }

  return res
}

/* Exports */

export {
  getImage,
  getImageClosestSize,
  getImageMaxWidth
}
