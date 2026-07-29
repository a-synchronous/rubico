/**
 * rubico may be freely distributed under the CFOSS license.
 */

const callProp = (property, ...args) => function callingProp(object) {
  return object[property](...args)
}

export default callProp
