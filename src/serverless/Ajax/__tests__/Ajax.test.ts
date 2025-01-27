/**
 * Serverless - Ajax Test
 */

/* Imports */

import { it, expect, describe, vi, beforeAll } from 'vitest'
import { testContext } from '../../../../tests/utils.js'
import { Ajax } from '../Ajax.js'

/* Tests */

describe('Ajax()', () => {
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('should...', async () => {
    const result = await Ajax(testContext(
      'http://test.com/',
      'POST',
      {
        name: 'John',
        email: 'john@example.com'
      }
    // @ts-expect-error - test null setupServerless
    ), null)

    const status = result.status
    const message = await result.json()
    const expectedStatus = 500
    const expectedMessage = {
      error: 'setupServerless is not a function'
    }

    expect(status).toBe(expectedStatus)
    expect(message).toEqual(expectedMessage)
  })
})
