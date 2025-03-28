/**
 * Local - Data Test
 */

/* Imports */

import { it, describe, beforeEach, afterEach, vi, expect } from 'vitest'
import { getLocalData } from '../localData.js'
import { config } from '../../config/config.js'
import { testResetStore } from '../../../tests/utils.js'
import { navigationPrimary } from '../../../tests/data/local/navigation--primary.js'
import { navigationItemOne } from '../../../tests/data/local/navigationItem--one.js'
import { navigationItemTwo } from '../../../tests/data/local/navigationItem--two.js'
import { navigationItemThree } from '../../../tests/data/local/navigationItem--three.js'
import { pageOne } from '../../../tests/data/local/page--one.js'
import { postOne } from '../../../tests/data/local/post--one.js'
import { taxonomyCategory } from '../../../tests/data/local/taxonomy--category.js'
import { termCategoryOne } from '../../../tests/data/local/term--category-one.js'
import { templateOne } from '../../../tests/data/local/template--one.js'
import { setStoreItem } from '../../store/store.js'

/* Use real fs instead of memfs */

vi.unmock('node:fs')
vi.unmock('node:fs/promises')

/* Test getLocalData */

describe('getLocalData()', () => {
  beforeEach(() => {
    config.source = 'local'
    config.local.dir = 'tests/data/local'
  })

  afterEach(() => {
    config.source = 'cms'
    config.local.dir = 'json'
    testResetStore()
  })

  it('should throw an error if no args are provided', async () => {
    // @ts-expect-error - test undefined params
    await expect(async () => await getLocalData()).rejects.toThrowError('No args')
  })

  it('should throw an error if no key is provided', async () => {
    // @ts-expect-error - test undefined params
    await expect(async () => await getLocalData({})).rejects.toThrowError('No key')
  })

  it('should return linked data', async () => {
    setStoreItem('imageMeta', {
      '2025/04/hero': {
        path: '2025/04/hero',
        name: 'hero.png',
        type: 'image/png',
        format: 'png',
        size: 93,
        width: 8,
        height: 8
      },
      '2025/03/image': {
        path: '2025/03/image',
        name: 'image.jpg',
        type: 'image/jpeg',
        format: 'jpg',
        size: 267,
        width: 8,
        height: 8
      },
      '2025/03/test': {
        path: '2025/03/test',
        name: 'test.png',
        type: 'image/png',
        format: 'png',
        size: 93,
        width: 8,
        height: 8
      }
    })

    const data = await getLocalData({
      key: 'all_local_data',
      imageProps: ['image', 'featuredMedia']
    })

    const expectedData = {
      'navigation--primary': navigationPrimary,
      'navigationItem--one': navigationItemOne,
      'navigationItem--two': navigationItemTwo,
      'navigationItem--three': navigationItemThree,
      'page--one': pageOne,
      'post--one': postOne,
      'taxonomy--category': taxonomyCategory,
      'term--category-one': termCategoryOne,
      'template--one': templateOne
    }

    expect(data).toEqual(expectedData)
  })
})
