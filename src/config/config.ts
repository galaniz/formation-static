/**
 * Config
 */

/* Imports */

import type { Config, ConfigSet, ConfigSetFilter } from './configTypes.js'

/**
 * Default options
 *
 * @type {Config}
 */
let config: Config = {
  namespace: 'ssf',
  source: 'cms',
  title: '',
  meta: {
    description: '',
    image: ''
  },
  partialTypes: [
    'navigationItem',
    'navigation'
  ],
  wholeTypes: [
    'page'
  ],
  hierarchicalTypes: [
    'page'
  ],
  localeInSlug: {},
  typeInSlug: {},
  taxonomyInSlug: {},
  normalTypes: {},
  renderTypes: {},
  env: {
    dev: true,
    prod: false,
    build: false,
    cache: false,
    dir: '',
    devUrl: '/',
    prodUrl: ''
  },
  cms: {
    name: '',
    space: '',
    prodUser: '',
    prodCredential: '',
    prodHost: '',
    devUser: '',
    devCredential: '',
    devHost: ''
  },
  local: {
    dir: 'json'
  },
  scripts: {
    inputDir: 'lib',
    outputDir: 'js'
  },
  styles: {
    inputDir: 'src',
    outputDir: 'css'
  },
  image: {
    inputDir: 'src/assets/img',
    outputDir: 'site/assets/img',
    localUrl: '/assets/img/',
    cmsUrl: '',
    quality: 75,
    sizes: [
      200, 400, 600, 800, 1000, 1200, 1600, 2000
    ]
  },
  filter: (config, _env) => config
}

/**
 * Update default config with user options
 *
 * @type {ConfigSet}
 */
const setConfig: ConfigSet = (args) => {
  config = { ...config, ...args }

  return config
}

/**
 * Filter config with environment variables
 *
 * @type {ConfigSetFilter}
 */
const setConfigFilter: ConfigSetFilter = (env) => {
  config = config.filter(config, env)

  return config
}

/* Exports */

export {
  config,
  setConfig,
  setConfigFilter
}
