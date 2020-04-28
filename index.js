const isFunction = x => typeof x === 'function'

const toFunction = x => isFunction(x) ? x : (() => x)

const is = fn => x => x && x.constructor && x.constructor === fn

const isArray = is(Array)

const isObject = is(Object)

const isPromise = is(Promise)

const type = x => (x && x.constructor && x.constructor.name) || typeof x

const chain = (fns, args, i = 0) => {
  const y = fns[i](...args)
  if (i === fns.length - 1) return y
  if (isPromise(y)) return new Promise((resolve, reject) => {
    y.then(res => {
      resolve(chain(fns, [res], i + 1))
    }).catch(err => { reject(err) })
  })
  return chain(fns, [y], i + 1)
}

const flow = (...fns) => {
  for (i = 0; i < fns.length; i++) {
    if (isFunction(fns[i])) continue
    throw new TypeError(`${typeof fns[i]} [${i}] is not a function`)
  }
  if (fns.length === 0) return x => x
  return (...x) => chain(fns, x)
}

const diverge = fns => {
  if (isArray(fns)) {
    const _fns = fns.map(toFunction)
    return async (...x) => await Promise.all(_fns.map(f => f(...x)))
  }
  if (isObject(fns)) {
    const _fns = {}
    for (const k in fns) {
      _fns[k] = toFunction(fns[k])
    }
    return async (...x) => {
      const y = {}, tasks = []
      for (const k in _fns) {
        const p = _fns[k](...x)
        if (isPromise(p)) tasks.push(p.then(a => { y[k] = a }))
        else { y[k] = p }
      }
      await Promise.all(tasks)
      return y
    }
  }
  throw new TypeError(`cannot diverge to ${type(fns)}`)
}

const r = {
  flow, diverge,
}

module.exports = r
