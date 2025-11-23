/**
 * Utils - Print Test
 */

/* Imports */

import { it, expect, describe, vi } from 'vitest'
import { print } from '../print.js'

/* Tests */

describe('print()', () => {
  const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
  const mockConsoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
  const mockConsoleInfo = vi.spyOn(console, 'info').mockImplementation(() => undefined)

  it('should print an empty error message on two lines', () => {
    // @ts-expect-error - test undefined params
    print()

    const message = mockConsoleError.mock.calls[0]?.[0] as string
    const expectedMessage = '\x1b[31m\x1b[1mLog: \x1b[0m\n'

    expect(mockConsoleError).toHaveBeenCalledTimes(1)
    expect(message).toBe(expectedMessage)
  })

  it('should print an error message on two lines', () => {
    print('Error', 'Error message')

    const message = mockConsoleError.mock.calls[0]?.[0] as string
    const expectedMessage = '\x1b[31m\x1b[1mError: \x1b[0m\nError message'

    expect(mockConsoleError).toHaveBeenCalledTimes(1)
    expect(message).toBe(expectedMessage)
  })

  it('should print an error message on three lines', () => {
    print('Error', ['Error one', 'Error two'])

    const message = mockConsoleError.mock.calls[0]?.[0] as string
    const expectedMessage = '\x1b[31m\x1b[1mError: \x1b[0m\nError one\nError two'

    expect(mockConsoleError).toHaveBeenCalledTimes(1)
    expect(message).toBe(expectedMessage)
  })

  it('should print a custom error message on two lines', () => {
    print('Error', new Error('Custom error'), 'error')

    const message = mockConsoleError.mock.calls[0]?.[0] as string
    const expectedMessage = '\x1b[31m\x1b[1mError: \x1b[0m\nError: Custom error'

    expect(mockConsoleError).toHaveBeenCalledTimes(1)
    expect(message).toBe(expectedMessage)
  })

  it('should print a warning message on two lines', () => {
    print('Warning', 'Warning message', 'warning')

    const message = mockConsoleWarn.mock.calls[0]?.[0] as string
    const expectedMessage = '\x1b[33m\x1b[1mWarning: \x1b[0m\nWarning message'

    expect(mockConsoleWarn).toHaveBeenCalledTimes(1)
    expect(message).toBe(expectedMessage)
  })

  it('should print an info message on two lines', () => {
    print('Info', 'Info message', 'info')

    const message = mockConsoleInfo.mock.calls[0]?.[0] as string
    const expectedMessage = '\x1b[36m\x1b[1mInfo: \x1b[0m\nInfo message'

    expect(mockConsoleInfo).toHaveBeenCalledTimes(1)
    expect(message).toBe(expectedMessage)
  })

  it('should print a success message on four lines', () => {
    print('Success', ['Success one', 'Success two', 'Success three'], 'success')

    const message = mockConsoleInfo.mock.calls[0]?.[0] as string
    const expectedMessage = '\x1b[32m\x1b[1mSuccess: \x1b[0m\nSuccess one\nSuccess two\nSuccess three'

    expect(mockConsoleInfo).toHaveBeenCalledTimes(1)
    expect(message).toBe(expectedMessage)
  })
})
