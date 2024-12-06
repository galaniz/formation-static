/**
 * Utils - Data Source
 */

/* Imports */

import type { DataSource } from './dataSourceTypes.js'
import { isStringStrict } from '../string/string.js'
import { config } from '../../config/config.js'

/**
 * Check and get data source
 *
 * @type {DataSource}
 */
const dataSource: DataSource = {
  isContentful (source = config.source) {
    return config.cms.name === 'contentful' && source === 'cms'
  },
  isWordPress (source = config.source) {
    return config.cms.name === 'wordpress' && source === 'cms'
  },
  isLocal (source = config.source) {
    return source === 'local'
  },
  get () {
    const cmsName = config.cms.name

    if (isStringStrict(cmsName)) {
      return cmsName
    }

    return config.source
  }
}

/* Exports */

export { dataSource }
