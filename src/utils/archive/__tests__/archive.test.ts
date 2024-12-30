/**
 * Utils - Archive Test
 */

/* Imports */

import { it, expect, describe, beforeEach, afterEach, beforeAll, afterAll } from 'vitest'
import { getArchiveInfo, getTaxonomyInfo, getArchiveLink, getArchiveLabels } from '../archive.js'
import { setStoreItem } from '../../../store/store.js'

/* Test getArchiveInfo */

describe('getArchiveInfo()', () => {
  beforeAll(() => {
    setStoreItem('archiveMeta', {
      post: {
        id: '123',
        slug: 'posts',
        title: 'Posts',
        contentType: 'post'
      },
      test: {
        // @ts-expect-error
        id: null,
        // @ts-expect-error
        slug: null,
        // @ts-expect-error
        title: null,
        // @ts-expect-error
        contentType: null
      }
    })
  })

  afterAll(() => {
    setStoreItem('archiveMeta', {})
  })

  it('should return object with empty values if no content type is provided', () => {
    // @ts-expect-error
    const result = getArchiveInfo()
    const expectedResult = {
      id: '',
      slug: '',
      title: '',
      contentType: ''
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return object with empty values if content type not found in archive meta', () => {
    const result = getArchiveInfo('test')
    const expectedResult = {
      id: '',
      slug: '',
      title: '',
      contentType: ''
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return object with empty values if content type is page', () => {
    const result = getArchiveInfo('page')
    const expectedResult = {
      id: '',
      slug: '',
      title: '',
      contentType: ''
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return object with empty values if content type is has null archive meta values', () => {
    const result = getArchiveInfo('test')
    const expectedResult = {
      id: '',
      slug: '',
      title: '',
      contentType: ''
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return object with values if content type exists in archive meta', () => {
    const result = getArchiveInfo('post')
    const expectedResult = {
      id: '123',
      slug: 'posts',
      title: 'Posts',
      contentType: 'post'
    }

    expect(result).toEqual(expectedResult)
  })
})

/* Test getTaxonomyInfo */

describe('getTaxonomyInfo()', () => {
  it('should return object with empty values if no content type or page data is provided', () => {
    // @ts-expect-error
    const result = getTaxonomyInfo()
    const expectedResult = {
      id: '',
      slug: '',
      title: '',
      contentTypes: [],
      primaryContentType: '',
      usePrimaryContentTypeSlug: true,
      isPage: false
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return object with empty values if no page data is provided', () => {
    const result = getTaxonomyInfo('test', {
      id: '123',
      title: 'Test',
      contentType: 'test',
      // @ts-expect-error
      taxonomy: null
    })

    const expectedResult = {
      id: '',
      slug: '',
      title: '',
      contentTypes: [],
      primaryContentType: '',
      usePrimaryContentTypeSlug: true,
      isPage: false
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return object with values if taxonomy content type and taxonomy data provided', () => {
    const result = getTaxonomyInfo('taxonomy', {
      id: '123',
      title: 'Test',
      slug: 'test',
      contentTypes: ['post'],
      usePrimaryContentTypeSlug: false,
      isPage: true
    })

    const expectedResult = {
      id: '123',
      slug: 'test',
      title: 'Test',
      contentTypes: ['post'],
      primaryContentType: 'post',
      usePrimaryContentTypeSlug: false,
      isPage: true
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return object with empty values if taxonomy data has null values', () => {
    const result = getTaxonomyInfo('term', {
      id: '123',
      title: 'Test',
      slug: 'test',
      taxonomy: {
        // @ts-expect-error
        id: null,
        // @ts-expect-error
        slug: null,
        // @ts-expect-error
        title: null,
        // @ts-expect-error
        contentTypes: null
      }
    })

    const expectedResult = {
      id: '',
      slug: '',
      title: '',
      contentTypes: [],
      primaryContentType: '',
      usePrimaryContentTypeSlug: true,
      isPage: false
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return object with values if term content type and taxonomy data provided', () => {
    const result = getTaxonomyInfo('term', {
      id: '123',
      title: 'Test',
      slug: 'test',
      taxonomy: {
        id: '123',
        slug: 'test',
        title: 'Test',
        contentTypes: ['post', 'test']
      }
    })

    const expectedResult = {
      id: '123',
      slug: 'test',
      title: 'Test',
      contentTypes: ['post', 'test'],
      primaryContentType: 'post',
      usePrimaryContentTypeSlug: true,
      isPage: false
    }

    expect(result).toEqual(expectedResult)
  })
})

/* Test getArchiveLink */

describe('getArchiveLink()', () => {
  beforeAll(() => {
    setStoreItem('archiveMeta', {
      post: {
        id: '789',
        slug: 'blog',
        title: 'Blog Posts',
        contentType: 'page'
      },
      test: {
        id: '456',
        slug: 'test',
        title: 'Test',
        contentType: 'page',
        plural: 'Tests'
      }
    })
  })

  afterAll(() => {
    setStoreItem('archiveMeta', {})
  })

  it('should return object with empty values if no content type is provided', () => {
    // @ts-expect-error
    const result = getArchiveLink()
    const expectedResult = {
      title: '',
      link: ''
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return empty title and link if taxonomy does not use content type slug', () => {
    const result = getArchiveLink('taxonomy', {
      id: '123',
      slug: 'test',
      title: 'Test',
      contentTypes: ['post'],
      usePrimaryContentTypeSlug: false
    })

    const expectedResult = {
      title: '',
      link: ''
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return title and link associated with taxonomy content type', () => {
    const result = getArchiveLink('taxonomy', {
      id: '123',
      slug: 'test',
      title: 'Test',
      contentTypes: ['post'],
      usePrimaryContentTypeSlug: true,
      isPage: true
    })

    const expectedResult = {
      title: 'Blog Posts',
      link: '/blog/'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return empty title and link if term does not use content type slug', () => {
    const result = getArchiveLink('term', {
      id: '012',
      slug: 'test',
      title: 'Test',
      taxonomy: {
        id: '123',
        slug: 'test',
        title: 'Test',
        contentTypes: ['post'],
        usePrimaryContentTypeSlug: false
      }
    })

    const expectedResult = {
      title: '',
      link: ''
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return title and link associated with term content type', () => {
    const result = getArchiveLink('term', {
      id: '012',
      slug: 'test',
      title: 'Test',
      taxonomy: {
        id: '123',
        slug: 'test',
        title: 'Test',
        contentTypes: ['post'],
        usePrimaryContentTypeSlug: true
      }
    })

    const expectedResult = {
      title: 'Blog Posts',
      link: '/blog/'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return title and link associated with term taxonomy', () => {
    const result = getArchiveLink('term', {
      id: '012',
      slug: 'test',
      title: 'Test',
      taxonomy: {
        id: '123',
        slug: 'test',
        title: 'Test',
        contentTypes: ['post'],
        usePrimaryContentTypeSlug: true,
        isPage: true
      }
    })

    const expectedResult = {
      title: 'Test',
      link: '/blog/test/'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return plural title and link associated with term taxonomy', () => {
    const result = getArchiveLink('term', {
      id: '012',
      slug: 'test',
      title: 'Test',
      taxonomy: {
        id: '123',
        slug: 'test',
        title: 'Test',
        contentTypes: ['test', 'post'],
        usePrimaryContentTypeSlug: true
      }
    })

    const expectedResult = {
      title: 'Tests',
      link: '/test/'
    }

    expect(result).toEqual(expectedResult)
  })
})

/* Test getArchiveLabels */

describe('getArchiveLabels()', () => {
  beforeEach(() => {
    setStoreItem('archiveMeta', {
      testEmptyContentType: {},
      testContentType: {
        singular: 'Test Content Type',
        plural: 'Test Content Types'
      }
    })
  })

  afterEach(() => {
    setStoreItem('archiveMeta', {})
  })

  it('should return default labels if content type is null', () => {
    // @ts-expect-error
    const result = getArchiveLabels(null)
    const expectedResult = {
      singular: 'Post',
      plural: 'Posts'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return default labels if content type is empty string', () => {
    const result = getArchiveLabels('')
    const expectedResult = {
      singular: 'Post',
      plural: 'Posts'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return default labels if content type has empty archive meta', () => {
    const result = getArchiveLabels('testEmptyContentType')
    const expectedResult = {
      singular: 'Post',
      plural: 'Posts'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return archive meta labels if content type has labels', () => {
    const result = getArchiveLabels('testContentType')
    const expectedResult = {
      singular: 'Test Content Type',
      plural: 'Test Content Types'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return default labels if taxonomy content type is null', () => {
    const result = getArchiveLabels('taxonomy', {
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
    const result = getArchiveLabels('taxonomy', {
      id: '123',
      title: 'Title',
      contentTypes: ['doesNotExist']
    })

    const expectedResult = {
      singular: 'Post',
      plural: 'Posts'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return archive meta labels if taxonomy content type has labels', () => {
    const result = getArchiveLabels('taxonomy', {
      id: '123',
      title: 'Title',
      contentTypes: ['testContentType']
    })

    const expectedResult = {
      singular: 'Test Content Type',
      plural: 'Test Content Types'
    }

    expect(result).toEqual(expectedResult)
  })
})
