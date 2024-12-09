/**
 * Utils - Archive Types
 */

/**
 * @typedef {object} ArchiveInfo
 * @prop {string} id
 * @prop {string} slug
 * @prop {string} title
 * @prop {string} contentType
 */
export interface ArchiveInfo {
  id: string
  slug: string
  title: string
  contentType: string
}

/**
 * @typedef {object} ArchiveLinkReturn
 * @prop {string} title
 * @prop {string} link
 */
export interface ArchiveLinkReturn {
  title: string
  link: string
}
