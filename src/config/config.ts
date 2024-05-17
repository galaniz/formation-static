/**
 * Config
 */

/* Imports */

import type { Config, ConfigSet, ConfigSetFilter } from './configTypes'
import { addFilter, applyFilters } from '../utils/filters/filters'

/**
 * Default options
 *
 * @type {import('./configTypes').Config}
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
  archiveMeta: {},
  normalTypes: {},
  renderTypes: {},
  renderFunctions: {},
  ajaxFunctions: {},
  actions: {},
  filters: {},
  shortcodes: {},
  image: {
    url: '/assets/img/',
    quality: 75,
    sizes: [
      200, 400, 600, 800, 1000, 1200, 1600, 2000
    ]
  },
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
    urls: {
      dev: '/',
      prod: ''
    }
  },
  store: {
    dir: 'src/store',
    files: {
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
    }
  },
  serverless: {
    dir: 'functions',
    files: {
      ajax: 'ajax/index.js',
      preview: '',
      reload: ''
    },
    routes: {
      reload: []
    }
  },
  redirects: {
    file: 'site/_redirects',
    data: []
  },
  cms: {
    name: '',
    space: '',
    previewAccessToken: '',
    previewHost: '',
    deliveryAccessToken: '',
    deliveryHost: ''
  },
  static: {
    dir: 'json',
    image: {
      inputDir: 'src/assets/img',
      outputDir: 'site/assets/img',
      dataFile: 'src/store/image-data.json'
    }
  },
  styles: {
    item: {},
    build: {}
  },
  scripts: {
    item: {},
    build: {}
  },
  apiKeys: {
    smtp2go: ''
  },
  console: {
    green: '\x1b[32m%s\x1b[0m',
    red: '\x1b[31m%s\x1b[0m'
  }
}

/**
 * Function - update default config with user options
 *
 * @type {import('./configTypes').ConfigSet}
 */
const setConfig: ConfigSet = (args) => {
  config = Object.assign(config, args)

  if (config.filter !== undefined) {
    addFilter('config', config.filter)
  }

  return config
}

/**
 * Function - update config based on env variables
 *
 * @type {import('./configTypes').ConfigSetFilter}
 */
const setConfigFilter: ConfigSetFilter = async (env) => {
  config = await applyFilters('config', config, env)
}

/* Exports */

export { config, setConfig, setConfigFilter }
