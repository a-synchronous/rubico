/**
 * rubico v1.6.22
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2020 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

const callProp = (property, ...args) => function callingProp(object) {
  return object[property](...args)
}

export default callProp
