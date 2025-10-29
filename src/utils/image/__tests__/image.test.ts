/**
 * Utils - Image Test
 */

/* Imports */

import { it, expect, describe, beforeEach } from 'vitest'
import { testMinify } from '../../../../tests/utils.js'
import { getImage, getImageClosestSize, getImageSizes } from '../image.js'
import { config } from '../../../config/config.js'

/* Test getImage */

describe('getImage()', () => {
  beforeEach(() => {
    config.source = 'cms'
    config.cms.name = ''
    config.image.localUrl = '/assets/img'
  })

  it('should return empty string if args is undefined', () => {
    // @ts-expect-error - test undefined args
    const result = getImage()
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if data is not an object', () => {
    // @ts-expect-error - test null data
    const result = getImage({ data: null })
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if source is not local and path is empty', () => {
    const result = getImage({
      data: {
        path: '',
        alt: 'Test',
        width: 200,
        height: 100,
        format: 'png'
      },
      source: 'local'
    }, true)

    const expectedResult = {
      output: '',
      aspectRatio: 0,
      naturalWidth: 0,
      naturalHeight: 0,
      src: '',
      srcFallback: '',
      srcset: [],
      sizes: ''
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return local image details', () => {
    const result = getImage({
      data: {
        path: 'test/test',
        alt: 'Test',
        width: 1600,
        height: 800,
        format: 'png'
      },
      source: 'local'
    }, true)

    result.output = testMinify(result.output)

    const exectedOutput = testMinify(`
      <img
        alt="Test"
        src="/assets/img/test/test.webp"
        srcset="/assets/img/test/test@200.webp 200w, /assets/img/test/test@400.webp 400w, /assets/img/test/test@600.webp 600w, /assets/img/test/test@800.webp 800w, /assets/img/test/test@1000.webp 1000w, /assets/img/test/test@1200.webp 1200w"
        sizes="(min-width: 75rem) 75rem, 100vw"
        width="1200"
        height="600"
        loading="lazy"
        decoding="async"
      >
    `)

    const expectedResult = {
      output: exectedOutput,
      aspectRatio: 0.5,
      naturalWidth: 1600,
      naturalHeight: 800,
      src: '/assets/img/test/test.webp',
      srcFallback: '/assets/img/test/test.png',
      srcset: [
        '/assets/img/test/test@200.webp 200w',
        '/assets/img/test/test@400.webp 400w',
        '/assets/img/test/test@600.webp 600w',
        '/assets/img/test/test@800.webp 800w',
        '/assets/img/test/test@1000.webp 1000w',
        '/assets/img/test/test@1200.webp 1200w'
      ],
      sizes: '(min-width: 75rem) 75rem, 100vw'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return local image details with source element', () => {
    config.image.localUrl = '/assets'

    const result = getImage({
      width: 600,
      picture: true,
      lazy: false,
      data: {
        path: 'test',
        alt: 'Test',
        width: 1600,
        height: 400,
        format: 'jpg'
      },
      source: 'local'
    }, true)

    result.output = testMinify(result.output)

    const exectedOutput = testMinify(`
      <img
        alt=""
        role="presentation"
        aria-hidden="true"
        src="data:image/svg+xml;charset=utf-8,%3Csvg height='150' width='600' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E" style="pointerEvents: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%"
      >
      <source
        srcset="/assets/test@200.webp 200w, /assets/test@400.webp 400w, /assets/test@600.webp 600w"
        sizes="(min-width: 37.5rem) 37.5rem, 100vw"
        type="image/webp"
      >
      <img
        alt="Test"
        src="/assets/test.jpg"
        srcset="/assets/test@200.jpg 200w, /assets/test@400.jpg 400w, /assets/test@600.jpg 600w"
        sizes="(min-width: 37.5rem) 37.5rem, 100vw"
        width="600"
        height="150"
        loading="eager"
        fetchpriority="high"
      >
    `)

    const expectedResult = {
      output: exectedOutput,
      aspectRatio: 0.25,
      naturalWidth: 1600,
      naturalHeight: 400,
      src: '/assets/test.webp',
      srcFallback: '/assets/test.jpg',
      srcset: [
        '/assets/test@200.webp 200w',
        '/assets/test@400.webp 400w',
        '/assets/test@600.webp 600w'
      ],
      sizes: '(min-width: 37.5rem) 37.5rem, 100vw'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return local image output', () => {
    const result = getImage({
      maxWidth: 1600,
      data: {
        path: 'test/test',
        alt: 'Test',
        width: 1600,
        height: 800,
        format: 'png'
      },
      source: 'local'
    })

    const expectedResult = testMinify(`
      <img
        alt="Test"
        src="/assets/img/test/test.webp"
        srcset="/assets/img/test/test@200.webp 200w, /assets/img/test/test@400.webp 400w, /assets/img/test/test@600.webp 600w, /assets/img/test/test@800.webp 800w, /assets/img/test/test@1000.webp 1000w, /assets/img/test/test@1200.webp 1200w, /assets/img/test/test.webp 1600w"
        sizes="(min-width: 100rem) 100rem, 100vw"
        width="1600"
        height="800"
        loading="lazy"
        decoding="async"
      >
    `)

    expect(testMinify(result)).toEqual(expectedResult)
  })

  it('should return contentful image details', () => {
    config.cms.name = 'contentful'

    const result = getImage({
      maxWidth: 1400,
      viewportWidth: 80,
      quality: 80,
      picture: true,
      alt: '',
      data: {
        url: 'http://images.ctfassets.net/space/account/test.jpg',
        width: 1800,
        height: 900,
        format: 'jpg',
        alt: 'Test'
      }
    }, true)

    result.output = testMinify(result.output)

    const exectedOutput = testMinify(`
      <source
        srcset="http://images.ctfassets.net/space/account/test.jpg?fm=webp&q=80&w=200&h=100 200w, http://images.ctfassets.net/space/account/test.jpg?fm=webp&q=80&w=400&h=200 400w, http://images.ctfassets.net/space/account/test.jpg?fm=webp&q=80&w=600&h=300 600w, http://images.ctfassets.net/space/account/test.jpg?fm=webp&q=80&w=800&h=400 800w, http://images.ctfassets.net/space/account/test.jpg?fm=webp&q=80&w=1000&h=500 1000w, http://images.ctfassets.net/space/account/test.jpg?fm=webp&q=80&w=1200&h=600 1200w, http://images.ctfassets.net/space/account/test.jpg?fm=webp&q=80&w=1400&h=700 1400w"
        sizes="(min-width: 87.5rem) 87.5rem, 80vw"
        type="image/webp"
      >
      <img
        alt=""
        src="http://images.ctfassets.net/space/account/test.jpg?fm=jpg&q=80&w=1400&h=700"
        srcset="http://images.ctfassets.net/space/account/test.jpg?fm=jpg&q=80&w=200&h=100 200w, http://images.ctfassets.net/space/account/test.jpg?fm=jpg&q=80&w=400&h=200 400w, http://images.ctfassets.net/space/account/test.jpg?fm=jpg&q=80&w=600&h=300 600w, http://images.ctfassets.net/space/account/test.jpg?fm=jpg&q=80&w=800&h=400 800w, http://images.ctfassets.net/space/account/test.jpg?fm=jpg&q=80&w=1000&h=500 1000w, http://images.ctfassets.net/space/account/test.jpg?fm=jpg&q=80&w=1200&h=600 1200w, http://images.ctfassets.net/space/account/test.jpg?fm=jpg&q=80&w=1400&h=700 1400w"
        sizes="(min-width: 87.5rem) 87.5rem, 80vw"
        width="1400"
        height="700"
        loading="lazy"
        decoding="async"
      >
    `)

    const expectedResult = {
      output: exectedOutput,
      aspectRatio: 0.5,
      naturalWidth: 1800,
      naturalHeight: 900,
      src: 'http://images.ctfassets.net/space/account/test.jpg?fm=webp&q=80&w=1400&h=700',
      srcFallback: 'http://images.ctfassets.net/space/account/test.jpg?fm=jpg&q=80&w=1400&h=700',
      srcset: [
        'http://images.ctfassets.net/space/account/test.jpg?fm=webp&q=80&w=200&h=100 200w',
        'http://images.ctfassets.net/space/account/test.jpg?fm=webp&q=80&w=400&h=200 400w',
        'http://images.ctfassets.net/space/account/test.jpg?fm=webp&q=80&w=600&h=300 600w',
        'http://images.ctfassets.net/space/account/test.jpg?fm=webp&q=80&w=800&h=400 800w',
        'http://images.ctfassets.net/space/account/test.jpg?fm=webp&q=80&w=1000&h=500 1000w',
        'http://images.ctfassets.net/space/account/test.jpg?fm=webp&q=80&w=1200&h=600 1200w',
        'http://images.ctfassets.net/space/account/test.jpg?fm=webp&q=80&w=1400&h=700 1400w'
      ],
      sizes: '(min-width: 87.5rem) 87.5rem, 80vw'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return contentful image details at specified height', () => {
    config.cms.name = 'contentful'

    const result = getImage({
      height: 200,
      data: {
        url: 'http://images.ctfassets.net/space/account/test.png',
        width: 2400,
        height: 600,
        format: 'png',
        alt: 'Test'
      }
    }, true)

    result.output = testMinify(result.output)

    const exectedOutput = testMinify(`
      <img
        alt="Test"
        src="http://images.ctfassets.net/space/account/test.png?fm=webp&q=75&w=800&h=200"
        srcset="http://images.ctfassets.net/space/account/test.png?fm=webp&q=75&w=200&h=50 200w, http://images.ctfassets.net/space/account/test.png?fm=webp&q=75&w=400&h=100 400w, http://images.ctfassets.net/space/account/test.png?fm=webp&q=75&w=600&h=150 600w, http://images.ctfassets.net/space/account/test.png?fm=webp&q=75&w=800&h=200 800w"
        sizes="(min-width: 50rem) 50rem, 100vw"
        width="800"
        height="200"
        loading="lazy"
        decoding="async"
      >
    `)

    const expectedResult = {
      output: exectedOutput,
      aspectRatio: 0.25,
      naturalWidth: 2400,
      naturalHeight: 600,
      src: 'http://images.ctfassets.net/space/account/test.png?fm=webp&q=75&w=800&h=200',
      srcFallback: 'http://images.ctfassets.net/space/account/test.png?fm=png&q=75&w=800&h=200',
      srcset: [
        'http://images.ctfassets.net/space/account/test.png?fm=webp&q=75&w=200&h=50 200w',
        'http://images.ctfassets.net/space/account/test.png?fm=webp&q=75&w=400&h=100 400w',
        'http://images.ctfassets.net/space/account/test.png?fm=webp&q=75&w=600&h=150 600w',
        'http://images.ctfassets.net/space/account/test.png?fm=webp&q=75&w=800&h=200 800w'
      ],
      sizes: '(min-width: 50rem) 50rem, 100vw'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return wordpress image details', () => {
    config.cms.name = 'wordpress'

    const result = getImage({
      maxWidth: 1100,
      data: {
        url: 'http://wp.com/test.png',
        width: 2200,
        height: 220,
        format: 'png',
        alt: 'Test',
        sizes: {
          200: 'http://wp.com/test-200x20.png',
          400: 'http://wp.com/test-400x40.png',
          600: 'http://wp.com/test-600x60.png',
          800: 'http://wp.com/test-800x80.png',
          1000: 'http://wp.com/test-1000x100.png'
        }
      }
    }, true)

    result.output = testMinify(result.output)

    const exectedOutput = testMinify(`
      <img
        alt="Test"
        src="http://wp.com/test.png"
        srcset="http://wp.com/test-200x20.png 200w, http://wp.com/test-400x40.png 400w, http://wp.com/test-600x60.png 600w, http://wp.com/test-800x80.png 800w, http://wp.com/test-1000x100.png 1000w"
        sizes="(min-width: 62.5rem) 62.5rem, 100vw"
        width="1000"
        height="100"
        loading="lazy"
        decoding="async"
      >
    `)

    const expectedResult = {
      output: exectedOutput,
      aspectRatio: 0.1,
      naturalWidth: 2200,
      naturalHeight: 220,
      src: 'http://wp.com/test.png',
      srcFallback: 'http://wp.com/test.png',
      srcset: [
        'http://wp.com/test-200x20.png 200w',
        'http://wp.com/test-400x40.png 400w',
        'http://wp.com/test-600x60.png 600w',
        'http://wp.com/test-800x80.png 800w',
        'http://wp.com/test-1000x100.png 1000w'
      ],
      sizes: '(min-width: 62.5rem) 62.5rem, 100vw'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return wordpress image output', () => {
    config.cms.name = 'wordpress'

    const result = getImage({
      maxWidth: 700,
      lazy: false,
      classes: 'test',
      attr: 'id="test"',
      alt: '',
      data: {
        url: 'http://wp.com/test.jpg',
        width: 1600,
        height: 800,
        format: 'jpg',
        alt: 'Test',
        sizes: {
          200: 'http://wp.com/test-200x100.jpg',
          400: 'http://wp.com/test-400x200.jpg',
          600: 'http://wp.com/test-600x300.jpg',
          800: 'http://wp.com/test-800x400.jpg'
        }
      }
    })

    const expectedResult = testMinify(`
      <img
        alt=""
        role="presentation"
        aria-hidden="true"
        src="data:image/svg+xml;charset=utf-8,%3Csvg height='400' width='800' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E" style="pointerEvents: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%"
      >
      <img
        class="test"
        alt=""
        src="http://wp.com/test.jpg"
        srcset="http://wp.com/test-200x100.jpg 200w, http://wp.com/test-400x200.jpg 400w, http://wp.com/test-600x300.jpg 600w, http://wp.com/test-800x400.jpg 800w"
        sizes="(min-width: 50rem) 50rem, 100vw"
        width="800"
        height="400"
        id="test"
        loading="eager"
        fetchpriority="high"
      >
    `)

    expect(testMinify(result)).toEqual(expectedResult)
  })

  it('should return wordpress image output with max natural width', () => {
    config.cms.name = 'wordpress'

    const result = getImage({
      maxWidth: 1600,
      lazy: false,
      alt: '',
      data: {
        url: 'http://wp.com/test.jpg',
        width: 1600,
        height: 800,
        format: 'jpg',
        alt: 'Test',
        sizes: {
          200: 'http://wp.com/test-200x100.jpg',
          400: 'http://wp.com/test-400x200.jpg',
          600: 'http://wp.com/test-600x300.jpg',
          800: 'http://wp.com/test-800x400.jpg'
        }
      }
    })

    const expectedResult = testMinify(`
      <img
        alt=""
        role="presentation"
        aria-hidden="true"
        src="data:image/svg+xml;charset=utf-8,%3Csvg height='800' width='1600' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E" style="pointerEvents: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%"
      >
      <img
        alt=""
        src="http://wp.com/test.jpg"
        srcset="http://wp.com/test-200x100.jpg 200w, http://wp.com/test-400x200.jpg 400w, http://wp.com/test-600x300.jpg 600w, http://wp.com/test-800x400.jpg 800w, http://wp.com/test.jpg 1600w"
        sizes="(min-width: 100rem) 100rem, 100vw"
        width="1600"
        height="800"
        loading="eager"
        fetchpriority="high"
      >
    `)

    expect(testMinify(result)).toEqual(expectedResult)
  })

  it('should return wordpress image output at specified width and height', () => {
    config.cms.name = 'wordpress'

    const result = getImage({
      width: 200,
      height: 200,
      data: {
        url: 'http://wp.com/test.gif',
        width: 800,
        height: 800,
        format: 'gif',
        sizes: {
          200: 'http://wp.com/test-200x200.gif'
        }
      }
    })

    const expectedResult = testMinify(`
      <img
        alt=""
        src="http://wp.com/test.gif"
        srcset="http://wp.com/test-200x200.gif 200w"
        sizes="(min-width: 12.5rem) 12.5rem, 100vw"
        width="200"
        height="200"
        loading="lazy"
        decoding="async"
      >
    `)

    expect(testMinify(result)).toEqual(expectedResult)
  })
})

/* Test getImageClosestSize */

describe('getImageClosestSize()', () => {
  it('should return 200 if size is null', () => {
    // @ts-expect-error - test null size
    const result = getImageClosestSize(null)
    const expectedResult = 200

    expect(result).toBe(expectedResult)
  })

  it('should return closest size to 0', () => {
    const result = getImageClosestSize(0)
    const expectedResult = 200

    expect(result).toBe(expectedResult)
  })

  it('should return closest size to 4000', () => {
    const result = getImageClosestSize(4000)
    const expectedResult = 2000

    expect(result).toBe(expectedResult)
  })

  it('should return closest size to 0', () => {
    const result = getImageClosestSize(0)
    const expectedResult = 200

    expect(result).toBe(expectedResult)
  })

  it('should return closest size to 900', () => {
    const result = getImageClosestSize(900)
    const expectedResult = 1000

    expect(result).toBe(expectedResult)
  })
})

/* Test getImageSizes */

describe('getImageSizes()', () => {
  const widths = {
    12: 1,
    11: 0.9166,
    10: 0.8333,
    9: 0.75,
    8: 0.6667,
    7: 0.6,
    6: 0.5,
    5: 0.4,
    4: 0.3333,
    3: 0.25,
    2: 0.1666
  }

  const maxWidths = {
    container: 1200
  }

  const breakpoints = [
    0,
    600,
    900,
    1200
  ]

  it('should return fallback if args is null', () => {
    // @ts-expect-error - test null args
    const result = getImageSizes(null)
    const expectedResult = {
      maxWidth: 0,
      sizes: ''
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return fallback if parents, widths, maxWidths and breakpoints are null or empty', () => {
    const result = getImageSizes({
      parents: [],
      // @ts-expect-error - test null widths
      widths: null,
      // @ts-expect-error - test null max widths
      maxWidths: null,
      breakpoints: []
    })

    const expectedResult = {
      maxWidth: 0,
      sizes: ''
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return fallback if parents are an array of null', () => {
    const result = getImageSizes({
      // @ts-expect-error - test null parents
      parents: [null, null, null, null],
      widths,
      maxWidths,
      breakpoints
    })

    const expectedResult = {
      maxWidth: 0,
      sizes: ''
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return fallback if parent args are null', () => {
    const result = getImageSizes({
      parents: [
        {
          renderType: 'container',
          // @ts-expect-error - test null args
          args: null
        },
        {
          renderType: 'column',
          // @ts-expect-error - test null args
          args: null
        }
      ],
      widths,
      maxWidths,
      breakpoints
    })

    const expectedResult = {
      maxWidth: 0,
      sizes: ''
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return container width if single container parent', () => {
    const result = getImageSizes({
      parents: [
        {
          renderType: 'container',
          args: {
            maxWidth: 'container'
          }
        }
      ],
      widths,
      maxWidths,
      breakpoints
    })

    const expectedResult = {
      maxWidth: 2400,
      sizes: '(min-width: 75rem) 75rem, 100vw'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return large breakpoint 2x if empty column widths and container', () => {
    const result = getImageSizes({
      parents: [
        {
          renderType: 'container',
          args: {
            maxWidth: 'none'
          }
        },
        {
          renderType: 'column',
          args: {
            width: '',
            widthSmall: '',
            widthMedium: '',
            widthLarge: ''
          }
        }
      ],
      widths,
      maxWidths,
      breakpoints
    })

    const expectedResult = {
      maxWidth: 2400,
      sizes: '(min-width: 75rem) 75rem, 100vw'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return width relative to container', () => {
    const result = getImageSizes({
      parents: [
        {
          renderType: 'container',
          args: {
            maxWidth: 'container'
          }
        },
        {
          renderType: 'column',
          args: {
            width: '5'
          }
        }
      ],
      widths,
      maxWidths,
      breakpoints
    })

    const expectedResult = {
      maxWidth: 960,
      sizes: '(min-width: 75rem) 30rem, 40vw'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return width large relative to container when large breakpoint > container', () => {
    const result = getImageSizes({
      parents: [
        {
          renderType: 'container',
          args: {
            maxWidth: 'container'
          }
        },
        {
          renderType: 'column',
          args: {
            width: '12',
            widthSmall: '10',
            widthMedium: '',
            widthLarge: '8'
          }
        }
      ],
      widths,
      maxWidths,
      breakpoints: [
        0,
        375,
        750,
        1500
      ]
    })

    const expectedResult = {
      maxWidth: 1600,
      sizes: '(min-width: 93.75rem) 50rem, (min-width: 23.4375rem) 83.33vw, 100vw'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return width medium relative to medium breakpoint if container none', () => {
    const result = getImageSizes({
      parents: [
        {
          renderType: 'container',
          args: {
            maxWidth: 'none'
          }
        },
        {
          renderType: 'column',
          args: {
            width: '12',
            widthSmall: '',
            widthMedium: '',
            widthLarge: '5'
          }
        }
      ],
      widths,
      maxWidths,
      breakpoints: [
        0,
        375,
        750,
        1500
      ]
    })

    const expectedResult = {
      maxWidth: 1500,
      sizes: '(min-width: 93.75rem) 40vw, 100vw'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return width large relative to large breakpoint if no container parent', () => {
    const result = getImageSizes({
      parents: [
        {
          renderType: 'column',
          args: {
            width: '12',
            widthSmall: '10',
            widthMedium: '',
            widthLarge: '8'
          }
        }
      ],
      widths,
      maxWidths,
      breakpoints: [
        0,
        375,
        750,
        1500
      ]
    })

    const expectedResult = {
      maxWidth: 2000,
      sizes: '(min-width: 93.75rem) 66.67vw, (min-width: 23.4375rem) 83.33vw, 100vw'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return width small relative to container', () => {
    const result = getImageSizes({
      parents: [
        {
          renderType: 'container',
          args: {
            maxWidth: 'container'
          }
        },
        {
          renderType: 'column',
          args: {
            width: '12',
            widthSmall: '',
            widthMedium: '6',
            widthLarge: ''
          }
        }
      ],
      widths,
      maxWidths,
      breakpoints
    })

    const expectedResult = {
      maxWidth: 1200,
      sizes: '(min-width: 75rem) 37.5rem, (min-width: 56.25rem) 50vw, 100vw'
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return width medium relative to container rounded to config size if source is local', () => {
    const result = getImageSizes({
      source: 'local',
      parents: [
        {
          renderType: 'container',
          args: {
            maxWidth: 'container'
          }
        },
        {
          renderType: 'column',
          args: {
            width: '12',
            widthSmall: '10',
            widthMedium: '',
            widthLarge: '6'
          }
        }
      ],
      widths,
      maxWidths,
      viewportWidth: 80,
      breakpoints
    })

    const expectedResult = {
      maxWidth: 1600,
      sizes: '(min-width: 75rem) 37.5rem, (min-width: 37.5rem) 66.664vw, 80vw'
    }

    expect(result).toEqual(expectedResult)
  })
})
