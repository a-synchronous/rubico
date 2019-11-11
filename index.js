const util = require('util')

const _ = {}

_.is = t => x => {
  if (t === 'int') return Number.isInteger(x)
  if (t === 'nil') return x === undefined  || x === null
  if (typeof t === 'string') return typeof x === t
  if (typeof t === 'function') return x instanceof t
  if (Number.isNaN(t)) return Number.isNaN(x)
  return false
}

_.isNot = t => x => !_.is(t)(x)

_.toString = x => {
  if (_.is('string')(x)) return x
  if (_.is('nil')(x)) return ''
  if (_.is(Object)(x)) return x.toString()
  return `${x}`
}

_.toNumber = Number

_.toInt = x => parseInt(x, 10)

_.toFloat = parseFloat

_.entriesToObject = x => {
  const y = {}
  for (const [k, v] of x) y[k] = v
  return y
}

_.get = (...keys) => x => {
  if (_.isNot(Object)(x)) return undefined
  let y = x
  for (const k of keys) {
    if (!y.hasOwnProperty(k)) return undefined
    y = y[k]
  }
  return y
}

_.lookup = x => k => _.get(k)(x)

_.default = d => x => x || d

_.parseJSON = (x, d) => {
  if (_.is(Object)(x)) return x
  try {
    return JSON.parse(x)
  } catch (e) {
    return d
  }
}

_.stringifyJSON = (x, d) => {
  try {
    return JSON.stringify(_.parseJSON(x))
  } catch (e) {
    return d
  }
}

_.prettifyJSON = spaces => x => {
  try {
    return JSON.stringify(_.parseJSON(x), null, spaces)
  } catch (e) {
    return undefined
  }
}

_.flip = pair => x => _.get(0)(_.sfilter(y => y !== x)(pair))

_.join = d => x => x.join(d)

_.split = d => x => _.toString(x).split(d)

_.toLowerCase = x => _.toString(x).toLowerCase()

_.toUpperCase = x => _.toString(x).toUpperCase()

_.capitalize = x => {
  const s = _.toString(x)
  if (s.length === 0) return ''
  return `${s[0].toUpperCase()}${s.slice(1)}`
}

_.promisify = util.promisify

_.callbackify = util.callbackify

_.promisifyAll = x => {
  const y = {}
  if (!x) return y
  for (k in x) {
    const v = x[k]
    if (_.isNot('function')(v)) { y[k] = v; continue }
    y[k] = _.promisify(v.bind(x))
  }
  for (k in x.__proto__ || {}) {
    const v = x.__proto__[k]
    if (_.isNot('function')(v)) { y[k] = v; continue }
    y[k] = _.promisify(v.bind(x))
  }
  return y
}

_.callbackifyAll = x => {
  const y = {}
  if (!x) return y
  for (k in x) {
    const v = x[k]
    if (_.isNot('function')(v)) { y[k] = v; continue }
    y[k] = _.callbackify(v.bind(x))
  }
  for (k in x.__proto__ || {}) {
    const v = x.__proto__[k]
    if (_.isNot('function')(v)) { y[k] = v; continue }
    y[k] = _.callbackify(v.bind(x))
  }
  return y
}

_.id = x => x

_.map = fn => async x => {
  if (_.is(Array)(x)) {
    const tasks = []
    for (const a of x) tasks.push(fn(a))
    return await Promise.all(tasks)
  }
  if (_.is(Set)(x)) {
    const tasks = []
    for (const a of x) tasks.push(fn(a))
    return new Set(await Promise.all(tasks))
  }
  if (_.is(Map)(x)) {
    const tasks = []
    for (const a of x) tasks.push(fn(a))
    return new Map(await Promise.all(tasks))
  }
  if (_.is(Object)(x)) {
    const tasks = []
    for (const k in x) tasks.push(fn([k, x[k]]))
    const y = {}
    for (const [k, v] of await Promise.all(tasks)) y[k] = v
    return y
  }
  return await fn(x)
}

_.smap = fn => x => {
  if (_.is(Array)(x)) return x.map(fn)
  if (_.is(Set)(x)) {
    const y = new Set()
    for (const a of x) y.add(fn(a))
    return y
  }
  if (_.is(Map)(x)) {
    const y = new Map()
    for (const a of x) y.set(...fn(a))
    return y
  }
  if (_.is(Object)(x)) {
    const y = {}
    for (const k in x) {
      const [kn, vn] = fn([k, x[k]])
      y[kn] = vn
    }
    return y
  }
  return fn(x)
}

_.filter = fn => async x => {
  if (_.is(Array)(x)) {
    const tasks = []
    for (const a of x) tasks.push((async () => (await fn(a)) && a)())
    return (await Promise.all(tasks)).filter(_.id)
  }
  if (_.is(Set)(x)) {
    const tasks = []
    for (const a of x) tasks.push((async () => (await fn(a)) && a)())
    return new Set((await Promise.all(tasks)).filter(_.id))
  }
  if (_.is(Map)(x)) {
    const tasks = []
    for (const a of x) tasks.push((async () => (await fn(a)) && a)())
    return new Map((await Promise.all(tasks)).filter(_.id))
  }
  if (_.is(Object)(x)) {
    const tasks = []
    for (const k in x) tasks.push(
      (async () => (await fn([k, x[k]])) && [k, x[k]])()
    )
    return _.entriesToObject((await Promise.all(tasks)).filter(_.id))
  }
  return (await fn(x)) ? x : undefined
}

_.sfilter = fn => x => {
  if (_.is(Array)(x)) return x.filter(fn)
  if (_.is(Set)(x)) {
    const y = new Set()
    for (const a of x) { if (!fn(a)) continue; y.add(a) }
    return y
  }
  if (_.is(Map)(x)) {
    const y = new Map()
    for (const a of x) { if (!fn(a)) continue; y.set(...a) }
    return y
  }
  if (_.is(Object)(x)) {
    const y = {}
    for (const k in x) { if (!fn([k, x[k]])) continue; y[k] = x[k] }
    return y
  }
  return fn(x) ? x : undefined
}

_.reduce = (fn, x0) => async x => {
  let [y, i] = x0 ? [x0, 0] : [x[0], 1]
  while (i < x.length) {
    y = await fn(y, x[i], i)
    i += 1
  }
  return y
}

_.sreduce = (fn, x0) => x => {
  let [y, i] = x0 ? [x0, 0] : [x[0], 1]
  while (i < x.length) {
    y = fn(y, x[i], i)
    i += 1
  }
  return y
}

const argsOut = x => x.length <= 1 ? x[0] : x

_.flow = (...fns) => async (...x) => {
  if (fns.length === 0) return argsOut(x)
  let y = await fns[0](...x), i = 1
  while (i < fns.length) {
    y = await fns[i](y)
    i += 1
  }
  return y
}

_.sflow = (...fns) => (...x) => {
  if (fns.length === 0) return argsOut(x)
  let y = fns[0](...x), i = 1
  while (i < fns.length) {
    y = fns[i](y)
    i += 1
  }
  return y
}

_.amp = (...fns) => async (...x) => {
  if (fns.length === 0) return argsOut(x)
  let y = await fns[0](...x), i = 1
  if (!y) return y
  while (i < fns.length) {
    y = await fns[i](y)
    if (!y) return y
    i += 1
  }
  return y
}

_.samp = (...fns) => (...x) => {
  if (fns.length === 0) return argsOut(x)
  let y = fns[0](...x), i = 1
  if (!y) return y
  while (i < fns.length) {
    y = fns[i](y)
    if (!y) return y
    i += 1
  }
  return y
}

_.alt = (...fns) => async (...x) => {
  let y = argsOut(x), i = 0
  while (i < fns.length) {
    y = await fns[i](...x)
    if (y) return y
    i += 1
  }
  return y
}

_.salt = (...fns) => (...x) => {
  let y = argsOut(x), i = 0
  while (i < fns.length) {
    y = fns[i](...x)
    if (y) return y
    i += 1
  }
  return y
}

_.diverge = fns => async (...x) => {
  if (_.is(Array)(fns)) return await Promise.all(fns.map(
    fn => _.isNot(Function)(fn) ? fn : fn(...x)
  ))
  if (_.is(Set)(fns)) {
    const y = new Set(), tasks = []
    for (const fn of fns) {
      if (_.isNot(Function)(fn)) { y.add(fn); continue }
      const p = fn(...x)
      if (_.is(Promise)(p)) tasks.push(p.then(a => y.add(a)))
      else y.add(p)
    }
    await Promise.all(tasks)
    return y
  }
  if (_.is(Map)(fns)) {
    const y = new Map(), tasks = []
    for (const [k, fn] of fns) {
      if (_.isNot(Function)(fn)) { y.set(k, fn); continue }
      const p = fn(...x)
      if (_.is(Promise)(p)) tasks.push(p.then(a => y.set(k, a)))
      else y.set(k, p)
    }
    await Promise.all(tasks)
    return y
  }
  if (_.is(Object)(fns)) {
    const y = {}, tasks = []
    for (const k in fns) {
      if (_.isNot(Function)(fns[k])) { y[k] = fns[k]; continue }
      const p = fns[k](...x)
      if (_.is(Promise)(p)) tasks.push(p.then(a => { y[k] = a }))
      else { y[k] = p }
    }
    await Promise.all(tasks)
    return y
  }
  throw new TypeError('fns must be a container')
}

_.sdiverge = fns => (...x) => {
  if (_.is(Array)(fns)) return fns.map(
    fn => _.isNot(Function)(fn) ? fn : fn(...x)
  )
  if (_.is(Set)(fns)) {
    const y = new Set()
    for (const fn of fns) {
      if (_.isNot(Function)(fn)) { y.add(fn); continue }
      y.add(fn(...x))
    }
    return y
  }
  if (_.is(Map)(fns)) {
    const y = new Map()
    for (const [k, fn] of fns) {
      if (_.isNot(Function)(fn)) { y.set(k, fn); continue }
      y.set(k, fn(...x))
    }
    return y
  }
  if (_.is(Object)(fns)) {
    const y = {}
    for (const k in fns) {
      if (_.isNot(Function)(fns[k])) { y[k] = fns[k]; continue }
      y[k] = fns[k](...x)
    }
    return y
  }
  throw new TypeError('fns must be a container')
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
