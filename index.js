/* rubico v1.1.10
 * https://github.com/a-synchronous/rubico
 * (c) 2019 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.rubico = {}));
}(this, function (exports) { 'use strict'

/* design principles
 *
 * rubico is a module, not a utility library
 * functional code should not care about async
 * exported methods are time and space optimal
 * memory used by exported methods is properly garbage collected
 * no special types; use built-in types
 * no currying; write new functions
 * avoid variadic functions; use lists
 */

const isDefined = x => x !== undefined && x !== null

const isUndefined = x => x === undefined

const isNull = x => x === null

const isIterable = x => isDefined(x) && isDefined(x[Symbol.iterator])

const isAsyncIterable = x => isDefined(x) && isDefined(x[Symbol.asyncIterator])

const isReadable = x => x && typeof x.read === 'function'

const isWritable = x => x && typeof x.write === 'function'

const isFunction = x => typeof x === 'function'

const isArray = Array.isArray

const numberTypedArrays = new Set([
  'Uint8ClampedArray',
  'Uint8Array', 'Int8Array',
  'Uint16Array', 'Int16Array',
  'Uint32Array', 'Int32Array',
  'Float32Array', 'Float64Array',
])

const isNumberTypedArray = x => x && x.constructor && (
  numberTypedArrays.has(x.constructor.name)
)

const bigIntTypedArrays = new Set([
  'BigUint64Array', 'BigInt64Array',
])

const isBigIntTypedArray = x => x && x.constructor && (
  bigIntTypedArrays.has(x.constructor.name)
)

const isNumber = x => typeof x === 'number' && !isNaN(x)

const isBigInt = x => typeof x === 'bigint'

const isString = x => typeof x === 'string'

const isPromise = x => x && typeof x.then === 'function'

const is = fn => x => x && x.constructor === fn

const toLowerCase = x => x && typeof x.toLowerCase === 'function' && x.toLowerCase()

const type = x => x && x.constructor && toLowerCase(x.constructor.name) || typeof x

const range = (start, end) => Array.from({ length: end - start }, (x, i) => i + start)

const arrayOf = (item, length) => Array.from({ length }, () => item)

const curryFunction = (fn, ...args) => {
  if (args.length >= fn.length) return fn(...args)
  return (...moreArgs) => curryFunction(fn, ...args.concat(moreArgs))
}

const _chain = (fnsIter, args) => {
  const { value: f0 } = fnsIter.next()
  let y = f0(...args)
  for (const fn of fnsIter) {
    y = isPromise(y) ? y.then(fn) : fn(y)
  }
  return y
}

const reverseArrayIter = arr => (function*() {
  for (let i = arr.length - 1; i >= 0; i--) yield arr[i]
})()

const pipe = fns => {
  if (!isArray(fns)) {
    throw new TypeError('pipe(x); x is not an array of functions')
  }
  if (fns.length < 1) {
    throw new RangeError('pipe(x); x is not an array of at least one function')
  }
  for (let i = 0; i < fns.length; i++) {
    if (isFunction(fns[i])) continue
    throw new TypeError(`pipe(x); x[${i}] is not a function`)
  }
  if (fns.length === 0) return x => x
  return (...args) => (isFunction(args[0])
    ? _chain(reverseArrayIter(fns), args)
    : _chain(fns[Symbol.iterator].call(fns), args)
  )
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
  if (isArray(fns)) {
    if (fns.length < 1) {
      throw new RangeError('fork(x); x is not an array of at least one function')
    }
    for (let i = 0; i < fns.length; i++) {
      if (isFunction(fns[i])) continue
      throw new TypeError(`fork(x); x[${i}] is not a function`)
    }
    return x => arrayFork(fns, x)
  }
  if (is(Object)(fns)) {
    if (Object.keys(fns).length < 1) {
      throw new RangeError('fork(x); x is not an object of at least one entry')
    }
    for (const k in fns) {
      if (isFunction(fns[k])) continue
      throw new TypeError(`fork(x); x['${k}'] is not a function`)
    }
    return x => objectFork(fns, x)
  }
  throw new TypeError('fork(x); x invalid')
}

const arrayForkSeries = (fns, x, i, y) => {
  if (i === fns.length) return y
  const point = fns[i](x)
  return (isPromise(point)
    ? point.then(res => arrayForkSeries(fns, x, i + 1, y.concat(res)))
    : arrayForkSeries(fns, x, i + 1, y.concat(point)))
}

fork.series = fns => {
  if (isArray(fns)) {
    if (fns.length < 1) {
      throw new RangeError(
        'fork.series(x); x is not an array of at least one function',
      )
    }
    for (let i = 0; i < fns.length; i++) {
      if (isFunction(fns[i])) continue
      throw new TypeError(`fork.series(x); x[${i}] is not a function`)
    }
    return x => arrayForkSeries(fns, x, 0, [])
  }
  throw new TypeError('fork.series(x); x invalid')
}

const assign = fns => {
  if (!is(Object)(fns)) {
    throw new TypeError('assign(x); x is not an object of functions')
  }
  return x => {
    if (!is(Object)(x)) {
      throw new TypeError('assign(...)(x); x is not an object')
    }
    const assignments = objectFork(fns, x)
    return (isPromise(assignments)
      ? assignments.then(res => Object.assign({}, x, res))
      : Object.assign({}, x, assignments))
  }
}

const tapReducer = (fn, reducer) => (y, xi) => {
  const point = fn(xi)
  return isPromise(point) ? point.then(() => reducer(y, xi)) : reducer(y, xi)
}

const tap = fn => {
  if (!isFunction(fn)) {
    throw new TypeError('tap(x); x is not a function')
  }
  return x => {
    if (isFunction(x)) return tapReducer(fn, x)
    const point = fn(x)
    return isPromise(point) ? point.then(() => x) : x
  }
}

const tryCatch = (fn, onError) => {
  if (!isFunction(fn)) {
    throw new TypeError('tryCatch(x, y); x is not a function')
  }
  if (!isFunction(onError)) {
    throw new TypeError('tryCatch(x, y); y is not a function')
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

const arraySwitchCase = (fns, x, i) => {
  if (i === fns.length - 1) return fns[i](x)
  const ok = fns[i](x)
  return isPromise(ok)
    ? ok.then(res => res ? fns[i + 1](x) : arraySwitchCase(fns, x, i + 2))
    : ok ? fns[i + 1](x) : arraySwitchCase(fns, x, i + 2)
}

const switchCase = fns => {
  if (!isArray(fns)) {
    throw new TypeError('switchCase(x); x is not an array of functions')
  }
  if (fns.length < 3) {
    throw new RangeError(
      'switchCase(x); x is not an array of at least three functions',
    )
  }
  if (fns.length % 2 === 0) {
    throw new RangeError(
      'switchCase(x); x is not an array of an odd number of functions',
    )
  }
  for (let i = 0; i < fns.length; i++) {
    if (isFunction(fns[i])) continue
    throw new TypeError(`switchCase(x); x[${i}] is not a function`)
  }
  return x => arraySwitchCase(fns, x, 0)
}

const mapAsyncIterable = (fn, x) => (async function*() {
  for await (const xi of x) yield fn(xi)
})()

const mapIterable = (fn, x) => (function*() {
  for (const xi of x) yield fn(xi)
})()

// x.map: https://v8.dev/blog/elements-kinds#avoid-polymorphism
const mapArray = (fn, x) => {
  let isAsync = false
  const y = x.map(xi => {
    const point = fn(xi)
    if (isPromise(point)) isAsync = true
    return point
  })
  return isAsync ? Promise.all(y) : y
}

const mapIterableToArray = (fn, x) => {
  let isAsync = false
  const primer = []
  for (const xi of x) {
    const point = fn(xi)
    if (isPromise(point)) isAsync = true
    primer.push(point)
  }
  return isAsync ? Promise.all(primer) : primer
}

const mapString = (fn, x) => {
  const y = mapIterableToArray(fn, x)
  return isPromise(y) ? y.then(res => res.join('')) : y.join('')
}

const mapTypedArray = (fn, x) => {
  const y = mapIterableToArray(fn, x)
  return (isPromise(y)
    ? y.then(res => new x.constructor(res))
    : new x.constructor(y))
}

const mapSet = (fn, x) => {
  const y = new Set(), promises = []
  for (const xi of x) {
    const point = fn(xi)
    if (isPromise(point)) {
      promises.push(point.then(res => { y.add(res) }))
    } else {
      y.add(point)
    }
  }
  return promises.length > 0 ? Promise.all(promises).then(() => y) : y
}

const mapMap = (fn, x) => {
  const y = new Map(), promises = []
  for (const entry of x) {
    const point = fn(entry)
    if (isPromise(point)) {
      promises.push(point.then(res => { y.set(...res) }))
    } else {
      y.set(...point)
    }
  }
  return promises.length > 0 ? Promise.all(promises).then(() => y) : y
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
  return (isPromise(point)
    ? point.then(res => reducer(y, res))
    : reducer(y, point))
}

const map = fn => {
  if (!isFunction(fn)) {
    throw new TypeError('map(x); x is not a function')
  }
  return x => {
    if (isAsyncIterable(x)) return mapAsyncIterable(fn, x)
    if (isArray(x)) return mapArray(fn, x)
    if (isString(x)) return mapString(fn, x)
    if (is(Set)(x)) return mapSet(fn, x)
    if (is(Map)(x)) return mapMap(fn, x)
    if (isNumberTypedArray(x)) return mapTypedArray(fn, x)
    if (isBigIntTypedArray(x)) return mapTypedArray(fn, x)
    if (isIterable(x)) return mapIterable(fn, x) // for generators or custom iterators
    if (is(Object)(x)) return mapObject(fn, x)
    if (isFunction(x)) return mapReducer(fn, x)
    throw new TypeError('map(...)(x); x invalid')
  }
}

const mapSeriesArray = (fn, x, i, y) => {
  if (i === x.length) return y
  const point = fn(x[i])
  return (isPromise(point)
    ? point.then(res => mapSeriesArray(fn, x, i + 1, y.concat(res)))
    : mapSeriesArray(fn, x, i + 1, y.concat(point)))
}

map.series = fn => {
  if (!isFunction(fn)) {
    throw new TypeError('map.series(x); x is not a function')
  }
  return x => {
    if (isArray(x)) return mapSeriesArray(fn, x, 0, [])
    throw new TypeError('map.series(...)(x); x invalid')
  }
}

// https://stackoverflow.com/questions/62037349/rubicos-map-pool-array-implementation
// https://stackoverflow.com/questions/39195441/limited-parallelism-with-async-await-in-typescript-es7
const mapPoolConstructor = construct => async (size, fn, x) => {
  const y = []
  const promises = new Set()
  for (const xi of x) {
    if (promises.size >= size) {
      await Promise.race(promises)
    }
    const yi = fn(xi)
    if (isPromise(yi)) {
      const p = yi.then(res => {
        promises.delete(p)
        return res
      })
      promises.add(p)
      y.push(p)
    } else {
      y.push(yi)
    }
  }
  return construct(await Promise.all(y))
}

const mapPoolArray = mapPoolConstructor(y => y)

const mapPoolSet = mapPoolConstructor(y => new Set(y))

const mapPoolMap = mapPoolConstructor(y => new Map(y))

map.pool = (size, fn) => {
  if (!isNumber(size)) {
    throw new TypeError('map.pool(size, f); size is not a number')
  }
  if (size < 1) {
    throw new RangeError('map.pool(size, f); size must be 1 or more')
  }
  if (!isFunction(fn)) {
    throw new TypeError('map.pool(size, f); f is not a function')
  }
  return x => {
    if (isArray(x)) return mapPoolArray(size, fn, x)
    if (is(Set)(x)) return mapPoolSet(size, fn, x)
    if (is(Map)(x)) return mapPoolMap(size, fn, x)
    throw new TypeError('map.pool(...)(x); x invalid')
  }
}

const mapArrayWithIndex = (fn, x) => {
  let isAsync = false
  const y = x.map((xi, i) => {
    const point = fn(xi, i, x)
    if (isPromise(point)) isAsync = true
    return point
  })
  return isAsync ? Promise.all(y) : y
}

const mapIterableWithIndexToArray = (fn, x) => {
  let isAsync = false
  const primer = []
  let i = 0
  for (const xi of x) {
    const point = fn(xi, i, x)
    if (isPromise(point)) isAsync = true
    primer.push(point)
    i += 1
  }
  return isAsync ? Promise.all(primer) : primer
}

const mapStringWithIndex = (fn, x) => {
  const y = mapIterableWithIndexToArray(fn, x)
  return isPromise(y) ? y.then(res => res.join('')) : y.join('')
}

map.withIndex = fn => {
  if (!isFunction(fn)) {
    throw new TypeError('map.withIndex(x); x is not a function')
  }
  return x => {
    if (isArray(x)) return mapArrayWithIndex(fn, x)
    if (isString(x)) return mapStringWithIndex(fn, x)
    throw new TypeError('map.withIndex(...)(x); x invalid')
  }
}

const filterAsyncIterable = (fn, x) => (async function*() {
  for await (const xi of x) { if (await fn(xi)) yield xi }
})()

const filterIterable = (fn, x) => (function*() {
  for (const xi of x) {
    const ok = fn(xi)
    if (isPromise(ok)) {
      throw new TypeError([
        'filter(f)(x); xi is an element of x; ',
        'if x if the resulting iterator of a sync generator, ',
        'f(xi) cannot return a Promise',
      ].join(''))
    }
    if (ok) yield xi
  }
})()

const createFilterIndex = (fn, x) => {
  let isAsync = false
  const filterIndex = []
  for (const xi of x) {
    const ok = fn(xi)
    if (isPromise(ok)) isAsync = true
    filterIndex.push(ok)
  }
  return isAsync ? Promise.all(filterIndex) : filterIndex
}

const filterArray = (fn, x) => {
  const index = createFilterIndex(fn, x)
  return (isPromise(index)
    ? index.then(res => x.filter((_, i) => res[i]))
    : x.filter((_, i) => index[i])
  )
}

const filterStringFromIndex = (index, x) => {
  let y = ''
  for (let i = 0; i < x.length; i++) { if (index[i]) y += x[i] }
  return y
}

const filterString = (fn, x) => {
  const index = createFilterIndex(fn, x)
  return (isPromise(index)
    ? index.then(res => filterStringFromIndex(res, x))
    : filterStringFromIndex(index, x)
  )
}

const filterSet = (fn, x) => {
  const y = new Set(), promises = []
  for (const xi of x) {
    const ok = fn(xi)
    if (isPromise(ok)) {
      promises.push(ok.then(res => res && y.add(xi)))
    } else if (ok) { y.add(xi) }
  }
  return promises.length > 0 ? Promise.all(promises).then(() => y) : y
}

const filterMap = (fn, x) => {
  const y = new Map(), promises = []
  for (const xi of x) {
    const ok = fn(xi)
    if (isPromise(ok)) {
      promises.push(ok.then(res => res && y.set(...xi)))
    } else if (ok) { y.set(...xi) }
  }
  return promises.length > 0 ? Promise.all(promises).then(() => y) : y
}

const filterTypedArray = (fn, x) => {
  const y = filterArray(fn, x)
  return (isPromise(y)
    ? y.then(res => new x.constructor(res))
    : new x.constructor(y)
  )
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
    throw new TypeError('filter(x); x is not a function')
  }
  return x => {
    if (isAsyncIterable(x)) return filterAsyncIterable(fn, x)
    if (isArray(x)) return filterArray(fn, x)
    if (isString(x)) return filterString(fn, x)
    if (is(Set)(x)) return filterSet(fn, x)
    if (is(Map)(x)) return filterMap(fn, x)
    if (isNumberTypedArray(x)) return filterTypedArray(fn, x)
    if (isBigIntTypedArray(x)) return filterTypedArray(fn, x)
    if (isIterable(x)) return filterIterable(fn, x) // for generators or custom iterators
    if (is(Object)(x)) return filterObject(fn, x)
    if (isFunction(x)) return filterReducer(fn, x)
    throw new TypeError('filter(...)(x); x invalid')
  }
}

const createFilterWithIndexIndex = (fn, x) => {
  let isAsync = false, i = 0
  const filterIndex = []
  for (const xi of x) {
    const ok = fn(xi, i, x)
    if (isPromise(ok)) isAsync = true
    filterIndex.push(ok)
    i += 1
  }
  return isAsync ? Promise.all(filterIndex) : filterIndex
}

const filterArrayWithIndex = (fn, x) => {
  const index = createFilterWithIndexIndex(fn, x)
  return (isPromise(index)
    ? index.then(res => x.filter((_, i) => res[i]))
    : x.filter((_, i) => index[i])
  )
}

const filterStringWithIndex = (fn, x) => {
  const index = createFilterWithIndexIndex(fn, x)
  return (isPromise(index)
    ? index.then(res => filterStringFromIndex(res, x))
    : filterStringFromIndex(index, x)
  )
}

filter.withIndex = fn => {
  if (!isFunction(fn)) {
    throw new TypeError('filter.withIndex(x); x is not a function')
  }
  return x => {
    // if (isAsyncIterable(x)) return filterAsyncIterable(fn, x)
    if (isArray(x)) return filterArrayWithIndex(fn, x)
    if (isString(x)) return filterStringWithIndex(fn, x)
    // if (is(Set)(x)) return filterSet(fn, x)
    // if (is(Map)(x)) return filterMap(fn, x)
    // if (isNumberTypedArray(x)) return filterTypedArray(fn, x)
    // if (isBigIntTypedArray(x)) return filterTypedArray(fn, x)
    // if (isIterable(x)) return filterIterable(fn, x) // for generators or custom iterators
    // if (is(Object)(x)) return filterObject(fn, x)
    // if (isFunction(x)) return filterReducer(fn, x)
    throw new TypeError('filter(...)(x); x invalid')
  }
}

const asyncReduceIterator = async (fn, y0, iter) => {
  let y = y0
  for (const xi of iter) {
    y = await fn(y, xi)
  }
  return y
}

// https://stackoverflow.com/questions/62112863/what-are-the-performance-implications-if-any-of-chaining-too-many-thens-on
const reduceIterable = (fn, possiblyX0, x) => {
  const iter = x[Symbol.iterator]()
  const y0 = isUndefined(possiblyX0) ? iter.next().value : possiblyX0
  if (isUndefined(y0)) {
    throw new TypeError('reduce(...)(x); x cannot be empty')
  }
  let y = fn(y0, iter.next().value)
  if (isPromise(y)) {
    return y.then(res => asyncReduceIterator(fn, res, iter))
  }
  for (const xi of iter) {
    y = fn(y, xi)
    if (isPromise(y)) {
      return y.then(res => asyncReduceIterator(fn, res, iter))
    }
  }
  return y
}

const reduceAsyncIterable = async (fn, possiblyY0, x) => {
  const iter = x[Symbol.asyncIterator]()
  const y0 = isUndefined(possiblyY0) ? (await iter.next()).value : possiblyY0
  if (isUndefined(y0)) {
    throw new TypeError('reduce(...)(x); x cannot be empty')
  }
  let y = await fn(y0, (await iter.next()).value)
  for await (const xi of iter) {
    y = await fn(y, xi)
  }
  return y
}

const reduceObject = (fn, x0, x) => reduceIterable(
  fn,
  x0,
  (function* () { for (const k in x) yield x[k] })(),
)

// https://stackoverflow.com/questions/30233302/promise-is-it-possible-to-force-cancel-a-promise/30235261#30235261
// https://stackoverflow.com/questions/62336381/is-this-promise-cancellation-implementation-for-reducing-an-async-iterable-on-th
const reduce = (fn, init) => {
  if (!isFunction(fn)) {
    throw new TypeError('reduce(x, y); x is not a function')
  }
  return x => {
    const x0 = isFunction(init) ? init(x) : init
    if (isIterable(x)) return (isPromise(x0)
      ? x0.then(res => reduceIterable(fn, res, x))
      : reduceIterable(fn, x0, x))
    if (isAsyncIterable(x)) {
      const state = { cancel: () => {} }
      const cancelToken = new Promise((_, reject) => { state.cancel = reject })
      const p = Promise.race([
        (isPromise(x0)
          ? x0.then(res => reduceAsyncIterable(fn, res, x))
          : reduceAsyncIterable(fn, x0, x)),
        cancelToken,
      ])
      p.cancel = () => { state.cancel(new Error('cancelled')) }
      return p
    }
    if (is(Object)(x)) return reduceObject(fn, x0, x)
    throw new TypeError('reduce(...)(x); x invalid')
  }
}

const nullTransform = (fn, x0) => reduce(
  fn(() => x0),
  x0,
)

const arrayTransform = (fn, x0) => x => reduce(
  fn((y, xi) => { y.push(xi); return y }),
  x0,
)(x)

const stringTransform = (fn, x0) => reduce(
  fn((y, xi) => `${y}${xi}`),
  x0,
)

const setTransform = (fn, x0) => reduce(
  fn((y, xi) => y.add(xi)),
  x0,
)

const mapTransform = (fn, x0) => reduce(
  fn((y, xi) => y.set(xi[0], xi[1])),
  x0,
)

const stringToCharCodes = x => {
  const y = []
  for (let i = 0; i < x.length; i++) {
    y.push(x.charCodeAt(i))
  }
  return y
}

const toNumberTypedArray = (constructor, x) => {
  if (isNumber(x)) return constructor.of(x)
  if (isString(x)) return new constructor(stringToCharCodes(x))
  if (isNumberTypedArray(x)) return new constructor(x)
  if (isArray(x) && x.every(isNumber)) return new constructor(x)
  throw new TypeError([
    `toNumberTypedArray(${constructor.name}, y)`,
    `cannot convert y to ${constructor.name}`,
  ].join('; '))
}

const firstPowerOf2After = x => {
  let y = 2
  while (y < x + 1) {
    y = y << 1
  }
  return y
}

const typedArrayConcat = (y, chunk, offset) => {
  const nextLength = offset + chunk.length
  const buf = nextLength > y.length ? (() => {
    const newBuf = new y.constructor(firstPowerOf2After(nextLength))
    newBuf.set(y, 0)
    return newBuf
  })() : y
  buf.set(chunk, offset)
  return buf
}

const numberTypedArrayTransform = (fn, x0) => x => {
  const point = reduce(
    fn(({ y, offset }, xi) => {
      const chunk = toNumberTypedArray(x0.constructor, xi)
      const buf = typedArrayConcat(y, chunk, offset)
      return { y: buf, offset: offset + chunk.length }
    }),
    { y: x0.constructor.from(x0), offset: x0.length },
  )(x)
  return isPromise(point) ? point.then(
    res => res.y.slice(0, res.offset)
  ) : point.y.slice(0, point.offset)
}

const toBigIntTypedArray = (constructor, x) => {
  if (isBigInt(x)) return constructor.of(x)
  if (isBigIntTypedArray(x)) return new constructor(x)
  if (isArray(x) && x.every(isBigInt)) return new constructor(x)
  throw new TypeError([
    `toBigIntTypedArray(${constructor.name}, y)`,
    `cannot convert y to ${constructor.name}`,
  ].join('; '))
}

const bigIntTypedArrayTransform = (fn, x0) => x => {
  const point = reduce(
    fn(({ y, offset }, xi) => {
      const chunk = toBigIntTypedArray(x0.constructor, xi)
      const buf = typedArrayConcat(y, chunk, offset)
      return { y: buf, offset: offset + chunk.length }
    }),
    { y: x0.constructor.from(x0), offset: x0.length },
  )(x)
  return isPromise(point) ? point.then(
    res => res.y.slice(0, res.offset)
  ) : point.y.slice(0, point.offset)
}

const writableTransform = (fn, x0) => reduce(
  fn((y, xi) => { y.write(xi); return y }),
  x0,
)

const objectTransform = (fn, x0) => reduce(
  fn((y, xi) => {
    if (isArray(xi)) { y[xi[0]] = xi[1]; return y }
    return Object.assign(y, xi)
    // TODO: implement
    // if (is(Object)(xi)) Object.assign(y, xi)
    // else throw new TypeError('...')
  }),
  x0,
)

const _transformBranch = (fn, x0, x) => {
  if (isNull(x0)) return nullTransform(fn, x0)(x)
  if (isArray(x0)) return arrayTransform(fn, x0)(x)
  if (isString(x0)) return stringTransform(fn, x0)(x)
  if (is(Set)(x0)) return setTransform(fn, x0)(x)
  if (is(Map)(x0)) return mapTransform(fn, x0)(x)
  if (isNumberTypedArray(x0)) return numberTypedArrayTransform(fn, x0)(x)
  if (isBigIntTypedArray(x0)) return bigIntTypedArrayTransform(fn, x0)(x)
  if (isWritable(x0)) return writableTransform(fn, x0)(x)
  if (is(Object)(x0)) return objectTransform(fn, x0)(x)
  throw new TypeError('transform(x, y); x invalid')
}

const transform = (fn, init) => {
  if (!isFunction(fn)) {
    throw new TypeError('transform(x, y); y is not a function')
  }
  return x => {
    const x0 = isFunction(init) ? init(x) : init
    return (isPromise(x0)
      ? x0.then(res => _transformBranch(fn, res, x))
      : _transformBranch(fn, x0, x))
  }
}

const flattenIterable = (reducer, x0, x) => {
  let y = x0
  for (const xi of x) {
    if (isIterable(xi)) {
      for (const xii of xi) y = reducer(y, xii)
    } else if (is(Object)(xi)) {
      for (const k in xi) y = reducer(y, xi[k])
    } else {
      throw new TypeError('flatMap(...)(x); cannot flatten element of x')
    }
  }
  return y
}

const flatten = (reducer, y, x) => {
  if (isIterable(x)) return flattenIterable(reducer, y, x)
  throw new TypeError('flatMap(...)(x); cannot flatten x')
}

const flattenToArray = x => flatten(
  (y, xii) => { y.push(xii); return y },
  [],
  x,
)

const flattenToSet = x => flatten(
  (y, xii) => y.add(xii),
  new Set(),
  x,
)

const flatMapArray = (fn, x) => {
  const y = mapArray(fn, x)
  return isPromise(y) ? y.then(flattenToArray) : flattenToArray(y)
}

const flatMapSet = (fn, x) => {
  const y = mapSet(fn, x)
  return isPromise(y) ? y.then(flattenToSet) : flattenToSet(y)
}

const flatMapReducer = (fn, reducer) => (y, xi) => {
  const yi = fn(xi)
  return isPromise(yi) ? yi.then(reduce(reducer, y)) : reduce(reducer, y)(yi)
}

const flatMap = fn => {
  if (!isFunction(fn)) {
    throw new TypeError('flatMap(x); x is not a function')
  }
  return x => {
    if (isArray(x)) return flatMapArray(fn, x)
    if (is(Set)(x)) return flatMapSet(fn, x)
    if (isFunction(x)) return flatMapReducer(fn, x)
    throw new TypeError('flatMap(...)(x); x invalid')
  }
}

const isDelimitedBy = (delim, x) => (x
  && x[0] !== delim
  && x[x.length - 1] !== delim
  && x.slice(1, x.length - 1).includes(delim))

const arrayGet = (path, x, defaultValue) => {
  let y = x
  if (!isDefined(y)) return defaultValue
  for (let i = 0; i < path.length; i++) {
    y = y[path[i]]
    if (!isDefined(y)) return defaultValue
  }
  return y
}

const get = (path, defaultValue) => {
  if (isArray(path)) return x => arrayGet(path, x, defaultValue)
  if (isNumber(path)) return x => arrayGet([path], x, defaultValue)
  if (isString(path)) return (isDelimitedBy('.', path)
    ? x => arrayGet(path.split('.'), x, defaultValue)
    : x => arrayGet([path], x, defaultValue))
  throw new TypeError('get(x, y); x invalid')
}

const pickObject = (props, x) => {
  const y = {}
  for (let i = 0; i < props.length; i++) {
    if (isDefined(x[props[i]])) y[props[i]] = x[props[i]]
  }
  return y
}

const pick = props => {
  if (isArray(props)) return x => {
    if (is(Object)(x)) return pickObject(props, x)
    throw new TypeError('pick(...)(x); x is not an object')
  }
  throw new TypeError('pick(x); x is not an array')
}

const omitObject = (props, x) => {
  const y = Object.assign({}, x)
  for (let i = 0; i < props.length; i++) delete y[props[i]]
  return y
}

const omit = props => {
  if (isArray(props)) return x => {
    if (is(Object)(x)) return omitObject(props, x)
    throw new TypeError('omit(...)(x); x is not an object')
  }
  throw new TypeError('omit(x); x is not an array')
}

const anyIterable = (fn, x) => {
  const promises = []
  for (const xi of x) {
    const point = fn(xi)
    if (isPromise(point)) promises.push(point)
    else if (point) return (promises.length > 0
      ? Promise.all(promises).then(() => true)
      : true)
  }
  return (promises.length > 0
    ? Promise.all(promises).then(res => res.some(x => x))
    : false)
}

const anyObject = (fn, x) => anyIterable(
  fn,
  (function* () { for (const k in x) yield x[k] })(),
)

const any = fn => {
  if (!isFunction(fn)) {
    throw new TypeError('any(x); x is not a function')
  }
  return x => {
    if (isIterable(x)) return anyIterable(fn, x)
    if (is(Object)(x)) return anyObject(fn, x)
    throw new TypeError('any(...)(x); x invalid')
  }
}

const allIterable = (fn, x) => {
  const promises = []
  for (const xi of x) {
    const point = fn(xi)
    if (isPromise(point)) promises.push(point)
    else if (!point) return (promises.length > 0
      ? Promise.all(promises).then(() => false)
      : false)
  }
  return (promises.length > 0
    ? Promise.all(promises).then(res => res.every(x => x))
    : true)
}

const allObject = (fn, x) => allIterable(
  fn,
  (function* () { for (const k in x) yield x[k] })(),
)

const all = fn => {
  if (!isFunction(fn)) {
    throw new TypeError('all(x); x is not a function')
  }
  return x => {
    if (isIterable(x)) return allIterable(fn, x)
    if (is(Object)(x)) return allObject(fn, x)
    throw new TypeError('all(...)(x); x invalid')
  }
}

const arrayAnd = (fns, x) => {
  const promises = []
  for (let i = 0; i < fns.length; i++) {
    const point = fns[i](x)
    if (isPromise(point)) promises.push(point)
    else if (!point) return (promises.length > 0
      ? Promise.all(promises).then(() => false)
      : false)
  }
  return (promises.length > 0
    ? Promise.all(promises).then(res => res.every(x => x))
    : true)
}

const and = fns => {
  if (!isArray(fns)) {
    throw new TypeError('and(x); x is not an array of functions')
  }
  if (fns.length < 1) {
    throw new RangeError('and(x); x is not an array of at least one function')
  }
  for (let i = 0; i < fns.length; i++) {
    if (isFunction(fns[i])) continue
    throw new TypeError(`and(x); x[${i}] is not a function`)
  }
  return x => arrayAnd(fns, x)
}

const arrayOr = (fns, x) => {
  const promises = []
  for (let i = 0; i < fns.length; i++) {
    const point = fns[i](x)
    if (isPromise(point)) promises.push(point)
    else if (point) return (promises.length > 0
      ? Promise.all(promises).then(() => true)
      : true)
  }
  return (promises.length > 0
    ? Promise.all(promises).then(res => res.some(x => x))
    : false)
}

const or = fns => {
  if (!isArray(fns)) {
    throw new TypeError('or(x); x is not an array of functions')
  }
  if (fns.length < 1) {
    throw new RangeError('or(x); x is not an array of at least one function')
  }
  for (let i = 0; i < fns.length; i++) {
    if (isFunction(fns[i])) continue
    throw new TypeError(`or(x); x[${i}] is not a function`)
  }
  return x => arrayOr(fns, x)
}

const not = fn => {
  if (!isFunction(fn)) {
    throw new TypeError('not(x); x is not a function')
  }
  return x => {
    const point = fn(x)
    return isPromise(point) ? point.then(res => !res) : !point
  }
}

const compare = (predicate, f, g) => x => {
  const fx = isFunction(f) ? f(x) : f
  const gx = isFunction(g) ? g(x) : g
  return (isPromise(fx) || isPromise(gx)
    ? Promise.all([fx, gx]).then(res => predicate(...res))
    : predicate(fx, gx))
}

const eq = function(f, g) {
  if (arguments.length !== 2) {
    throw new RangeError('eq(...arguments); exactly two arguments required')
  }
  return compare((a, b) => a === b, f, g)
}

const gt = function(f, g) {
  if (arguments.length !== 2) {
    throw new RangeError('gt(...arguments); exactly two arguments required')
  }
  return compare((a, b) => a > b, f, g)
}

const lt = function(f, g) {
  if (arguments.length !== 2) {
    throw new RangeError('lt(...arguments); exactly two arguments required')
  }
  return compare((a, b) => a < b, f, g)
}

const gte = function(f, g) {
  if (arguments.length !== 2) {
    throw new RangeError('gte(...arguments); exactly two arguments required')
  }
  return compare((a, b) => a >= b, f, g)
}

const lte = function(f, g) {
  if (arguments.length !== 2) {
    throw new RangeError('lte(...arguments); exactly two arguments required')
  }
  return compare((a, b) => a <= b, f, g)
}

exports.pipe = pipe
exports.fork = fork
exports.assign = assign
exports.tap = tap
exports.tryCatch = tryCatch
exports.switchCase = switchCase
exports.map = map
exports.flatMap = flatMap
exports.filter = filter
exports.reduce = reduce
exports.transform = transform
exports.get = get
exports.pick = pick
exports.omit = omit
exports.any = any
exports.all = all
exports.and = and
exports.or = or
exports.not = not
exports.eq = eq
exports.gt = gt
exports.lt = lt
exports.gte = gte
exports.lte = lte

}))
