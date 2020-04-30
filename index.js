const isFunction = x => typeof x === 'function'

const isBinaryFunction = x => typeof x === 'function' && x.length === 2

const toFunction = x => isFunction(x) ? x : (() => x)

const is = fn => x => x && x.constructor && x.constructor === fn

const isArray = is(Array)

const isObject = is(Object)

const isPromise = is(Promise)

const type = x => (x && x.constructor && x.constructor.name) || typeof x

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

const mapArray = (fn, arr) => {
  const retArr = []
  const promises = []
  for (let i = 0; i < arr.length; i++) {
    const point = fn(arr[i])
    if (isPromise(point)) {
      promises.push(new Promise((resolve, reject) => {
        point.then(res => {
          retArr[i] = res
          resolve()
        }).catch(reject)
      }))
    } else {
      retArr[i] = point
    }
  }
  if (promises.length > 0) {
    return new Promise((resolve, reject) => {
      Promise.all(promises).then(() => {
        resolve(retArr)
      }).catch(reject)
    })
  } else {
    return retArr
  }
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
    return new Promise((resolve, reject) => {
      Promise.all(promises).then(() => {
        resolve(retObj)
      }).catch(err => {
        reject(err)
      })
    })
  } else {
    return retObj
  }
}

// TODO: implement
const mapReducer = (fn, reducer) => {
  return (y, xi) => {
    reducer(y, fn(xi))
  }
}

const map = fn => {
  if (!isFunction(fn)) {
    throw new TypeError(`${typeof fn} is not a function`)
  }
  return x => {
    if (isArray(x)) return mapArray(fn, x)
    if (isObject(x)) return mapObject(fn, x)
    // TODO: if (isBinaryFunction(x)) return mapReducer(fn, x)
    // r.map(inc)((y, xi) => y.concat(xi))
    throw new TypeError(`cannot map from ${type(x)}`)
  }
}

// TODO: implement
const filter = fn => x => {}

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
