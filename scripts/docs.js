/**
 * Scripts - Docs
 */

/* Imports */

import { renderMarkdownDocs } from '@alanizcreative/formation-docs/docs.js'

/* Create README */

await renderMarkdownDocs({
  include: 'src/**\/*.ts',
  exclude: 'src/**\/*.test.ts',
  docsExclude: 'src/**\/*Types.ts',
  index: `
  /**
   * @file
   * title: Formation Static
   * Minimal static-site renderer from local JSON, Contentful, or WordPress data. Outputs HTML strings (not files) for build and serverless contexts.
   *
   * @example
   * title: Installation
   * shell: npm install -D @alanizcreative/formation-static
   *
   * @index
   */
  `
})
