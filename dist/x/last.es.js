/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

const last = value => {
  if (value == null) {
    return undefined
  }
  const length = value.length
  return typeof length == 'number' ? value[length - 1] : undefined
}

export default last
