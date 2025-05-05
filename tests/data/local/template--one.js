export const templateOne = {
  id: 'template--one',
  renderType: 'container',
  tag: 'section',
  metadata: {
    tags: [
      {
        id: 'template'
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
                id: 'templateSlot'
              }
            ]
          }
        }
      ]
    }
  ]
}
