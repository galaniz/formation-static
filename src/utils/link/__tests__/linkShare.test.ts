/**
 * Utils - Link Share Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { getShareLinks } from '../linkShare.js'

/* Tests */

describe('getShareLinks()', () => {
  it('should return empty array if no url or platforms provided', () => {
    // @ts-expect-error
    const result = getShareLinks()
    const expectedResult = []

    expect(result).toEqual(expectedResult)
  })

  it('should return share links for all platforms', () => {
    const result = getShareLinks('https://test.com/post/', [
      'Email',
      'Facebook',
      'X',
      'LinkedIn',
      'Pinterest',
      'Reddit'
    ])

    const expectedResult = [
      {
        type: 'Email',
        link: 'mailto:?subject=Check%20out%20this%20article&body=https://test.com/post/'
      },
      {
        type: 'Facebook',
        link: 'https://www.facebook.com/sharer.php?u=https://test.com/post/'
      },
      {
        type: 'X',
        link: 'https://twitter.com/intent/tweet?url=https://test.com/post/'
      },
      {
        type: 'LinkedIn',
        link: 'https://www.linkedin.com/shareArticle?url=https://test.com/post/'
      },
      {
        type: 'Pinterest',
        link: 'https://pinterest.com/pin/create/button/?url=https://test.com/post/'
      },
      {
        type: 'Reddit',
        link: 'https://reddit.com/submit?url=https://test.com/post/'
      }
    ]

    expect(result).toEqual(expectedResult)
  })

  it('should return share link for email with title provided', () => {
    const result = getShareLinks('https://test.com/post/', ['Email'], 'Title')
    const expectedResult = [
      {
        type: 'Email',
        link: 'mailto:?subject=Title&body=https://test.com/post/'
      }
    ]

    expect(result).toEqual(expectedResult)
  })
})
