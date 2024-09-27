/**
 * Utils - Action
 */

/* Imports */

import type { Actions, ActionsFunctions } from './actionTypes.js'
import { isStringStrict } from '../string/string.js'
import { isArrayStrict } from '../array/array.js'
import { isObjectStrict } from '../object/object.js'
import { isFunction } from '../function/function.js'

/**
 * Store action callbacks by name
 *
 * @type {ActionsFunctions}
 */
let actions: ActionsFunctions = {
  renderStart: [],
  renderEnd: [],
  renderItemStart: [],
  renderItemEnd: []
}

/**
 * Add action to action object
 *
 * @param {string} name
 * @param {function} action
 * @return {boolean}
 */
const addAction = <T extends keyof Actions>(name: T, action: Actions[T]): boolean => {
  if (!isStringStrict(name) || !isFunction(action)) {
    return false
  }

  if (actions[name] === undefined) {
    actions[name] = []
  }

  actions[name].push(action)

  return true
}

/**
 * Remove action from actions object
 *
 * @param {string} name
 * @param {function} action
 * @return {boolean}
 */
const removeAction = <T extends keyof Actions>(name: T, action: Actions[T]): boolean => {
  if (!isStringStrict(name) || !isFunction(action)) {
    return false
  }

  const callbacks = actions[name]

  if (isArrayStrict(callbacks)) {
    const index = callbacks.indexOf(action)

    if (index > -1) {
      callbacks.splice(index, 1)

      return true
    }
  }

  return false
}

/**
 * Run callback functions from actions object
 *
 * @param {string} name
 * @param {*} [args]
 * @return {Promise<void>}
 */
const doActions = async <T>(name: string, args?: T): Promise<void> => {
  const callbacks = actions[name]

  if (isArrayStrict(callbacks)) {
    for (const callback of callbacks) {
      if (isFunction(callback)) {
        await callback(args)
      }
    }
  }
}

/**
 * Empty actions object
 *
 * @return {void}
 */
const resetActions = (): void => {
  actions = {
    renderStart: [],
    renderEnd: [],
    renderItemStart: [],
    renderItemEnd: []
  }
}

/**
 * Fill actions object
 *
 * @param {Actions} args
 * @return {boolean}
 */
const setActions = (args: Partial<Actions>): boolean => {
  if (!isObjectStrict(args)) {
    return false
  }

  const newActions = Object.entries(args)

  if (newActions.length === 0) {
    return false
  }

  resetActions()

  newActions.forEach(([name, action]) => {
    if (action === undefined) {
      return
    }

    addAction(name, action)
  })

  return true
}

/* Exports */

export {
  addAction,
  removeAction,
  doActions,
  resetActions,
  setActions
}
