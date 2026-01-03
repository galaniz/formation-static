export const navigationItemThree = {
  id: 'navigationItem--three',
  contentType: 'navigationItem',
  title: 'Three',
  internalLink: {
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
          useContentTypeSlug: true,
          contentTypes: [
            'post'
          ]
        }
      }
    ],
    content: undefined
  }
}
