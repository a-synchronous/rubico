/* principles
 *
 * this is a module, not a utility library
 * functional code should not care about async
 * these functions are optimized for v8
 */

const isFunction = x => typeof x === 'function'

const isBinaryFunction = x => typeof x === 'function' && x.length === 2

const toFunction = x => isFunction(x) ? x : (() => x)

const is = fn => x => x && x.constructor && x.constructor === fn

const isArray = is(Array)

const isObject = is(Object)

const isPromise = is(Promise)

const type = x => (x && x.constructor && x.constructor.name) || typeof x

const range = (start, end) => Array.from({ length: end - start }, (x, i) => i + start)

const arrayOf = (item, length) => Array.from({ length }, () => item)

const _chain = (fns, args, i, step, end) => {
  const point = fns[i](...args)
  if (i === (end - step)) return point
  if (isPromise(point)) return new Promise((resolve, reject) => {
    point.then(res => {
      resolve(_chain(fns, [res], i + step, step, end))
    }).catch(reject)
  })
  return _chain(fns, [point], i + step, step, end)
}

const pipe = fns => {
  if (!isArray(fns)) {
    throw new TypeError(`first argument must be an array of functions`)
  }
  for (i = 0; i < fns.length; i++) {
    if (isFunction(fns[i])) continue
    throw new TypeError(`${typeof fns[i]} (functions[${i}]) is not a function`)
  }
  if (fns.length === 0) return x => x
  return (...args) => {
    if (isBinaryFunction(args[0])) {
      return _chain(fns, args, fns.length - 1, -1, -1)
    }
    return _chain(fns, args, 0, 1, fns.length)
  }
}

// arr.map: https://v8.dev/blog/elements-kinds#avoid-polymorphism
const mapArray = (fn, arr) => {
  let isAsync = false
  const retArr = arr.map(item => {
    const point = fn(item)
    if (isPromise(point)) isAsync = true
    return point
  })
  return isAsync ? Promise.all(retArr) : retArr
}

const mapObject = (fn, obj) => {
  const retObj = {}
  const promises = []
  for (const key in obj) {
    const point = fn(obj[key])
    if (isPromise(point)) {
      promises.push(new Promise((resolve, reject) => {
        point.then(res => {
          retObj[key] = res
          resolve()
        }).catch(reject)
      }))
    } else {
      retObj[key] = point
    }
  }
  if (promises.length > 0) {
    return Promise.all(promises).then(() => retObj)
  }
  return retObj
}

const mapReducer = (fn, reducer) => (y, xi) => {
  const point = fn(xi)
  if (isPromise(point) || isPromise(y)) {
    return new Promise((resolve, reject) => {
      Promise.all([y, point]).then(res => {
        resolve(reducer(...res))
      }).catch(reject)
    })
  }
  return reducer(y, point)
}

const map = fn => {
  if (!isFunction(fn)) {
    throw new TypeError(`${typeof fn} is not a function`)
  }
  return x => {
    if (isArray(x)) return mapArray(fn, x)
    if (isObject(x)) return mapObject(fn, x)
    if (isBinaryFunction(x)) return mapReducer(fn, x)
    throw new TypeError(`cannot map from ${type(x)}`)
  }
}

const filterArray = (fn, arr) => {
  let isAsync = false
  const okArr = arr.map(item => {
    const ok = fn(item)
    if (isPromise(ok)) isAsync = true
    return ok
  })
  if (isAsync) {
    return Promise.all(okArr).then(
      res => arr.filter((_, i) => res[i])
    )
  }
  return arr.filter((_, i) => okArr[i])
}

const filterObject = (fn, obj) => {
  const retObj = {}
  const promises = []
  for (const k in obj) {
    const ok = fn(obj[k])
    if (isPromise(ok)) {
      promises.push(new Promise((resolve, reject) => {
        ok.then(res => {
          if (res) { retObj[k] = obj[k] }
          resolve()
        }).catch(reject)
      }))
    } else {
      if (ok) { retObj[k] = obj[k] }
    }
  }
  if (promises.length > 0) {
    return Promise.all(promises).then(() => retObj)
  }
  return retObj
}

// TODO: implement
const filterReducer = (fn, reducer) => {}

const filter = fn => {
  if (!isFunction(fn)) {
    throw new TypeError(`${typeof fn} is not a function`)
  }
  return x => {
    if (isArray(x)) return filterArray(fn, x)
    if (isObject(x)) return filterObject(fn, x)
    if (isBinaryFunction(x)) return filterReducer(fn, x)
    throw new TypeError(`cannot filter from ${type(x)}`)
  }
}

// TODO: implement
const reduce = fn => x => {}

// TODO: implement
// r.assign({ a: hi, b: ho })
// input must be object
const assign = fns => {}

// TODO: reconsider name.. put?
const diverge = fns => {
  if (isArray(fns)) {
    const _fns = fns.map(toFunction)
    return async (...x) => await Promise.all(_fns.map(f => f(...x)))
  }
  if (isObject(fns)) {
    const _fns = {}
    for (const k in fns) {
      _fns[k] = toFunction(fns[k])
    }
    return async (...x) => {
      const y = {}, tasks = []
      for (const k in _fns) {
        const p = _fns[k](...x)
        if (isPromise(p)) tasks.push(p.then(a => { y[k] = a }))
        else { y[k] = p }
      }
      await Promise.all(tasks)
      return y
    }
  }
  throw new TypeError(`cannot diverge from ${type(fns)}`)
}

// TODO: implement
// r.switch([isNumber, () => 'was number', isString, 'was string', throwError])
const switch_ = fns => {}

const r = {
  pipe,
  map,
  filter,
  reduce,
  assign,
  diverge,
  switch: switch_,
}

module.exports = r
