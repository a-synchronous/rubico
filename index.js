'use strict'

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

const isReadable = x => x
  && x.readable
  && typeof x._read === 'function'
  && typeof x._readableState === 'object'

const isWritable = x => x && typeof x.write === 'function'

const isFunction = x => typeof x === 'function'

const isBinaryFunction = x => typeof x === 'function' && x.length === 2

const isArray = Array.isArray

const isBuffer = x => x && x.constructor
  && typeof x.constructor.isBuffer === 'function'
  && x.constructor.isBuffer(x)

const isNumber = x => typeof x === 'number' || x instanceof Number

const isString = x => typeof x === 'string' || x instanceof String

const isPromise = x => x && typeof x.then === 'function'

const is = fn => x => x && x.constructor === fn

const isObject = is(Object)

const isSet = is(Set)

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
  for (let i = 0; i < fns.length; i++) {
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

const arrayForkSeries = (fns, x, i, y) => {
  if (i === fns.length) return y
  const point = fns[i](x)
  return isPromise(point)
    ? point.then(res => arrayForkSeries(fns, x, i + 1, y.concat(res)))
    : arrayForkSeries(fns, x, i + 1, y.concat(point))
}

fork.series = fns => {
  if (isArray(fns)) return x => arrayForkSeries(fns, x, 0, [])
  throw new TypeError(`cannot fork.series into ${type(fns)}`)
}

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

const tapReducer = (fn, reducer) => (y, xi) => {
  const point = fn(xi)
  return isPromise(point) ? point.then(() => reducer(y, xi)) : reducer(y, xi)
}

const tap = fn => {
  if (!isFunction(fn)) {
    throw new TypeError(`cannot tap with ${type(fn)}`)
  }
  return x => {
    if (isBinaryFunction(x)) return tapReducer(fn, x)
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
  for (let i = 0; i < fns.length; i++) {
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

const mapSeriesArray = (fn, x, i, y) => {
  if (i === x.length) return y
  const point = fn(x[i])
  return isPromise(point)
    ? point.then(res => mapSeriesArray(fn, x, i + 1, y.concat(res)))
    : mapSeriesArray(fn, x, i + 1, y.concat(point))
}

map.series = fn => {
  if (!isFunction(fn)) {
    throw new TypeError(`${type(fn)} is not a function`)
  }
  return x => {
    if (isArray(x)) return mapSeriesArray(fn, x, 0, [])
    throw new TypeError(`cannot map.series from ${type(x)}`)
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

const reduceIterable = (fn, y0, x) => {
  const iter = x[Symbol.iterator].bind(x)()
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

const reduceAsyncIterable = async (fn, y0, x) => {
  const iter = x[Symbol.asyncIterator].bind(x)()
  let cursor = await iter.next()
  if (cursor.done) {
    throw new TypeError('cannot reduce empty iterator')
  }
  let y = isDefined(y0) ? await fn(y0, cursor.value) : await (async () => {
    const x0 = cursor.value
    cursor = await iter.next()
    return cursor.done ? x0 : fn(x0, cursor.value)
  })()
  cursor = await iter.next()
  while (!cursor.done) {
    const { value } = cursor
    const res = await Promise.all([fn(y, value), iter.next()])
    y = res[0]; cursor = res[1]
  }
  return y
}

const reduceObject = (fn, y0, x) => reduceIterable(
  fn,
  y0,
  (function* () { for (const k in x) yield x[k] })(),
)

const reduce = (fn, y0) => {
  if (!isFunction(fn)) {
    throw new TypeError(`${type(fn)} is not a function`)
  }
  return x => {
    if (isIterable(x)) return reduceIterable(fn, y0, x)
    if (isAsyncIterable(x)) return reduceAsyncIterable(fn, y0, x)
    if (isObject(x)) return reduceObject(fn, y0, x)
    throw new TypeError(`cannot reduce ${type(x)}`)
  }
}

const arrayTransform = (y0, fn) => reduce(
  fn((y, xi) => { y.push(xi); return y }),
  Array.from(y0),
)

const stringTransform = (y0, fn) => reduce(
  fn((y, xi) => `${y}${xi}`),
  y0,
)

const setTransform = (y0, fn) => reduce(
  fn((y, xi) => y.add(xi)),
  new Set(y0),
)

const bufferTransform = (y0, fn) => reduce(
  fn((y, xi) => Buffer.concat([y, Buffer.from(xi)])),
  Buffer.from(y0),
)

const writeableTransform = (y0, fn) => reduce(
  fn((y, xi) => { y.write(xi); return y }),
  y0,
)

const transform = (y0, fn) => {
  if (!isFunction(fn)) {
    throw new TypeError(`${type(fn)} is not a function`)
  }
  if (isArray(y0)) return arrayTransform(y0, fn)
  if (isString(y0)) return stringTransform(y0, fn)
  if (isSet(y0)) return setTransform(y0, fn)
  if (isBuffer(y0)) return bufferTransform(y0, fn)
  if (isWritable(y0)) return writeableTransform(y0, fn)
  throw new TypeError(`cannot transform ${type(y0)}`)
}

const isDelimitedBy = (delim, x) => x
  && x[0] !== delim
  && x[x.length - 1] !== delim
  && x.slice(1, x.length - 1).includes(delim)

const arrayGet = (path, x, defaultValue) => {
  let y = x
  for (let i = 0; i < path.length; i++) {
    y = y[path[i]]
    if (!isDefined(y)) return defaultValue
  }
  return y
}

const get = (path, defaultValue) => {
  if (isArray(path)) return x => arrayGet(path, x, defaultValue)
  if (isNumber(path)) return x => arrayGet([path], x, defaultValue)
  if (isString(path)) return isDelimitedBy('.', path)
    ? x => arrayGet(path.split('.'), x, defaultValue)
    : x => arrayGet([path], x, defaultValue)
  throw new TypeError(`cannot get with ${type(path)} path`)
}

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
module.exports.default = r
