/**
 * Config - Types
 */

/* Imports */

import type { Generic, GenericFunctions, GenericStrings } from '../global/globalTypes.js'
import type { Navigation, NavigationItem } from '../components/Navigation/NavigationTypes.js'
import type { RenderFunctions, RenderItem } from '../render/renderTypes.js'
import type { Filters } from '../utils/filters/filtersTypes.js'
import type { Actions } from '../utils/actions/actionsTypes.js'
import type { Shortcodes } from '../utils/shortcodes/shortcodesTypes.js'
import type { FormMessages, FormMeta } from '../objects/Form/FormTypes.js'

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
 * @typedef {object} ConfigParent
 * @prop {string} id
 * @prop {string} slug
 * @prop {string} title
 * @prop {string} contentType
 */
export interface ConfigParent {
  id: string
  slug: string
  title: string
  contentType: string
}

/**
 * @typedef {Object.<string, ConfigParent>} ConfigParents
 */
export interface ConfigParents {
  [key: string]: ConfigParent
}

/**
 * @typedef {object} ConfigArchiveMetaItem
 * @prop {string} [id]
 * @prop {string} [slug]
 * @prop {string} [title]
 * @prop {string} [singular]
 * @prop {string} [plural]
 * @prop {string} [layout]
 * @prop {string} [order]
 * @prop {number} [display]
 */
export interface ConfigArchiveMetaItem {
  id?: string
  slug?: string
  title?: string
  singular?: string
  plural?: string
  layout?: string
  order?: string
  display?: number
}

/**
 * @typedef {Object.<string, ConfigArchiveMetaItem>} ConfigArchiveMeta
 */
export interface ConfigArchiveMeta {
  [key: string]: ConfigArchiveMetaItem
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
 * @typedef {Object.<string, FormMeta>} ConfigFormMeta
 */
export interface ConfigFormMeta {
  [key: string]: FormMeta
}

/**
 * @typedef {Object.<string, RenderItem>} ConfigStaticPosts
 */
export interface ConfigStaticPosts {
  [key: string]: RenderItem
}

/**
 * @typedef {Object.<string, string[]>} ConfigStaticPostsIndex
 */
export interface ConfigStaticPostsIndex {
  [key: string]: string[]
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
 * @typedef ConfigScriptMeta
 * @type {Generic}
 * @prop {string} [sendUrl]
 * @prop {Object.<string, FormMessages>} [forms]
 */
export interface ConfigScriptMeta extends Generic {
  sendUrl?: string
  forms?: {
    [key: string]: FormMessages
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
 * @prop {ConfigStoreFile} files.parents
 * @prop {ConfigStoreFile} files.navigations
 * @prop {ConfigStoreFile} files.navigationItems
 */
export interface ConfigStore {
  dir: string
  files: {
    slugs: ConfigStoreFile
    parents: ConfigStoreFile
    navigations: ConfigStoreFile
    navigationItems: ConfigStoreFile
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
 * @prop {string} prodUser
 * @prop {string} prodCredential
 * @prop {string} prodHost
 * @prop {string} devUser
 * @prop {string} devCredential
 * @prop {string} devHost
 */
export interface ConfigCms {
  name: string
  space: string
  prodUser: string
  prodCredential: string
  prodHost: string
  devUser: string
  devCredential: string
  devHost: string
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
 * @prop {string} inputDir
 * @prop {string} outputDir
 * @prop {Map.<string, Set<string>>} deps
 * @prop {Map<string, string>} build
 */
export interface ConfigScriptsStyles {
  inputDir: string
  outputDir: string
  deps: Map<string, Set<string>>
  build: Map<string, string>
}

/**
 * @typedef {object} ConfigApiKeys
 * @prop {string} smtp2go
 */
export interface ConfigApiKeys {
  smtp2go: string
}

/**
 * @typedef {GenericStrings|NodeJS.Process['env']} ConfigEnvArg
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
 * @prop {string[]} partialTypes
 * @prop {string[]} wholeTypes
 * @prop {GenericStrings} renderTypes
 * @prop {RenderFunctions} renderFunctions
 */
export interface ConfigBase {
  namespace: string
  source: string
  title: string
  meta: ConfigMeta
  partialTypes: string[]
  wholeTypes: string[]
  renderTypes: GenericStrings
  renderFunctions: RenderFunctions
}

/**
 * @typedef Config
 * @type {ConfigBase}
 * @prop {GenericStrings} normalTypes
 * @prop {ConfigArchiveMeta} archiveMeta
 * @prop {GenericFunctions} ajaxFunctions
 * @prop {Actions} actions
 * @prop {Filters} filters
 * @prop {Shortcodes} shortcodes
 * @prop {ConfigImage} image
 * @prop {ConfigParents} parents
 * @prop {Navigation[]} navigation
 * @prop {NavigationItem[]} navigationItem
 * @prop {ConfigScriptMeta} scriptMeta
 * @prop {ConfigFormMeta} formMeta
 * @prop {ConfigEnv} env
 * @prop {ConfigStore} store
 * @prop {ConfigServerless} serverless
 * @prop {ConfigRedirects} redirects
 * @prop {ConfigCms} cms
 * @prop {ConfigStatic} static
 * @prop {ConfigScriptsStyles} styles
 * @prop {ConfigScriptsStyles} scripts
 * @prop {ConfigApiKeys} apiKeys
 */
export interface Config extends ConfigBase {
  normalTypes: GenericStrings
  archiveMeta: ConfigArchiveMeta
  ajaxFunctions: GenericFunctions
  actions: Partial<Actions>
  filters: Partial<Filters>
  filter?: ConfigFilter
  shortcodes: Shortcodes
  image: ConfigImage
  parents: ConfigParents
  navigation: Navigation[]
  navigationItem: NavigationItem[]
  scriptMeta: ConfigScriptMeta
  formMeta: ConfigFormMeta
  env: ConfigEnv
  store: ConfigStore
  serverless: ConfigServerless
  redirects: ConfigRedirects
  cms: ConfigCms
  static: ConfigStatic
  styles: ConfigScriptsStyles
  scripts: ConfigScriptsStyles
  apiKeys: ConfigApiKeys
}

/**
 * @typedef ConfigArgs
 * @type {ConfigBase}
 * @prop {ConfigArchiveMeta} [archiveMeta]
 * @prop {GenericFunctions} [ajaxFunctions]
 * @prop {Actions} [actions]
 * @prop {Filters} [filters]
 * @prop {Shortcodes} [shortcodes]
 * @prop {ConfigImage} [image]
 * @prop {Generic} [scriptMeta]
 * @prop {Generic} [formMeta]
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
 * @param {ConfigArgs} args
 * @return {Config}
 */
export type ConfigSet = (args: ConfigArgs) => Config

/**
 * @typedef {function} ConfigSetFilter
 * @param {ConfigEnvArg} env
 * @return {Promise<void>}
 */
export type ConfigSetFilter = (env: ConfigEnvArg) => Promise<void>
