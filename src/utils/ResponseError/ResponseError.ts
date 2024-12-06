/**
 * Utils - Response Error
 */

/**
 * Custom exception to include fetch response
 */
class ResponseError extends Error {
  /**
   * Response data
   *
   * @type {Response|undefined}
   */
  response: Response | undefined

  /**
   * Set properties
   *
   * @param {string} message
   * @param {Response} [res]
   */
  constructor (message: string, res?: Response) {
    super(message)
    this.message = message

    if (res instanceof Response) {
      this.response = res
    }
  }
}

/* Exports */

export { ResponseError }
