/**
 * Utils - Link Share
 */

/* Imports */

import type { LinkShare, LinkShareReturn } from './linkTypes.js'
import { isStringStrict } from '../string/string.js'
import { isArrayStrict } from '../array/array.js'

/**
 * Start of share links by platform
 *
 * @type {LinkShare}
 */
const shareLinks: LinkShare = {
  Facebook: 'https://www.facebook.com/sharer.php?u=',
  X: 'https://twitter.com/intent/tweet?url=',
  LinkedIn: 'https://www.linkedin.com/shareArticle?url=',
  Pinterest: 'https://pinterest.com/pin/create/button/?url=',
  Reddit: 'https://reddit.com/submit?url=',
  Email: ''
}

/**
 * Get social share links
 *
 * @param {string} url
 * @param {string[]} platforms
 * @return {ShareLinksReturn[]}
 */
const getShareLinks = (
  url: string,
  platforms: Array<keyof LinkShare>,
  title?: string
): LinkShareReturn[] => {
  if (!isStringStrict(url) || !isArrayStrict(platforms)) {
    return []
  }

  return platforms.map((platform) => {
    const platformLink = shareLinks[platform]

    let link = isStringStrict(platformLink) ? `${platformLink}${url}` : ''

    if (platform === 'Email') {
      link = `mailto:?subject=${encodeURIComponent(isStringStrict(title) ? title : 'Check out this article')}&body=${url}`
    }

    return {
      type: platform,
      link
    }
  })
}

/* Exports */

export { getShareLinks }
