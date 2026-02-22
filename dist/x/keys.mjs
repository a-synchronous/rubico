/**
 * Rubico v2.8.2
 * https://rubico.land/
 *
 * © Richard Yufei Tong, King of Software
 * Rubico may be freely distributed under the CFOSS license.
 */

const objectKeys = Object.keys

const keys = object => object == null ? []
  : typeof object.keys == 'function' ? [...object.keys()]
  : objectKeys(object)

export default keys
