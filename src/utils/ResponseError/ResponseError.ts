/**
 * Utils - Response Error
 */

/**
 * Custom exception to include fetch response
 */
class ResponseError extends Error {
  /**
   * Store response data
   *
   * @type {Response|undefined}
   */
  response: Response | undefined

  /**
   * Set properties
   *
   * @param {string} message
   * @param {Response} [resp]
   */
  constructor (message: string, resp?: Response) {
    super(message)
    this.message = message

    if (resp !== undefined) {
      this.response = resp
    }
  }
}

/* Exports */

export { ResponseError }
