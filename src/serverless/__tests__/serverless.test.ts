/**
 * Serverless - Test
 */

/* Imports */

import { it, expect, describe, vi, afterEach, beforeAll } from 'vitest'
import { fs } from 'memfs'
import { readFile } from 'node:fs/promises'
import { testMinify, testResetServerless } from '../../../tests/utils.js'
import { config } from '../../config/config.js'
import { createServerlessFiles } from '../serverlessFiles.js'
import {
  serverlessDir,
  serverlessRoutes,
  serverlessActions,
  setServerless
} from '../serverless.js'

/* Test setServerless */

describe('setServerless()', () => {
  afterEach(() => {
    testResetServerless()
  })

  it('should return false and not set serverless variables if no args', () => {
    // @ts-expect-error - test undefined args
    const result = setServerless()
    const expectedResult = false
    const expectedDir = 'functions'
    const expectedRoutes = { reload: [] }
    const expectedActions = {}

    expect(result).toBe(expectedResult)
    expect(serverlessDir).toBe(expectedDir)
    expect(serverlessRoutes).toEqual(expectedRoutes)
    expect(serverlessActions).toEqual(expectedActions)
  })

  it('should return true and set variables', async () => {
    const result = setServerless({
      actions: {
        test: () => new Promise(resolve => {
          resolve({})
        })
      },
      routes: {
        test: []
      }
    }, 'test')

    const resultAction = await serverlessActions.test?.(
      // @ts-expect-error - test empty data
      {}, {}
    )

    const expectedResult = true
    const expectedDir = 'test'
    const expectedRoutes = {
      test: [],
      reload: []
    }

    expect(result).toBe(expectedResult)
    expect(serverlessDir).toBe(expectedDir)
    expect(serverlessRoutes).toEqual(expectedRoutes)
    expect(resultAction).toEqual({})
  })
})

/* Test createServerlessFiles */

describe('createServerlessFiles()', () => {
  beforeAll(() => {
    vi.spyOn(console, 'info').mockImplementation(() => {})
  })

  afterEach(() => {
    config.cms.name = ''
    config.env.dev = true
    testResetServerless()
  })

  it('should not create preview file if production', async () => {
    config.env.dev = false
    setServerless({}, '/files')

    await createServerlessFiles({
      previewFile: 'preview.js'
    })

    const preview = fs.existsSync('/files/preview.js')
    const expectedPreview = false

    expect(preview).toBe(expectedPreview)
  })

  it('should create ajax, preview and custom route files', async () => {
    const loremContent = 'import test from "../test.js"; export const lorem = async () => "lorem"'

    setServerless({
      routes: {
        reload: [],
        custom: [
          {
            path: 'lorem.js',
            content: loremContent
          }
        ]
      }
    }, '/files')

    await createServerlessFiles()

    const ajax = await readFile('/files/ajax/index.js', { encoding: 'utf8' })
    const preview = await readFile('/files/_middleware.js', { encoding: 'utf8' })
    const lorem = await readFile('/files/lorem.js', { encoding: 'utf8' })

    const expectedAjax = testMinify(`
      import { Ajax } from '@alanizcreative/formation-static/serverless/Ajax/Ajax.js';
      import { setupServerless } from '../../../lib/setup/setupServerless.js';
      const render = async (context) => {
        return await Ajax(context, setupServerless);
      };
      export const onRequestPost = [render];
    `)

    const expectedPreview = testMinify(`
      import { Preview } from '@alanizcreative/formation-static/serverless/Preview/Preview.js';
      import { getAllContentfulData } from '@alanizcreative/formation-static/contentful/contentfulData.js';
      import { setupServerless } from '../../lib/setup/setupServerless.js';
      const render = async (context) => {
        return await Preview(context, setupServerless, getAllContentfulData);
      };
      export const onRequestGet = [render];
    `)

    expect(testMinify(ajax)).toBe(expectedAjax)
    expect(testMinify(preview)).toBe(expectedPreview)
    expect(testMinify(lorem)).toBe(testMinify(loremContent))
  })

  it('should create reload route files', async () => {
    config.cms.name = 'wordpress'

    setServerless({
      routes: {
        reload: [
          {
            path: 'test'
          },
          {
            path: 'parent/child'
          },
          {
            path: '' // Test empty path
          }
        ],
        custom: [
          {
            path: 'lorem.js',
            content: ''
          }
        ]
      }
    }, '/files')

    await createServerlessFiles({
      reloadFile: 'reload.js'
    })

    const testReload = await readFile('/files/test/reload.js', { encoding: 'utf8' })
    const childReload = await readFile('/files/parent/child/reload.js', { encoding: 'utf8' })
    const emptyReload = fs.existsSync('/files/reload.js')
    const lorem = fs.existsSync('/files/lorem.js')

    const expectedTestReload = testMinify(`
      import { Reload } from '@alanizcreative/formation-static/serverless/Reload/Reload.js';
      import { getAllWordPressData } from '@alanizcreative/formation-static/wordpress/wordpressData.js';
      import { setupServerless } from '../../../lib/setup/setupServerless.js';
      const render = async (context) => {
        return await Reload(context, setupServerless, getAllWordPressData);
      };
      export const onRequestGet = [render];
    `)

    const expectedChildReload = testMinify(`
      import { Reload } from '@alanizcreative/formation-static/serverless/Reload/Reload.js';
      import { getAllWordPressData } from '@alanizcreative/formation-static/wordpress/wordpressData.js';
      import { setupServerless } from '../../../../lib/setup/setupServerless.js';
      const render = async (context) => {
        return await Reload(context, setupServerless, getAllWordPressData);
      };
      export const onRequestGet = [render];
    `)

    const expectedEmptyReload = false
    const expectedLorem = false

    expect(testMinify(testReload)).toBe(expectedTestReload)
    expect(testMinify(childReload)).toBe(expectedChildReload)
    expect(emptyReload).toBe(expectedEmptyReload)
    expect(lorem).toBe(expectedLorem)
  })

  it('should create ajax, preview, reload and custom routes in specified files and directories', async () => {
    setServerless({
      routes: {
        reload: [
          {
            path: 'test'
          }
        ],
        test: [
          {
            path: 'test.js',
            content: 'test'
          }
        ]
      }
    }, '/files')

    await createServerlessFiles({
      dataExport: 'getData',
      dataExportFile: 'lib/data.js',
      setupExport: 'setup',
      setupExportFile: 'lib/setup.js',
      previewExportFile: 'lib/preview.js',
      reloadExportFile: 'lib/reload.js',
      ajaxExportFile: 'lib/ajax.js',
      ajaxFile: 'ajax.js',
      previewFile: 'preview.js',
      reloadFile: 'reload.js'
    })

    const ajax = await readFile('/files/ajax.js', { encoding: 'utf8' })
    const preview = await readFile('/files/preview.js', { encoding: 'utf8' })
    const testReload = await readFile('/files/test/reload.js', { encoding: 'utf8' })
    const test = await readFile('/files/test.js', { encoding: 'utf8' })

    const expectedAjax = testMinify(`
      import { Ajax } from '../../lib/ajax.js';
      import { setup } from '../../lib/setup.js';
      const render = async (context) => {
        return await Ajax(context, setup);
      };
      export const onRequestPost = [render];
    `)

    const expectedPreview = testMinify(`
      import { Preview } from '../../lib/preview.js';
      import { getData } from '../../lib/data.js';
      import { setup } from '../../lib/setup.js';
      const render = async (context) => {
        return await Preview(context, setup, getData);
      };
      export const onRequestGet = [render];
    `)

    const expectedTestReload = testMinify(`
      import { Reload } from '../../../lib/reload.js';
      import { getData } from '../../../lib/data.js';
      import { setup } from '../../../lib/setup.js';
      const render = async (context) => {
        return await Reload(context, setup, getData);
      };
      export const onRequestGet = [render];
    `)

    expect(testMinify(ajax)).toBe(expectedAjax)
    expect(testMinify(preview)).toBe(expectedPreview)
    expect(testMinify(testReload)).toBe(expectedTestReload)
    expect(testMinify(test)).toBe('test')
  })
})
