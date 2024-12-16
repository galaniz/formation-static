/**
 * Config - Types
 */

/* Imports */

import type { Source, GenericStrings } from '../global/globalTypes.js'

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
 * @typedef {object} ConfigCms
 * @prop {string} name
 * @prop {string} space
 * @prop {boolean} [ssl]
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
  ssl?: boolean
  prodUser: string
  prodCredential: string
  prodHost: string
  devUser: string
  devCredential: string
  devHost: string
}

/**
 * @typedef {object} ConfigLocal
 * @prop {string} dir
 */
export interface ConfigLocal {
  dir: string
}

/**
 * @typedef {object} ConfigAsset
 * @prop {string} inputDir
 * @prop {string} outputDir - Relative to site folder
 */
export interface ConfigAsset {
  inputDir: string
  outputDir: string
}

/**
 * @typedef {object} ConfigImage
 * @prop {string} inputDir
 * @prop {string} outputDir
 * @prop {string} localUrl
 * @prop {string} cmsUrl
 * @prop {number[]} sizes
 * @prop {number} quality
 */
export interface ConfigImage {
  inputDir: string
  outputDir: string
  localUrl: string
  cmsUrl: string
  sizes: number[]
  quality: number
}

/**
 * @typedef {function} ConfigFilter
 * @param {Config} config
 * @param {GenericStrings|NodeJS.Process['env']} env
 * @return {Config}
 */
export type ConfigFilter = (
  config: Config,
  env: GenericStrings | NodeJS.Process['env']
) => Config

/**
 * @typedef {object} ConfigBase
 * @prop {string} namespace
 * @prop {Source} source
 * @prop {string} title
 * @prop {ConfigMeta} meta
 * @prop {string[]} partialTypes
 * @prop {string[]} wholeTypes
 * @prop {GenericStrings} renderTypes
 * @prop {GenericStrings} normalTypes
 * @prop {string[]} hierarchicalTypes
 * @prop {string[]} localesInSlug
 * @prop {Object<string, string|Object<string, string>>} typesInSlug
 * @prop {ConfigEnv} env
 * @prop {ConfigCms} cms
 * @prop {ConfigLocal} local
 * @prop {ConfigAsset} scripts
 * @prop {ConfigAsset} styles
 * @prop {ConfigImage} image
 * @prop {ConfigFilter} filter
 * @prop {boolean} throwError
 */
export interface Config {
  namespace: string
  source: Source
  title: string
  meta: ConfigMeta
  partialTypes: string[]
  wholeTypes: string[]
  renderTypes: GenericStrings
  normalTypes: GenericStrings
  hierarchicalTypes: string[]
  localesInSlug: string[]
  typesInSlug: Record<string, string | Record<string, string>>
  env: ConfigEnv
  cms: ConfigCms
  local: ConfigLocal
  scripts: ConfigAsset
  styles: ConfigAsset
  image: ConfigImage
  filter: ConfigFilter
  throwError: boolean
}

/**
 * @typedef {function} ConfigSet
 * @param {Config} args
 * @return {Config}
 */
export type ConfigSet = (args: Partial<Config>) => Config

/**
 * @typedef {function} ConfigSetFilter
 * @param {GenericStrings|NodeJS.Process['env']} env
 * @return {Config}
 */
export type ConfigSetFilter = (
  env: GenericStrings | NodeJS.Process['env']
) => Config
