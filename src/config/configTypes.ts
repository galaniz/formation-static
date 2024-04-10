/**
 * Config - Types
 */

/* Imports */

import type { Generic, GenericFunctions, GenericStrings, GenericNumbers, SlugBase } from '../global/globalTypes'
import type { Navigation, NavigationItem } from '../components/Navigation/NavigationTypes'
import type { RenderItem } from '../render/renderTypes'
import type { Filters } from '../utils/filters/filtersTypes'
import type { Actions } from '../utils/actions/actionsTypes'
import type { Shortcodes } from '../utils/shortcodes/shortcodesTypes'

/**
 * @typedef {object} ConfigMeta
 * @prop {string} description
 * @prop {string} image
 */
export interface ConfigMeta {
  description: string
  image: string
}

/**
 * @typedef {object} ConfigSlugParent
 * @prop {string} id
 * @prop {string} slug
 * @prop {string} title
 * @prop {string} contentType
 */
export interface ConfigSlugParent {
  id: string
  slug: string
  title: string
  contentType: string
}

/**
 * @typedef {Object.<string, ConfigSlugParent>} ConfigSlugParents
 */
export interface ConfigSlugParents {
  [key: string]: ConfigSlugParent
}

/**
 * @typedef {object} ConfigSlugArchive
 * @prop {string} slug
 * @prop {string} title
 * @prop {string} contentType
 */

/**
 * @typedef {Object.<string, ConfigSlugArchive>} ConfigSlugArchives
 */
export interface ConfigSlugArchives {
  [key: string]: Omit<ConfigSlugParent, 'id'>
}

/**
 * @typedef {object} ConfigSlug
 * @prop {ConfigSlugParents} parents
 * @prop {ConfigSlugArchives} archives
 * @prop {Object.<string, import('../global/globalTypes').SlugBase>} bases
 * @prop {import('../global/globalTypes').SlugBase} bases.page
 */
export interface ConfigSlug {
  parents: ConfigSlugParents
  archives: ConfigSlugArchives
  bases: {
    page: SlugBase
    [key: string]: SlugBase
  }
}

/**
 * @typedef {object} ConfigContentTypesArchive
 * @prop {string} singular
 * @prop {string} plural
 * @prop {string} [layout]
 * @prop {string} [order]
 * @prop {number} [display]
 * @prop {string[]} [linkContentType]
 * @prop {import('../global/globalTypes').Generic} id
 */
export interface ConfigContentTypesArchive {
  singular: string
  plural: string
  layout?: string
  order?: string
  display?: number
  linkContentType?: string[]
  id: Generic
}

/**
 * @typedef {Object.<string, ConfigContentTypesArchive>} ConfigContentTypesArchives
 */
export interface ConfigContentTypesArchives {
  [key: string]: ConfigContentTypesArchive
}

/**
 * @typedef {object} ConfigContentTypesTaxonomy
 * @prop {string[]} contentTypes
 * @prop {string[]} props
 */
export interface ConfigContentTypesTaxonomy {
  contentTypes: string[]
  props: string[]
}

/**
 * @typedef {Object.<string, ConfigContentTypesTaxonomy>} ConfigContentTypesTaxonomies
 */
export interface ConfigContentTypesTaxonomies {
  [key: string]: ConfigContentTypesTaxonomy
}

/**
 * @typedef {object} ConfigContentTypes
 * @prop {string[]} partial
 * @prop {string[]} whole
 * @prop {ConfigContentTypesArchives} archive
 * @prop {ConfigContentTypesTaxonomies} taxonomy
 */
export interface ConfigContentTypes {
  partial: string[]
  whole: string[]
  archive: ConfigContentTypesArchives
  taxonomy: ConfigContentTypesTaxonomies
}

/**
 * @typedef {object} ConfigImage
 * @prop {string} url
 * @prop {number[]} sizes
 * @prop {number} quality
 */
export interface ConfigImage {
  url: string
  sizes: number[]
  quality: number
}

/**
 * @typedef {object} ConfigFormMetaItem
 * @prop {string} [toEmail]
 * @prop {string} [senderEmail]
 * @prop {string} [subject]
 */
export interface ConfigFormMetaItem {
  toEmail?: string
  senderEmail?: string
  subject?: string
}

/**
 * @typedef {Object.<string, ConfigFormMetaItem>} ConfigFormMeta
 */
export interface ConfigFormMeta {
  [key: string]: ConfigFormMetaItem
}

/**
 * @typedef {Object.<string, GenericStrings>} ConfigArchiveIds
 */
export interface ConfigArchiveIds {
  [key: string]: GenericStrings
}

/**
 * @typedef {Object.<string, import('../render/RenderTypes').RenderItem[]>} ConfigArchivePosts
 */
export interface ConfigArchivePosts {
  [key: string]: RenderItem[]
}

/**
 * @typedef {Object.<string, *>} ConfigTerms
 */
export interface ConfigTerms {
  [key: string]: {
    [key: string]: {
      [key: string]: RenderItem[]
    }
  }
}

/**
 * @typedef {object} ConfigArchive
 * @prop {ConfigArchiveIds} ids
 * @prop {ConfigArchivePosts} posts
 * @prop {ConfigTerms} terms
 */
export interface ConfigArchive {
  ids: ConfigArchiveIds
  posts: ConfigArchivePosts
  terms: ConfigTerms
}

/**
 * @typedef {object} ConfigEnv
 * @prop {boolean} dev
 * @prop {boolean} prod
 * @prop {boolean} build
 * @prop {boolean} cache
 * @prop {string} dir
 * @prop {Object<string, string>} urls
 * @prop {string} urls.dev
 * @prop {string} urls.prod
 */
export interface ConfigEnv {
  dev: boolean
  prod: boolean
  build: boolean
  cache: boolean
  dir: string
  urls: {
    dev: string
    prod: string
  }
}

/**
 * @typedef {object} ConfigStoreFile
 * @prop {string} data
 * @prop {string} name
 */
export interface ConfigStoreFile {
  data: string
  name: string
}

/**
 * @typedef {object} ConfigStore
 * @prop {string} dir
 * @prop {Object.<string, ConfigStoreFile>} files
 * @prop {ConfigStoreFile} files.slugs
 * @prop {ConfigStoreFile} files.slugParents
 * @prop {ConfigStoreFile} files.navigations
 */
export interface ConfigStore {
  dir: string
  files: {
    slugs: ConfigStoreFile
    slugArchives: ConfigStoreFile
    slugParents: ConfigStoreFile
    navigations: ConfigStoreFile
    [key: string]: ConfigStoreFile
  }
}

/**
 * @typedef {object} ConfigServerlessRoute
 * @prop {string} path
 * @prop {string} [content]
 */
export interface ConfigServerlessRoute {
  path: string
  content?: string
}

/**
 * @typedef {object} ConfigServerlessFiles
 * @prop {string} ajax
 * @prop {string} preview
 * @prop {string} reload
 */
export interface ConfigServerlessFiles {
  ajax: string
  preview: string
  reload: string
}

/**
 * @typedef {object} ConfigServerless
 * @prop {string} dir
 * @prop {ConfigServerlessFiles} files
 * @prop {Object.<string, ConfigServerlessRoute[]>} routes
 * @prop {ConfigServerlessRoute[]} routes.reload
 */
export interface ConfigServerless {
  dir: string
  files: ConfigServerlessFiles
  routes: {
    reload: ConfigServerlessRoute[]
    [key: string]: ConfigServerlessRoute[]
  }
}

/**
 * @typedef {object} ConfigRedirects
 * @prop {string} file
 * @prop {string[]} data
 */
export interface ConfigRedirects {
  file: string
  data: string[]
}

/**
 * @typedef {object} ConfigCms
 * @prop {string} name
 * @prop {string} space
 * @prop {string} previewAccessToken
 * @prop {string} previewHost
 * @prop {string} deliveryAccessToken
 * @prop {string} deliveryHost
 */
export interface ConfigCms {
  name: string
  space: string
  previewAccessToken: string
  previewHost: string
  deliveryAccessToken: string
  deliveryHost: string
}

/**
 * @typedef {object} ConfigStatic
 * @prop {string} dir
 * @prop {Object.<string, string>} image
 * @prop {string} image.inputDir
 * @prop {string} image.outputDir
 * @prop {string} image.dataFile
 */
export interface ConfigStatic {
  dir: string
  image: {
    inputDir: string
    outputDir: string
    dataFile: string
  }
}

/**
 * @typedef {object} ConfigScriptsStyles
 * @prop {import('../global/globalTypes').GenericNumbers} item
 * @prop {import('../global/globalTypes').GenericStrings} build
 */
export interface ConfigScriptsStyles {
  item: GenericNumbers
  build: GenericStrings
}

/**
 * @typedef {object} ConfigApiKeys
 * @prop {string} smtp2go
 */
export interface ConfigApiKeys {
  smtp2go: string
}

/**
 * @typedef {object} ConfigConsole
 * @prop {string} green
 * @prop {string} red
 */
export interface ConfigConsole {
  green: string
  red: string
}

/**
 * @typedef {import('../global/globalTypes').GenericStrings|NodeJS.Process['env']} ConfigEnvArg
 */
export type ConfigEnvArg = GenericStrings | NodeJS.Process['env']

/**
 * @typedef {function} ConfigFilter
 * @param {Config} config
 * @param {ConfigEnvArg} env
 * @return {Promise<Config>}
 */
export type ConfigFilter = (config: Config, env: ConfigEnvArg) => Promise<Config>

/**
 * @typedef {object} ConfigBase
 * @prop {string} namespace
 * @prop {string} source
 * @prop {string} title
 * @prop {ConfigMeta} meta
 * @prop {ConfigSlug} slug
 * @prop {ConfigContentTypes} contentTypes
 * @prop {import('../global/globalTypes').GenericStrings} renderTypes
 * @prop {import('../global/globalTypes').GenericFunctions} renderFunctions
 */
export interface ConfigBase {
  namespace: string
  source: string
  title: string
  meta: ConfigMeta
  slug: ConfigSlug
  contentTypes: ConfigContentTypes
  renderTypes: GenericStrings
  renderFunctions: GenericFunctions
}

/**
 * @typedef Config
 * @type {ConfigBase}
 * @prop {import('../global/globalTypes').GenericFunctions} ajaxFunctions
 * @prop {import('../utils/actions/actionsTypes').Actions} actions
 * @prop {import('../utils/filters/filtersTypes').Filters} filters
 * @prop {import('../utils/shortcodes/shortcodesTypes').Shortcodes} shortcodes
 * @prop {ConfigImage} image
 * @prop {import('../components/Navigation/NavigationTypes').Navigation[]} navigation
 * @prop {import('../components/Navigation/NavigationTypes').NavigationItem[]} navigationItem
 * @prop {import('../global/globalTypes').Generic} scriptMeta
 * @prop {import('../global/globalTypes').Generic} formMeta
 * @prop {ConfigArchive} archive
 * @prop {ConfigEnv} env
 * @prop {ConfigStore} store
 * @prop {ConfigServerless} serverless
 * @prop {ConfigRedirects} redirects
 * @prop {ConfigCms} cms
 * @prop {ConfigStatic} static
 * @prop {ConfigScriptsStyles} styles
 * @prop {ConfigScriptsStyles} scripts
 * @prop {ConfigApiKeys} apiKeys
 * @prop {ConfigConsole} console
 */
export interface Config extends ConfigBase {
  ajaxFunctions: GenericFunctions
  actions: Partial<Actions>
  filters: Partial<Filters>
  filter?: ConfigFilter
  shortcodes: Shortcodes
  image: ConfigImage
  navigation: Navigation[]
  navigationItem: NavigationItem[]
  scriptMeta: Generic
  formMeta: Generic
  archive: ConfigArchive
  env: ConfigEnv
  store: ConfigStore
  serverless: ConfigServerless
  redirects: ConfigRedirects
  cms: ConfigCms
  static: ConfigStatic
  styles: ConfigScriptsStyles
  scripts: ConfigScriptsStyles
  apiKeys: ConfigApiKeys
  console: ConfigConsole
}

/**
 * @typedef ConfigArgs
 * @type {ConfigBase}
 * @prop {import('../global/globalTypes').GenericFunctions} [ajaxFunctions]
 * @prop {import('../global/globalTypes').GenericFunctions} [actions]
 * @prop {import('../utils/filters/filtersTypes').Filters} [filters]
 * @prop {import('../utils/shortcodes/shortcodesTypes').Shortcodes} [shortcodes]
 * @prop {ConfigImage} [image]
 * @prop {import('../global/globalTypes').Generic} [scriptMeta]
 * @prop {import('../global/globalTypes').Generic} [formMeta]
 * @prop {ConfigArchive} [archive]
 * @prop {ConfigEnv} [env]
 * @prop {ConfigStore} [store]
 * @prop {ConfigServerless} [serverless]
 * @prop {ConfigRedirects} [redirects]
 * @prop {ConfigCms} [cms]
 * @prop {ConfigStatic} [static]
 * @prop {ConfigScriptsStyles} [styles]
 * @prop {ConfigScriptsStyles} [scripts]
 * @prop {ConfigApiKeys} [apiKeys]
 */
export type ConfigArgs = Partial<Config>

/**
 * @typedef {function} ConfigSet
 * @param {import('./configTypes').ConfigArgs} args
 * @return {import('./configTypes').Config}
 */
export type ConfigSet = (args: ConfigArgs) => Config

/**
 * @typedef {function} ConfigSetFilter
 * @param {ConfigEnvArg} env
 * @return {Promise<void>}
 */
export type ConfigSetFilter = (env: ConfigEnvArg) => Promise<void>
