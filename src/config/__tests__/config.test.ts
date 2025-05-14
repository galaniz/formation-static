/**
 * Config - Test
 */

/* Imports */

import type { Config } from '../configTypes.js'
import { it, expect, describe, afterEach } from 'vitest'
import { config, setConfig, setConfigFilter } from '../config.js'

/**
 * Default config
 *
 * @type {Config}
 */
const testConfig: Config = { ...config }

/* Test setConfig */

describe('setConfig()', () => {
  afterEach(() => {
    setConfig(testConfig)
  })

  it('should return default config', () => {
    // @ts-expect-error - test empty args
    const newConfig = setConfig()

    expect(newConfig).toEqual(testConfig)
  })

  it('should update config', () => {
    const newConfig = setConfig({
      namespace: 'test',
      source: 'cms',
      title: 'Test',
      meta: {
        description: 'Test',
        image: 'Test'
      },
      partialTypes: [
        'test'
      ],
      wholeTypes: [
        'test'
      ],
      hierarchicalTypes: [
        'test'
      ],
      localeInSlug: {
        'test': 'test'
      },
      typeInSlug: {
        'test': 'test'
      },
      taxonomyInSlug: {
        'test': 'test'
      },
      normalTypes: {
        'frm-test': 'test'
      },
      renderTypes: {
        'frm-test': 'test'
      },
      env: {
        dev: true,
        prod: false,
        build: false,
        cache: false,
        dir: 'test',
        devUrl: '',
        prodUrl: 'http://test.com'
      },
      cms: {
        name: 'Test',
        space: 'test',
        prodUser: 'test',
        prodCredential: 'test',
        prodHost: 'test.com',
        devUser: 'test',
        devCredential: 'test',
        devHost: 'test.com'
      },
      local: {
        dir: 'json'
      },
      scripts: {
        inputDir: 'testInput',
        outputDir: 'testOutput'
      },
      styles: {
        inputDir: 'testInput',
        outputDir: 'testOutput'
      },
      image: {
        inputDir: 'input/assets/test',
        outputDir: 'output/assets/test',
        localUrl: '/assets/test',
        remoteUrl: 'http://test.com/assets/img',
        quality: 80,
        sizes: [
          300,
          600,
          900,
          1200
        ]
      }
    })

    expect(config).toEqual(newConfig)
  })
})

/* Test setConfigFilter */

describe('setConfigFilter()', () => {
  afterEach(() => {
    setConfig(testConfig)
  })

  it('should filter config namespace with default value', () => {
    setConfig({
      filter: (con, env) => {
        con.namespace = env?.NAMESPACE ?? 'frm' // eslint-disable-line @typescript-eslint/no-unnecessary-condition

        return con
      }
    })

    // @ts-expect-error - test empty args
    setConfigFilter()

    const namespace = config.namespace
    const expectedNamespace = 'frm'

    expect(namespace).toBe(expectedNamespace)
  })

  it('should filter config namespace with environment variable', () => {
    setConfig({
      filter: (con, env) => {
        con.namespace = env.NAMESPACE ?? ''

        return con
      }
    })

    setConfigFilter({
      NAMESPACE: 'ns'
    })

    const namespace = config.namespace
    const expectedNamespace = 'ns'

    expect(namespace).toBe(expectedNamespace)
  })
})
