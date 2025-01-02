/**
 * Redirects
 */

/* Imports */

import type { RenderRedirect } from '../render/renderTypes.js'
import { isArrayStrict } from '../utils/array/array.js'
import { isObjectStrict } from '../utils/object/object.js'

/**
 * Redirects data
 *
 * @type {string[]}
 */
let redirects: string[] = []

/**
 * Set redirects with normalized data
 *
 * @param {RenderRedirect[]} data
 * @return {boolean}
 */
const setRedirects = (data?: RenderRedirect[]): boolean => {
  if (!isArrayStrict(data)) {
    return false
  }

  redirects = []

  data.forEach((item) => {
    if (!isObjectStrict(item)) {
      return
    }

    const { redirect } = item

    if (!isArrayStrict(redirect)) {
      return
    }

    redirects = redirects.concat(redirect)
  })

  return redirects.length > 1
}

/* Exports */

export {
  redirects,
  setRedirects
}
