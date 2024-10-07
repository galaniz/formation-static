/**
 * Utils - File Types
 */

/**
 * @typedef {object} FileServerlessArgs
 * @prop {string} [configExport=config]
 * @prop {string} [configFile=lib/config/config.js]
 * @prop {string} [dataExport=getAllContentfulData]
 * @prop {string} [dataFile=lib/serverless/serverlessData.js]
 * @prop {string} [previewExport=Preview]
 * @prop {string} [previewFile=lib/serverless/serverlessPreview.js]
 * @prop {string} [reloadExport=Reload]
 * @prop {string} [reloadFile=lib/serverless/serverlessReload.js]
 * @prop {string} [ajaxExport=Ajax]
 * @prop {string} [ajaxFile=lib/serverless/serverlessAjax.js]
 */
export interface FileServerlessArgs {
  configExport?: string
  configFile?: string
  dataExport?: string
  dataFile?: string
  previewExport?: string
  previewFile?: string
  reloadExport?: string
  reloadFile?: string
  ajaxExport?: string
  ajaxFile?: string
}
