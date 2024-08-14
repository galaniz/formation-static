/**
 * Utils - Tag
 */

/* Imports */

import type { TagGet, TagExists, TagGetReturn } from './tagTypes.js'
import { isObjectStrict } from '../object/object.js'
import { isStringStrict } from '../string/string.js'
import { isArrayStrict } from '../array/array.js'

/**
 * Get data from metadata object
 *
 * @type {TagGet}
 */
const getTag: TagGet = (obj, id) => {
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
}

/**
 * Check if tag exists in metadata object
 *
 * @type {TagExists}
 */
const tagExists: TagExists = (obj, id) => {
  const res = getTag(obj, id)

  return res !== undefined
}

/* Exports */

export {
  getTag,
  tagExists
}
