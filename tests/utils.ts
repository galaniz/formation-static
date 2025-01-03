/**
 * Tests - Utils
 */

/* Imports */

import type { RenderFunctions } from '../src/render/renderTypes.js'
import type { ServerlessContext } from '../src/serverless/serverlessTypes.js'
import type { Store } from '../src/store/storeTypes.js'
import type { Config } from '../src/config/configTypes.js'
import { Container } from '../src/layouts/Container/Container.js'
import { Column } from '../src/layouts/Column/Column.js'
import { Form } from '../src/objects/Form/Form.js'
import { Field } from '../src/objects/Field/Field.js'
import { RichText } from '../src/text/RichText/RichText.js'
import { setRenderFunctions } from '../src/render/render.js'
import { store, setStore } from '../src/store/store.js'

/**
 * Remove all empty spaces from string
 *
 * @param {string} str
 * @return {string}
 */
const testMinify = (str: string): string => {
  return str.replace(/\s/g, '')
}

/**
 * Default store object
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
    imageMeta: {}
  }
}

/**
 * Reset store to default properties
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
 * Default render functions object
 *
 * @return {RenderFunctions}
 */
const testDefaultRenderFunctions = (): RenderFunctions => {
  return {
    container: Container,
    column: Column,
    form: Form,
    field: Field,
    richText: RichText
  }
}

/**
 * Reset render functions to default
 *
 * @return {void}
 */
const testResetRenderFunctions = (): void => {
  setRenderFunctions({
    functions: {},
    layout: () => '',
    navigations: () => ({}),
    httpError: () => ''
  })
}

/**
 * Serverless context object
 *
 * @param {string} url
 * @return {ServerlessContext}
 */
const testContext = (url: string = 'http://test.com/'): ServerlessContext => {
  const request = new Request(url, { method: 'GET' })

  return {
    request: {
      ...request,
      url,
      method: 'GET',
      clone: () => ({
        ...request.clone(),
        fetcher: {},
        bytes: () => new ArrayBuffer(0)
      }),
      fetcher: {},
      bytes: () => new ArrayBuffer(0)
    },
    functionPath: '',
    env: {},
    data: {},
    waitUntil () {},
    passThroughOnException () {},
    params: {},
    next () {}
  } as unknown as ServerlessContext
}

/**
 * WordPress cms config object
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

/* Exports */

export {
  testMinify,
  testDefaultStore,
  testResetStore,
  testDefaultRenderFunctions,
  testResetRenderFunctions,
  testContext,
  testWordPressConfig
}
