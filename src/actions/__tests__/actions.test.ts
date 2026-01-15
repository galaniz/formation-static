/**
 * Utils - Actions Test
 */

/* Imports */

import type { Actions } from '../actionsTypes.js'
import { it, expect, describe, beforeEach, vi } from 'vitest'
import {
  actions,
  addAction,
  removeAction,
  doActions,
  setActions,
  resetActions
} from '../actions.js'

/**
 * First test action name.
 *
 * @type {string}
 */
const testNameOne: string = 'testName'

/**
 * Second test action name.
 *
 * @type {string}
 */
const testNameTwo: string = 'testNameTwo'

/* Test actions */

describe('actions', () => {
  it('should be map containing 4 empty sets', () => {
    const renderStart = actions.get('renderStart')
    const renderEnd = actions.get('renderEnd')
    const renderItemStart = actions.get('renderItemStart')
    const renderItemEnd = actions.get('renderItemEnd')
    const size = actions.size

    const expectResult = new Set()
    const expectedSize = 4

    expect(renderStart).toEqual(expectResult)
    expect(renderEnd).toEqual(expectResult)
    expect(renderItemStart).toEqual(expectResult)
    expect(renderItemEnd).toEqual(expectResult)
    expect(size).toBe(expectedSize)
  })
})

/* Test addAction */

describe('addAction()', () => {
  beforeEach(() => {
    actions.delete(testNameOne)
  })

  it('should return true if name is a string and action is a function', () => {
    const result = addAction(testNameOne, () => {})
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return false if name is null', () => {
    const name = null
    const action = (): void => {}
    // @ts-expect-error - test null name
    const result = addAction(name, action)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if action is null', () => {
    const name = 'name'
    const action = null
    // @ts-expect-error - test null action
    const result = addAction(name, action)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })
})

/* Test doActions */

describe('doActions()', () => {
  beforeEach(() => {
    actions.delete(testNameOne)
    actions.delete(testNameTwo)
  })

  it('should call action and return true', () => {
    const testAction = vi.fn((arg: boolean): boolean => arg)

    addAction(testNameOne, testAction)
    doActions(testNameOne, true)

    expect(testAction).toHaveBeenCalledTimes(1)
    expect(testAction).toHaveReturnedWith(true)
  })

  it('should only call action two', () => {
    const testActionOne = vi.fn()
    const testActionTwo = vi.fn()

    addAction(testNameOne, testActionOne)
    addAction(testNameTwo, testActionTwo)
    doActions(testNameTwo)
    removeAction(testNameTwo, testActionTwo)

    expect(testActionTwo).toHaveBeenCalledTimes(1)
    expect(testActionOne).not.toHaveBeenCalled()
  })

  it('should not call action if different action name called', () => {
    const testAction = vi.fn()
    const exists = actions.has(testNameTwo)
    const expectExists = false

    addAction(testNameOne, testAction)
    doActions(testNameTwo)

    expect(exists).toBe(expectExists)
    expect(testAction).not.toHaveBeenCalled()
  })

  it('should call async action and return arg value', async () => {
    const testAction = vi.fn((arg: boolean) => new Promise(resolve => {
      resolve(arg)
    }))

    addAction(testNameOne, testAction)
    await doActions(testNameOne, false, true)

    expect(testAction).toHaveBeenCalledTimes(1)
    expect(testAction).toHaveResolvedWith(false)
  })

  it('should call async action and throw error', async () => {
    const testAction = vi.fn(() => new Promise((_resolve, reject) => {
      reject(new Error('Test error'))
    }))

    addAction(testNameOne, testAction)

    await expect(async () => { await doActions(testNameOne, '', true) }).rejects.toThrowError('Test error')
  })

  it('should call mixed actions and return arg value', async () => {
    const testActionOne = vi.fn((arg: string) => new Promise(resolve => {
      resolve(arg)
    }))

    const testActionTwo = vi.fn((arg: string): string => arg)
    const testValue = 'test'

    addAction(testNameOne, testActionOne)
    addAction(testNameOne, testActionTwo)
    await doActions(testNameOne, testValue, true)

    expect(testActionOne).toHaveBeenCalledTimes(1)
    expect(testActionOne).toHaveResolvedWith(testValue)
    expect(testActionTwo).toHaveBeenCalledTimes(1)
    expect(testActionTwo).toHaveReturnedWith(testValue)
  })
})

/* Test removeAction */

describe('removeAction()', () => {
  beforeEach(() => {
    actions.delete(testNameOne)
  })

  it('should return false if name is null', () => {
    const name = null
    const action = (): void => {}
    // @ts-expect-error - test null name
    const result = removeAction(name, action)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if action is null', () => {
    const name = 'name'
    const action = null
    // @ts-expect-error - test null action
    const result = removeAction(name, action)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if action does not exist', () => {
    const name = 'name'
    const action = (): boolean => false
    const result = removeAction(name, action)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return true if name and action exists', () => {
    const testAction = vi.fn()

    addAction(testNameOne, testAction)

    const result = removeAction(testNameOne, testAction)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })
})

/* Test setActions */

describe('setActions()', () => {
  beforeEach(() => {
    actions.delete(testNameOne)
  })

  it('should return false if args are null', () => {
    // @ts-expect-error - test null args
    const result = setActions(null)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if args are an empty object', () => {
    const result = setActions({})
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return true and action should not be added', () => {
    const args: Partial<Actions> = {}
    // @ts-expect-error - test null action
    args[testNameOne] = null

    const result = setActions(args)
    const expectedResult = true

    const existsResult = actions.has(testNameOne)
    const expectedAxistsResult = false

    expect(result).toBe(expectedResult)
    expect(existsResult).toBe(expectedAxistsResult)
  })

  it('should return true and action should be added', () => {
    const args: Partial<Actions> = {}
    args[testNameOne] = () => {}

    const result = setActions(args)
    const expectedResult = true

    const existsResult = actions.has(testNameOne)
    const expectedAxistsResult = true

    expect(result).toBe(expectedResult)
    expect(existsResult).toBe(expectedAxistsResult)
  })
})

/* Test resetActions */

describe('resetActions()', () => {
  beforeEach(() => {
    actions.delete(testNameOne)
  })

  it('should reset map to initial 4 empty sets', () => {
    addAction(testNameOne, () => {})
    addAction('renderStart', async () => {})
    resetActions()

    const renderStart = actions.get('renderStart')
    const renderEnd = actions.get('renderEnd')
    const renderItemStart = actions.get('renderItemStart')
    const renderItemEnd = actions.get('renderItemEnd')
    const size = actions.size

    const expectResult = new Set()
    const expectedSize = 4

    expect(renderStart).toEqual(expectResult)
    expect(renderEnd).toEqual(expectResult)
    expect(renderItemStart).toEqual(expectResult)
    expect(renderItemEnd).toEqual(expectResult)
    expect(size).toBe(expectedSize)
  })
})
