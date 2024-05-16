/**
 * Utils - Get Image
 */

/* Imports */

import type { ImageArgs, ImageReturn } from './getImageTypes'
import { config } from '../../config/config'
import { isString, isStringStrict } from '../isString/isString'
import { isNumber } from '../isNumber/isNumber'
import { isObjectStrict } from '../isObject/isObject'
import { dataSource } from '../dataSource/dataSource'

/**
 * Function - get responsive image output
 *
 * @param {import('./getImageTypes').ImageArgs} args
 * @return {import('./getImageTypes').ImageReturn|string}
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

  let {
    url = ''
  } = data

  /* Static url */

  if (source === 'static' && isStringStrict(path)) {
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
  } else {
    const common = `&q=${quality}&w=${w}&h=${h}`

    src = `${url}?fm=webp${common}`
    srcFallback = `${url}?fm=${format}${common}`
  }

  const sizes = `(min-width: ${w / 16}rem) ${w / 16}rem, ${viewportWidth}vw`
  const srcsetFallback: string[] = []

  let srcset: string[] | number[] = [...config.image.sizes]

  if (!srcset.includes(w)) {
    srcset.push(w)
  }

  srcset = srcset.filter(s => s <= w)

  srcset.sort((a, b) => a - b)

  srcset = srcset.map(s => {
    if (source === 'static') {
      const common = `${url}${s !== naturalWidth ? `@${s}` : ''}`

      srcsetFallback.push(`${common}.${format} ${s}w`)

      return `${common}.webp ${s}w`
    } else {
      const common = `&q=${quality}&w=${s}&h=${Math.round(s * aspectRatio)} ${s}w`

      srcsetFallback.push(`${url}?fm=${format}${common}`)

      return `${url}?fm=webp${common}`
    }
  })

  /* Output */

  let sourceOutput = ''

  if (picture) {
    sourceOutput = `<source srcset="${srcset.join(', ')}" sizes="${sizes}" type="image/webp">`
  }

  let eagerHackOutput = ''

  if (!lazy) {
    eagerHackOutput = `<img alt="" role="presentation" aria-hidden="true" src="data:image/svg+xml;charset=utf-8,%3Csvg height='${h}' width='${w}' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E" style="pointerEvents: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%">`
  }

  const output = `
    ${eagerHackOutput}
    ${sourceOutput}
    <img${classes !== '' ? ` class="${classes}"` : ''} alt="${alt}" src="${picture ? srcFallback : src}" srcset="${picture ? srcsetFallback.join(', ') : srcset.join(', ')}" sizes="${sizes}" width="${w}" height="${h}"${attr !== '' ? ` ${attr}` : ''}${lazy ? ' loading="lazy" decoding="async"' : ' loading="eager"'}>
  `

  if (returnDetails) {
    return {
      output,
      aspectRatio,
      naturalWidth,
      naturalHeight,
      src,
      srcFallback,
      srcset,
      sizes
    }
  }

  return output
}

/* Exports */

export { getImage }
