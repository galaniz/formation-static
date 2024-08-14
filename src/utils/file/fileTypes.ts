/**
 * Utils - File Types
 */

/**
 * @typedef {object} FileServerlessArgs
 * @prop {string} [packageDir]
 * @prop {string} [configName]
 * @prop {string} [configFile]
 */
export interface FileServerlessArgs {
  packageDir?: string
  configName?: string
  configFile?: string
}
