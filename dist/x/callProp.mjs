/**
 * rubico v2.6.6
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2025 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

const callProp = (property, ...args) => function callingProp(object) {
  return object[property](...args)
}

export default callProp
