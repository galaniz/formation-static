/**
 * Utils - Content Type Test
 */

/* Imports */

import { it, expect, describe, beforeEach, afterEach } from 'vitest'
import { normalizeContentType, getContentTypeLabels } from '../contentType.js'
import { config } from '../../../config/config.js'
import { store } from '../../../store/store.js'

/* Test normalizeContentType */

describe('normalizeContentType()', () => {
  beforeEach(() => {
    config.normalTypes = {
      'ssf/content-type': 'normalContentType',
      // @ts-expect-error
      'ssf/content-null': null
    }
  })

  afterEach(() => {
    config.normalTypes = {}
  })

  it('should return initial content type', () => {
    const contentType = 'doesNotExist'
    const result = normalizeContentType(contentType)
    const expectedResult = 'doesNotExist'

    expect(result).toBe(expectedResult)
  })

  it('should return initial content type if normal type is null', () => {
    const contentType = 'ssf/content-null'
    const result = normalizeContentType(contentType)
    const expectedResult = 'ssf/content-null'

    expect(result).toBe(expectedResult)
  })

  it('should return normal content type', () => {
    const contentType = 'ssf/content-type'
    const result = normalizeContentType(contentType)
    const expectedResult = 'normalContentType'

    expect(result).toBe(expectedResult)
  })
})

/* Test getContentTypeLabels */

describe('getContentTypeLabels()', () => {
  beforeEach(() => {
    store.archiveMeta = {
      testEmptyContentType: {},
      testContentType: {
        singular: 'Test Content Type',
        plural: 'Test Content Types'
      }
    }
  })

  afterEach(() => {
    store.archiveMeta = {}
  })

  it('should return default labels if content type is null', () => {
    // @ts-expect-error
    const result = getContentTypeLabels(null)
    const expectedResult = {
      singular: 'Post',
      plural: 'Posts'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return default labels if content type is empty string', () => {
    const result = getContentTypeLabels('')
    const expectedResult = {
      singular: 'Post',
      plural: 'Posts'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return default labels if content type has empty archive meta', () => {
    const result = getContentTypeLabels('testEmptyContentType')
    const expectedResult = {
      singular: 'Post',
      plural: 'Posts'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return archive meta labels if content type has labels', () => {
    const result = getContentTypeLabels('testContentType')
    const expectedResult = {
      singular: 'Test Content Type',
      plural: 'Test Content Types'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return default labels if taxonomy content type is null', () => {
    const result = getContentTypeLabels('taxonomyContentType', {
      // @ts-expect-error
      contentType: null
    })

    const expectedResult = {
      singular: 'Post',
      plural: 'Posts'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return default labels if taxonomy content type does not have archive meta', () => {
    const result = getContentTypeLabels('taxonomyContentType', {
      id: '123',
      title: 'Title',
      contentType: 'doesNotExist'
    })

    const expectedResult = {
      singular: 'Post',
      plural: 'Posts'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return archive meta labels if taxonomy content type has labels', () => {
    const result = getContentTypeLabels('taxonomyContentType', {
      id: '123',
      title: 'Title',
      contentType: 'testContentType'
    })

    const expectedResult = {
      singular: 'Test Content Type',
      plural: 'Test Content Types'
    }

    expect(result).toEqual(expectedResult)
  })
})
