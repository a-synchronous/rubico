/**
 * rubico may be freely distributed under the CFOSS license.
 */

const last = value => {
  if (value == null) {
    return undefined
  }
  const length = value.length
  return typeof length == 'number' ? value[length - 1] : undefined
}

export default last
