export const pageOne = {
  contentType: 'page',
  title: 'One',
  slug: 'index',
  content: [
    {
      renderType: 'contentTemplate',
      content: [
        {
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
                    contentType: 'page',
                    title: 'One',
                    slug: 'index',
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
