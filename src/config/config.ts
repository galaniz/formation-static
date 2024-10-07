/**
 * Config
 */

/* Imports */

import type { Config, ConfigSet, ConfigSetFilter } from './configTypes.js'
import { addFilter, applyFilters } from '../utils/filter/filter.js'

/**
 * Default options
 *
 * @type {Config}
 */
let config: Config = {
  namespace: 'ssf',
  source: 'static',
  title: 'Static Site',
  meta: {
    description: '',
    image: ''
  },
  partialTypes: [
    'navigation',
    'navigationItem',
    'redirect'
  ],
  wholeTypes: [
    'page'
  ],
  hierarchicalTypes: [
    'page'
  ],
  typesInSlug: [],
  localesInSlug: [],
  archiveMeta: {},
  normalTypes: {},
  renderTypes: {},
  renderFunctions: {},
  renderLayout: async () => { return '' },
  renderHttpError: undefined,
  renderNavigations: undefined,
  ajaxFunctions: {},
  actions: {},
  filters: {},
  shortcodes: {},
  parents: {},
  navigation: [],
  navigationItem: [],
  scriptMeta: {},
  formMeta: {},
  env: {
    dev: true,
    prod: false,
    build: false,
    cache: false,
    dir: '',
    devUrl: '/',
    prodUrl: ''
  },
  storeDir: 'lib/store',
  storeFiles: {
    slugs: {
      data: '',
      name: 'slugs.json'
    },
    parents: {
      data: '',
      name: 'parents.json'
    },
    navigations: {
      data: '',
      name: 'navigations.json'
    },
    navigationItems: {
      data: '',
      name: 'navigation-items.json'
    },
    archiveMeta: {
      data: '',
      name: 'archive-meta.json'
    },
    formMeta: {
      data: '',
      name: 'form-meta.json'
    }
  },
  serverlessDir: 'functions',
  serverlessFiles: {
    ajax: '',
    preview: '',
    reload: ''
  },
  serverlessRoutes: {
    reload: []
  },
  redirects: {
    file: 'site/_redirects',
    data: []
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
  staticDir: 'json',
  image: {
    inputDir: 'src/assets/img',
    outputDir: 'site/assets/img',
    dataFile: 'lib/store/image-data.json',
    url: '/assets/img/',
    quality: 75,
    sizes: [
      200, 400, 600, 800, 1000, 1200, 1600, 2000
    ]
  },
  styles: {
    inputDir: 'src',
    outputDir: 'css',
    deps: new Map(),
    item: new Map(),
    build: new Map()
  },
  scripts: {
    inputDir: 'lib',
    outputDir: 'js',
    deps: new Map(),
    item: new Map(),
    build: new Map()
  },
  apiKeys: {
    smtp2go: ''
  }
}

/**
 * Update default config with user options
 *
 * @type {ConfigSet}
 */
const setConfig: ConfigSet = (args) => {
  config = Object.assign(config, args)

  if (config.filter !== undefined) {
    addFilter('config', config.filter)
  }

  return config
}

/**
 * Update config based on env variables
 *
 * @type {ConfigSetFilter}
 */
const setConfigFilter: ConfigSetFilter = async (env) => {
  config = await applyFilters('config', config, env)
}

/* Exports */

export {
  config,
  setConfig,
  setConfigFilter
}
