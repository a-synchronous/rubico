/**
 * rubico v1.8.10
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

const isPromise = value => value != null && typeof value.then == 'function'

// true -> false
const _not = value => !value

const not = function (funcOrValue) {
  if (typeof funcOrValue == 'function') {
    return function logicalInverter(value) {
      const boolean = funcOrValue(value)
      return isPromise(boolean) ? boolean.then(_not) : !boolean
    }
  }
  return !funcOrValue
}

const notSync = func => function notSync(...args) {
  return !func(...args)
}

not.sync = notSync

export default not
