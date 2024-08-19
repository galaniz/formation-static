/**
 * Utils - Script Style
 */

/* Imports */

import { config } from '../../config/config.js'
import { isArrayStrict } from '../array/array.js'
import { isStringStrict } from '../string/string.js'

/**
 * Add style or script path and dependencies to item and build maps
 *
 * @private
 * @param {string} type - styles | scripts
 * @param {string} path
 * @param {string[]} [deps]
 * @return {boolean}
 */
const _addScriptStyle = (
  type: 'styles' | 'scripts',
  path: string,
  deps: string[] = []
): boolean => {
  /* Path required */

  if (!isStringStrict(path)) {
    return false
  }

  /* Input and output dir */

  const scripts = config[type]
  const ext = type === 'scripts' ? 'js' : 'scss'

  const { inputDir, outputDir } = scripts

  const input = `${inputDir}/${path}.${ext}`
  const output = `${outputDir}/${path}`

  /* Add to item and build */

  scripts.item.set(output, input)
  scripts.build.set(output, input)

  /* Add deps */

  if (isArrayStrict(deps)) {
    deps.forEach((dep) => {
      const depInput = `${inputDir}/${dep}.${ext}`
      const depOutput = `${outputDir}/${dep}`

      if (!scripts.deps.has(output)) {
        scripts.deps.set(output, new Set())
      }

      scripts.deps.get(output)?.add(depOutput)
      scripts.item.set(depOutput, depInput)
      scripts.build.set(depOutput, depInput)
    })
  }

  /* Append success */

  return true
}

/**
 * Add script path and dependencies to item and build maps
 *
 * @param {string} path
 * @param {string[]} [deps]
 * @return {boolean}
 */
const addScript = (path: string, deps: string[] = []): boolean => {
  return _addScriptStyle('scripts', path, deps)
}

/**
 * Add style path and dependencies to item and build maps
 *
 * @param {string} path
 * @param {string[]} [deps]
 * @return {boolean}
 */
const addStyle = (path: string, deps: string[] = []): boolean => {
  return _addScriptStyle('styles', path, deps)
}

/**
 * Output script or stylesheet elements
 *
 * @private
 * @param {string} type - styles | scripts
 * @param {string} link
 * @return {string}
 */
const _outputScriptsStyles = (type: 'styles' | 'scripts', link: string): string => {
  /* Link is required */

  if (!isStringStrict(link)) {
    return ''
  }

  /* Vars */

  const {
    item,
    deps
  } = config[type]

  /* Check if scripts exist */

  if (item.size === 0) {
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

  itemOut.forEach((out) => {
    if (type === 'scripts') {
      output += `<script type="module" src="${link}${out}.js"></script>`
    }

    if (type === 'styles') {
      output += `<link rel="stylesheet" href="${link}${out}.css" media="all">`
    }
  })

  return output
}

/**
 * Output script elements
 *
 * @param {string} link
 * @return {string}
 */
const outputScripts = (link: string): string => {
  return _outputScriptsStyles('scripts', link)
}

/**
 * Output stylesheet elements
 *
 * @param {string} link
 * @return {string}
 */
const outputStyles = (link: string): string => {
  return _outputScriptsStyles('styles', link)
}

/* Exports */

export {
  addScript,
  addStyle,
  outputScripts,
  outputStyles
}
