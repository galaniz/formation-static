export const menuItems = [
  {
    id: '10',
    title: 'Home',
    link: 'http://wp.com/home/',
    attr_title: '',
    description: '',
    internalLink: {
      contentType: 'page',
      slug: 'home',
      id: '7',
      locale: 'en-CA'
    },
    children: [
      {
        id: '11',
        menu_order: 2,
        title: 'Test'
      }
    ],
    target: '',
    classes: [
      ''
    ],
    xfn: [
      ''
    ],
    meta: []
  },
  {
    id: '11',
    title: 'Test',
    link: '/home/sample-page/',
    attr_title: 'Test Attr',
    description: 'test description',
    internalLink: {
      contentType: 'page',
      slug: 'sample-page',
      id: '2'
    },
    target: '_blank',
    classes: [
      'test-class'
    ],
    xfn: [
      ''
    ],
    meta: []
  },
  {
    id: '15',
    title: 'Uncategorized',
    link: 'http://wp.com/category/uncategorized/',
    attr_title: '',
    description: '',
    internalLink: {
      contentType: 'term',
      slug: 'uncategorized',
      id: '1',
      taxonomy: {
        id: 'category',
        title: '',
        slug: '',
        contentTypes: []
      }
    },
    target: '',
    classes: [
      ''
    ],
    xfn: [
      ''
    ],
    meta: []
  },
  {
    id: '16',
    title: 'Example',
    externalLink: 'http://example.com',
    attr_title: '',
    description: '',
    target: '',
    classes: [
      ''
    ],
    xfn: [
      ''
    ],
    meta: []
  },
  {
    id: '17',
    title: 'Lorem',
    link: 'http://wp.com/lorem/',
    attr_title: '',
    description: '',
    target: '',
    classes: [
      ''
    ],
    xfn: [
      ''
    ],
    meta: []
  }
]
