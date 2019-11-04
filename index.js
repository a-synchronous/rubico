const { promisify, callbackify } = require('util')

const _ = {}

_.promisify = promisify

_.callbackify = callbackify

_.promisifyAll = x => {
  const y = {}
  if (!x) return y
  for (k in x) {
    if (typeof x[k] !== 'function') continue
    y[k] = promisify(x[k].bind(x))
  }
  for (k in x.__proto__ || {}) {
    if (typeof x[k] !== 'function') continue
    y[k] = promisify(x[k].bind(x))
  }
  return y
}

_.callbackifyAll = x => {
  const y = {}
  if (!x) return y
  for (k in x) {
    if (typeof x[k] !== 'function') continue
    y[k] = callbackify(x[k].bind(x))
  }
  for (k in x.__proto__ || {}) {
    if (typeof x[k] !== 'function') continue
    y[k] = callbackify(x[k].bind(x))
  }
  return y
}

_.map = fn => async x => {
  if (x instanceof Array) {
    const tasks = []
    for (const a of x) tasks.push(fn(a))
    return await Promise.all(tasks)
  }
  if (x instanceof Set) {
    const tasks = []
    for (const a of x) tasks.push(fn(a))
    return new Set(await Promise.all(tasks))
  }
  if (x instanceof Map) {
    const tasks = []
    for (const [k, v] of x) tasks.push((async () => [k, await fn(v)])())
    return new Map(await Promise.all(tasks))
  }
  if (x instanceof Object) {
    const tasks = []
    for (const k in x) tasks.push((async () => [k, await fn(x[k])])())
    const y = {}
    for (const [k, v] of await Promise.all(tasks)) y[k] = v
    return y
  }
}

_.syncMap = fn => x => {
  if (x instanceof Array) return x.map(fn)
  if (x instanceof Set) {
    const y = new Set()
    for (const a of x) y.add(fn(a))
    return y
  }
  if (x instanceof Map) {
    const y = new Map()
    for (const [k, v] of x) y.set(k, fn(v))
    return y
  }
  if (x instanceof Object) {
    const y = {}
    for (const k in x) y[k] = fn(x[k])
    return y
  }
}

_.reduce = fn => x0 => async x => {
  let [y, i] = x0 ? [x0, 0] : [x[0], 1]
  while (i < x.length) {
    y = await fn(y, x[i])
    i += 1
  }
  return y
}

_.syncReduce = fn => x0 => x => {
  let [y, i] = x0 ? [x0, 0] : [x[0], 1]
  while (i < x.length) {
    y = fn(y, x[i])
    i += 1
  }
  return y
}

const argsOut = x => x.length <= 1 ? x[0] : x

_.flow = (...fns) => async (...x) => {
  if (fns.length === 0) return argsOut(x)
  let [y, i] = [await fns[0](...x), 1]
  while (i < fns.length) {
    y = await fns[i](y)
    i += 1
  }
  return y
}

_.syncFlow = (...fns) => (...x) => {
  if (fns.length === 0) return argsOut(x)
  let [y, i] = [fns[0](...x), 1]
  while (i < fns.length) {
    y = fns[i](y)
    i += 1
  }
  return y
}

_.amp = (...fns) => async (...x) => {
  if (fns.length === 0) return argsOut(x)
  let [y, i] = [await fns[0](...x), 1]
  if (!y) return y
  while (i < fns.length) {
    y = await fns[i](y)
    if (!y) return y
    i += 1
  }
  return y
}

_.alt = (...fns) => async (...x) => {
  let i = 0
  while (i < fns.length) {
    const y = await fns[i](...x)
    if (y) return y
    i += 1
  }
}

_.parallel = (...fns) => x => _.map(fn => fn(x))(fns)

_.props = async x => {
  const tasks = []
  for (const k in x) tasks.push((async () => [k, await x[k]])())
  const y = {}
  for (const [k, v] of await Promise.all(tasks)) y[k] = v
  return y
}

_.sideEffect = (fn, errFn) => async (...x) => {
  try {
    await fn(...x)
  } catch (e) {
    if (errFn) errFn(...x)(e)
  }
  return argsOut(x)
}

_.trace = tag => _.sideEffect(x => console.log(tag, x))

_.benchmark = fn => tag => async x => {
  const st = Date.now()
  const y = await fn(x)
  console.log(tag, `${Date.now() - st}ms`)
  return y
}

module.exports = _
