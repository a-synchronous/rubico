const util = require('util')
const assert = require('assert')
const _ = {}

_.id = function id(x) { return x }

_.noop = function noop() {}

_.inspect = function inspect(x) { return util.inspect(x, { depth: Infinity }) }

_.spread = function spread(fn) { return x => fn(...x) }

_.throw = e => { throw e }

_.apply = fn => async args => {
  let y = fn
  for (const a of args) y = await y(a)
  return y
}

_.apply.sync = fn => args => {
  let y = fn
  for (const a of args) y = y(a)
  return y
}

_.exists = x => x !== undefined && x !== null

_.dne = x => x === undefined || x === null

_.isFn = x => typeof x === 'function'

_.isString = x => typeof x === 'string'

_.isNumber = x => typeof x === 'number'

_.isBoolean = x => typeof x === 'boolean'

_.is = c => x => _.exists(x) && _.exists(x.constructor) && x.constructor === c

_.isArray = _.is(Array)

_.isObject = _.is(Object)

_.isSet = _.is(Set)

_.isMap = _.is(Map)

_.isBuffer = _.is(Buffer)

_.isSymbol = _.is(Symbol)

_.isPromise = _.is(Promise)

_.isRegExp = _.is(RegExp)

_.new = x => {
  if (_.isString(x)) return ''
  if (_.isNumber(x)) return 0
  if (_.isArray(x)) return []
  if (_.isObject(x)) return {}
  if (_.isSet(x)) return new Set()
  if (_.isMap(x)) return new Map()
  if (_.isBuffer(x)) return Buffer.from('')
  throw new TypeError(`cannot new ${x}`)
}

_.toFn = x => {
  if (_.isFn(x)) return x
  return () => x
}

_.toString = x => `${x}`

_.toInt = x => x === Infinity ? x : parseInt(x, 10)

_.toFloat = parseFloat

_.toArray = x => {
  if (_.dne(x)) return []
  if (_.isString(x)) return Array.of(x)
  if (_.isNumber(x)) return Array.of(x)
  return Array.from(x)
}

_.toSet = x => new Set(_.toArray(x))

const escapeRegex = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

_.toRegExp = (x, flags = '') => {
  if (_.isRegExp(x)) return new RegExp(x, flags)
  if (_.isString(x)) return new RegExp(escapeRegex(x), flags)
  throw new TypeError(`cannot coerce to RegExp ${x}`)
}

_.flow = (...fns) => {
  if (!fns.every(_.isFn)) throw new TypeError('not all fns are fns')
  const ret = async (...x) => {
    if (fns.length === 0) return x[0]
    let y = await fns[0](...x), i = 1
    while (i < fns.length) {
      y = await fns[i](y)
      i += 1
    }
    return y
  }
  ret.toString = () => `flow(${fns.map(_.inspect).join(', ')})`
  return ret
}

_.flow.sync = (...fns) => {
  if (!fns.every(_.isFn)) throw new TypeError('not all fns are fns')
  const ret = (...x) => {
    if (fns.length === 0) return x[0]
    let y = fns[0](...x), i = 1
    while (i < fns.length) {
      y = fns[i](y)
      i += 1
    }
    return y
  }
  ret.toString = () => `flow.sync(${fns.map(_.inspect).join(', ')})`
  return ret
}

_.series = (...fns) => {
  if (!fns.every(_.isFn)) throw new TypeError('not all fns are fns')
  return async (...x) => {
    const y = []
    for (const fn of fns) y.push(await _.toFn(fn)(...x))
    return y
  }
}

_.series.sync = (...fns) => {
  if (!fns.every(_.isFn)) throw new TypeError('not all fns are fns')
  return (...x) => {
    const y = []
    for (const fn of fns) y.push(_.toFn(fn)(...x))
    return y
  }
}

_.switch = (...fns) => {
  const lastFn = fns.length % 2 === 0 ? () => {} : fns.pop()
  return async x => {
    let i = 0
    while (i < fns.length) {
      if (await _.toFn(fns[i])(x)) return _.toFn(fns[i + 1])(x)
      i += 2
    }
    return _.toFn(lastFn)(x)
  }
}

_.switch.sync = (...fns) => {
  const lastFn = fns.length % 2 === 0 ? () => {} : fns.pop()
  return x => {
    let i = 0
    while (i < fns.length) {
      if (_.toFn(fns[i])(x)) return _.toFn(fns[i + 1])(x)
      i += 2
    }
    return _.toFn(lastFn)(x)
  }
}

_.effect = fn => async x => {
  await _.toFn(fn)(x)
  return x
}

_.effect.sync = fn => x => {
  _.toFn(fn)(x)
  return x
}

_.sleep = ms => _.effect(
  () => new Promise(resolve => setTimeout(resolve, ms))
)

_.tryCatch = (tryFn, catchFn) => async x => {
  try {
    return await _.toFn(tryFn)(x)
  } catch (e) {
    e.arguments = [x]
    return await _.toFn(catchFn)(e)
  }
}

_.stryCatch = (tryFn, catchFn) => x => {
  try {
    return _.toFn(tryFn)(x)
  } catch (e) {
    e.arguments = [x]
    return _.toFn(catchFn)(e)
  }
}

_.diverge = fns => {
  if (_.isArray(fns)) return async (...x) => (
    await Promise.all(fns.map(fn => _.toFn(fn)(...x)))
  )
  if (_.isSet(fns)) return async (...x) => {
    const y = new Set(), tasks = []
    for (const fn of fns) {
      const p = _.toFn(fn)(...x)
      if (_.isPromise(p)) tasks.push(p.then(a => y.add(a)))
      else y.add(p)
    }
    await Promise.all(tasks)
    return y
  }
  if (_.isMap(fns)) return async (...x) => {
    const y = new Map(), tasks = []
    for (const [k, fn] of fns) {
      const p = _.toFn(fn)(...x)
      if (_.isPromise(p)) tasks.push(p.then(a => y.set(k, a)))
      else y.set(k, p)
    }
    await Promise.all(tasks)
    return y
  }
  if (_.isObject(fns)) return async (...x) => {
    const y = {}, tasks = []
    for (const k in fns) {
      const p = _.toFn(fns[k])(...x)
      if (_.isPromise(p)) tasks.push(p.then(a => { y[k] = a }))
      else { y[k] = p }
    }
    await Promise.all(tasks)
    return y
  }
  throw new TypeError(`cannot diverge ${fns}`)
}

_.diverge.sync = fns => {
  if (_.isArray(fns)) return (...x) => fns.map(fn => _.toFn(fn)(...x))
  if (_.isSet(fns)) return (...x) => {
    const y = new Set()
    for (const fn of fns) y.add(_.toFn(fn)(...x))
    return y
  }
  if (_.isMap(fns)) return (...x) => {
    const y = new Map()
    for (const [k, fn] of fns) y.set(k, _.toFn(fn)(...x))
    return y
  }
  if (_.isObject(fns)) return (...x) => {
    const y = {}
    for (const k in fns) y[k] = _.toFn(fns[k])(...x)
    return y
  }
  throw new TypeError(`cannot diverge ${fns}`)
}

_.map = fn => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  return async x => {
    if (_.isArray(x)) {
      const tasks = []
      let i = 0
      for (const a of x) {
        tasks.push(fn(a, i))
        i += 1
      }
      return await Promise.all(tasks)
    }
    if (_.isSet(x)) {
      const tasks = []
      let i = 0
      for (const a of x) {
        tasks.push(fn(a, i))
        i += 1
      }
      return new Set(await Promise.all(tasks))
    }
    if (_.isMap(x)) {
      const tasks = [], y = new Map()
      let i = 0
      for (const [k, v] of x) {
        const a = fn(v, i)
        if (_.isPromise(a)) tasks.push(a.then(b => y.set(k, b)))
        else y.set(k, a)
        i += 1
      }
      await Promise.all(tasks)
      return y
    }
    if (_.isObject(x)) {
      const tasks = [], y = {}
      let i = 0
      for (const k in x) {
        const a = fn(x[k], i)
        if (_.isPromise(a)) tasks.push(a.then(b => y[k] = b))
        else y[k] = a
        i += 1
      }
      await Promise.all(tasks)
      return y
    }
    e.message = `cannot map ${x}`
    throw e
  }
}

_.map.sync = fn => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  return x => {
    if (_.isArray(x)) return x.map(fn)
    if (_.isSet(x)) {
      const y = new Set()
      let i = 0
      for (const a of x) {
        y.add(fn(a, i))
        i += 1
      }
      return y
    }
    if (_.isMap(x)) {
      const y = new Map()
      let i = 0
      for (const [k, v] of x) {
        y.set(k, fn(v, i))
        i += 1
      }
      return y
    }
    if (_.isObject(x)) {
      const y = {}
      let i = 0
      for (const k in x) {
        y[k] = fn(x[k], i)
        i += 1
      }
      return y
    }
    e.message = `cannot map ${x}`
    throw e
  }
}

_.serialMap = fn => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  return async x => {
    if (_.isArray(x)) {
      const y = []
      for (const a of x) y.push(await fn(a))
      return y
    }
    if (_.isSet(x)) {
      const y = new Set()
      for (const a of x) y.add(await fn(a))
      return y
    }
    if (_.isMap(x)) {
      const y = new Map()
      for (const [k, v] of x) y.set(k, await fn(v))
      return y
    }
    if (_.isObject(x)) {
      const y = {}
      for (const k in x) y[k] = await fn(x[k])
      return y
    }
    e.message = `cannot serialMap ${x}`
    throw e
  }
}

_.entryMap = fn => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  return async x => {
    if (_.isArray(x)) {
      const tasks = []
      for (const a of x) tasks.push(fn(a))
      return await Promise.all(tasks)
    }
    if (_.isSet(x)) {
      const tasks = []
      for (const a of x) tasks.push(fn(a))
      return new Set(await Promise.all(tasks))
    }
    if (_.isMap(x)) {
      const tasks = []
      for (const a of x) tasks.push(fn(a))
      return new Map(await Promise.all(tasks))
    }
    if (_.isObject(x)) {
      const tasks = []
      for (const k in x) tasks.push(fn([k, x[k]]))
      const y = {}
      for (const [k, v] of await Promise.all(tasks)) y[k] = v
      return y
    }
    e.message = `cannot entryMap ${x}`
    throw e
  }
}

_.entryMap.sync = fn => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  return x => {
    if (_.isArray(x)) return x.map(fn)
    if (_.isSet(x)) {
      const y = new Set()
      for (const a of x) y.add(fn(a))
      return y
    }
    if (_.isMap(x)) {
      const y = new Map()
      for (const a of x) y.set(...fn(a))
      return y
    }
    if (_.isObject(x)) {
      const y = {}
      for (const k in x) {
        const [kn, vn] = fn([k, x[k]])
        y[kn] = vn
      }
      return y
    }
    e.message = `cannot entryMap ${x}`
    throw e
  }
}

_.filter = fn => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  return async x => {
    if (_.isArray(x)) {
      const tasks = []
      for (const a of x) tasks.push((async () => (await fn(a)) && a)())
      return (await Promise.all(tasks)).filter(_.id)
    }
    if (_.isSet(x)) {
      const tasks = []
      for (const a of x) tasks.push((async () => (await fn(a)) && a)())
      return new Set((await Promise.all(tasks)).filter(_.id))
    }
    if (_.isMap(x)) {
      const tasks = [], y = new Map()
      for (const [k, v] of x) tasks.push(
        (async () => { if (await fn(v)) { y.set(k, v) } })()
      )
      await Promise.all(tasks)
      return y
    }
    if (_.isObject(x)) {
      const tasks = [], y = {}
      for (const k in x) tasks.push(
        (async () => { if (await fn(x[k])) { y[k] = x[k] } })()
      )
      await Promise.all(tasks)
      return y
    }
    e.message = `cannot filter ${x}`
    throw e
  }
}

_.filter.sync = fn => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  return x => {
    if (_.isArray(x)) return x.filter(fn)
    if (_.isSet(x)) {
      const y = new Set()
      for (const a of x) { if (!fn(a)) continue; y.add(a) }
      return y
    }
    if (_.isMap(x)) {
      const y = new Map()
      for (const [k, v] of x) { if (!fn(v)) continue; y.set(k, v) }
      return y
    }
    if (_.isObject(x)) {
      const y = {}
      for (const k in x) { if (!fn(x[k])) continue; y[k] = x[k] }
      return y
    }
    e.message = `cannot filter ${x}`
    throw e
  }
}

_.reduce = (fn, x0) => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  return async x => {
    if (_.isArray(x)) {
    } else if (_.isSet(x)) {
      x = Array.from(x)
    } else if (_.isMap(x)) {
      x = [...x.values()]
    } else if (_.isObject(x)) {
      x = Object.values(x)
    } else {
      e.message = `cannot reduce ${x}`
      throw e
    }
    let [y, i] = x0 ? [x0, 0] : [x[0], 1]
    while (i < x.length) {
      y = await fn(y, x[i], i)
      i += 1
    }
    return y
  }
}

_.reduce.sync = (fn, x0) => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  return x => {
    if (_.isArray(x)) {
    } else if (_.isSet(x)) {
      x = Array.from(x)
    } else if (_.isMap(x)) {
      x = [...x.values()]
    } else if (_.isObject(x)) {
      x = Object.values(x)
    } else {
      e.message = `cannot reduce ${x}`
      throw e
    }
    let [y, i] = x0 ? [x0, 0] : [x[0], 1]
    while (i < x.length) {
      y = fn(y, x[i], i)
      i += 1
    }
    return y
  }
}

_.not = fn => async x => !(await _.toFn(fn)(x))

_.not.sync = fn => x => !_.toFn(fn)(x)

_.any = fn => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  return async x => {
    if (_.isObject(x)) {
      for (const k in await _.map(_.toFn(fn))(x)) {
        if (x[k]) return true
      }
      return false
    }
    if (_.isArray(x) || _.isSet(x) || _.isMap(x)) {
      for (const a of await _.map(_.toFn(fn))(x)) {
        if (a) return true
      }
      return false
    }
    e.message = `cannot any ${x}`
    throw e
  }
}

_.any.sync = fn => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  return x => {
    if (_.isArray(x) || _.isSet(x) || _.isMap(x)) {
      for (const a of x) {
        if (_.toFn(fn)(a)) return true
      }
      return false
    }
    if (_.isObject(x)) {
      for (const k in x) {
        if (_.toFn(fn)(x[k])) return true
      }
      return false
    }
    e.message = `cannot any ${x}`
    throw e
  }
}

_.every = fn => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  return async x => {
    if (_.isArray(x) || _.isSet(x) || _.isMap(x)) {
      for (const a of await _.map(_.toFn(fn))(x)) {
        if (!a) return false
      }
      return true
    }
    if (_.isObject(x)) {
      for (const k in await _.map(_.toFn(fn))(x)) {
        if (!x[k]) return false
      }
      return true
    }
    e.message = `cannot every ${x}`
    throw e
  }
}

_.every.sync = fn => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  return x => {
    if (_.isArray(x) || _.isSet(x) || _.isMap(x)) {
      for (const a of x) {
        if (!_.toFn(fn)(a)) return false
      }
      return true
    }
    if (_.isObject(x)) {
      for (const k in x) {
        if (!_.toFn(fn)(x[k])) return false
      }
      return true
    }
    e.message = `cannot every ${x}`
    throw e
  }
}

_.and = (...fns) => (...args) => _.every(fn => _.toFn(fn)(...args))(fns)

_.and.sync = (...fns) => (...args) => _.every.sync(fn => _.toFn(fn)(...args))(fns)

_.or = (...fns) => (...args) => _.any(fn => _.toFn(fn)(...args))(fns)

_.or.sync = (...fns) => (...args) => _.any.sync(fn => _.toFn(fn)(...args))(fns)

_.eq = (...fns) => _.flow(
  _.diverge(fns),
  x => {
    for (let i = 1; i < x.length; i++) {
      if (x[i] !== x[0]) return false
    }
    return true
  },
)

_.eq.sync = (...fns) => _.flow.sync(
  _.diverge.sync(fns),
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

_.lt.sync = (...fns) => _.flow.sync(
  _.diverge.sync(fns),
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

_.lte.sync = (...fns) => _.flow.sync(
  _.diverge.sync(fns),
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

_.gt.sync = (...fns) => _.flow.sync(
  _.diverge.sync(fns),
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

_.gte.sync = (...fns) => _.flow.sync(
  _.diverge.sync(fns),
  x => {
    for (let i = 1; i < x.length; i++) {
      if (x[i - 1] < x[i]) return false
    }
    return true
  },
)

const simpleGet = k => x => {
  if (typeof x !== 'object') return undefined
  if (_.isMap(x)) return x.get(k)
  return x[k]
}

const keyToPath = k => {
  if (_.isString(k)) return _.split('.')(k)
  if (_.isArray(k)) return k
  return [k]
}

_.get = (key, defaultValue) => {
  const path = keyToPath(key)
  return x => {
    let y = x
    for (const k of path) {
      y = simpleGet(k)(y)
      if (_.dne(y)) return defaultValue
    }
    return y
  }
}

_.lookup = x => k => _.get(k)(x)

_.put = (...ents) => async x => {
  const y = { ...x }, tasks = []
  for (const [k, fn] of ents) {
    const a = _.toFn(fn)(x)
    if (_.isPromise(a)) tasks.push(a.then(b => { y[k] = b }))
    else { y[k] = a }
  }
  await Promise.all(tasks)
  return y
}

_.put.sync = (...ents) => x => {
  const y = { ...x }
  for (const [k, fn] of ents) {
    y[k] = _.toFn(fn)(x)
  }
  return y
}

// https://jsperf.com/multi-array-concat/7
_.concat = (...fns) => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  return async x => {
    if (!_.isString(x) && !_.isArray(x)) {
      e.message = `cannot concat to ${x}`
      throw e
    }
    const items = await _.map(fn => _.toFn(fn)(x))(fns)
    return x.constructor.prototype.concat.apply(x, items)
  }
}

_.concat.sync = (...fns) => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  return x => {
    if (!_.isString(x) && !_.isArray(x)) {
      e.message = `cannot concat to ${x}`
      throw e
    }
    const items = _.map.sync(fn => _.toFn(fn)(x))(fns)
    return x.constructor.prototype.concat.apply(x, items)
  }
}

_.has = m => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  return col => {
    if (_.isString(col)) return col.includes(m)
    if (_.isArray(col)) return col.includes(m)
    if (_.isSet(col)) return col.has(m)
    if (_.isMap(col)) return col.has(m)
    if (_.isObject(col)) return !!_.get(m)(col)
    if (_.isBuffer(col)) return _.toString(col).includes(m)
    e.message = `cannot has ${col}`
    throw e
  }
}

_.member = col => {
  if (_.isString(col)) return m => col.includes(m)
  if (_.isArray(col)) return m => col.includes(m)
  if (_.isSet(col)) return m => col.has(m)
  if (_.isMap(col)) return m => col.has(m)
  if (_.isObject(col)) return m => !!_.get(m)(col)
  if (_.isBuffer(x)) return m => _.toString(col).includes(m)
  throw new TypeError(`cannot member ${col}`)
}

_.log = tag => _.effect(() => console.log(tag))

_.trace = _.effect.sync(x => console.log(_.inspect(x)))

_.tracet = tag => _.effect.sync(x => {
  const args = []
  if (_.exists(tag)) args.push(tag)
  args.push(_.inspect(x))
  console.log(...args)
})

_.tracep = (p, tag) => _.effect.sync(x => {
  const args = []
  if (_.exists(tag)) args.push(tag)
  const fmtp = _.isArray(p) ? p.join('.') : p
  args.push(`.${fmtp} -`, _.inspect(_.get(p)(x)))
  console.log(...args)
})

_.tracef = (fn, tag) => _.effect(async x => {
  const args = []
  if (_.exists(tag)) args.push(tag)
  args.push(_.inspect(await _.toFn(fn)(x)))
  console.log(...args)
})

_.tracef.sync = (fn, tag) => _.effect.sync(x => {
  const args = []
  if (_.exists(tag)) args.push(tag)
  args.push(_.inspect(_.toFn(fn)(x)))
  console.log(...args)
})

_.promisify = util.promisify

_.callbackify = util.callbackify

_.promisifyAll = x => {
  const y = {}
  if (!x) return y
  for (k in x) {
    const v = x[k]
    if (!_.isFn(v)) { y[k] = v; continue }
    y[k] = _.promisify(v.bind(x))
  }
  for (k in x.__proto__ || {}) {
    const v = x.__proto__[k]
    if (!_.isFn(v)) { y[k] = v; continue }
    y[k] = _.promisify(v.bind(x))
  }
  return y
}

_.callbackifyAll = x => {
  const y = {}
  if (!x) return y
  for (k in x) {
    const v = x[k]
    if (!_.isFn(v)) { y[k] = v; continue }
    y[k] = _.callbackify(v.bind(x))
  }
  for (k in x.__proto__ || {}) {
    const v = x.__proto__[k]
    if (!_.isFn(v)) { y[k] = v; continue }
    y[k] = _.callbackify(v.bind(x))
  }
  return y
}

_.pick = (...keys) => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  return x => {
    if (!_.isObject(x)) {
      e.message = `cannot pick ${x}`
      throw e
    }
    const y = {}
    for (const k of keys) {
      const v = x[k]
      if (_.dne(v)) continue
      y[k] = v
    }
    return y
  }
}

_.slice = (from, to) => x => {
  if (_.dne(from)) from = 0
  else if (from < 0) from += x.length
  if (_.dne(to)) to = x.length
  else if (to < 0) to += x.length
  from = Math.max(0, Math.min(from, x.length))
  to = Math.max(0, Math.min(to, x.length))
  let y = []
  for (let i = from; i < to; i++) y.push(x[i])
  return y
}

_.replaceOne = (s, r) => {
  if (_.dne(r)) throw new TypeError('no replacement provided')
  if (!_.isString(r) && !_.isNumber(r)) {
    throw new TypeError(`bad replacement ${r}`)
  }
  if (!_.isString(s)) {
    throw new TypeError(`cannot replace ${s}`)
  }
  const rx = _.toRegExp(s)
  const e = new TypeError()
  Error.captureStackTrace(e)
  return x => {
    if (!_.isString(x)) {
      e.message = `cannot replace for ${x}`
      throw e
    }
    return x.replace(rx, _.toString(r))
  }
}

_.replaceAll = (s, r) => {
  if (_.dne(r)) throw new TypeError('no replacement provided')
  if (!_.isString(r) && !_.isNumber(r)) {
    throw new TypeError(`bad replacement ${r}`)
  }
  if (!_.isString(s)) {
    throw new TypeError(`cannot replace ${s}`)
  }
  const rx = _.toRegExp(s, 'g')
  const e = new TypeError()
  Error.captureStackTrace(e)
  return x => {
    if (!_.isString(x)) {
      e.message = `cannot replace for ${x}`
      throw e
    }
    return x.replace(rx, _.toString(r))
  }
}

_.join = d => {
  if (_.dne(d)) throw new TypeError('no delimiter provided')
  if (!_.isString(d) && !_.isNumber(d)) {
    throw new TypeError(`bad delimiter ${d}`)
  }
  const e = new TypeError()
  Error.captureStackTrace(e)
  return x => {
    if (!_.isArray(x)) {
      e.message = `cannot join ${x}`
      throw e
    }
    return x.join(d)
  }
}

_.split = d => {
  if (_.dne(d)) throw new TypeError('no delimiter provided')
  if (!_.isString(d) && !_.isNumber(d)) {
    throw new TypeError(`bad delimiter ${d}`)
  }
  const e = new TypeError()
  Error.captureStackTrace(e)
  return x => {
    if (!_.isString(x)) {
      e.message = `cannot split ${x}`
      throw e
    }
    return x.split(d)
  }
}

_.lowercase = x => {
  if (!_.isString(x)) throw new TypeError(`cannot lowercase ${x}`)
  return x.toLowerCase()
}

_.uppercase = x => {
  if (!_.isString(x)) throw new TypeError(`cannot uppercase ${x}`)
  return x.toUpperCase()
}

_.capitalize = x => {
  if (!_.isString(x)) throw new TypeError(`cannot capitalize ${x}`)
  const s = _.toString(x)
  if (s.length === 0) return ''
  return `${s[0].toUpperCase()}${s.slice(1)}`
}

_.braid = (...rates) => {
  const e = new Error()
  Error.captureStackTrace(e)
  return x => {
    if (!_.isArray(x) || !x.every(_.isArray)) {
      e.name = 'TypeError'
      e.message = 'point must be an array of arrays'
      throw e
    }
    if (x.length !== rates.length) {
      e.message = 'point length must === number of rates'
      throw e
    }
    const y = []
    const iterators = x.map(y => y.values())
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
}

_.unbraid = (...rates) => {
  const e = new Error()
  Error.captureStackTrace(e)
  return x => {
    if (!_.isArray(x)) {
      e.name = 'TypeError'
      e.message = 'point must be an array'
      throw e
    }
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
}

_.transpose = x => {
  if (!_.isArray(x)) throw new TypeError('point must be an array')
  const y = []
  for (let i = 0; i < x.length; i++) {
    for (let j = 0; j < x[i].length; j++) {
      if (!y[j]) y[j] = []
      y[j][i] = x[i][j]
    }
  }
  return y
}

_.flatten = x => {
  if (!_.isArray(x)) throw new TypeError('point must be an array')
  return x.flat(1)
}

_.flattenAll = x => {
  if (!_.isArray(x)) throw new TypeError('point must be an array')
  return x.flat(Infinity)
}

_.uniq = x => {
  if (!_.isArray(x)) throw new TypeError('point must be an array')
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
  if (!_.isArray(x)) throw new TypeError('point must be an array')
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

_.first = x => {
  if (!_.isArray(x)) throw new TypeError('point must be an array')
  return _.get(0)(x)
}

_.last = x => {
  if (!_.isArray(x)) throw new TypeError('point must be an array')
  return x[x.length - 1]
}

_.reverse = x => {
  if (!_.isArray(x)) throw new TypeError('point must be an array')
  return x.slice(0).reverse()
}

_.compare = (a, b) => {
  if (a < b) return -1
  if (a > b) return 1
  return 0
}

_.sort = (order = 1) => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  return x => {
    if (!_.isArray(x)) {
      e.message = 'point must be an array'
      throw e
    }
    return x.sort(
      (a, b) => order * _.compare(a, b)
    )
  }
}

_.sortBy = (k, order = 1) => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  return x => {
    if (!_.isArray(x)) {
      e.message = 'point must be an array'
      throw e
    }
    return x.sort(
      (a, b) => order * _.compare(_.get(k)(a), _.get(k)(b))
    )
  }
}

_.size = x => {
  if (_.isString(x)) return x.length
  if (_.isArray(x)) return x.length
  if (_.isSet(x)) return x.size
  if (_.isMap(x)) return x.size
  if (_.isObject(x)) {
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

_.flip = pair => x => _.get(0)(_.filter.sync(y => y !== x)(pair))

_.spaces = l => {
  let s = ''
  for (let i = 0; i < l; i++) s += ' '
  return s
}

_.prettifyJSON = x => JSON.stringify(x, null, 2)

module.exports = _
