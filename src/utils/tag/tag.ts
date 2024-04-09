/**
 * Utils - Tag
 */

/* Imports */

import type { Tag, TagGetReturn } from './tagTypes'
import { isObjectStrict } from '../isObject/isObject'
import { isStringStrict } from '../isString/isString'
import { isArrayStrict } from '../isArray/isArray'

/**
 * Easier access to tag info
 *
 * @type {import('./tagTypes').Tag}
 */
const tag: Tag = {
  get (obj, id) {
    if (!isObjectStrict(obj) || !isStringStrict(id)) {
      return
    }

    const tags = obj.metadata?.tags

    if (!isArrayStrict(tags)) {
      return
    }

    let tagInfo: TagGetReturn | undefined

    tags.find((tag) => {
      if (!isObjectStrict(tag)) {
        return false
      }

      const tagId = tag.id

      if (tagId === id) {
        tagInfo = {
          id: tagId,
          name: isStringStrict(tag.name) ? tag.name : ''
        }

        return true
      }

      return false
    })

    return tagInfo
  },
  exists (obj, id) {
    const res = tag.get(obj, id)

    return res !== undefined
  }
}

/* Exports */

export { tag }
