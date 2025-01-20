export const taxonomies = [
  {
    id: 'category',
    title: 'Categories',
    slug: 'category',
    description: '',
    contentType: 'taxonomy',
    contentTypes: [
      'post'
    ],
    hierarchical: true,
    rest_base: 'categories',
    rest_namespace: 'wp/v2'
  },
  {
    id: 'post_tag',
    title: 'Tags',
    slug: 'tag',
    description: '',
    contentType: 'taxonomy',
    contentTypes: [
      'post'
    ],
    hierarchical: false,
    rest_base: 'tags',
    rest_namespace: 'wp/v2'
  },
  {
    id: 'nav_menu',
    title: 'Navigation Menus',
    slug: 'nav_menu',
    description: '',
    contentType: 'taxonomy',
    contentTypes: [
      'nav_menu_item'
    ],
    hierarchical: false,
    rest_base: 'menus',
    rest_namespace: 'wp/v2'
  },
  {
    id: 'wp_pattern_category',
    title: 'Pattern Categories',
    slug: 'wp_pattern_category',
    description: '',
    contentType: 'taxonomy',
    contentTypes: [
      'wp_block'
    ],
    hierarchical: false,
    rest_base: 'wp_pattern_category',
    rest_namespace: 'wp/v2'
  }
]
