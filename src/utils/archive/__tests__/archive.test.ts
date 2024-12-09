/**
 * Utils - Archive Test
 */

/* Imports */

import { it, expect, describe, beforeAll, afterAll } from 'vitest'
import { getArchiveInfo, getTaxonomyInfo, getArchiveLink } from '../archive.js'
import { store } from '../../../store/store.js'

/* Test getArchiveInfo */

describe('getArchiveInfo()', () => {
  beforeAll(() => {
    store.archiveMeta = {
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
    }
  })

  afterAll(() => {
    store.archiveMeta = {}
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
      contentType: '',
      useContentTypeSlug: true,
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
      contentType: '',
      useContentTypeSlug: true,
      isPage: false
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return object with values if taxonomy content type and taxonomy data provided', () => {
    const result = getTaxonomyInfo('taxonomy', {
      id: '123',
      title: 'Test',
      slug: 'test',
      contentType: 'post',
      useContentTypeSlug: false,
      isPage: true
    })

    const expectedResult = {
      id: '123',
      slug: 'test',
      title: 'Test',
      contentType: 'post',
      useContentTypeSlug: false,
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
        contentType: null
      }
    })

    const expectedResult = {
      id: '',
      slug: '',
      title: '',
      contentType: '',
      useContentTypeSlug: true,
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
        contentType: 'post'
      }
    })

    const expectedResult = {
      id: '123',
      slug: 'test',
      title: 'Test',
      contentType: 'post',
      useContentTypeSlug: true,
      isPage: false
    }

    expect(result).toEqual(expectedResult)
  })
})

/* Test getArchiveLink */

describe('getArchiveLink()', () => {
  beforeAll(() => {
    store.archiveMeta = {
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
    }
  })

  afterAll(() => {
    store.archiveMeta = {}
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
      contentType: 'post',
      useContentTypeSlug: false
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
      contentType: 'post',
      useContentTypeSlug: true,
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
        contentType: 'post',
        useContentTypeSlug: false
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
        contentType: 'post',
        useContentTypeSlug: true
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
        contentType: 'post',
        useContentTypeSlug: true,
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
        contentType: 'test',
        useContentTypeSlug: true
      }
    })

    const expectedResult = {
      title: 'Tests',
      link: '/test/'
    }

    expect(result).toEqual(expectedResult)
  })
})
