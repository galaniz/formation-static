/**
 * Redirects - File
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
 * @return {void}
 */
const setRedirectsData = (data?: RenderRedirect[]): void => {
  if (!isArrayStrict(data)) {
    return
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
}

/* Exports */

export {
  redirects,
  setRedirectsData
}
