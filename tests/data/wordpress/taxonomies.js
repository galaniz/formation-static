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
    hierarchical: true
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
    hierarchical: false
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
    hierarchical: false
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
    hierarchical: false
  }
]
