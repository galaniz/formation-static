/**
 * Utils - Image
 */

/* Imports */

import type {
  ImageArgs,
  ImageReturnType,
  ImageSizesArgs,
  ImageSizesReturn,
  ImageSizesParentsArgs
} from './imageTypes.js'
import { config } from '../../config/config.js'
import { isString, isStringStrict } from '../string/string.js'
import { isArrayStrict } from '../array/array.js'
import { isNumber } from '../number/number.js'
import { isObjectStrict } from '../object/object.js'
import { dataSource } from '../dataSource/dataSource.js'

/**
 * URL with params from remote source.
 *
 * @private
 * @param {string} url
 * @param {string} format
 * @param {number} quality
 * @param {number} width
 * @param {number} height
 * @param {Record<string, string>} params
 * @return {string}
 */
const getImageUrl = (
  url: string,
  format: string,
  quality: number,
  width: number,
  height: number,
  params: Record<string, string>
): string => {
  const urlObj = new URL(url)

  Object.entries(params).forEach(([key, value]) => {
    let val = value

    if (val === '%format') {
      val = format
    }

    if (val === '%quality') {
      val = `${quality}`
    }

    if (val === '%width') {
      val = `${width}`
    }

    if (val === '%height') {
      val = `${height}`
    }

    urlObj.searchParams.set(key, val)
  })

  return urlObj.toString()
}

/**
 * Responsive image output.
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
    data,
    classes,
    attr,
    alt: imageAlt = 'inherit',
    width = 'auto',
    height = 'auto',
    lazy = true,
    picture = false,
    quality = 75,
    source = config.source,
    maxWidth = 1200,
    viewportWidth = 100,
    sizes,
    format = 'webp',
    params = {
      fm: '%format',
      q: '%quality',
      w: '%width',
      h: '%height'
    }
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
    format: naturalFormat = 'jpg',
    sizes: dataSizes
  } = data

  let { url = config.image.remoteUrl } = data

  /* Alt */

  let alt = imageAlt === 'inherit' ? dataAlt : imageAlt

  if (!isStringStrict(alt)) {
    alt = ''
  }

  /* Source */

  const isLocal = source === 'local'
  const isRemote = dataSource.isContentful(source) || source === 'remote'
  const isWordpress = dataSource.isWordPress(source)

  /* Local url */

  if (isLocal) {
    if (!isStringStrict(path)) {
      return fallback as ImageReturnType<V>
    }

    url = `${config.image.localUrl}/${path}`
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

  if (isWordpress && dataSizes && !dataSizes[w]) {
    const isNatural = w === naturalWidth

    if (!isNatural) {
      w = getImageClosestSize(w, Object.keys(dataSizes).map(s => parseInt(s, 10)))
      h = Math.round(w * aspectRatio)
    }

    if (isNatural) {
      dataSizes[w] = url
    }
  }

  /* Src and sizes attributes */

  let src = url
  let srcFallback = url

  if (isLocal) {
    src = `${url}.${format}`
    srcFallback = `${url}.${naturalFormat}`
  }

  if (isRemote) {
    src = getImageUrl(url, format, quality, w, h, params)
    srcFallback = getImageUrl(url, naturalFormat, quality, w, h, params)
  }

  const sizesValue = sizes || `(min-width: ${w / 16}rem) ${w / 16}rem, ${viewportWidth}vw`
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
      const base = `${url}${s !== naturalWidth ? `@${s}` : ''}`

      srcsetFallback.push(`${base}.${naturalFormat} ${s}w`)
      srcsetSource.push(`${base}.${format} ${s}w`)
    }

    if (isRemote) {
      const sizeHeight = Math.round(s * aspectRatio)

      srcsetFallback.push(getImageUrl(url, naturalFormat, quality, s, sizeHeight, params) + ` ${s}w`)
      srcsetSource.push(getImageUrl(url, format, quality, s, sizeHeight, params) + ` ${s}w`)
    }

    if (isWordpress) {
      const sizeUrl = dataSizes?.[s]

      if (isStringStrict(sizeUrl)) {
        srcsetSource.push(`${sizeUrl} ${s}w`)
      }
    }
  })

  /* Output */

  let sourceOutput = ''

  if (picture) {
    sourceOutput = `<source srcset="${srcsetSource.join(', ')}" sizes="${sizesValue}" type="image/${format}">`
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
      sizes="${sizesValue}"
      width="${w}"
      height="${h}"
      ${isStringStrict(attr) ? ` ${attr}` : ''}
      ${lazy ? ' loading="lazy" decoding="async"' : ' loading="eager" fetchpriority="high"'}
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
      sizes: sizesValue
    } as ImageReturnType<V>
  }

  return output as ImageReturnType<V>
}

/**
 * Closest value in config sizes.
 *
 * @param {number} size
 * @param {number[]} [sizes]
 * @return {number}
 */
const getImageClosestSize = (size: number, sizes: number[] = []): number => {
  if (!sizes.length) {
    sizes = config.image.sizes
  }

  return [...sizes].reduce((prev, curr) => {
    return Math.abs(curr - size) <= Math.abs(prev - size) ? curr : prev
  })
}

/**
 * Calculate sizes from column and container parents.
 *
 * @param {ImageSizesArgs} args
 * @return {ImageSizesReturn}
 */
const getImageSizes = (args: ImageSizesArgs): ImageSizesReturn => {
  /* Fallback */

  const fallback = {
    maxWidth: 0,
    sizes: ''
  }

  /* Args required */

  if (!isObjectStrict(args)) {
    return fallback
  }

  const {
    parents,
    widths,
    maxWidths,
    breakpoints,
    source = config.source,
    viewportWidth = 100
  } = args

  /* Parents, widths, max widths and breakpoints required */

  const required =
    isArrayStrict(parents) &&
    isObjectStrict(widths) &&
    isObjectStrict(maxWidths) &&
    isArrayStrict(breakpoints)

  if (!required) {
    return fallback
  }

  /* Container width */

  let containerWidth = 0

  /* Column widths as floats */

  const columnWidths: number[] = []

  let col = 1
  let colSmall = 1
  let colMedium = 1
  let colLarge = 1

  /* Width strings to numbers */

  parents.forEach(parent => {
    if (!isObjectStrict(parent)) {
      return
    }

    const { renderType, args } = parent as ImageSizesParentsArgs

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

      const base = (isNumber(widths[width]) && widths[width] ? widths[width] : 1)
      const baseSmall = isNumber(widths[widthSmall]) && widths[widthSmall] ? widths[widthSmall] : base
      const baseMedium = isNumber(widths[widthMedium]) && widths[widthMedium] ? widths[widthMedium] : baseSmall
      const baseLarge = isNumber(widths[widthLarge]) && widths[widthLarge] ? widths[widthLarge] : baseMedium

      col *= base
      colSmall *= baseSmall
      colMedium *= baseMedium
      colLarge *= baseLarge

      columnWidths[0] = col
      columnWidths[1] = colSmall
      columnWidths[2] = colMedium
      columnWidths[3] = colLarge
    }

    if (renderType === 'container') {
      const { maxWidth = 'Default' } = args

      if (isNumber(maxWidths[maxWidth])) {
        containerWidth = maxWidths[maxWidth]
      }
    }
  })

  const columnWidthsLen = columnWidths.length
  const hasContainerWidth = !!containerWidth

  if (!columnWidthsLen && !hasContainerWidth) {
    return fallback
  }

  /* Convert to fixed widths and determine sizes */

  const breakpointsLen = breakpoints.length
  const maxWidthArr: number[] = []
  const sizesArr: string[] = []
  const sizeFactor = viewportWidth / 100

  let lastWidth = 1
  let lastBreakpoint = 0
  let lastSize = ''
  let containerWidthAdded = false

  for (let i = 0; i < breakpointsLen; i += 1) {
    const breakpoint = breakpoints[i] as number
    const width = columnWidths[i]

    if (!isNumber(width)) {
      continue
    }

    const gteContainerWidth = hasContainerWidth && breakpoint >= containerWidth
    const breakpointWidth = Math.round(width * (gteContainerWidth ? containerWidth : breakpoint))
    const sizeWidth = gteContainerWidth ? breakpointWidth / 16 : ((width * 100) * sizeFactor)
    const size = gteContainerWidth ? `${sizeWidth}rem` : `${sizeWidth % 1 === 0 ? sizeWidth : sizeWidth.toFixed(2)}vw`

    if (hasContainerWidth && containerWidth > lastBreakpoint && containerWidth < breakpoint) {
      const relMaxWidth = Math.round(lastWidth * containerWidth)
      const relSize = `${relMaxWidth / 16}rem`

      maxWidthArr.push(relMaxWidth)
      sizesArr.push(`(min-width: ${containerWidth / 16}rem) ${relSize}`)

      containerWidthAdded = true
      lastSize = relSize
    }

    maxWidthArr.push(breakpointWidth)

    if (lastSize !== size) {
      sizesArr.push(breakpoint ? `(min-width: ${breakpoint / 16}rem) ${size}` : size)
    }

    lastWidth = width
    lastBreakpoint = breakpoint
    lastSize = size
  }

  if (!containerWidthAdded && hasContainerWidth && containerWidth > lastBreakpoint) {
    const relMaxWidth = Math.round(lastWidth * containerWidth)
    const relSize = `${relMaxWidth / 16}rem`

    maxWidthArr.push(relMaxWidth)
    sizesArr.push(`(min-width: ${containerWidth / 16}rem) ${relSize}`)
  }

  /* Output */

  const maxWidth = Math.max(...maxWidthArr) * 2

  if (!columnWidthsLen || (col === 1 && colSmall === 1 && colMedium === 1 && colLarge === 1)) {
    const sizeWidth = `${(maxWidth / 32)}rem`

    sizesArr[0] = `${viewportWidth}vw`
    sizesArr[1] = `(min-width: ${sizeWidth}) ${sizeWidth}`
  }

  const sizes = sizesArr.reverse().join(', ')

  if (source === 'local') {
    return {
      maxWidth: getImageClosestSize(maxWidth),
      sizes
    }
  }

  return {
    maxWidth,
    sizes
  }
}

/* Exports */

export {
  getImage,
  getImageClosestSize,
  getImageSizes
}
