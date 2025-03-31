export const pageOne = {
  id: 'page--one',
  contentType: 'page',
  title: 'One',
  slug: 'index',
  featuredMedia: null,
  ref: {
    id: 'post--one',
    contentType: 'post',
    title: 'Post One',
    slug: 'post-one',
    date: '2025-03-24T00:00:00',
    featuredMedia: {
      path: '2025/04/hero',
      name: 'hero.png',
      type: 'image/png',
      format: 'png',
      size: 93,
      width: 8,
      height: 8
    },
    term: [
      {
        id: 'term--category-one',
        contentType: 'term',
        title: 'Category One',
        slug: 'category-one',
        unset: undefined,
        taxonomy: {
          id: 'taxonomy--category',
          contentType: 'taxonomy',
          title: 'Category',
          slug: 'category',
          usePrimaryContentTypeSlug: true,
          contentTypes: [
            'post'
          ]
        }
      }
    ],
    content: undefined
  },
  content: [
    {
      renderType: 'contentTemplate',
      content: [
        {
          id: 'template--one',
          renderType: 'container',
          tag: 'section',
          metadata: {
            tags: [
              {
                id: 'template',
                name: 'Template'
              }
            ]
          },
          content: [
            {
              renderType: 'container',
              tag: 'div',
              content: [
                {
                  metadata: {
                    tags: [
                      {
                        id: 'templateSlot',
                        name: 'Template Slot'
                      }
                    ]
                  }
                }
              ]
            }
          ]
        },
        {
          renderType: 'richText',
          tag: 'h1',
          content: 'Hello World'
        }
      ]
    },
    {
      renderType: 'container',
      tag: 'section',
      content: [
        {
          renderType: 'container',
          content: [
            {
              renderType: 'richText',
              tag: 'h2',
              content: 'Lorem ipsum'
            },
            {
              renderType: 'richText',
              tag: 'p',
              content: [
                {
                  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '
                },
                {
                  tag: 'a',
                  attr: {
                    href: 'https://test.com/',
                    target: '_blank'
                  },
                  content: 'Sed do eiusmod tempor incididunt'
                },
                {
                  content: ' ut labore et '
                },
                {
                  tag: 'a',
                  internalLink: {
                    id: 'page--one',
                    contentType: 'page',
                    title: 'One',
                    slug: 'index',
                    featuredMedia: null,
                    ref: undefined,
                    content: undefined
                  },
                  content: 'dolore magna '
                },
                {
                  content: 'aliqua.'
                }
              ]
            }
          ]
        },
        {
          renderType: 'container',
          content: [
            {
              renderType: 'custom',
              content: [
                {
                  renderType: 'image',
                  image: {
                    path: '2025/03/image',
                    name: 'image.jpg',
                    type: 'image/jpeg',
                    format: 'jpg',
                    size: 267,
                    width: 8,
                    height: 8
                  },
                  alt: ''
                },
                {
                  renderType: 'image',
                  image: {
                    path: '2025/03/test',
                    name: 'test.png',
                    type: 'image/png',
                    format: 'png',
                    size: 93,
                    width: 8,
                    height: 8
                  },
                  alt: 'Test'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
