/**
 * Utils - Tag
 */

/* Imports */

import type { TagGet, TagExists, TagGetReturn } from './tagTypes'
import { isObjectStrict } from '../isObject/isObject'
import { isStringStrict } from '../isString/isString'
import { isArrayStrict } from '../isArray/isArray'

/**
 * Function - get data from metadata object
 *
 * @type {import('./tagTypes').TagGet}
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
 * Function - check if tag exists in metadata object
 *
 * @type {import('./tagTypes').TagExists}
 */
const tagExists: TagExists = (obj, id) => {
  const res = getTag(obj, id)

  return res !== undefined
}

/* Exports */

export { getTag, tagExists }
