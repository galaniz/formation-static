/**
 * Utils - Scripts
 */

/* Imports */

import type { Scripts, Styles, ScriptsPriority } from './scriptsTypes.js'
import { isArrayStrict } from '../utils/array/array.js'
import { isStringStrict } from '../utils/string/string.js'
import { config } from '../config/config.js'

/**
 * Scripts data per render item.
 *
 * @type {Scripts}
 */
const scripts: Scripts = {
  priority: new Map(),
  deps: new Map(),
  item: new Map(),
  build: new Map(),
  meta: {}
}

/**
 * Styles data per render item.
 *
 * @type {Styles}
 */
const styles: Styles = {
  priority: new Map(),
  deps: new Map(),
  item: new Map(),
  build: new Map()
}

/**
 * Add style or script path and dependencies to item and build maps.
 *
 * @private
 * @param {'styles'|'scripts'} type
 * @param {string} path
 * @param {string[]} [deps]
 * @param {ScriptsPriority} [priority]
 * @return {boolean}
 */
const addScriptStyle = (
  type: 'styles' | 'scripts',
  path: string,
  deps: string[] = [],
  priority?: ScriptsPriority
): boolean => {
  /* Path required */

  if (!isStringStrict(path)) {
    return false
  }

  /* Input and output dir */

  const isScripts = type === 'scripts'
  const assets = isScripts ? scripts : styles
  const ext = isScripts ? 'js' : 'scss'

  const { inputDir, outputDir } = config[type]

  const input = `${inputDir}/${path}.${ext}`
  const output = `${outputDir}/${path}`

  /* Add to item and build */

  assets.item.set(output, input)
  assets.build.set(output, input)

  /* Add deps */

  if (isArrayStrict(deps)) {
    deps.forEach(dep => {
      const depInput = `${inputDir}/${dep}.${ext}`
      const depOutput = `${outputDir}/${dep}`

      if (!assets.deps.has(output)) {
        assets.deps.set(output, new Set())
      }

      assets.deps.get(output)?.add(depOutput)
      assets.item.set(depOutput, depInput)
      assets.build.set(depOutput, depInput)
    })
  }

  /* Add priority */

  if (priority) {
    assets.priority.set(output, priority)
  }

  /* Append success */

  return true
}

/**
 * Add script path and dependencies to item and build maps.
 *
 * @param {string} path
 * @param {string[]} [deps]
 * @param {ScriptsPriority} [priority]
 * @return {boolean}
 */
const addScript = (path: string, deps: string[] = [], priority?: ScriptsPriority): boolean => {
  return addScriptStyle('scripts', path, deps, priority)
}

/**
 * Add style path and dependencies to item and build maps.
 *
 * @param {string} path
 * @param {string[]} [deps]
 * @param {ScriptsPriority} [priority]
 * @return {boolean}
 */
const addStyle = (path: string, deps: string[] = [], priority?: ScriptsPriority): boolean => {
  return addScriptStyle('styles', path, deps, priority)
}

/**
 * Output script or stylesheet elements.
 *
 * @private
 * @param {'styles'|'scripts'} type
 * @param {string} link
 * @return {string}
 */
const outputScriptsStyles = (type: 'styles' | 'scripts', link: string): string => {
  /* Link is required */

  if (!isStringStrict(link)) {
    return ''
  }

  /* Vars */

  const { item, deps, priority } = type === 'scripts' ? scripts : styles

  /* Check if scripts exist */

  if (!item.size) {
    return ''
  }

  /* Sort by dependencies */

  const itemOut = Array.from(item.keys())

  itemOut.sort((a, b) => {
    const aIsDep = deps.get(b)?.has(a)
    const bIsDep = deps.get(a)?.has(b)

    if (aIsDep === true) {
      return -1
    }

    if (bIsDep === true) {
      return 1
    }

    return 0
  })

  /* Output */

  let output = ''

  itemOut.forEach(out => {
    const fetchPriority = priority.has(out) ? ` fetchpriority="${priority.get(out)}"` : ''

    if (type === 'scripts') {
      output += `<script type="module" src="${link}${out}.js"${fetchPriority}></script>`
    }

    if (type === 'styles') {
      output += `<link rel="stylesheet" href="${link}${out}.css" media="all"${fetchPriority}>`
    }
  })

  return output
}

/**
 * Output script elements.
 *
 * @param {string} link
 * @return {string}
 */
const outputScripts = (link: string): string => {
  return outputScriptsStyles('scripts', link)
}

/**
 * Output stylesheet elements.
 *
 * @param {string} link
 * @return {string}
 */
const outputStyles = (link: string): string => {
  return outputScriptsStyles('styles', link)
}

/* Exports */

export {
  scripts,
  styles,
  addScript,
  addStyle,
  outputScripts,
  outputStyles
}
