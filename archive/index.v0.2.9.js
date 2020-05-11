const util = require('util')
const crypto = require('crypto')

const _ = {}

const setProp = prop => (x, value) => Object.defineProperty(x, prop, { value })
_.setProp = setProp

const setName = setProp('name')
_.setName = setName

const getName = fn => fn.name || 'anonymous'
_.getName = getName

_.exists = x => x !== undefined && x !== null
setName(_.exists, 'exists')

_.dne = x => x === undefined || x === null
setName(_.dne, 'dne')

_.isFn = x => typeof x === 'function'
setName(_.isFn, 'isFn')

_.isString = x => typeof x === 'string'
setName(_.isString, 'isString')

_.isNumber = x => typeof x === 'number'
setName(_.isNumber, 'isNumber')

_.isBigInt = x => typeof x === 'bigint'
setName(_.isBigInt, 'isBigInt')

_.isBoolean = x => typeof x === 'boolean'
setName(_.isBoolean, 'isBoolean')

_.is = fn => {
  const ret = x => _.exists(x) && _.exists(x.constructor) && x.constructor === fn
  setName(ret, `is(${getName(fn)})`)
  return ret
}
setName(_.is, 'is')

_.isArray = _.is(Array)
setName(_.isArray, 'isArray')

_.isObject = _.is(Object)
setName(_.isObject, 'isObject')

_.isSet = _.is(Set)
setName(_.isSet, 'isSet')

_.isMap = _.is(Map)
setName(_.isMap, 'isMap')

_.isBuffer = _.is(Buffer)
setName(_.isBuffer, 'isBuffer')

_.isSymbol = _.is(Symbol)
setName(_.isSymbol, 'isSymbol')

_.isPromise = _.is(Promise)
setName(_.isPromise, 'isPromise')

_.isRegExp = _.is(RegExp)
setName(_.isRegExp, 'isRegExp')

_.id = x => x
setName(_.id, 'id')

_.noop = () => {}
setName(_.noop, 'noop')

_.inspect = x => util.inspect(x, { depth: Infinity })
setName(_.inspect, 'inspect')

_.shorthand = x => {
  if (_.isFn(x)) return getName(x)
  if (_.isString(x)) {
    if (x.length === 0) return '\'\''
    if (x.length > 10) return `'${x.slice(0, 10)}...'{${x.length}}`
    return `'${x}'`
  }
  if (_.isBigInt(x)) return `${x}n`
  if (_.isArray(x)) return x.length === 0 ? '[]' : `[...]{${x.length}}`
  if (_.isObject(x)) {
    const l = Object.keys(x).length
    if (l === 0) return '{}'
    return `{...}{${l}}`
  }
  if (_.isSet(x)) {
    if (x.size === 0) return 'Set{}'
    return `Set{...}{${x.size}}`
  }
  if (_.isMap(x)) {
    if (x.size === 0) return 'Map{}'
    return `Map{...}{${x.size}}`
  }
  if (_.isBuffer(x)) {
    if (x.length === 0) return 'Buffer<>'
    return `Buffer<...>{${x.length}}`
  }
  return `${_.inspect(x)}`.slice(0, 20)
}
setName(_.shorthand, 'shorthand')

_.spread = fn => {
  const ret = x => fn(...x)
  setName(ret, `spread(${getName(fn)})`)
  return ret
}
setName(_.spread, 'spread')

_.throw = e => { throw e }
setName(_.throw, 'throw')

// TODO: apply multiple to arities > 1
_.apply = fn => {
  const ret = x => {
    let y = fn
    for (const a of x) y = y(a)
    if (typeof y === 'function') {
      setName(y, getName(fn) + x.map(y => `(${_.shorthand(y)})`).join(''))
    }
    return y
  }
  setName(ret, `apply(${getName(fn)})`)
  return ret
}
setName(_.apply, 'apply')

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
setName(_.new, 'new')

_.copy = x => {
  if (_.isString(x)) return x
  if (_.isNumber(x)) return x
  if (_.isArray(x)) return x.slice(0)
  if (_.isObject(x)) return Object.assign({}, x)
  if (_.isSet(x)) return new Set(x)
  if (_.isMap(x)) return new Map(x)
  if (_.isBuffer(x)) return Buffer.from(x)
  throw new TypeError(`cannot copy ${x}`)
}
setName(_.copy, 'copy')

_.toFn = x => {
  if (_.isFn(x)) return x
  const ret = () => x
  setName(ret, `() => ${_.shorthand(x)}`)
  return ret
}
setName(_.toFn, 'toFn')

_.toString = x => `${x}`
setName(_.toString, 'toString')

_.toInt = x => x === Infinity ? x : parseInt(x, 10)
setName(_.toInt, 'toInt')

_.toFloat = parseFloat
setName(_.toFloat, 'toFloat')

_.toArray = x => {
  if (_.dne(x)) return []
  if (_.isString(x)) return Array.of(x)
  if (_.isNumber(x)) return Array.of(x)
  return Array.from(x)
}
setName(_.toArray, 'toArray')

_.toSet = x => new Set(_.toArray(x))
setName(_.toSet, 'toSet')

const escapeRegex = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

_.toRegExp = (x, flags = '') => {
  if (_.isRegExp(x)) return new RegExp(x, flags)
  if (_.isString(x)) return new RegExp(escapeRegex(x), flags)
  throw new TypeError(`cannot coerce to RegExp ${x}`)
}
setName(_.toRegExp, 'toRegExp')

// TODO: what if x was a fn? a fn that returned bits off a stream or an item from a large list
//       consider: second argument is accum
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
  setName(ret, `${fns.map(_.shorthand).join('→')}`)
  return ret
}
setName(_.flow, 'flow')

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
  setName(ret, `${fns.map(_.shorthand).join('→')}`)
  return ret
}
setName(_.flow.sync, 'flow')

_.series = (...fns) => {
  if (!fns.every(_.isFn)) throw new TypeError('not all fns are fns')
  const ret = async (...x) => {
    const y = []
    for (const fn of fns) y.push(await _.toFn(fn)(...x))
    return y
  }
  setName(ret, `series(${fns.map(_.shorthand).join(', ')})`)
  return ret
}
setName(_.series, 'series')

_.series.sync = (...fns) => {
  if (!fns.every(_.isFn)) throw new TypeError('not all fns are fns')
  const ret = (...x) => {
    const y = []
    for (const fn of fns) y.push(_.toFn(fn)(...x))
    return y
  }
  setName(ret, `series(${fns.map(_.shorthand).join(', ')})`)
  return ret
}
setName(_.series.sync, 'series')

_.switch = (...fns) => {
  if (fns.length < 3) throw new Error('3 or more fns required')
  if (fns.length % 2 === 0) throw new Error('odd number of fns required')
  fns = fns.map(_.toFn)
  const lastFn = fns.pop()
  const ret = async x => {
    let i = 0
    while (i < fns.length) {
      if (await fns[i](x)) return fns[i + 1](x)
      i += 2
    }
    return lastFn(x)
  }
  setName(ret, `switch(${fns.map(_.shorthand).join(', ')}, ${_.shorthand(lastFn)})`)
  return ret
}
setName(_.switch, 'switch')

_.switch.sync = (...fns) => {
  if (fns.length < 3) throw new Error('3 or more fns required')
  if (fns.length % 2 === 0) throw new Error('odd number of fns required')
  fns = fns.map(_.toFn)
  const lastFn = fns.pop()
  const ret = x => {
    let i = 0
    while (i < fns.length) {
      if (fns[i](x)) return fns[i + 1](x)
      i += 2
    }
    return lastFn(x)
  }
  setName(ret, `switch(${fns.map(_.shorthand).join(', ')}, ${_.shorthand(lastFn)})`)
  return ret
}
setName(_.switch.sync, 'switch')

_.effect = fn => {
  fn = _.toFn(fn)
  const ret = async x => { await fn(x); return x }
  setName(ret, `effect(${_.shorthand(fn)})`)
  return ret
}
setName(_.effect, 'effect')

_.effect.sync = fn => {
  fn = _.toFn(fn)
  const ret = x => { fn(x); return x }
  setName(ret, `effect(${_.shorthand(fn)})`)
  return ret
}
setName(_.effect.sync, 'effect')

_.sleep = ms => {
  const ret = _.effect(
    () => new Promise(resolve => setTimeout(resolve, ms))
  )
  setName(ret, `sleep(${ms})`)
  return ret
}
setName(_.sleep, 'sleep')

_.tryCatch = (tryFn, catchFn) => {
  if (!_.isFn(tryFn)) throw new TypeError('try fn not a fn')
  if (!_.isFn(catchFn)) throw new TypeError('catch fn not a fn')
  const ret = async (...x) => {
    try {
      return await tryFn(...x)
    } catch (e) {
      e._args = x
      return await catchFn(e)
    }
  }
  setName(ret, `tryCatch(${_.shorthand(tryFn)}, ${_.shorthand(catchFn)})`)
  return ret
}
setName(_.tryCatch, 'tryCatch')

_.tryCatch.sync = (tryFn, catchFn) => {
  if (!_.isFn(tryFn)) throw new TypeError('try fn not a fn')
  if (!_.isFn(catchFn)) throw new TypeError('catch fn not a fn')
  const ret = (...x) => {
    try {
      return tryFn(...x)
    } catch (e) {
      e._args = x
      return catchFn(e)
    }
  }
  setName(ret, `tryCatch(${_.shorthand(tryFn)}, ${_.shorthand(catchFn)})`)
  return ret
}
setName(_.tryCatch.sync, 'tryCatch')

// TODO: account for AsyncIterator, Iterator, and Stream points
_.map = (fn, opts = {}) => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  const ret = async x => {
    if (_.isArray(x)) {
      const tasks = []
      let i = 0
      for await (const a of x) {
        tasks.push(fn(a, i))
        i += 1
      }
      return await Promise.all(tasks)
    }
    if (_.isSet(x)) {
      const tasks = []
      let i = 0
      for await (const a of x) {
        tasks.push(fn(a, i))
        i += 1
      }
      return new Set(await Promise.all(tasks))
    }
    if (_.isMap(x)) {
      const tasks = [], y = new Map()
      let i = 0
      for await (const [k, v] of x) {
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
  setName(ret, `map(${_.shorthand(fn)})`)
  return ret
}
setName(_.map, 'map')

_.map.sync = fn => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  const ret = x => {
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
  setName(ret, `map(${_.shorthand(fn)})`)
  return ret
}
setName(_.map.sync, 'map')

// TODO: only support [] and {}
_.diverge = fns => {
  if (_.isArray(fns)) {
    fns = _.map.sync(_.toFn)(fns)
    const ret = async (...x) => (
      await Promise.all(fns.map(fn => fn(...x)))
    )
    setName(ret, `diverge(${_.shorthand(fns)})`)
    return ret
  }
  if (_.isSet(fns)) {
    fns = _.map.sync(_.toFn)(fns)
    const ret = async (...x) => {
      const y = new Set(), tasks = []
      for (const fn of fns) {
        const p = fn(...x)
        if (_.isPromise(p)) tasks.push(p.then(a => y.add(a)))
        else y.add(p)
      }
      await Promise.all(tasks)
      return y
    }
    setName(ret, `diverge(${_.shorthand(fns)})`)
    return ret
  }
  if (_.isMap(fns)) {
    fns = _.map.sync(_.toFn)(fns)
    const ret = async (...x) => {
      const y = new Map(), tasks = []
      for (const [k, fn] of fns) {
        const p = _.toFn(fn)(...x)
        if (_.isPromise(p)) tasks.push(p.then(a => y.set(k, a)))
        else y.set(k, p)
      }
      await Promise.all(tasks)
      return y
    }
    setName(ret, `diverge(${_.shorthand(fns)})`)
    return ret
  }
  if (_.isObject(fns)) {
    fns = _.map.sync(_.toFn)(fns)
    const ret = async (...x) => {
      const y = {}, tasks = []
      for (const k in fns) {
        const p = fns[k](...x)
        if (_.isPromise(p)) tasks.push(p.then(a => { y[k] = a }))
        else { y[k] = p }
      }
      await Promise.all(tasks)
      return y
    }
    setName(ret, `diverge(${_.shorthand(fns)})`)
    return ret
  }
  throw new TypeError(`cannot diverge ${fns}`)
}
setName(_.diverge, 'diverge')

_.diverge.sync = fns => {
  if (_.isArray(fns)) {
    fns = _.map.sync(_.toFn)(fns)
    const ret = (...x) => fns.map(fn => fn(...x))
    setName(ret, `diverge(${_.shorthand(fns)})`)
    return ret
  }
  if (_.isSet(fns)) {
    fns = _.map.sync(_.toFn)(fns)
    const ret = (...x) => {
      const y = new Set()
      for (const fn of fns) y.add(fn(...x))
      return y
    }
    setName(ret, `diverge(${_.shorthand(fns)})`)
    return ret
  }
  if (_.isMap(fns)) {
    fns = _.map.sync(_.toFn)(fns)
    const ret = (...x) => {
      const y = new Map()
      for (const [k, fn] of fns) y.set(k, fn(...x))
      return y
    }
    setName(ret, `diverge(${_.shorthand(fns)})`)
    return ret
  }
  if (_.isObject(fns)) {
    fns = _.map.sync(_.toFn)(fns)
    const ret = (...x) => {
      const y = {}
      for (const k in fns) y[k] = fns[k](...x)
      return y
    }
    setName(ret, `diverge(${_.shorthand(fns)})`)
    return ret
  }
  throw new TypeError(`cannot diverge ${fns}`)
}
setName(_.diverge.sync, 'diverge')

_.serialMap = fn => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  const ret = async x => {
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
  setName(ret, `serialMap(${_.shorthand(fn)})`)
  return ret
}
setName(_.serialMap, 'serialMap')

_.entryMap = fn => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  const ret = async x => {
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
  setName(ret, `entryMap(${_.shorthand(fn)})`)
  return ret
}
setName(_.entryMap, 'entryMap')

_.entryMap.sync = fn => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  const ret = x => {
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
  setName(ret, `entryMap(${_.shorthand(fn)})`)
  return ret
}
setName(_.entryMap.sync, 'entryMap')

_.filter = fn => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  const ret = async x => {
    if (_.isArray(x)) {
      const tasks = []
      for await (const a of x) tasks.push((async () => (await fn(a)) && a)())
      return (await Promise.all(tasks)).filter(_.id)
    }
    if (_.isSet(x)) {
      const tasks = []
      for await (const a of x) tasks.push((async () => (await fn(a)) && a)())
      return new Set((await Promise.all(tasks)).filter(_.id))
    }
    if (_.isMap(x)) {
      const tasks = [], y = new Map()
      for await (const [k, v] of x) tasks.push(
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
  setName(ret, `filter(${_.shorthand(fn)})`)
  return ret
}
setName(_.filter, 'filter')

_.filter.sync = fn => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  const ret = x => {
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
  setName(ret, `filter(${_.shorthand(fn)})`)
  return ret
}
setName(_.filter.sync, 'filter')

const nameReduce = (fn, x0) => {
  let name = `reduce(${_.shorthand(fn)}`
  if (_.exists(x0)) name += `, ${_.shorthand(x0)}`
  name += ')'
  return name
}

_.reduce = (fn, x0) => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  const ret = async x => {
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
    let [y, i] = _.exists(x0) ? [x0, 0] : [x[0], 1]
    while (i < x.length) {
      y = await fn(y, x[i], i)
      i += 1
    }
    return y
  }
  setName(ret, nameReduce(fn, x0))
  return ret
}
setName(_.reduce, 'reduce')

_.reduce.sync = (fn, x0) => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  const ret = x => {
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
  setName(ret, nameReduce(fn, x0))
  return ret
}
setName(_.reduce.sync, 'reduce')

_.not = fn => {
  fn = _.toFn(fn)
  const ret = async x => !(await fn(x))
  setName(ret, `not(${_.shorthand(fn)})`)
  return ret
}
setName(_.not, 'not')

_.not.sync = fn => {
  fn = _.toFn(fn)
  const ret = x => !fn(x)
  setName(ret, `not(${_.shorthand(fn)})`)
  return ret
}
setName(_.not.sync, 'not')

_.any = fn => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  const ret = async x => {
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
  setName(ret, `any(${_.shorthand(fn)})`)
  return ret
}
setName(_.any, 'any')

_.any.sync = fn => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  const ret = x => {
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
  setName(ret, `any(${_.shorthand(fn)})`)
  return ret
}
setName(_.any.sync, 'any')

_.every = fn => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  const ret = async x => {
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
  setName(ret, `every(${_.shorthand(fn)})`)
  return ret
}
setName(_.every, 'every')

_.every.sync = fn => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  const ret = x => {
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
  setName(ret, `every(${_.shorthand(fn)})`)
  return ret
}
setName(_.every.sync, 'every')

_.and = (...fns) => {
  fns = _.map.sync(_.toFn)(fns)
  const ret = (...x) => _.every(fn => fn(...x))(fns)
  setName(ret, `and(${fns.map(_.shorthand).join(', ')})`)
  return ret
}
setName(_.and, 'and')

_.and.sync = (...fns) => {
  fns = _.map.sync(_.toFn)(fns)
  const ret = (...x) => _.every.sync(fn => fn(...x))(fns)
  setName(ret, `and(${fns.map(_.shorthand).join(', ')})`)
  return ret
}
setName(_.and.sync, 'and')

_.or = (...fns) => {
  fns = _.map.sync(_.toFn)(fns)
  const ret = (...x) => _.any(fn => fn(...x))(fns)
  setName(ret, `or(${fns.map(_.shorthand).join(', ')})`)
  return ret
}
setName(_.or, 'or')

_.or.sync = (...fns) => {
  fns = _.map.sync(_.toFn)(fns)
  const ret = (...x) => _.any.sync(fn => fn(...x))(fns)
  setName(ret, `or(${fns.map(_.shorthand).join(', ')})`)
  return ret
}
setName(_.or.sync, 'or')

_.eq = (...fns) => {
  fns = _.map.sync(_.toFn)(fns)
  const ret = _.flow(
    _.diverge(fns),
    x => {
      for (let i = 1; i < x.length; i++) {
        if (x[i] !== x[0]) return false
      }
      return true
    },
  )
  setName(ret, `eq(${fns.map(_.shorthand).join(', ')})`)
  return ret
}
setName(_.eq, 'eq')

_.eq.sync = (...fns) => {
  fns = _.map.sync(_.toFn)(fns)
  const ret = _.flow.sync(
    _.diverge.sync(fns),
    x => {
      for (let i = 1; i < x.length; i++) {
        if (x[i] !== x[0]) return false
      }
      return true
    },
  )
  setName(ret, `eq(${fns.map(_.shorthand).join(', ')})`)
  return ret
}
setName(_.eq.sync, 'eq')

_.lt = (...fns) => {
  fns = _.map.sync(_.toFn)(fns)
  const ret = _.flow(
    _.diverge(fns),
    x => {
      for (let i = 1; i < x.length; i++) {
        if (x[i - 1] >= x[i]) return false
      }
      return true
    },
  )
  setName(ret, `lt(${fns.map(_.shorthand).join(', ')})`)
  return ret
}
setName(_.lt, 'lt')

_.lt.sync = (...fns) => {
  fns = _.map.sync(_.toFn)(fns)
  const ret = _.flow.sync(
    _.diverge.sync(fns),
    x => {
      for (let i = 1; i < x.length; i++) {
        if (x[i - 1] >= x[i]) return false
      }
      return true
    },
  )
  setName(ret, `lt(${fns.map(_.shorthand).join(', ')})`)
  return ret
}
setName(_.lt.sync, 'lt')

_.lte = (...fns) => {
  fns = _.map.sync(_.toFn)(fns)
  const ret = _.flow(
    _.diverge(fns),
    x => {
      for (let i = 1; i < x.length; i++) {
        if (x[i - 1] > x[i]) return false
      }
      return true
    },
  )
  setName(ret, `lte(${fns.map(_.shorthand).join(', ')})`)
  return ret
}
setName(_.lte, 'lte')

_.lte.sync = (...fns) => {
  fns = _.map.sync(_.toFn)(fns)
  const ret = _.flow.sync(
    _.diverge.sync(fns),
    x => {
      for (let i = 1; i < x.length; i++) {
        if (x[i - 1] > x[i]) return false
      }
      return true
    },
  )
  setName(ret, `lte(${fns.map(_.shorthand).join(', ')})`)
  return ret
}
setName(_.lte.sync, 'lte')

_.gt = (...fns) => {
  fns = _.map.sync(_.toFn)(fns)
  const ret = _.flow(
    _.diverge(fns),
    x => {
      for (let i = 1; i < x.length; i++) {
        if (x[i - 1] <= x[i]) return false
      }
      return true
    },
  )
  setName(ret, `gt(${fns.map(_.shorthand).join(', ')})`)
  return ret
}
setName(_.gt, 'gt')

_.gt.sync = (...fns) => {
  fns = _.map.sync(_.toFn)(fns)
  const ret = _.flow.sync(
    _.diverge.sync(fns),
    x => {
      for (let i = 1; i < x.length; i++) {
        if (x[i - 1] <= x[i]) return false
      }
      return true
    },
  )
  setName(ret, `gt(${fns.map(_.shorthand).join(', ')})`)
  return ret
}
setName(_.gt.sync, 'gt')

_.gte = (...fns) => {
  fns = _.map.sync(_.toFn)(fns)
  const ret = _.flow(
    _.diverge(fns),
    x => {
      for (let i = 1; i < x.length; i++) {
        if (x[i - 1] < x[i]) return false
      }
      return true
    },
  )
  setName(ret, `gte(${fns.map(_.shorthand).join(', ')})`)
  return ret
}
setName(_.gte, 'gte')

_.gte.sync = (...fns) => {
  fns = _.map.sync(_.toFn)(fns)
  const ret = _.flow.sync(
    _.diverge.sync(fns),
    x => {
      for (let i = 1; i < x.length; i++) {
        if (x[i - 1] < x[i]) return false
      }
      return true
    },
  )
  setName(ret, `gte(${fns.map(_.shorthand).join(', ')})`)
  return ret
}
setName(_.gte.sync, 'gte')

const simpleGet = k => x => {
  if (typeof x !== 'object') return undefined
  if (_.isMap(x)) return x.get(k)
  return x[k]
}

const keyToPath = k => {
  if (_.isString(k)) return k.split('.')
  if (_.isArray(k)) return k
  return [k]
}

_.get = (key, defaultValue) => {
  const path = keyToPath(key)
  const ret = x => {
    let y = x
    for (const k of path) {
      y = simpleGet(k)(y)
      if (_.dne(y)) return defaultValue
    }
    return y
  }
  const nameArgs = [_.shorthand(key)]
  if (_.exists(defaultValue)) nameArgs.push(_.shorthand(defaultValue))
  setName(ret, `get(${nameArgs.join(', ')})`)
  return ret
}
setName(_.get, 'get')

_.lookup = x => {
  const ret = k => _.get(k)(x)
  setName(ret, `lookup(${_.shorthand(x)})`)
  return ret
}
setName(_.lookup, 'lookup')

const namePut = ents => {
  const nameArgs = []
  for (const [k, fn] of ents) {
    nameArgs.push(`[${k}, ${_.shorthand(_.toFn(fn))}]`)
  }
  return `put(${nameArgs.join(', ')})`
}

_.put = (...ents) => {
  const ret = async x => {
    const y = _.copy(x), tasks = []
    for (const [k, fn] of ents) {
      const a = _.toFn(fn)(x)
      if (_.isPromise(a)) tasks.push(a.then(b => { y[k] = b }))
      else { y[k] = a }
    }
    await Promise.all(tasks)
    return y
  }
  setName(ret, namePut(ents))
  return ret
}
setName(_.put, 'put')

_.put.sync = (...ents) => {
  const ret = x => {
    const y = _.copy(x)
    for (const [k, fn] of ents) {
      y[k] = _.toFn(fn)(x)
    }
    return y
  }
  setName(ret, namePut(ents))
  return ret
}
setName(_.put.sync, 'put')

// https://jsperf.com/multi-array-concat/7
_.concat = (...fns) => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  fns = _.map.sync(_.toFn)(fns)
  const ret = async x => {
    if (!_.isString(x) && !_.isArray(x)) {
      e.message = `cannot concat to ${x}`
      throw e
    }
    const items = await _.map(fn => fn(x))(fns)
    return x.constructor.prototype.concat.apply(x, items)
  }
  setName(ret, `concat(${_.map.sync(_.shorthand)(fns).join(', ')})`)
  return ret
}
setName(_.concat, 'concat')

_.concat.sync = (...fns) => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  fns = _.map.sync(_.toFn)(fns)
  const ret = x => {
    if (!_.isString(x) && !_.isArray(x)) {
      e.message = `cannot concat to ${x}`
      throw e
    }
    const items = _.map.sync(fn => _.toFn(fn)(x))(fns)
    return x.constructor.prototype.concat.apply(x, items)
  }
  setName(ret, `concat(${_.map.sync(_.shorthand)(fns).join(', ')})`)
  return ret
}
setName(_.concat.sync, 'concat')

_.has = m => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  const ret = col => {
    if (_.isString(col)) return col.includes(m)
    if (_.isArray(col)) return col.includes(m)
    if (_.isSet(col)) return col.has(m)
    if (_.isMap(col)) return col.has(m)
    if (_.isObject(col)) return !!_.get(m)(col)
    if (_.isBuffer(col)) return _.toString(col).includes(m)
    e.message = `cannot has ${col}`
    throw e
  }
  setName(ret, `has(${_.shorthand(m)})`)
  return ret
}
setName(_.has, 'has')

_.member = col => {
  let ret
  if (_.isString(col)) ret = m => col.includes(m)
  else if (_.isArray(col)) ret = m => col.includes(m)
  else if (_.isSet(col)) ret = m => col.has(m)
  else if (_.isMap(col)) ret = m => col.has(m)
  else if (_.isObject(col)) ret = m => !!_.get(m)(col)
  else if (_.isBuffer(x)) ret = m => _.toString(col).includes(m)
  else throw new TypeError(`cannot member ${col}`)
  setName(ret, `member(${_.shorthand(col)})`)
  return ret
}
setName(_.member, 'member')

_.log = tag => {
  const ret = _.effect.sync(() => console.log(tag))
  setName(ret, `log(${_.inspect(tag)})`)
  return ret
}
setName(_.log, 'log')

_.trace = tag => {
  const ret = _.effect.sync(x => {
    const args = []
    if (_.exists(tag)) args.push(tag)
    args.push(_.inspect(x))
    console.log(...args)
  })
  setName(ret, `trace(${_.inspect(tag)})`)
  return ret
}
setName(_.trace, 'trace')

_.tracep = (p, tag) => {
  const ret = _.effect.sync(x => {
    const args = []
    if (_.exists(tag)) args.push(tag)
    const fmtp = _.isArray(p) ? p.join('.') : p
    args.push(`.${fmtp} -`, _.inspect(_.get(p)(x)))
    console.log(...args)
  })
  const nameArgs = [_.inspect(p)]
  if (_.exists(tag)) nameArgs.push(_.inspect(tag))
  setName(ret, `tracep(${nameArgs.join(', ')})`)
  return ret
}
setName(_.tracep, 'tracep')

_.tracef = (fn, tag) => {
  const ret = _.effect(async x => {
    const args = []
    if (_.exists(tag)) args.push(tag)
    args.push(_.inspect(await _.toFn(fn)(x)))
    console.log(...args)
  })
  const nameArgs = [_.shorthand(fn)]
  if (_.exists(tag)) nameArgs.push(_.shorthand(tag))
  setName(ret, `tracef(${nameArgs.join(', ')})`)
  return ret
}
setName(_.tracef, 'tracef')

_.tracef.sync = (fn, tag) => {
  const ret = _.effect.sync(x => {
    const args = []
    if (_.exists(tag)) args.push(tag)
    args.push(_.inspect(_.toFn(fn)(x)))
    console.log(...args)
  })
  const nameArgs = [_.shorthand(fn)]
  if (_.exists(tag)) nameArgs.push(_.shorthand(tag))
  setName(ret, `tracef(${nameArgs.join(', ')})`)
  return ret
}
setName(_.tracef.sync, 'tracef')

_.promisify = util.promisify
setName(_.promisify, 'promisify')

_.callbackify = util.callbackify
setName(_.callbackify, 'callbackify')

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
setName(_.promisifyAll, 'promisifyAll')

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
setName(_.callbackifyAll, 'callbackifyAll')

_.pick = (...keys) => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  const ret = x => {
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
  setName(ret, `pick(${keys.map(_.shorthand).join(', ')})`)
  return ret
}
setName(_.pick, 'pick')

_.exclude = (...keys) => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  const ret = x => {
    if (!_.isObject(x)) {
      e.message = `cannot exclude ${x}`
      throw e
    }
    const y = { ...x }
    for (const k of keys) {
      delete y[k]
    }
    return y
  }
  setName(ret, `exclude(${keys.map(_.shorthand).join(', ')})`)
  return ret
}
setName(_.exclude, 'exclude')

_.slice = (from, to) => {
  const ret = x => {
    let f = from, t = to
    if (_.dne(f)) f = 0
    else if (f < 0) f += x.length
    if (_.dne(t)) t = x.length
    else if (t < 0) t += x.length
    f = Math.max(0, Math.min(f, x.length))
    t = Math.max(0, Math.min(t, x.length))
    let y = []
    for (let i = f; i < t; i++) y.push(x[i])
    if (_.isString(x)) y = y.join('')
    return y
  }
  const nameArgs = [_.shorthand(from)]
  if (_.exists(to)) nameArgs.push(_.shorthand(to))
  setName(ret, `slice(${nameArgs.join(', ')})`)
  return ret
}
setName(_.slice, 'slice')

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
  const ret =  x => {
    if (!_.isString(x)) {
      e.message = `cannot replace for ${x}`
      throw e
    }
    return x.replace(rx, _.toString(r))
  }
  setName(ret, `replaceOne(${_.shorthand(s)}, ${_.shorthand(r)})`)
  return ret
}
setName(_.replaceOne, 'replaceOne')

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
  const ret = x => {
    if (!_.isString(x)) {
      e.message = `cannot replace for ${x}`
      throw e
    }
    return x.replace(rx, _.toString(r))
  }
  setName(ret, `replaceAll(${_.shorthand(s)}, ${_.shorthand(r)})`)
  return ret
}
setName(_.replaceAll, 'replaceAll')

_.join = d => {
  if (_.dne(d)) throw new TypeError('no delimiter provided')
  if (!_.isString(d) && !_.isNumber(d)) {
    throw new TypeError(`bad delimiter ${d}`)
  }
  const e = new TypeError()
  Error.captureStackTrace(e)
  const ret = x => {
    if (!_.isArray(x)) {
      e.message = `cannot join ${x}`
      throw e
    }
    return x.join(d)
  }
  setName(ret, `join(${_.shorthand(d)})`)
  return ret
}
setName(_.join, 'join')

_.split = d => {
  if (_.dne(d)) throw new TypeError('no delimiter provided')
  if (!_.isString(d) && !_.isNumber(d)) {
    throw new TypeError(`bad delimiter ${d}`)
  }
  const e = new TypeError()
  Error.captureStackTrace(e)
  const ret = x => {
    if (!_.isString(x)) {
      e.message = `cannot split ${x}`
      throw e
    }
    return x.split(d)
  }
  setName(ret, `split(${_.shorthand(d)})`)
  return ret
}
setName(_.split, 'split')

_.lowercase = x => {
  if (!_.isString(x)) throw new TypeError(`cannot lowercase ${x}`)
  return x.toLowerCase()
}
setName(_.lowercase, 'lowercase')

_.uppercase = x => {
  if (!_.isString(x)) throw new TypeError(`cannot uppercase ${x}`)
  return x.toUpperCase()
}
setName(_.uppercase, 'uppercase')

_.capitalize = x => {
  if (!_.isString(x)) throw new TypeError(`cannot capitalize ${x}`)
  const s = _.toString(x)
  if (s.length === 0) return ''
  return `${s[0].toUpperCase()}${s.slice(1)}`
}
setName(_.capitalize, 'capitalize')

_.braid = (...rates) => {
  const e = new Error()
  Error.captureStackTrace(e)
  const ret = x => {
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
  setName(ret, `braid(${rates.map(_.shorthand).join(', ')})`)
  return ret
}
setName(_.braid, 'braid')

_.unbraid = (...rates) => {
  const e = new Error()
  Error.captureStackTrace(e)
  const ret = x => {
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
  setName(ret, `unbraid(${rates.map(_.shorthand).join(', ')})`)
  return ret
}
setName(_.unbraid, 'unbraid')

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
setName(_.transpose, 'transpose')

_.flatten = x => {
  if (!_.isArray(x)) throw new TypeError('point must be an array')
  return x.flat(1)
}
setName(_.flatten, 'flatten')

_.flattenAll = x => {
  if (!_.isArray(x)) throw new TypeError('point must be an array')
  return x.flat(Infinity)
}
setName(_.flattenAll, 'flattenAll')

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
setName(_.uniq, 'uniq')

_.first = x => {
  if (!_.isArray(x)) throw new TypeError('point must be an array')
  return _.get(0)(x)
}
setName(_.first, 'first')

_.last = x => {
  if (!_.isArray(x)) throw new TypeError('point must be an array')
  return x[x.length - 1]
}
setName(_.last, 'last')

_.reverse = x => {
  if (!_.isArray(x)) throw new TypeError('point must be an array')
  return x.slice(0).reverse()
}
setName(_.reverse, 'reverse')

_.compare = (a, b) => {
  if (a < b) return -1
  if (a > b) return 1
  return 0
}
setName(_.compare, 'compare')

_.sort = (order = 1) => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  const ret = x => {
    if (!_.isArray(x)) {
      e.message = 'point must be an array'
      throw e
    }
    return x.sort(
      (a, b) => order * _.compare(a, b)
    )
  }
  setName(ret, `sort(${_.shorthand(order)})`)
  return ret
}
setName(_.sort, 'sort')

// TODO: take function instead of prop
_.sortBy = (k, order = 1) => {
  const e = new TypeError()
  Error.captureStackTrace(e)
  const ret = x => {
    if (!_.isArray(x)) {
      e.message = 'point must be an array'
      throw e
    }
    return x.sort(
      (a, b) => order * _.compare(_.get(k)(a), _.get(k)(b))
    )
  }
  setName(ret, `sortBy(${_.shorthand(k)}, ${_.shorthand(order)})`)
  return ret
}
setName(_.sortBy, 'sortBy')

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
setName(_.size, 'size')

_.isEmpty = x => _.size(x) === 0
setName(_.isEmpty, 'isEmpty')

_.once = fn => {
  const ret = (...args) => {
    let ret = null
    if (ret) return ret
    ret = fn(...args)
    return ret
  }
  setName(ret, `once(${_.shorthand(fn)})`)
  return ret
}
setName(_.once, 'once')

_.spaces = l => {
  let s = ''
  for (let i = 0; i < l; i++) s += ' '
  return s
}
setName(_.spaces, 'spaces')

_.prettifyJSON = x => JSON.stringify(x, null, 2)
setName(_.prettifyJSON, 'prettifyJSON')

_.hash = alg => {
  const ret = x => crypto.createHash(alg).update(x).digest('hex')
  setName(ret, `hash(${_.shorthand(alg)})`)
  return ret
}
setName(_.hash, 'hash')

_.sha256 = _.hash('sha256')
setName(_.sha256, 'sha256')

_.sha512 = _.hash('sha512')
setName(_.sha512, 'sha512')

module.exports = _
