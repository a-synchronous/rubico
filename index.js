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

_.get = key => x => {
  if (_.is(Map)(x)) return x.get(key)
  if (_.isNot(Object)(x)) return undefined
  if (_.is('string')(key)) {
    let y = x
    for (const k of _.split('.')(key)) {
      if (!_.exists(y[k])) return undefined
      y = y[k]
    }
    return y
  }
  if (_.is('number')(key)) return x[key]
  return undefined
}

_.has = k => x => {
  if (_.is('string')(x)) return x.includes(k)
  if (_.is(Array)(x)) return x.includes(k)
  if (_.is(Set)(x)) return x.has(k)
  if (_.is(Map)(x)) return x.has(k)
  if (_.is(Object)(x)) return !!_.get(k)(x)
  throw new TypeError(`cannot has ${x}`)
}

_.lookup = x => k => _.get(k)(x)

_.put = (...ents) => async x => {
  const y = { ...x }, tasks = []
  for (const [k, fn] of ents) {
    const a = fn(x)
    if (_.is(Promise)(a)) tasks.push(a.then(b => { y[k] = b }))
    else { y[k] = a }
  }
  await Promise.all(tasks)
  return y
}

_.sput = (...ents) => x => {
  const y = { ...x }
  for (const [k, fn] of ents) {
    y[k] = fn(x)
  }
  return y
}

_.default = d => x => x || d

_.pick = keys => x => {
  if (_.isNot(Object)(x)) throw new TypeError('point must be an object')
  const y = {}
  for (const k of keys) {
    if (!x.hasOwnProperty(k)) continue
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
    const tasks = [], y = new Map()
    for (const [k, v] of x) {
      const a = fn(v)
      if (_.is(Promise)(a)) tasks.push(a.then(b => y.set(k, b)))
      else y.set(k, a)
    }
    await Promise.all(tasks)
    return y
  }
  if (_.is(Object)(x)) {
    const tasks = [], y = {}
    for (const k in x) {
      const a = fn(x[k])
      if (_.is(Promise)(a)) tasks.push(a.then(b => y[k] = b))
      else y[k] = a
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
    for (const a of x) y.add(fn(a))
    return y
  }
  if (_.is(Map)(x)) {
    const y = new Map()
    for (const [k, v] of x) y.set(k, fn(v))
    return y
  }
  if (_.is(Object)(x)) {
    const y = {}
    for (const k in x) y[k] = fn(x[k])
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

_.diverge = fns => async (...x) => {
  if (_.is(Array)(fns)) return await Promise.all(fns.map(fn => fn(...x)))
  if (_.is(Set)(fns)) {
    const y = new Set(), tasks = []
    for (const fn of fns) {
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
  if (_.is(Array)(fns)) return fns.map(fn => fn(...x))
  if (_.is(Set)(fns)) {
    const y = new Set()
    for (const fn of fns) y.add(fn(...x))
    return y
  }
  if (_.is(Map)(fns)) {
    const y = new Map()
    for (const [k, fn] of fns) y.set(k, fn(...x))
    return y
  }
  if (_.is(Object)(fns)) {
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

_.sleep = ms => _.sideEffect(
  () => new Promise(resolve => setTimeout(resolve, ms))
)

_.first = _.get(0)

_.last = x => x[x.length - 1]

_.reverse = x => x.slice(0).reverse()

_.sort = (order = 1) => x => x.sort((a, b) => order * (a - b))

_.sortBy = (k, order = 1) => x => x.sort((a, b) => order * (a[k] - b[k]))

_.any = fn => _.flow(_.map(fn), _.sany(_.id))

_.sany = fn => x => {
  for (const a of x) {
    if (fn(a)) return true
  }
  return false
}

_.every = fn => _.flow(_.map(fn), _.severy(_.id))

_.severy = fn => x => {
  for (const a of x) {
    if (!fn(a)) return false
  }
  return true
}

_.and = (...fns) => (...args) => _.every(fn => fn(...args))(fns)

_.sand = (...fns) => (...args) => _.severy(fn => fn(...args))(fns)

_.or = (...fns) => (...args) => _.any(fn => fn(...args))(fns)

_.sor = (...fns) => (...args) => _.sany(fn => fn(...args))(fns)

_.exists = x => x !== undefined && x !== null

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

_.once = fn => (...args) => {
  let ret = null
  if (ret) return ret
  ret = fn(...args)
  return ret
}

module.exports = _
