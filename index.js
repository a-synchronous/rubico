'use strict'

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

const isIterable = x => isDefined(x[Symbol.iterator])

const isAsyncIterable = x => isDefined(x[Symbol.asyncIterator])

const isReadable = x => x
  && x.readable
  && typeof x._read === 'function'
  && typeof x._readableState === 'object'

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

const isNumber = x => typeof x === 'number'

const isBigInt = x => typeof x === 'bigint'

const isString = x => typeof x === 'string'

const isPromise = x => x && typeof x.then === 'function'

const is = fn => x => x && x.constructor === fn

const isObject = is(Object)

const isSet = is(Set)

const toLowerCase = x => x && typeof x.toLowerCase === 'function' && x.toLowerCase()

const type = x => x && x.constructor && toLowerCase(x.constructor.name) || typeof x

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
  return (...args) => isFunction(args[0])
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
  if (isObject(fns)) {
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
  return isPromise(point)
    ? point.then(res => arrayForkSeries(fns, x, i + 1, y.concat(res)))
    : arrayForkSeries(fns, x, i + 1, y.concat(point))
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
  if (!isObject(fns)) {
    throw new TypeError('assign(x); x is not an object of functions')
  }
  return x => {
    if (!isObject(x)) {
      throw new TypeError('assign(...)(x); x is not an object')
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

const arrayTernary = (fns, x) => {
  const ok = fns[0](x)
  return isPromise(ok) ? ok.then(
    res => res ? fns[1](x) : fns[2](x)
  ) : ok ? fns[1](x) : fns[2](x)
}

// TODO: ...fns
const ternary = fns => {
  if (!isArray(fns)) {
    throw new TypeError('ternary(x); x is not an array of three functions')
  }
  if (fns.length !== 3) {
    throw new RangeError('ternary(x); x is not an array of exactly three functions')
  }
  for (let i = 0; i < fns.length; i++) {
    if (isFunction(fns[i])) continue
    throw new TypeError(`ternary(x); x[${i}] is not a function`)
  }
  return x => arrayTernary(fns, x)
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
    throw new TypeError('map(x); x is not a function')
  }
  return x => {
    if (isArray(x)) return mapArray(fn, x)
    if (isObject(x)) return mapObject(fn, x)
    if (isFunction(x)) return mapReducer(fn, x)
    throw new TypeError('map(...)(x); x invalid')
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
    throw new TypeError('map.series(x); x is not a function')
  }
  return x => {
    if (isArray(x)) return mapSeriesArray(fn, x, 0, [])
    throw new TypeError('map.series(...)(x); x invalid')
  }
}

// TODO(richytong): map.pool(fn, poolSize); poolSize is max concurrency
map.pool = (fn, poolSize) => {}

// TODO(richytong): map.indexed(fn); fn called with (item, index, array)
map.withIndex = fn => {}

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
    throw new TypeError('filter(x); x is not a function')
  }
  return x => {
    if (isArray(x)) return filterArray(fn, x)
    if (isObject(x)) return filterObject(fn, x)
    if (isFunction(x)) return filterReducer(fn, x)
    throw new TypeError('filter(...)(x); x invalid')
  }
}

const reduceIterable = (fn, x0, x) => {
  const iter = x[Symbol.iterator].bind(x)()
  let cursor = iter.next()
  if (cursor.done) {
    throw new TypeError('reduce(...)(x); x cannot be empty')
  }
  let y = !isUndefined(x0) ? fn(x0, cursor.value) : (() => {
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

const reduceAsyncIterable = async (fn, x0, x) => {
  const iter = x[Symbol.asyncIterator].bind(x)()
  let cursor = await iter.next()
  if (cursor.done) {
    throw new TypeError('reduce(...)(x); x cannot be empty')
  }
  let y = !isUndefined(x0) ? await fn(x0, cursor.value) : await (async () => {
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

const reduceObject = (fn, x0, x) => reduceIterable(
  fn,
  x0,
  (function* () { for (const k in x) yield x[k] })(),
)

const reduce = (fn, x0) => {
  if (!isFunction(fn)) {
    throw new TypeError('reduce(x, y); x is not a function')
  }
  return x => {
    if (isIterable(x)) return reduceIterable(fn, x0, x)
    if (isAsyncIterable(x)) return reduceAsyncIterable(fn, x0, x)
    if (isObject(x)) return reduceObject(fn, x0, x)
    throw new TypeError('reduce(...)(x); x invalid')
  }
}

const nullTransform = (x0, fn) => reduce(
  fn(() => x0),
  x0,
)

const arrayTransform = (x0, fn) => reduce(
  fn((y, xi) => { y.push(xi); return y }),
  Array.from(x0),
)

const stringTransform = (x0, fn) => reduce(
  fn((y, xi) => `${y}${xi}`),
  x0,
)

const setTransform = (x0, fn) => reduce(
  fn((y, xi) => y.add(xi)),
  new Set(x0),
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

const numberTypedArrayTransform = (x0, fn) => x => {
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

const bigIntTypedArrayTransform = (x0, fn) => x => {
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

const writeableTransform = (x0, fn) => reduce(
  fn((y, xi) => { y.write(xi); return y }),
  x0,
)

const transform = (x0, fn) => {
  if (!isFunction(fn)) {
    throw new TypeError('transform(x, y); y is not a function')
  }
  if (isNull(x0)) return nullTransform(x0, fn)
  if (isArray(x0)) return arrayTransform(x0, fn)
  if (isString(x0)) return stringTransform(x0, fn)
  if (isSet(x0)) return setTransform(x0, fn)
  if (isNumberTypedArray(x0)) return numberTypedArrayTransform(x0, fn)
  if (isBigIntTypedArray(x0)) return bigIntTypedArrayTransform(x0, fn)
  if (isWritable(x0)) return writeableTransform(x0, fn)
  // TODO(richytong): if (isDataView(x0)) return dataViewTransform(x0, fn)
  throw new TypeError('transform(x, y); x invalid')
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
    if (isObject(x)) return pickObject(props, x)
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
    if (isObject(x)) return omitObject(props, x)
    throw new TypeError('omit(...)(x); x is not an object')
  }
  throw new TypeError('omit(x); x is not an array')
}

const anyIterable = (fn, x) => {
  const promises = []
  for (const xi of x) {
    const point = fn(xi)
    if (isPromise(point)) promises.push(point)
    else if (point) return promises.length > 0
      ? Promise.all(promises).then(() => true)
      : true
  }
  return promises.length > 0
    ? Promise.all(promises).then(res => res.some(x => x))
    : false
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
    if (isObject(x)) return anyObject(fn, x)
    throw new TypeError('any(...)(x); x invalid')
  }
}

const allIterable = (fn, x) => {
  const promises = []
  for (const xi of x) {
    const point = fn(xi)
    if (isPromise(point)) promises.push(point)
    else if (!point) return promises.length > 0
      ? Promise.all(promises).then(() => false)
      : false
  }
  return promises.length > 0
    ? Promise.all(promises).then(res => res.every(x => x))
    : true
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
    if (isObject(x)) return allObject(fn, x)
    throw new TypeError('all(...)(x); x invalid')
  }
}

const arrayAnd = (fns, x) => {
  const promises = []
  for (let i = 0; i < fns.length; i++) {
    const point = fns[i](x)
    if (isPromise(point)) promises.push(point)
    else if (!point) return promises.length > 0
      ? Promise.all(promises).then(() => false)
      : false
  }
  return promises.length > 0
    ? Promise.all(promises).then(res => res.every(x => x))
    : true
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
    else if (point) return promises.length > 0
      ? Promise.all(promises).then(() => true)
      : true
  }
  return promises.length > 0
    ? Promise.all(promises).then(res => res.some(x => x))
    : false
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

const compareAsc = (predicate, x) => {
  for (let i = 0; i < x.length - 1; i++) {
    if (!predicate(x[i], x[i + 1])) return false
  }
  return true
}

const operator = (predicate, fns, x) => {
  let isAsync = false
  const points = fns.map(fn => {
    const point = fn(x)
    if (isPromise(point)) isAsync = true
    return point
  })
  return isAsync ? Promise.all(points).then(
    res => compareAsc(predicate, res)
  ) : compareAsc(predicate, points)
}

const eq = fns => {
  if (!isArray(fns)) {
    throw new TypeError('eq(x); x is not an array of functions')
  }
  if (fns.length < 2) {
    throw new RangeError('eq(x); x is not an array of at least two functions')
  }
  for (let i = 0; i < fns.length; i++) {
    if (isFunction(fns[i])) continue
    throw new TypeError(`eq(x); x[${i}] is not a function`)
  }
  return x => operator((a, b) => a === b, fns, x)
}

const gt = fns => {
  if (!isArray(fns)) {
    throw new TypeError('gt(x); x is not an array of functions')
  }
  if (fns.length < 2) {
    throw new RangeError('gt(x); x is not an array of at least two functions')
  }
  for (let i = 0; i < fns.length; i++) {
    if (isFunction(fns[i])) continue
    throw new TypeError(`gt(x); x[${i}] is not a function`)
  }
  return x => operator((a, b) => a > b, fns, x)
}

const lt = fns => {
  if (!isArray(fns)) {
    throw new TypeError('lt(x); x is not an array of functions')
  }
  if (fns.length < 2) {
    throw new RangeError('lt(x); x is not an array of at least two functions')
  }
  for (let i = 0; i < fns.length; i++) {
    if (isFunction(fns[i])) continue
    throw new TypeError(`lt(x); x[${i}] is not a function`)
  }
  return x => operator((a, b) => a < b, fns, x)
}

const gte = fns => {
  if (!isArray(fns)) {
    throw new TypeError('gte(x); x is not an array of functions')
  }
  if (fns.length < 2) {
    throw new RangeError('gte(x); x is not an array of at least two functions')
  }
  for (let i = 0; i < fns.length; i++) {
    if (isFunction(fns[i])) continue
    throw new TypeError(`gte(x); x[${i}] is not a function`)
  }
  return x => operator((a, b) => a >= b, fns, x)
}

const lte = fns => {
  if (!isArray(fns)) {
    throw new TypeError('lte(x); x is not an array of functions')
  }
  if (fns.length < 2) {
    throw new RangeError('lte(x); x is not an array of at least two functions')
  }
  for (let i = 0; i < fns.length; i++) {
    if (isFunction(fns[i])) continue
    throw new TypeError(`lte(x); x[${i}] is not a function`)
  }
  return x => operator((a, b) => a <= b, fns, x)
}

const r = {
  pipe,
  fork,
  assign,
  tap,
  tryCatch,
  ternary,
  map,
  filter,
  reduce,
  transform,
  get,
  pick,
  omit,
  any,
  all,
  and,
  or,
  not,
  eq,
  gt,
  lt,
  gte,
  lte,
}

module.exports = r

// TODO: esm
