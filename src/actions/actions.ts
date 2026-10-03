/**
 * Utils - Actions
 */

/* Imports */

import type { Actions, ActionsSet, ActionMap, ActionReturnType } from './actionsTypes.js'
import type { GenericFunction } from '../global/globalTypes.js'
import { isSet, isSetStrict } from '../utils/set/set.js'
import { isStringStrict } from '../utils/string/string.js'
import { isObjectStrict } from '../utils/object/object.js'
import { isFunction } from '../utils/function/function.js'

/**
 * Action callbacks by name.
 *
 * @type {ActionMap}
 */
let actions: ActionMap = new Map([
  ['renderStart', new Set()],
  ['renderEnd', new Set()],
  ['renderItemStart', new Set()],
  ['renderItemEnd', new Set()]
])

/**
 * Add action to action map.
 *
 * @param {string} name
 * @param {GenericFunction} action
 * @return {boolean}
 */
const addAction = <N extends keyof Actions>(name: N, action: NonNullable<ActionsSet[N]>): boolean => {
  if (!isStringStrict(name) || !isFunction(action)) {
    return false
  }

  if (!isSet(actions.get(name))) {
    actions.set(name, new Set())
  }

  actions.get(name)?.add(action)

  return true
}

/**
 * Remove action from actions map.
 *
 * @param {string} name
 * @param {GenericFunction} action
 * @return {boolean}
 */
const removeAction = <N extends keyof Actions>(name: N, action: NonNullable<ActionsSet[N]>): boolean => {
  if (!isStringStrict(name) || !isFunction(action)) {
    return false
  }

  const actionSet = actions.get(name)

  if (!isSet(actionSet)) {
    return false
  }

  return actionSet.delete(action)
}

/**
 * Call asynchronous functions sequentially.
 *
 * @private
 * @param {GenericFunction[]} callbacks
 * @param {*} [args]
 * @return {void}
 */
const doSequentially = async (callbacks: GenericFunction[], args?: unknown): Promise<void> => {
  for (const callback of callbacks) {
    await callback(args)
  }
}

/**
 * Run callback functions from actions map.
 *
 * @param {string} name
 * @param {*} [args]
 * @param {boolean} [isAsync]
 * @return {*}
 */
const doActions = <A extends boolean = false, N extends string & keyof Actions = string>(
  name: N,
  args?: Parameters<Actions[N]>[0],
  isAsync: A = false as A
): ActionReturnType<A> => {
  const actionSet = actions.get(name)

  if (!isSetStrict(actionSet)) {
    return undefined as ActionReturnType<A>
  }

  const callbacks: GenericFunction[] = []

  for (const callback of actionSet.values()) {
    if (isAsync) {
      callbacks.push(callback)
    } else {
      callback(args)
    }
  }

  if (isAsync) {
    return doSequentially(callbacks, args)
      .then(result => result) as ActionReturnType<A> 
  }

  return undefined as ActionReturnType<A>
}

/**
 * Empty actions map.
 *
 * @return {void}
 */
const resetActions = (): void => {
  actions = new Map([
    ['renderStart', new Set()],
    ['renderEnd', new Set()],
    ['renderItemStart', new Set()],
    ['renderItemEnd', new Set()]
  ])
}

/**
 * Fill actions map.
 *
 * @param {Actions} args
 * @return {boolean}
 */
const setActions = (args: ActionsSet): boolean => {
  if (!isObjectStrict(args)) {
    return false
  }

  const newActions = Object.entries(args)

  if (!newActions.length) {
    return false
  }

  resetActions()

  newActions.forEach(([name, action]) => {
    if (!action) {
      return
    }

    addAction(name, action)
  })

  return true
}

/* Exports */

export {
  actions,
  addAction,
  removeAction,
  doActions,
  resetActions,
  setActions
}
