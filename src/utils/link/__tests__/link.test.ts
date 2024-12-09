/**
 * Utils - Link Test
 */

/* Imports */

import { it, expect, describe, beforeEach, afterEach } from 'vitest'
import { getSlug, getLink, getPermalink } from '../link.js'
import { config } from '../../../config/config.js'
import { store } from '../../../store/store.js'

/* Test getSlug */

describe('getSlug()', () => {
  beforeEach(() => {
    config.localesInSlug = ['en', 'es']
  })

  afterEach(() => {
    config.hierarchicalTypes = []
    config.localesInSlug = []
    config.typesInSlug = {}
    store.archiveMeta = {}
    store.parents = {}
  })

  it('should return empty string if args are null', () => {
    const args = null
    // @ts-expect-error
    const result = getSlug(args)
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if slug is index', () => {
    const result = getSlug({ slug: 'index' })
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return locale if slug is index and in config slug locales', () => {
    const result = getSlug({
      slug: 'index',
      pageData: {
        locale: 'en'
      }
    }, true)

    const expectedResult = {
      slug: 'en',
      parents: []
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return config type slug and slug', () => {
    config.typesInSlug = {
      color: 'hue'
    }

    const result = getSlug({
      slug: 'purple',
      contentType: 'color'
    }, true)

    const expectedResult = {
      slug: 'hue/purple',
      parents: []
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return localized type slug and slug', () => {
    config.typesInSlug = {
      color: {
        es: 'colores'
      }
    }

    const result = getSlug({
      slug: 'purple',
      contentType: 'color',
      pageData: {
        locale: 'es'
      }
    }, true)

    const expectedResult = {
      slug: 'es/colores/purple',
      parents: []
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return parent slugs and slug', () => {
    config.hierarchicalTypes = ['hierarchical']
    store.parents = {
      123: {
        id: '456',
        slug: 'colors',
        title: 'Colors',
        contentType: 'hierarchical'
      },
      456: {
        id: '789',
        slug: 'design',
        title: 'Design',
        contentType: 'hierarchical'
      }
    }

    const result = getSlug({
      id: '123',
      slug: 'pink',
      contentType: 'hierarchical'
    }, true)

    const expectedResult = {
      slug: 'design/colors/pink',
      parents: [
        {
          id: '789',
          slug: 'design',
          title: 'Design',
          contentType: 'hierarchical'
        },
        {
          id: '456',
          slug: 'colors',
          title: 'Colors',
          contentType: 'hierarchical'
        }
      ]
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return archive slug and slug', () => {
    store.archiveMeta.color = {
      id: '123',
      slug: 'colors',
      title: 'Colors',
      contentType: 'page'
    }

    const result = getSlug({
      slug: 'purple',
      contentType: 'color'
    }, true)

    const expectedResult = {
      slug: 'colors/purple',
      parents: [
        {
          id: '123',
          slug: 'colors',
          title: 'Colors',
          contentType: 'page'
        }
      ]
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return parent, archive slug and slug', () => {
    store.parents['123'] = {
      id: '456',
      slug: 'art',
      title: 'Art',
      contentType: 'page'
    }

    store.archiveMeta.color = {
      id: '123',
      slug: 'colors',
      title: 'Colors',
      contentType: 'page'
    }

    const result = getSlug({
      slug: 'purple',
      contentType: 'color'
    }, true)

    const expectedResult = {
      slug: 'art/colors/purple',
      parents: [
        {
          id: '456',
          slug: 'art',
          title: 'Art',
          contentType: 'page'
        },
        {
          id: '123',
          slug: 'colors',
          title: 'Colors',
          contentType: 'page'
        }
      ]
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return locale, archive slug and slug', () => {
    store.archiveMeta.color = {
      id: '123',
      slug: 'colors',
      title: 'Colors',
      contentType: 'page'
    }

    const result = getSlug({
      slug: 'purple',
      contentType: 'color',
      pageData: {
        locale: 'en'
      }
    }, true)

    const expectedResult = {
      slug: 'en/colors/purple',
      parents: [
        {
          id: '123',
          slug: 'colors',
          title: 'Colors',
          contentType: 'page'
        }
      ]
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return taxonomy slug', () => {
    store.archiveMeta.color = {
      id: '123',
      slug: 'colors',
      title: 'Colors',
      contentType: 'page'
    }

    const result = getSlug({
      id: '456',
      slug: 'types',
      contentType: 'taxonomy',
      pageData: {
        id: '789',
        slug: 'types',
        title: 'Color Types',
        contentType: 'color',
        useContentTypeSlug: false
      }
    }, true)

    const expectedResult = {
      slug: 'types',
      parents: []
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return archive slug and taxonomy slug', () => {
    store.archiveMeta.color = {
      id: '123',
      slug: 'colors',
      title: 'Colors',
      contentType: 'page'
    }

    const result = getSlug({
      id: '456',
      slug: 'types',
      contentType: 'taxonomy',
      pageData: {
        id: '789',
        slug: 'types',
        title: 'Color Types',
        contentType: 'color',
        useContentTypeSlug: true
      }
    }, true)

    const expectedResult = {
      slug: 'colors/types',
      parents: [
        {
          id: '123',
          slug: 'colors',
          title: 'Colors',
          contentType: 'page'
        }
      ]
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return locale, archive slug and taxonomy slug', () => {
    store.archiveMeta.color = {
      id: '123',
      slug: 'colors',
      title: 'Colors',
      contentType: 'page'
    }

    const result = getSlug({
      id: '456',
      slug: 'types',
      contentType: 'taxonomy',
      pageData: {
        id: '789',
        slug: 'types',
        title: 'Color Types',
        contentType: 'color',
        useContentTypeSlug: true,
        locale: 'en'
      }
    }, true)

    const expectedResult = {
      slug: 'en/colors/types',
      parents: [
        {
          id: '123',
          slug: 'colors',
          title: 'Colors',
          contentType: 'page'
        }
      ]
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return locale, archive slug and taxonomy slug', () => {
    store.parents = {
      123: {
        id: '456',
        slug: 'art',
        title: 'Art',
        contentType: 'page'
      },
      456: {
        id: '789',
        slug: 'all',
        title: 'All',
        contentType: 'page'
      }
    }

    store.archiveMeta.color = {
      id: '123',
      slug: 'colors',
      title: 'Colors',
      contentType: 'page'
    }

    const result = getSlug({
      id: '456',
      slug: 'types',
      contentType: 'taxonomy',
      pageData: {
        id: '789',
        slug: 'types',
        title: 'Color Types',
        contentType: 'color',
        useContentTypeSlug: true,
        locale: 'en'
      }
    }, true)

    const expectedResult = {
      slug: 'en/all/art/colors/types',
      parents: [
        {
          id: '789',
          slug: 'all',
          title: 'All',
          contentType: 'page'
        },
        {
          id: '456',
          slug: 'art',
          title: 'Art',
          contentType: 'page'
        },
        {
          id: '123',
          slug: 'colors',
          title: 'Colors',
          contentType: 'page'
        }
      ]
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return taxonomy slug and term slug', () => {
    store.archiveMeta.color = {
      id: '123',
      slug: 'colors',
      title: 'Colors',
      contentType: 'page'
    }

    const result = getSlug({
      slug: 'cold',
      contentType: 'term',
      pageData: {
        taxonomy: {
          id: '456',
          slug: 'types',
          title: 'Color Types',
          contentType: 'color',
          useContentTypeSlug: false
        }
      }
    }, true)

    const expectedResult = {
      slug: 'types/cold',
      parents: []
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return archive, taxonomy and term slug', () => {
    store.archiveMeta.color = {
      id: '123',
      slug: 'colors',
      title: 'Colors',
      contentType: 'page'
    }

    const result = getSlug({
      slug: 'cold',
      contentType: 'term',
      pageData: {
        taxonomy: {
          id: '456',
          slug: 'types',
          title: 'Color Types',
          contentType: 'color',
          useContentTypeSlug: true,
          isPage: true
        }
      }
    }, true)

    const expectedResult = {
      slug: 'colors/types/cold',
      parents: [
        {
          id: '123',
          slug: 'colors',
          title: 'Colors',
          contentType: 'page'
        },
        {
          id: '456',
          slug: 'types',
          title: 'Color Types',
          contentType: 'taxonomy'
        }
      ]
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return slug with page query param', () => {
    const result = getSlug({
      slug: 'colors',
      page: 2,
      contentType: 'page'
    })

    const expectedResult = 'colors/?page=2'

    expect(result).toEqual(expectedResult)
  })

  // TODO: Test filters
})

/* Test getPermalink */

describe('getPermalink()', () => {
  afterEach(() => {
    config.env.prod = false
    config.env.prodUrl = ''
  })

  it('should return index dev url if no slug provided', () => {
    const result = getPermalink()
    const expectedResult = '/'

    expect(result).toBe(expectedResult)
  })

  it('should return index dev url if slug is slash', () => {
    const result = getPermalink('/')
    const expectedResult = '/'

    expect(result).toBe(expectedResult)
  })

  it('should return dev url with trailing slash', () => {
    const result = getPermalink('test')
    const expectedResult = '/test/'

    expect(result).toBe(expectedResult)
  })

  it('should return dev url without trailing slash', () => {
    const result = getPermalink('test', false)
    const expectedResult = '/test'

    expect(result).toBe(expectedResult)
  })

  it('should return index prod url if no slug provided', () => {
    config.env.prod = true
    config.env.prodUrl = 'https://test.com/'

    const result = getPermalink()
    const expectedResult = 'https://test.com/'

    expect(result).toBe(expectedResult)
  })

  it('should return index prod url if slug is slash', () => {
    config.env.prod = true
    config.env.prodUrl = 'https://test.com/'

    const result = getPermalink('/')
    const expectedResult = 'https://test.com/'

    expect(result).toBe(expectedResult)
  })

  it('should return prod url with trailing slash', () => {
    config.env.prod = true
    config.env.prodUrl = 'https://test.com/'

    const result = getPermalink('test')
    const expectedResult = 'https://test.com/test/'

    expect(result).toBe(expectedResult)
  })

  it('should return prod url without trailing slash', () => {
    config.env.prod = true
    config.env.prodUrl = 'https://test.com/'

    const result = getPermalink('test', false)
    const expectedResult = 'https://test.com/test'

    expect(result).toBe(expectedResult)
  })
})

/* Test getLink */

describe('getLink()', () => {
  afterEach(() => {
    config.localesInSlug = []
    config.env.prod = false
    config.env.prodUrl = ''
  })

  it('should return empty string if no internal or external link provided', () => {
    const result = getLink()
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return external link', () => {
    // @ts-expect-error
    const result = getLink(null, 'https://external.com/')
    const expectedResult = 'https://external.com/'

    expect(result).toBe(expectedResult)
  })

  it('should return internal link as dev permalink', () => {
    const result = getLink({
      id: '123',
      slug: 'test',
      contentType: 'page'
    })

    const expectedResult = '/test/'

    expect(result).toBe(expectedResult)
  })

  it('should return internal link as prod permalink', () => {
    config.env.prod = true
    config.env.prodUrl = 'https://test.com/'
    config.localesInSlug = ['es']

    const result = getLink({
      id: '123',
      slug: 'test',
      locale: 'es',
      contentType: 'page'
    })

    const expectedResult = 'https://test.com/es/test/'

    expect(result).toBe(expectedResult)
  })
})
