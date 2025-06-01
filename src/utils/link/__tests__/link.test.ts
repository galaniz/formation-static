/**
 * Utils - Link Test
 */

/* Imports */

import { it, expect, describe, beforeEach, afterEach, vi } from 'vitest'
import { testResetStore } from '../../../../tests/utils.js'
import { getSlug, getLink, getPermalink } from '../link.js'
import { setStoreItem } from '../../../store/store.js'
import { addFilter, resetFilters } from '../../../utils/filter/filter.js'
import { config } from '../../../config/config.js'

/* Test getSlug */

describe('getSlug()', () => {
  beforeEach(() => {
    config.localeInSlug = {
      'en-CA': 'en',
      'es-CL': 'es'
    }
  })

  afterEach(() => {
    testResetStore()
    resetFilters()
    config.hierarchicalTypes = []
    config.localeInSlug = {}
    config.typeInSlug = {}
    config.taxonomyInSlug = {}
  })

  it('should return empty string if args are null', () => {
    const args = null
    // @ts-expect-error - test null args
    const result = getSlug(args)
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if slug is index', () => {
    const result = getSlug({ slug: 'index' })
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return locale if locale exists and slug is index', () => {
    const result = getSlug({
      slug: 'index',
      itemData: {
        locale: 'en-CA'
      }
    }, true)

    const expectedResult = {
      slug: 'en',
      parents: []
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return type slug and slug', () => {
    config.typeInSlug = {
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
    config.typeInSlug = {
      color: {
        'es-CL': 'colores'
      }
    }

    const result = getSlug({
      slug: 'purple',
      contentType: 'color',
      itemData: {
        locale: 'es-CL'
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

    setStoreItem('parents', {
      hierarchical: {
        123: {
          id: '456',
          slug: 'colors',
          title: 'Colors'
        },
        456: {
          id: '789',
          slug: 'design',
          title: 'Design'
        }
      }
    })

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
          contentType: 'hierarchical',
          locale: undefined
        },
        {
          id: '456',
          slug: 'colors',
          title: 'Colors',
          contentType: 'hierarchical',
          locale: undefined
        }
      ]
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return archive slug and slug', () => {
    setStoreItem('archiveMeta', {
      color: {
        id: '123',
        slug: 'colors',
        title: 'Colors',
        contentType: 'page'
      }
    })

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
          contentType: 'page',
          locale: undefined
        }
      ]
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return parent, archive slug and slug', () => {
    setStoreItem('parents', {
      page: {
        123: {
          id: '456',
          slug: 'art',
          title: 'Art'
        }
      }
    })

    setStoreItem('archiveMeta', {
      color: {
        id: '123',
        slug: 'colors',
        title: 'Colors',
        contentType: 'page'
      }
    })

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
          contentType: 'page',
          locale: undefined
        },
        {
          id: '123',
          slug: 'colors',
          title: 'Colors',
          contentType: 'page',
          locale: undefined
        }
      ]
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return locale, archive slug and slug', () => {
    setStoreItem('archiveMeta', {
      color: {
        id: '123',
        slug: 'colors',
        title: 'Colors',
        contentType: 'page'
      }
    })

    const result = getSlug({
      slug: 'purple',
      contentType: 'color',
      itemData: {
        locale: 'en-CA'
      }
    }, true)

    const expectedResult = {
      slug: 'en/colors/purple',
      parents: [
        {
          id: '123',
          slug: 'colors',
          title: 'Colors',
          contentType: 'page',
          locale: 'en-CA'
        }
      ]
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return locale, localized type slug and exclude archive slug', () => {
    config.typeInSlug = {
      color: {
        'en-CA': 'hue'
      }
    }

    setStoreItem('archiveMeta', {
      color: {
        id: '123',
        slug: 'colors',
        title: 'Colors',
        contentType: 'page'
      }
    })

    const result = getSlug({
      slug: 'index',
      contentType: 'color',
      itemData: {
        locale: 'en-CA'
      }
    }, true)

    const expectedResult = {
      slug: 'en/hue',
      parents: [
        {
          id: '123',
          slug: 'colors',
          title: 'Colors',
          contentType: 'page',
          locale: 'en-CA'
        }
      ]
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return taxonomy slug and exclude archive slug', () => {
    setStoreItem('archiveMeta', {
      color: {
        id: '123',
        slug: 'colors',
        title: 'Colors',
        contentType: 'page'
      }
    })

    const result = getSlug({
      id: '456',
      slug: 'types',
      contentType: 'taxonomy',
      itemData: {
        id: '789',
        slug: 'types',
        title: 'Color Types',
        contentTypes: ['color'],
        usePrimaryContentTypeSlug: false
      }
    }, true)

    const expectedResult = {
      slug: 'types',
      parents: [
        {
          id: '123',
          slug: 'colors',
          title: 'Colors',
          contentType: 'page',
          locale: undefined
        }
      ]
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return archive slug and taxonomy slug', () => {
    setStoreItem('archiveMeta', {
      color: {
        id: '123',
        slug: 'colors',
        title: 'Colors',
        contentType: 'page'
      }
    })

    const result = getSlug({
      id: '456',
      slug: 'types',
      contentType: 'taxonomy',
      itemData: {
        id: '789',
        slug: 'types',
        title: 'Color Types',
        contentTypes: ['color'],
        usePrimaryContentTypeSlug: true
      }
    }, true)

    const expectedResult = {
      slug: 'colors/types',
      parents: [
        {
          id: '123',
          slug: 'colors',
          title: 'Colors',
          contentType: 'page',
          locale: undefined
        }
      ]
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return locale, archive slug and taxonomy slug', () => {
    setStoreItem('archiveMeta', {
      color: {
        id: '123',
        slug: 'colors',
        title: 'Colors',
        contentType: 'page'
      }
    })

    const result = getSlug({
      id: '456',
      slug: 'types',
      contentType: 'taxonomy',
      itemData: {
        id: '789',
        slug: 'types',
        title: 'Color Types',
        contentTypes: ['color'],
        usePrimaryContentTypeSlug: true,
        locale: 'en-CA'
      }
    }, true)

    const expectedResult = {
      slug: 'en/colors/types',
      parents: [
        {
          id: '123',
          slug: 'colors',
          title: 'Colors',
          contentType: 'page',
          locale: 'en-CA'
        }
      ]
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return locale, parent slug, archive slug and taxonomy slug', () => {
    setStoreItem('parents', {
      page: {
        123: {
          id: '456',
          slug: 'art',
          title: 'Art'
        },
        456: {
          id: '789',
          slug: 'all',
          title: 'All'
        }
      }
    })

    setStoreItem('archiveMeta', {
      color: {
        id: '123',
        slug: 'colors',
        title: 'Colors',
        contentType: 'page'
      }
    })

    const result = getSlug({
      id: '456',
      slug: 'types',
      contentType: 'taxonomy',
      itemData: {
        id: '789',
        slug: 'types',
        title: 'Color Types',
        contentTypes: ['color'],
        usePrimaryContentTypeSlug: true,
        locale: 'en-CA'
      }
    }, true)

    const expectedResult = {
      slug: 'en/all/art/colors/types',
      parents: [
        {
          id: '789',
          slug: 'all',
          title: 'All',
          contentType: 'page',
          locale: 'en-CA'
        },
        {
          id: '456',
          slug: 'art',
          title: 'Art',
          contentType: 'page',
          locale: 'en-CA'
        },
        {
          id: '123',
          slug: 'colors',
          title: 'Colors',
          contentType: 'page',
          locale: 'en-CA'
        }
      ]
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return taxonomy slug and term slug', () => {
    setStoreItem('archiveMeta', {
      color: {
        id: '123',
        slug: 'colors',
        title: 'Colors',
        contentType: 'page'
      }
    })

    const result = getSlug({
      slug: 'cold',
      contentType: 'term',
      itemData: {
        taxonomy: {
          id: '456',
          slug: 'types',
          title: 'Color Types',
          contentTypes: ['color'],
          usePrimaryContentTypeSlug: false
        }
      }
    }, true)

    const expectedResult = {
      slug: 'types/cold',
      parents: [
        {
          id: '123',
          slug: 'colors',
          title: 'Colors',
          contentType: 'page',
          locale: undefined
        }
      ]
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return localized taxonomy slug and term slug', () => {
    config.taxonomyInSlug = {
      types: {
        'es-CL': 'tipo'
      }
    }

    const result = getSlug({
      slug: 'cold',
      contentType: 'term',
      itemData: {
        locale: 'es-CL',
        taxonomy: {
          id: '456',
          slug: 'types',
          title: 'Color Types',
          contentTypes: ['color'],
          usePrimaryContentTypeSlug: false
        }
      }
    }, true)

    const expectedResult = {
      slug: 'es/tipo/cold',
      parents: []
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return archive, taxonomy and term slug', () => {
    setStoreItem('archiveMeta', {
      color: {
        id: '123',
        slug: 'colors',
        title: 'Colors',
        contentType: 'page'
      }
    })

    const taxonomy = {
      id: '456',
      slug: 'types',
      title: 'Color Types',
      contentTypes: ['color'],
      usePrimaryContentTypeSlug: true,
      isPage: true
    }

    const result = getSlug({
      slug: 'cold',
      contentType: 'term',
      itemData: {
        taxonomy
      }
    }, true)

    const expectedResult = {
      slug: 'colors/types/cold',
      parents: [
        {
          id: '123',
          slug: 'colors',
          title: 'Colors',
          contentType: 'page',
          locale: undefined
        },
        {
          id: '456',
          slug: 'types',
          title: 'Color Types',
          contentTypes: ['color'],
          primaryContentType: 'color',
          usePrimaryContentTypeSlug: true,
          isPage: true,
          contentType: 'taxonomy',
          locale: undefined
        }
      ]
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return type, taxonomy, term and term parent slugs', () => {
    config.hierarchicalTypes = ['term']
    config.typeInSlug = { color: 'colors' }
    config.taxonomyInSlug = { types: 'kind' }

    setStoreItem('parents', {
      term: {
        789: {
          id: '101',
          slug: 'cold',
          title: 'Cold'
        }
      }
    })

    const taxonomy = {
      id: '456',
      slug: 'types',
      title: 'Color Types',
      contentTypes: ['color'],
      usePrimaryContentTypeSlug: true,
      isPage: true
    }

    const result = getSlug({
      id: '789',
      slug: 'icy',
      contentType: 'term',
      itemData: {
        taxonomy
      }
    }, true)

    const expectedResult = {
      slug: 'colors/kind/cold/icy',
      parents: [
        {
          contentType: 'taxonomy',
          primaryContentType: 'color',
          locale: undefined,
          ...taxonomy
        },
        {
          id: '101',
          slug: 'cold',
          title: 'Cold',
          contentType: 'term',
          locale: undefined,
          taxonomy: {
            ...taxonomy,
            primaryContentType: 'color'
          }
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

  it('should filter slug parts', () => {
    const filterArgs = vi.fn()

    addFilter('slugParts', (parts, args) => {
      filterArgs(args)
      return parts.filter((part) => part !== 'colors')
    })

    const result = getSlug({
      slug: 'colors',
      contentType: 'page'
    })

    expect(result).toEqual('')
    expect(filterArgs).toHaveBeenCalledWith({
      slug: 'colors',
      contentType: 'page'
    })
  })

  it('should filter slug', () => {
    const filterSlug = vi.fn()

    addFilter('slug', (slug, args) => {
      filterSlug(args)
      return `${slug}/test`
    })

    const result = getSlug({
      slug: 'hue',
      contentType: 'page'
    })

    expect(result).toEqual('hue/test')
    expect(filterSlug).toHaveBeenCalledWith({
      slug: 'hue',
      contentType: 'page'
    })
  })
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
    config.env.prodUrl = 'http://test.com'

    const result = getPermalink()
    const expectedResult = 'http://test.com/'

    expect(result).toBe(expectedResult)
  })

  it('should return index prod url if slug is slash', () => {
    config.env.prod = true
    config.env.prodUrl = 'http://test.com'

    const result = getPermalink('/')
    const expectedResult = 'http://test.com/'

    expect(result).toBe(expectedResult)
  })

  it('should return prod url with trailing slash', () => {
    config.env.prod = true
    config.env.prodUrl = 'http://test.com'

    const result = getPermalink('test')
    const expectedResult = 'http://test.com/test/'

    expect(result).toBe(expectedResult)
  })

  it('should return prod url without trailing slash', () => {
    config.env.prod = true
    config.env.prodUrl = 'http://test.com'

    const result = getPermalink('test', false)
    const expectedResult = 'http://test.com/test'

    expect(result).toBe(expectedResult)
  })

  it('should not prepend or append slash if slug has slashes', () => {
    config.env.prod = true
    config.env.prodUrl = 'http://test.com'

    const result = getPermalink('/test/')
    const expectedResult = 'http://test.com/test/'

    expect(result).toBe(expectedResult)
  })
})

/* Test getLink */

describe('getLink()', () => {
  afterEach(() => {
    config.localeInSlug = {}
    config.env.prod = false
    config.env.prodUrl = ''
  })

  it('should return empty string if no internal or external link provided', () => {
    const result = getLink()
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return external link', () => {
    // @ts-expect-error - test null internal link
    const result = getLink(null, 'http://external.com/')
    const expectedResult = 'http://external.com/'

    expect(result).toBe(expectedResult)
  })

  it('should return invalid internal slug as dev permalink', () => {
    const result = getLink({
      id: '123',
      // @ts-expect-error - test null slug
      slug: null,
      contentType: 'page'
    })

    const expectedResult = '/'

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
    config.env.prodUrl = 'http://test.com'
    config.localeInSlug = {
      'es-ES': 'es'
    }

    const result = getLink({
      id: '123',
      slug: 'test',
      locale: 'es-ES',
      contentType: 'page'
    })

    const expectedResult = 'http://test.com/es/test/'

    expect(result).toBe(expectedResult)
  })
})
