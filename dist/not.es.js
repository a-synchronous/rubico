/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

const isPromise = value => value != null && typeof value.then == 'function'

// true -> false
const _not = value => !value

const not = func => function logicalInverter(value) {
  if (value != null && typeof value.not == 'function') {
    return value.not(func)
  }
  const boolean = func(value)
  return isPromise(boolean) ? boolean.then(_not) : !boolean
}

const notSync = func => function notSync(...args) {
  return !func(...args)
}

not.sync = notSync

export default not
