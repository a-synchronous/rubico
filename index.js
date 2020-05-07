/* design principles
 *
 * this is a module, not a utility library
 * functional code should not care about async
 * these functions are time then space optimal
 * memory used by these functions is properly garbage collected
 */
const isDefined = x => x !== undefined && x !== null

const isIterable = x => isDefined(x[Symbol.iterator])

const isAsyncIterable = x => isDefined(x[Symbol.asyncIterator])

const isReadableStream = x => (
  x && typeof x._read === 'function' && typeof x._readableState === 'object'
)

const isFunction = x => typeof x === 'function'

const isBinaryFunction = x => typeof x === 'function' && x.length === 2

const isArray = x => x instanceof Array

const isPromise = x => x && typeof x.then === 'function'

const is = fn => x => x && x.constructor && x.constructor === fn

const isObject = is(Object)

const type = x => (x && x.constructor && x.constructor.name) || typeof x

const range = (start, end) => Array.from({ length: end - start }, (x, i) => i + start)

const arrayOf = (item, length) => Array.from({ length }, () => item)

const _chain = (fns, args, step) => {
  let i, end
  if (step === 1) {
    i = 0; end = fns.length - 1
  } else if (step === -1) {
    i = fns.length - 1; end = 0
  } else {
    throw new RangeError('step must be 1 or -1')
  }
  let y = fns[i](...args)
  while (i !== end) {
    y = isPromise(y) ? y.then(fns[i + step]) : fns[i + step](y)
    i += step
  }
  return y
}

const pipe = fns => {
  if (!isArray(fns)) {
    throw new TypeError(`first argument must be an array of functions`)
  }
  for (i = 0; i < fns.length; i++) {
    if (isFunction(fns[i])) continue
    throw new TypeError(`${type(fns[i])} (functions[${i}]) is not a function`)
  }
  if (fns.length === 0) return x => x
  return (...args) => isBinaryFunction(args[0])
    ? _chain(fns, args, -1)
    : _chain(fns, args, 1)
}

const arrayFork = (fns, x) => {
  let isAsync = false
  const y = fns.map(fn => {
    const point = fn(x)
    if (isPromise(point)) isAsync = true
    return point
  })
  return isAsync ? Promise.all(y) : y
}

const objectFork = (fns, x) => {
  const y = {}, promises = []
  for (const k in fns) {
    const point = fns[k](x)
    if (isPromise(point)) {
      promises.push(point.then(res => { y[k] = res }))
    } else {
      y[k] = point
    }
  }
  return promises.length > 0 ? Promise.all(promises).then(() => y) : y
}

const fork = fns => {
  if (isArray(fns)) return x => arrayFork(fns, x)
  if (isObject(fns)) return x => objectFork(fns, x)
  throw new TypeError(`cannot fork into ${type(fns)}`)
}

// TODO: implement - arrays only, functions applied in series rather than in parallel
fork.series = fns => {}

const assign = fns => {
  if (!isObject(fns)) {
    throw new TypeError(`cannot assign from ${type(fns)}`)
  }
  return x => {
    if (!isObject(x)) {
      throw new TypeError(`cannot assign into ${type(x)}`)
    }
    const assignments = objectFork(fns, x)
    return isPromise(assignments)
      ? assignments.then(res => Object.assign({}, x, res))
      : Object.assign({}, x, assignments)
  }
}

const tap = fn => {
  if (!isFunction(fn)) {
    throw new TypeError(`cannot tap with ${type(fn)}`)
  }
  return x => {
    // TODO: if (isBinaryFunction(x)) return tapReducer(fn, x)
    const point = fn(x)
    return isPromise(point) ? point.then(() => x) : x
  }
}

const tryCatch = (fn, onError) => {
  if (!isFunction(fn)) {
    throw new TypeError(`cannot try ${type(fn)}`)
  }
  if (!isFunction(onError)) {
    throw new TypeError(`cannot catch with ${type(onError)}`)
  }
  return x => {
    try {
      const point = fn(x)
      return isPromise(point) ? point.catch(e => onError(e, x)) : point
    } catch (e) {
      return onError(e, x)
    }
  }
}

const arraySwitch = (fns, x, i) => {
  if (i === fns.length - 1) return fns[i](x)
  const ok = fns[i](x)
  return isPromise(ok)
    ? ok.then(res => res ? fns[i + 1](x) : arraySwitch(fns, x, i + 2))
    : ok ? fns[i + 1](x) : arraySwitch(fns, x, i + 2)
}

const switch_ = fns => {
  if (!isArray(fns)) {
    throw new TypeError(`first argument must be an array of functions`)
  }
  if (fns.length < 3) {
    throw new RangeError('at least 3 functions required')
  }
  if (fns.length % 2 === 0) {
    throw new RangeError('odd number of functions required')
  }
  for (i = 0; i < fns.length; i++) {
    if (isFunction(fns[i])) continue
    throw new TypeError(`${type(fns[i])} (functions[${i}]) is not a function`)
  }
  return x => arraySwitch(fns, x, 0)
}

// x.map: https://v8.dev/blog/elements-kinds#avoid-polymorphism
const mapArray = (fn, x) => {
  let isAsync = false
  const y = x.map(item => {
    const point = fn(item)
    if (isPromise(point)) isAsync = true
    return point
  })
  return isAsync ? Promise.all(y) : y
}

const mapObject = (fn, x) => {
  const y = {}, promises = []
  for (const k in x) {
    const point = fn(x[k])
    if (isPromise(point)) {
      promises.push(point.then(res => { y[k] = res }))
    } else {
      y[k] = point
    }
  }
  return promises.length > 0 ? Promise.all(promises).then(() => y) : y
}

const mapReducer = (fn, reducer) => (y, xi) => {
  const point = fn(xi)
  return isPromise(point)
    ? point.then(res => reducer(y, res))
    : reducer(y, point)
}

const map = fn => {
  if (!isFunction(fn)) {
    throw new TypeError(`${type(fn)} is not a function`)
  }
  return x => {
    if (isArray(x)) return mapArray(fn, x)
    if (isObject(x)) return mapObject(fn, x)
    if (isBinaryFunction(x)) return mapReducer(fn, x)
    throw new TypeError(`cannot map from ${type(x)}`)
  }
}

const filterArray = (fn, x) => {
  let isAsync = false
  const okIndex = x.map(item => {
    const ok = fn(item)
    if (isPromise(ok)) isAsync = true
    return ok
  })
  return isAsync
    ? Promise.all(okIndex).then(res => x.filter((_, i) => res[i]))
    : x.filter((_, i) => okIndex[i])
}

const filterObject = (fn, x) => {
  const y = {}, promises = []
  for (const k in x) {
    const ok = fn(x[k])
    if (isPromise(ok)) {
      promises.push(ok.then(res => { if (res) { y[k] = x[k] } }))
    } else if (ok) { y[k] = x[k] }
  }
  return promises.length > 0 ? Promise.all(promises).then(() => y) : y
}

const filterReducer = (fn, reducer) => (y, xi) => {
  const ok = fn(xi)
  if (isPromise(ok)) {
    return Promise.all([ok, y]).then(
      res => res[0] ? reducer(res[1], xi) : res[1]
    )
  }
  return ok ? reducer(y, xi) : y
}

const filter = fn => {
  if (!isFunction(fn)) {
    throw new TypeError(`${type(fn)} is not a function`)
  }
  return x => {
    if (isArray(x)) return filterArray(fn, x)
    if (isObject(x)) return filterObject(fn, x)
    if (isBinaryFunction(x)) return filterReducer(fn, x)
    throw new TypeError(`cannot filter from ${type(x)}`)
  }
}

const getIterator = x => {
  if (isDefined(x[Symbol.iterator])) {
    return x[Symbol.iterator].bind(x)()
  }
  if (isObject(x)) {
    return (function* () { for (const k in x) yield x[k] })()
  }
  throw new TypeError(`cannot get iterator from ${type(x)}`)
}

const reduce = (fn, y0) => {
  if (!isFunction(fn)) {
    throw new TypeError(`${type(fn)} is not a function`)
  }
  return x => {
    // TODO: if (isIterable(x)) return reduceIterable(fn, y0, x)
    // TODO: if (isAsyncIterable(x)) return reduceAsyncIterable(fn, y0, x)
    // TODO: if (isReadableStream(x)) return reduceStream(fn, y0, x)
    // TODO: if (isObject(x)) return reduceObject(fn, y0, x)
    // TODO: throw new TypeError(`cannot reduce ${type(x)}`)
    const iter = getIterator(x)
    let cursor = iter.next()
    if (cursor.done) {
      throw new TypeError('cannot reduce empty iterator')
    }
    let y = isDefined(y0) ? fn(y0, cursor.value) : (() => {
      const x0 = cursor.value
      cursor = iter.next()
      return cursor.done ? x0 : fn(x0, cursor.value)
    })()
    cursor = iter.next()
    while (!cursor.done) {
      const { value } = cursor
      y = isPromise(y) ? y.then(res => fn(res, value)) : fn(y, value)
      cursor = iter.next()
    }
    return y
  }
}

// TODO: implement
// r.transform([...], r.pipe([...])) <- atoms can be anything
// r.transform('...', r.filter(...)) <- atoms must be strings or implement toString
// r.transform(new Set([...]), r.pipe([...]))
// r.transform(Buffer.from('...'), r.map(...))
// r.transform(myStream, r.map(...))
const transform = (y0, fn) => {}

// TODO: implement
const get = keys => {}

// TODO: implement
const pick = keys => {}

// TODO: implement
const omit = keys => {}

// TODO: implement
const any = fn => {}

// TODO: implement
const every = fn => {}

// TODO: implement
const and = fns => {}

// TODO: implement
const or = fns => {}

// TODO: implement
const not = fn => {}

// TODO: implement
const gt = fns => {}

// TODO: implement
const lt = fns => {}

// TODO: implement
const gte = fns => {}

// TODO: implement
const lte = fns => {}

const r = {
  pipe, fork, assign,
  tap, tryCatch, switch: switch_,
  map, filter, reduce, transform,
  get, pick, omit,
  any, every,
  and, or, not,
  gt, lt, gte, lte,
}

module.exports = r
