/**
 * Local - Data Normal
 */

/* Imports */

import type { LocalData, LocalDataItem } from './localDataTypes.js'
import type { RenderItem } from '../render/renderTypes.js'
import { isObject, isObjectStrict } from '../utils/object/object.js'
import { isArray, isArrayStrict } from '../utils/array/array.js'
import { isStringStrict } from '../utils/string/string.js'
import { getStoreItem } from '../store/store.js'
import { StoreImageMeta } from '../store/storeTypes.js'

/**
 * Link object and image references
 *
 * @param {LocalDataItem} data
 * @param {LocalData} refData
 * @param {StoreImageMeta} imageData
 * @param {string[]} [refProps=['internalLink', 'term', 'taxonomy']]
 * @param {string[]} [imageProps=['image']]
 * @param {string[]} [unsetProps=['content']]
 * @param {string} [contentType]
 * @return {LocalDataItem}
 */
const normalizeLocalRefs = (
  data: LocalDataItem,
  refData: LocalData,
  imageData: StoreImageMeta,
  refProps: string[] = ['internalLink', 'term', 'taxonomy'],
  imageProps: string[] = ['image'],
  unsetProps: string[] = ['content'],
  contentType?: string
): LocalDataItem => {
  const newData = isArray(data) ? [] : {} as LocalDataItem
  const isTemplate = data.renderType === 'contentTemplate'
  const isNavigation = contentType === 'navigation'
  const isNavigationItem = contentType === 'navigationItem'

  for (const [key, value] of Object.entries(data)) {
    const isRef = refProps.includes(key)
    const isImage = imageProps.includes(key)
    const isStr = isStringStrict(value)
    const isArr = isArrayStrict(value)

    let newValue = value

    if (isTemplate && key === 'content' && isArr) {
      newValue = value.map(item => {
        if (!isStringStrict(item)) {
          return item
        }

        const ref = refData[item]

        if (isObjectStrict(ref)) {
          return { ...ref }
        }
      })
    }

    if (((isNavigation && key === 'items') || (isNavigationItem && key === 'children')) && isArr) {
      newValue = value.map(id => {
        if (!isStringStrict(id)) {
          return null
        }

        return {
          id,
          title: refData[id]?.title
        }
      }).filter(Boolean)
    }

    if (isImage && isStr) {
      newValue = imageData[value] ? { ...imageData[value] } : null
    }

    if (isRef && isStr) {
      const ref = refData[value]

      if (isArrayStrict(ref)) {
        newValue = [...ref]
      }

      if (isObjectStrict(ref)) {
        newValue = { ...ref }

        unsetProps.forEach(prop => {
          if ((newValue as LocalDataItem)[prop]) {
            (newValue as LocalDataItem)[prop] = undefined
          }
        })
      }
    }

    if (isRef && isArrayStrict(value)) {
      newValue = value.map(refKey => {
        if (!isStringStrict(refKey)) {
          return null
        }

        const ref = refData[refKey]

        if (isObjectStrict(ref)) {
          const newRef = { ...ref }

          unsetProps.forEach(prop => {
            if ((newRef as LocalDataItem)[prop]) {
              (newRef as LocalDataItem)[prop] = undefined
            }
          })
        }

        return ref
      }).filter(Boolean)
    }

    if (isObject(newValue)) {
      newValue = normalizeLocalRefs(
        newValue as RenderItem,
        refData,
        imageData,
        refProps,
        imageProps,
        unsetProps
      )
    }

    (newData as LocalDataItem)[key] = newValue
  }

  return newData as LocalDataItem
}

/**
 * Transform and link local data
 *
 * @param {LocalData} data
 * @param {string[]} [refProps]
 * @param {string[]} [imageProps]
 * @param {string[]} [unsetProps]
 * @return {LocalData}
 */
const normalizeLocalData = (
  data: LocalData,
  refProps?: string[],
  imageProps?: string[],
  unsetProps?: string[]
): LocalData => {
  /* Transformed data */

  const newData: LocalData = {}

  /* Image data */

  const imageMeta = getStoreItem('imageMeta')

  /* Items */

  for (const [key, item] of Object.entries(data)) {
    if (!isObjectStrict(item)) {
      continue
    }

    newData[key] = normalizeLocalRefs(
      item,
      data,
      imageMeta,
      refProps,
      imageProps,
      unsetProps,
      item.contentType
    )
  }

  /* Result */

  return newData
}

/* Exports */

export { normalizeLocalData }
