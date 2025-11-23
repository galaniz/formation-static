/**
 * Scripts - Docs
 */

/* Imports */

import { renderMarkdownDocs } from '@alanizcreative/formation-docs/docs.js'

/* Create README */

await renderMarkdownDocs({
  include: 'src/**/*.ts',
  exclude: [
    'src/**/*.test.ts',
    'src/**/*Mock.ts'
  ],
  docsExclude: 'src/**/!(*global)Types.ts',
  docsTypes: 'src/**/*Types.ts',
  index: `
  /**
   * @file
   * title: Formation Static
   * Minimal static-site HTML renderer from JSON, Contentful, or WordPress data. No file output, just HTML strings.
   *
   * @example
   * title: Installation
   * shell: npm install -D @alanizcreative/formation-static
   *
   * @index
   */
  `,
  filterTitle (title, dir) {
    if (dir === 'wordpress') {
      return 'WordPress'
    }

    return title
  }
})
