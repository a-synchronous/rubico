const util = require('util')
const assert = require('assert')

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

_.isIterable = x => {
  if (_.dne(x)) return false
  if (_.is('object')(x)) return true
  return _.is('function')(_.get(Symbol.iterator)(x))
}

_.toString = x => {
  if (_.is('string')(x)) return x
  if (_.is('nil')(x)) return ''
  if (_.is(Object)(x)) return x.toString()
  return `${x}`
}

_.toFn = x => _.is(Function)(x) ? x : () => x

_.toNumber = Number

_.toInt = x => parseInt(x, 10)

_.toFloat = parseFloat

_.toSet = x => new Set(x)

_.entriesToObject = x => {
  const y = {}
  for (const [k, v] of x) y[k] = v
  return y
}

const naiveGet = (key, defaultValue) => x => {
  if (_.isNot(Object)(x)) return defaultValue
  if (_.is('symbol')(key)) return x[key]
  if (_.is(Map)(x)) return x.get(key)
  return x[key]
}

_.get = (key, defaultValue) => {
  if (_.is('string')(key)) return x => {
    let y = x
    for (const k of _.split('.')(key)) {
      y = naiveGet(k)(y)
      if (!_.exists(y)) return defaultValue
    }
    return y
  }
  if (_.is(Array)(key)) return x => {
    let y = x
    for (const k of key) {
      y = naiveGet(k)(y)
      if (!_.exists(y)) return defaultValue
    }
    return y
  }
  return x => naiveGet(key, defaultValue)(x)
}

_.lookup = x => k => _.get(k)(x)

_.has = k => x => {
  if (_.is('string')(x)) return x.includes(k)
  if (_.is(Array)(x)) return x.includes(k)
  if (_.is(Set)(x)) return x.has(k)
  if (_.is(Map)(x)) return x.has(k)
  if (_.is(Object)(x)) return !!_.get(k)(x)
  throw new TypeError(`cannot has ${x}`)
}

_.hasNot = k => x => !_.has(k)(x)

_.isMember = x => k => _.has(k)(x)

_.isNotMember = x => k => !_.has(k)(x)

_.put = (...ents) => async x => {
  const y = { ...x }, tasks = []
  for (const [k, fn] of ents) {
    const a = _.toFn(fn)(x)
    if (_.is(Promise)(a)) tasks.push(a.then(b => { y[k] = b }))
    else { y[k] = a }
  }
  await Promise.all(tasks)
  return y
}

_.sput = (...ents) => x => {
  const y = { ...x }
  for (const [k, fn] of ents) {
    y[k] = _.toFn(fn)(x)
  }
  return y
}

_.default = d => x => x || d

_.pick = keys => x => {
  if (_.isNot(Object)(x)) throw new TypeError('point must be an object')
  const y = {}
  for (const k of keys) {
    if (!_.exists(x[k])) continue
    y[k] = x[k]
  }
  return y
}

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

_.replace = (...args) => x => x.replace(...args)

_.join = d => x => x.join(d)

_.split = d => x => _.toString(x).split(d)

_.slice = (from, to) => x => {
  if (!_.exists(to)) to = x.length
  let y = []
  for (let i = from; i < to; i++) y.push(x[i])
  return y
}

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
    let i = 0
    for (const a of x) {
      tasks.push(fn(a, i))
      i += 1
    }
    return await Promise.all(tasks)
  }
  if (_.is(Set)(x)) {
    const tasks = []
    let i = 0
    for (const a of x) {
      tasks.push(fn(a, i))
      i += 1
    }
    return new Set(await Promise.all(tasks))
  }
  if (_.is(Map)(x)) {
    const tasks = [], y = new Map()
    let i = 0
    for (const [k, v] of x) {
      const a = fn(v, i)
      if (_.is(Promise)(a)) tasks.push(a.then(b => y.set(k, b)))
      else y.set(k, a)
      i += 1
    }
    await Promise.all(tasks)
    return y
  }
  if (_.is(Object)(x)) {
    const tasks = [], y = {}
    let i = 0
    for (const k in x) {
      const a = fn(x[k], i)
      if (_.is(Promise)(a)) tasks.push(a.then(b => y[k] = b))
      else y[k] = a
      i += 1
    }
    await Promise.all(tasks)
    return y
  }
  return await fn(x)
}

_.smap = fn => x => {
  if (_.is(Array)(x)) return x.map(fn)
  if (_.is(Set)(x)) {
    const y = new Set()
    let i = 0
    for (const a of x) {
      y.add(fn(a, i))
      i += 1
    }
    return y
  }
  if (_.is(Map)(x)) {
    const y = new Map()
    let i = 0
    for (const [k, v] of x) {
      y.set(k, fn(v, i))
      i += 1
    }
    return y
  }
  if (_.is(Object)(x)) {
    const y = {}
    let i = 0
    for (const k in x) {
      y[k] = fn(x[k], i)
      i += 1
    }
    return y
  }
  return fn(x)
}

_.mapSeries = fn => async x => {
  if (_.is(Array)(x)) {
    const y = []
    for (const a of x) y.push(await fn(a))
    return y
  }
  if (_.is(Set)(x)) {
    const y = new Set()
    for (const a of x) y.add(await fn(a))
    return y
  }
  if (_.is(Map)(x)) {
    const y = new Map()
    for (const [k, v] of x) y.set(k, await fn(v))
    return y
  }
  if (_.is(Object)(x)) {
    const y = {}
    for (const k in x) y[k] = await fn(x[k])
    return y
  }
  return fn(x)
}

_.mapEntries = fn => async x => {
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

_.smapEntries = fn => x => {
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
    const tasks = [], y = new Map()
    for (const [k, v] of x) tasks.push(
      (async () => { if (await fn(v)) { y.set(k, v) } })()
    )
    await Promise.all(tasks)
    return y
  }
  if (_.is(Object)(x)) {
    const tasks = [], y = {}
    for (const k in x) tasks.push(
      (async () => { if (await fn(x[k])) { y[k] = x[k] } })()
    )
    await Promise.all(tasks)
    return y
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
    for (const [k, v] of x) { if (!fn(v)) continue; y.set(k, v) }
    return y
  }
  if (_.is(Object)(x)) {
    const y = {}
    for (const k in x) { if (!fn(x[k])) continue; y[k] = x[k] }
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

const verifyFunctions = fns => {
  for (const fn of fns) {
    // if (_.exists(fn)) continue
    if (_.is(Function)(fn)) continue
    throw new TypeError(`${fn} is not a function; ${fns.length} items`)
  }
}

_.flow = (...fns) => {
  verifyFunctions(fns)
  return async (...x) => {
    if (fns.length === 0) return argsOut(x)
    let y = await fns[0](...x), i = 1
    while (i < fns.length) {
      y = await fns[i](y)
      i += 1
    }
    return y
  }
}

_.sflow = (...fns) => {
  verifyFunctions(fns)
  return (...x) => {
    if (fns.length === 0) return argsOut(x)
    let y = fns[0](...x), i = 1
    while (i < fns.length) {
      y = fns[i](y)
      i += 1
    }
    return y
  }
}

_.amp = (...fns) => {
  verifyFunctions(fns)
  return async (...x) => {
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
}

_.samp = (...fns) => {
  verifyFunctions(fns)
  return (...x) => {
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
}

_.alt = (...fns) => {
  verifyFunctions(fns)
  return async (...x) => {
    let y = argsOut(x), i = 0
    while (i < fns.length) {
      y = await fns[i](...x)
      if (y) return y
      i += 1
    }
    return y
  }
}

_.salt = (...fns) => {
  verifyFunctions(fns)
  return (...x) => {
    let y = argsOut(x), i = 0
    while (i < fns.length) {
      y = fns[i](...x)
      if (y) return y
      i += 1
    }
    return y
  }
}

_.diverge = fns0 => {
  if (!_.isIterable(fns0)) throw new TypeError('fns must be a container')
  if (_.sany(_.dne)(fns0)) throw new TypeError('fn dne')
  const fns = _.smap(_.toFn)(fns0)
  if (_.is(Array)(fns)) return async (...x) => (
    await Promise.all(fns.map(fn => fn(...x)))
  )
  if (_.is(Set)(fns)) return async (...x) => {
    const y = new Set(), tasks = []
    for (const fn of fns) {
      const p = fn(...x)
      if (_.is(Promise)(p)) tasks.push(p.then(a => y.add(a)))
      else y.add(p)
    }
    await Promise.all(tasks)
    return y
  }
  if (_.is(Map)(fns)) return async (...x) => {
    const y = new Map(), tasks = []
    for (const [k, fn] of fns) {
      const p = fn(...x)
      if (_.is(Promise)(p)) tasks.push(p.then(a => y.set(k, a)))
      else y.set(k, p)
    }
    await Promise.all(tasks)
    return y
  }
  return async (...x) => {
    const y = {}, tasks = []
    for (const k in fns) {
      const p = fns[k](...x)
      if (_.is(Promise)(p)) tasks.push(p.then(a => { y[k] = a }))
      else { y[k] = p }
    }
    await Promise.all(tasks)
    return y
  }
}

_.sdiverge = fns0 => {
  if (!_.isIterable(fns0)) throw new TypeError('fns must be a container')
  if (_.sany(_.dne)(fns0)) throw new TypeError('fn dne')
  const fns = _.smap(_.toFn)(fns0)
  if (_.is(Array)(fns)) return (...x) => fns.map(fn => fn(...x))
  if (_.is(Set)(fns)) return (...x) => {
    const y = new Set()
    for (const fn of fns) y.add(fn(...x))
    return y
  }
  if (_.is(Map)(fns)) return (...x) => {
    const y = new Map()
    for (const [k, fn] of fns) y.set(k, fn(...x))
    return y
  }
  return (...x) => {
    const y = {}
    for (const k in fns) y[k] = fns[k](...x)
    return y
  }
  throw new TypeError('fns must be a container')
}

_.if = (condFn, fn) => {
  verifyFunctions([condFn, fn])
  return async (...x) => {
    if (await condFn(...x)) return await fn(...x)
    return argsOut(x)
  }
}

_.sideEffect = (fn, errFn) => async (...x) => {
  try {
    await fn(...x)
  } catch (e) {
    if (errFn) errFn(...x)(e)
  }
  return argsOut(x)
}

_.log = tag => _.sideEffect(() => console.log(tag))

_.trace = _.sideEffect(console.log)

_.tracep = (p, tag = '') => _.sideEffect(x => console.log(p, _.get(p)(x)), tag)

_.tracef = (fn, tag = '') => _.sideEffect(async x => console.log(await fn(x), tag))

_.benchmark = fn => tag => async x => {
  const st = Date.now()
  const y = await fn(x)
  console.log(tag, `${Date.now() - st}ms`)
  return y
}

const getIterator = x => x.values()

_.braid = rates => (x, y = []) => {
  const iterators = _.smap(getIterator)(x)
  let i = 0
  while (iterators.length > 0) {
    const modi = i % iterators.length
    for (let j = 0; j < rates[modi]; j++) {
      const v = iterators[modi].next()
      if (v.done) {
        iterators.splice(modi, 1)
        break
      }
      y.push(v.value)
    }
    i += 1
  }
  return y
}

_.unbraid = rates => x => {
  const y = []
  for (let k = 0; k < rates.length; k++) y.push([])
  let i = 0, ri = 0
  while (i < x.length) {
    const modi = ri % rates.length
    for (let j = 0; j < rates[modi]; j++) {
      y[modi].push(x[i])
      i += 1
    }
    ri += 1
  }
  return y
}

_.transpose = x => {
  const y = []
  for (let i = 0; i < x.length; i++) {
    for (let j = 0; j < x[i].length; j++) {
      if (!y[j]) y[j] = []
      y[j][i] = x[i][j]
    }
  }
  return y
}

_.flatten = _.sreduce((a, b) => a.concat(b), [])

_.uniq = x => {
  const mem = new Set()
  const y = []
  for (const a of x) {
    if (mem.has(a)) continue
    mem.add(a)
    y.push(a)
  }
  return y
}

_.uniqp = k => x => {
  const mem = new Set()
  const y = []
  for (const a of x) {
    const v = _.get(k)(a)
    if (mem.has(v)) continue
    mem.add(v)
    y.push(a)
  }
  return y
}

/*
_.suniqf = fn => x => {
  const mem = {}
  const y = []
  for (const a of x) {
  }
}
*/

_.sleep = ms => _.sideEffect(
  () => new Promise(resolve => setTimeout(resolve, ms))
)

_.first = _.get(0)

_.last = x => x[x.length - 1]

_.reverse = x => x.slice(0).reverse()

_.sort = (order = 1) => x => x.sort((a, b) => order * (a - b))

_.sortBy = (k, order = 1) => x => x.sort((a, b) => order * (a[k] - b[k]))

_.not = fn => async x => !(await _.toFn(fn)(x))

_.snot = fn => x => !_.toFn(fn)(x)

_.any = fn => _.flow(_.map(fn), _.sany(_.id))

_.sany = fn => x => {
  if (!_.isIterable(x)) return false
  if (_.is(Array)(x) || _.is(Set)(x) || _.is(Map)(x)) {
    for (const a of x) {
      if (_.toFn(fn)(a)) return true
    }
  } else {
    for (const k in x) {
      if (_.toFn(fn)(x[k])) return true
    }
  }
  return false
}

_.every = fn => _.flow(_.map(fn), _.severy(_.id))

_.severy = fn => x => {
  if (!_.isIterable(x)) return false
  if (_.is(Array)(x) || _.is(Set)(x) || _.is(Map)(x)) {
    for (const a of x) {
      if (!_.toFn(fn)(a)) return false
    }
  } else {
    for (const k in x) {
      if (!_.toFn(fn)(x[k])) return false
    }
  }
  return true
}

_.and = (...fns) => (...args) => _.every(fn => _.toFn(fn)(...args))(fns)

_.sand = (...fns) => (...args) => _.severy(fn => _.toFn(fn)(...args))(fns)

_.or = (...fns) => (...args) => _.any(fn => _.toFn(fn)(...args))(fns)

_.sor = (...fns) => (...args) => _.sany(fn => _.toFn(fn)(...args))(fns)

_.eq = (...fns) => _.flow(
  _.diverge(fns),
  x => {
    for (let i = 1; i < x.length; i++) {
      if (x[i] !== x[0]) return false
    }
    return true
  },
)

_.seq = (...fns) => _.sflow(
  _.sdiverge(fns),
  x => {
    for (let i = 1; i < x.length; i++) {
      if (x[i] !== x[0]) return false
    }
    return true
  },
)

_.lt = (...fns) => _.flow(
  _.diverge(fns),
  x => {
    for (let i = 1; i < x.length; i++) {
      if (x[i - 1] >= x[i]) return false
    }
    return true
  },
)

_.slt = (...fns) => _.sflow(
  _.sdiverge(fns),
  x => {
    for (let i = 1; i < x.length; i++) {
      if (x[i - 1] >= x[i]) return false
    }
    return true
  },
)

_.lte = (...fns) => _.flow(
  _.diverge(fns),
  x => {
    for (let i = 1; i < x.length; i++) {
      if (x[i - 1] > x[i]) return false
    }
    return true
  },
)

_.slte = (...fns) => _.sflow(
  _.sdiverge(fns),
  x => {
    for (let i = 1; i < x.length; i++) {
      if (x[i - 1] > x[i]) return false
    }
    return true
  },
)

_.gt = (...fns) => _.flow(
  _.diverge(fns),
  x => {
    for (let i = 1; i < x.length; i++) {
      if (x[i - 1] <= x[i]) return false
    }
    return true
  },
)

_.sgt = (...fns) => _.sflow(
  _.sdiverge(fns),
  x => {
    for (let i = 1; i < x.length; i++) {
      if (x[i - 1] <= x[i]) return false
    }
    return true
  },
)

_.gte = (...fns) => _.flow(
  _.diverge(fns),
  x => {
    for (let i = 1; i < x.length; i++) {
      if (x[i - 1] < x[i]) return false
    }
    return true
  },
)

_.sgte = (...fns) => _.sflow(
  _.sdiverge(fns),
  x => {
    for (let i = 1; i < x.length; i++) {
      if (x[i - 1] < x[i]) return false
    }
    return true
  },
)

_.exists = x => x !== undefined && x !== null

_.dne = x => x === undefined || x === null

_.size = x => {
  if (_.is('string')(x)) return x.length
  if (_.is(Array)(x)) return x.length
  if (_.is(Set)(x)) return x.size
  if (_.is(Map)(x)) return x.size
  if (_.is(Object)(x)) {
    let y = 0
    for (const k in x) if (x.hasOwnProperty(k)) y += 1
    return y
  }
  throw new TypeError(`cannot size ${x}`)
}

_.isEmpty = x => _.size(x) === 0

_.once = fn => (...args) => {
  let ret = null
  if (ret) return ret
  ret = fn(...args)
  return ret
}

_.assert = (...fns) => async x => {
  await _.map(async fn => {
    if (await fn(x)) return
    const e = new Error(`${_.stringifyJSON(x)} did not pass ${_.toString(fn)}`)
    e.name = 'AssertionError'
    throw e
  })(fns)
  return x
}

_.ternary = (cf, lf, rf) => async x => {
  if (await _.toFn(cf)(x)) return await _.toFn(lf)(x)
  return await _.toFn(rf)(x)
}

_.sternary = (cf, lf, rf) => x => {
  if (_.toFn(cf)(x)) return _.toFn(lf)(x)
  return _.toFn(rf)(x)
}

module.exports = _
