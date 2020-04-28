const isFunction = x => typeof x === 'function'

const flow = (...fns) => {
  for (i = 0; i < fns.length; i++) {
    if (!isFunction(fns[i])) {
      throw new TypeError(`${typeof fns[i]} [${i}] is not a function`)
    }
  }
  if (fns.length === 0) return x => x
  const flowed = async (...x) => {
    let y = await fns[0](...x), i = 1
    while (i < fns.length) {
      y = await fns[i](y)
      i += 1
    }
    return y
  }
  return flowed
}

const _ = {
  flow,
}

module.exports = _
