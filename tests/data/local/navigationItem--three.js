export const navigationItemThree = {
  contentType: 'navigationItem',
  title: 'Three',
  internalLink: {
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
        contentType: 'term',
        title: 'Category One',
        slug: 'category-one',
        taxonomy: {
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
  }
}
