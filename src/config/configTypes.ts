/**
 * Config - Types
 */

/* Imports */

import type { Generic, GenericFunctions, GenericStrings } from '../global/globalTypes.js'
import type { Navigation, NavigationItem } from '../components/Navigation/NavigationTypes.js'
import type {
  RenderFunctions,
  RenderHttpError,
  RenderItem,
  RenderLayout,
  RenderNavigations
} from '../render/renderTypes.js'
import type { Filters } from '../utils/filter/filterTypes.js'
import type { Actions } from '../utils/action/actionTypes.js'
import type { Shortcodes } from '../utils/shortcode/shortcodeTypes.js'
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
export type ConfigParents = Record<string, ConfigParent>

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
export type ConfigArchiveMeta = Record<string, ConfigArchiveMetaItem>

/**
 * @typedef {object} ConfigImage
 * @prop {string} inputDir
 * @prop {string} outputDir
 * @prop {string} dataFile
 * @prop {string} url
 * @prop {number[]} sizes
 * @prop {number} quality
 */
export interface ConfigImage {
  inputDir: string
  outputDir: string
  dataFile: string
  url: string
  sizes: number[]
  quality: number
}

/**
 * @typedef {Object.<string, FormMeta>} ConfigFormMeta
 */
export type ConfigFormMeta = Record<string, FormMeta>

/**
 * @typedef {Object.<string, RenderItem>} ConfigStaticPosts
 */
export type ConfigStaticPosts = Record<string, RenderItem>

/**
 * @typedef {Object.<string, string[]>} ConfigStaticPostsIndex
 */
export type ConfigStaticPostsIndex = Record<string, string[]>

/**
 * @typedef {object} ConfigEnv
 * @prop {boolean} dev
 * @prop {boolean} prod
 * @prop {boolean} build
 * @prop {boolean} cache
 * @prop {string} dir
 * @prop {string} devUrl
 * @prop {string} prodUrl
 */
export interface ConfigEnv {
  dev: boolean
  prod: boolean
  build: boolean
  cache: boolean
  dir: string
  devUrl: string
  prodUrl: string
}

/**
 * @typedef ConfigScriptMeta
 * @type {Generic}
 * @prop {string} [sendUrl]
 * @prop {Object.<string, FormMessages>} [forms]
 */
export interface ConfigScriptMeta extends Generic {
  sendUrl?: string
  forms?: Record<string, FormMessages>
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
 * @typedef {Object.<string, ConfigStoreFile>} ConfigStoreFiles
 * @prop {ConfigStoreFile} slugs
 * @prop {ConfigStoreFile} parents
 * @prop {ConfigStoreFile} navigations
 * @prop {ConfigStoreFile} navigationItems
 */
export interface ConfigStoreFiles {
  slugs: ConfigStoreFile
  parents: ConfigStoreFile
  navigations: ConfigStoreFile
  navigationItems: ConfigStoreFile
  [key: string]: ConfigStoreFile
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
 * @typedef {Object.<string, ConfigServerlessRoute[]>} ConfigServerlessRoutes
 * @prop {ConfigServerlessRoute[]} reload
 */
export interface ConfigServerlessRoutes {
  reload: ConfigServerlessRoute[]
  [key: string]: ConfigServerlessRoute[]
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
 * @typedef {object} ConfigScriptsStyles
 * @prop {string} inputDir
 * @prop {string} outputDir
 * @prop {Map.<string, Set<string>>} deps
 * @prop {Map<string, string>} item - Current render item scripts or styles
 * @prop {Map<string, string>} build
 */
export interface ConfigScriptsStyles {
  inputDir: string
  outputDir: string
  deps: Map<string, Set<string>>
  item: Map<string, string>
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
 * @prop {RenderLayout} renderLayout
 * @prop {RenderNavigations} [renderNavigations]
 * @prop {RenderHttpError} [renderHttpError]
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
  renderLayout: RenderLayout
  renderNavigations?: RenderNavigations
  renderHttpError?: RenderHttpError
}

/**
 * @typedef Config
 * @type {ConfigBase}
 * @prop {GenericStrings} normalTypes
 * @prop {string[]} hierarchicalTypes
 * @prop {string[]} typesInSlug
 * @prop {string[]} localesInSlug
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
 * @prop {string} storeDir
 * @prop {ConfigStoreFiles} storeFiles
 * @prop {string} serverlessDir
 * @prop {ConfigServerlessFiles} serverlessFiles
 * @prop {ConfigServerlessRoutes} serverlessRoutes
 * @prop {ConfigRedirects} redirects
 * @prop {ConfigCms} cms
 * @prop {string} staticDir
 * @prop {ConfigScriptsStyles} styles
 * @prop {ConfigScriptsStyles} scripts
 * @prop {ConfigApiKeys} apiKeys
 */
export interface Config extends ConfigBase {
  normalTypes: GenericStrings
  hierarchicalTypes: string[]
  typesInSlug: string[]
  localesInSlug: string[]
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
  storeDir: string
  storeFiles: ConfigStoreFiles
  serverlessDir: string
  serverlessFiles: ConfigServerlessFiles
  serverlessRoutes: ConfigServerlessRoutes
  redirects: ConfigRedirects
  cms: ConfigCms
  staticDir: string
  styles: ConfigScriptsStyles
  scripts: ConfigScriptsStyles
  apiKeys: ConfigApiKeys
}

/**
 * @typedef ConfigArgs
 * @type {ConfigBase}
 * @prop {GenericStrings} [normalTypes]
 * @prop {string[]} [hierarchicalTypes]
 * @prop {string[]} [typesInSlug]
 * @prop {string[]} [localesInSlug]
 * @prop {ConfigArchiveMeta} [archiveMeta]
 * @prop {GenericFunctions} [ajaxFunctions]
 * @prop {Actions} [actions]
 * @prop {Filters} [filters]
 * @prop {Shortcodes} [shortcodes]
 * @prop {ConfigImage} [image]
 * @prop {ConfigParents} [parents]
 * @prop {Navigation[]} [navigation]
 * @prop {NavigationItem[]} [navigationItem]
 * @prop {ConfigScriptMeta} [scriptMeta]
 * @prop {ConfigFormMeta} [formMeta]
 * @prop {ConfigEnv} [env]
 * @prop {string} [storeDir]
 * @prop {ConfigStoreFiles} [storeFiles]
 * @prop {string} [serverlessDir]
 * @prop {ConfigServerlessFiles} [serverlessFiles]
 * @prop {ConfigServerlessRoutes} [serverlessRoutes]
 * @prop {ConfigRedirects} [redirects]
 * @prop {ConfigCms} [cms]
 * @prop {string} [staticDir]
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
