/**
 * Tests - Utils
 */

/* Imports */

import type { Store } from '../src/store/storeTypes.js'
import type { Config } from '../src/config/configTypes.js'
import { setRenderFunctions } from '../src/render/render.js'
import { store, setStore } from '../src/store/store.js'
import { setServerless } from '../src/serverless/serverless.js'

/**
 * Remove all empty spaces from string.
 *
 * @param {string} str
 * @return {string}
 */
const testMinify = (str: string): string => {
  return str.replace(/\s/g, '')
}

/**
 * Default store object.
 *
 * @return {Store}
 */
const testDefaultStore = (): Store => {
  return {
    slugs: {},
    parents: {},
    navigations: [],
    navigationItems: [],
    formMeta: {},
    archiveMeta: {},
    imageMeta: {},
    taxonomies: {},
    serverless: {}
  }
}

/**
 * Reset store to default properties.
 *
 * @return {void}
 */
const testResetStore = (): void => {
  for (const [key] of Object.entries(store)) {
    delete store[key] // eslint-disable-line @typescript-eslint/no-dynamic-delete
  }

  setStore(testDefaultStore(), 'lib/store')
}

/**
 * Reset render functions to default.
 *
 * @return {void}
 */
const testResetRenderFunctions = (): void => {
  setRenderFunctions({
    functions: {},
    layout: () => '',
    navigation: () => undefined,
    httpError: () => ''
  })
}

/**
 * Serverless request object.
 *
 * @param {string} [url='http://test.com/']
 * @param {string} [method='GET']
 * @param {object} [data={}]
 * @return {Request}
 */
const testRequest = (url: string = 'http://test.com/', method: string = 'GET', data: object = {}): Request => {
  const request = new Request(url, { method })

  return {
    ...request,
    url,
    method,
    clone: () => ({
      ...request.clone(),
      fetcher: {},
      bytes: () => new ArrayBuffer(0)
    }),
    text: () => Promise.resolve(JSON.stringify(data)),
    json: () => Promise.resolve(data)
  }
}

/**
 * WordPress CMS config object.
 *
 * @return {Config['cms']}
 */
const testWordPressConfig = (): Config['cms'] => {
  return {
    name: 'wordpress',
    space: 'space',
    prodUser: 'user',
    prodCredential: 'pass',
    prodHost: 'wp.com',
    devUser: 'user',
    devCredential: 'pass',
    devHost: 'wp.com'
  }
}

/**
 * Reset serverless actions to default.
 *
 * @return {void}
 */
const testResetServerless = (): void => {
  setServerless({})
}

/* Exports */

export {
  testMinify,
  testDefaultStore,
  testResetStore,
  testResetRenderFunctions,
  testRequest,
  testWordPressConfig,
  testResetServerless
}
