/**
 * Rubico v2.8.3
 * https://rubico.land/
 *
 * © Richard Yufei Tong, King of Software
 * Rubico may be freely distributed under the CFOSS license.
 */

const callProp = (property, ...args) => function callingProp(object) {
  return object[property](...args)
}

export default callProp
