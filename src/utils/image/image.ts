/**
 * Utils - Image
 */

/* Imports */

import type {
  ImageArgs,
  ImageReturnType,
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
 * @param {boolean} [returnDetails]
 * @return {ImageReturnType}
 */
const getImage = <V extends boolean = false>(
  args: ImageArgs,
  returnDetails: V = false as V
): ImageReturnType<V> => {
  const {
    data = undefined,
    classes = '',
    attr = '',
    alt: imageAlt = 'inherit',
    width = 'auto',
    height = 'auto',
    lazy = true,
    picture = false,
    quality = 75,
    source = config.source,
    maxWidth = 1200,
    viewportWidth = 100
  } = isObjectStrict(args) ? args : {}

  /* Fallback */

  const fallbackDetails = {
    output: '',
    aspectRatio: 0,
    naturalWidth: 0,
    naturalHeight: 0,
    src: '',
    srcFallback: '',
    srcset: [],
    sizes: ''
  }

  const fallback = returnDetails ? fallbackDetails : ''

  /* Data required */

  if (!isObjectStrict(data)) {
    return fallback as ImageReturnType<V>
  }

  const {
    path = '',
    alt: dataAlt = '',
    width: naturalWidth = 1,
    height: naturalHeight = 1,
    format = 'jpg'
  } = data

  let { url = config.image.cmsUrl } = data

  /* Alt */

  let alt = imageAlt === 'inherit' ? dataAlt : imageAlt

  if (!isStringStrict(alt)) {
    alt = ''
  }

  /* Source */

  const isLocal = source === 'local'
  const isContentful = dataSource.isContentful(source)
  const isWordpress = dataSource.isWordPress(source)

  /* Local url */

  if (isLocal) {
    if (!isStringStrict(path)) {
      return fallback as ImageReturnType<V>
    }

    url = `${config.image.localUrl}${path}`
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

  if (dataSource.isLocal(source)) {
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

  const srcsetSource: string[] = []

  srcset.forEach(s => {
    if (isLocal) {
      const common = `${url}${s !== naturalWidth ? `@${s}` : ''}`

      srcsetFallback.push(`${common}.${format} ${s}w`)
      srcsetSource.push(`${common}.webp ${s}w`)
    }

    if (isContentful) {
      const common = `&q=${quality}&w=${s}&h=${Math.round(s * aspectRatio)} ${s}w`

      srcsetFallback.push(`${url}?fm=${format}${common}`)
      srcsetSource.push(`${url}?fm=webp${common}`)
    }

    if (isWordpress) {
      const sizeUrl = data.sizes?.[s]

      if (isStringStrict(sizeUrl)) {
        srcsetSource.push(`${sizeUrl} ${s}w`)
      }
    }
  })

  /* Output */

  let sourceOutput = ''

  if (picture) {
    sourceOutput = `<source srcset="${srcsetSource.join(', ')}" sizes="${sizes}" type="image/webp">`
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
      ${isStringStrict(classes) ? ` class="${classes}"` : ''}
      alt="${alt}"
      src="${picture ? srcFallback : src}"
      srcset="${picture ? srcsetFallback.join(', ') : srcsetSource.join(', ')}"
      sizes="${sizes}"
      width="${w}"
      height="${h}"
      ${isStringStrict(attr) ? ` ${attr}` : ''}
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
      srcset: srcsetSource,
      sizes
    } as ImageReturnType<V>
  }

  return output as ImageReturnType<V>
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
const getImageMaxWidth = (args: ImageMaxWidthArgs): number => {
  /* Args must be an object */

  if (!isObjectStrict(args)) {
    return 0
  }

  const {
    parents,
    widths,
    maxWidths,
    breakpoints,
    source = config.source
  } = args

  /* Parents, widths, maxWidths and breakpoints required */

  const required =
    isArrayStrict(parents) &&
    isObjectStrict(widths) &&
    isObjectStrict(maxWidths) &&
    isArrayStrict(breakpoints)

  if (!required) {
    return 0
  }

  /* Widths as floats */

  const w: number[] = []

  /* Max width */

  let m = 0

  /* Width strings to numbers */

  parents.forEach((parent) => {
    if (!isObjectStrict(parent)) {
      return
    }

    const { renderType, args } = parent

    if (!isObjectStrict(args)) {
      return
    }

    if (renderType === 'column') {
      const {
        width = 'Default',
        widthSmall = 'Default',
        widthMedium = 'Default',
        widthLarge = 'Default'
      } = args

      w[0] = isNumber(widths[width]) && widths[width] > 0 ? widths[width] : 1
      w[1] = isNumber(widths[widthSmall]) && widths[widthSmall] > 0 ? widths[widthSmall] : w[0]
      w[2] = isNumber(widths[widthMedium]) && widths[widthMedium] > 0 ? widths[widthMedium] : w[1]
      w[3] = isNumber(widths[widthLarge]) && widths[widthLarge] > 0 ? widths[widthLarge] : w[2]
    }

    if (renderType === 'container') {
      const { maxWidth = 'Default' } = args

      m = isNumber(maxWidths[maxWidth]) ? maxWidths[maxWidth] : 0
    }
  })

  if (w.length === 0 && m === 0) {
    return 0
  }

  /* Convert to fixed widths */

  const bk = [...breakpoints]
  const calc: number[] = []

  let lastW = 1

  bk.forEach((b, i) => {
    const wd = w[i]

    if (!isNumber(wd)) {
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

  if (source === 'local') {
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
