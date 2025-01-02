export const menuItems = [
  {
    id: '10',
    title: 'Home',
    link: 'http://wp.com/home/',
    attrTitle: '',
    description: '',
    contentType: 'navigationItem',
    internalLink: {
      contentType: 'page',
      slug: 'home',
      id: '7'
    },
    children: [
      {
        id: '11',
        menuOrder: 2,
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
    attrTitle: 'Test Attr',
    description: 'test description',
    contentType: 'navigationItem',
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
    attrTitle: '',
    description: '',
    contentType: 'navigationItem',
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
    attrTitle: '',
    description: '',
    contentType: 'navigationItem',
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
