/**
 * Utils
 *
 * Note - Modules with minimal file system/external dependencies
 */

export { setConfigFilter } from '../config/config'
export { addAction, removeAction, doActions, resetActions, setActions } from './actions/actions'
export { addScriptStyle } from './addScriptStyle/addScriptStyle'
export { escape } from './escape/escape'
export { addFilter, removeFilter, applyFilters, resetFilters, setFilters } from './filters/filters'
export { getArchiveInfo } from './getArchiveInfo/getArchiveInfo'
export { getArchiveLink } from './getArchiveLink/getArchiveLink'
export { getTaxonomyInfo } from './getTaxonomyInfo/getTaxonomyInfo'
export { getContentTypeLabels } from './getContentTypeLabels/getContentTypeLabels'
export { getDuration } from './getDuration/getDuration'
export { getImage, getImageClosestSize, getImageMaxWidth } from './getImage/getImage'
export { getLink } from './getLink/getLink'
export { getPathDepth } from './getPathDepth/getPathDepth'
export { getPath } from './getPath/getPath'
export { getPermalink } from './getPermalink/getPermalink'
export { getSlug } from './getSlug/getSlug'
export { getYear } from './getYear/getYear'
export { getObjectKeys } from './getObjectKeys/getObjectKeys'
export { getJson, getJsonFile } from './getJson/getJson'
export { getExcerpt } from './getExcerpt/getExcerpt'
export { getShareLinks } from './getShareLinks/getShareLinks'
export { dataSource } from './dataSource/dataSource'
export { isArray, isArrayStrict } from './isArray/isArray'
export { isObject, isObjectStrict } from './isObject/isObject'
export { isString, isStringStrict } from './isString/isString'
export { isNumber } from './isNumber/isNumber'
export { isFunction } from './isFunction/isFunction'
export { isBoolean } from './isBoolean/isBoolean'
export { isHeading } from './isHeading/isHeading'
export { normalizeContentType } from './normalizeContentType/normalizeContentType'
export { normalizeContentfulData } from './normalizeContentfulData/normalizeContentfulData'
export { resolveInternalLinks } from './resolveInternalLinks/resolveInternalLinks'
export { undefineProps } from './undefineProps/undefineProps'
export { getTag, tagExists } from './tag/tag'
export {
  addShortcode,
  removeShortcode,
  doShortcodes,
  resetShortcodes,
  setShortcodes,
  stripShortcodes
} from './shortcodes/shortcodes'
