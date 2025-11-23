export const postOne = {
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
  content: [
    {
      renderType: 'richText',
      tag: 'h1',
      content: 'Post One'
    },
    {
      renderType: 'richText',
      tag: 'p',
      content: 'This is a post.'
    }
  ]
}
