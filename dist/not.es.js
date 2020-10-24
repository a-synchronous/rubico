/**
 * rubico v1.6.3
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2020 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

const isPromise = value => value != null && typeof value.then == 'function'

// true -> false
const _not = value => !value

const not = func => function logicalInverter(...args) {
  const boolean = func(...args)
  return isPromise(boolean) ? boolean.then(_not) : !boolean
}

const notSync = func => function notSync(...args) {
  return !func(...args)
}

not.sync = notSync

export default not
