/**
 * Utils - Response Error
 */

/**
 * Custom exception to include fetch response.
 */
class ResponseError extends Error {
  /**
   * Response data.
   *
   * @type {Response|undefined}
   */
  response: Response | undefined

  /**
   * Create new instance with given message and response.
   *
   * @param {string} message
   * @param {Response} [resp]
   */
  constructor (message: string, resp?: Response) {
    super(message)
    this.message = message

    if (resp instanceof Response) {
      this.response = resp
    }
  }
}

/* Exports */

export { ResponseError }
