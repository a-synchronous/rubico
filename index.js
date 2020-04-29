const isFunction = x => typeof x === 'function'

const toFunction = x => isFunction(x) ? x : (() => x)

const is = fn => x => x && x.constructor && x.constructor === fn

const isArray = is(Array)

const isObject = is(Object)

const isPromise = is(Promise)

const type = x => (x && x.constructor && x.constructor.name) || typeof x

const chain = (fns, args, i = 0) => {
  const point = fns[i](...args)
  if (i === fns.length - 1) return point
  if (isPromise(point)) return new Promise((resolve, reject) => {
    point.then(res => {
      resolve(chain(fns, [res], i + 1))
    }).catch(reject)
  })
  return chain(fns, [point], i + 1)
}

const flow = (...fns) => {
  for (i = 0; i < fns.length; i++) {
    if (isFunction(fns[i])) continue
    throw new TypeError(`${typeof fns[i]} (arguments[${i}]) is not a function`)
  }
  if (fns.length === 0) return x => x
  return (...x) => chain(fns, x)
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

const map = fn => {
  if (!isFunction(fn)) {
    throw new TypeError(`${typeof fn} is not a function`)
  }
  return x => {
    if (isArray(x)) return mapArray(fn, x)
    if (isObject(x)) return mapObject(fn, x)
    throw new TypeError(`cannot map from ${type(x)}`)
  }
}

// TODO: implement
const switch = (...fns) => {}

// TODO: implement
const assign = (...fns) => {}

// TODO: reconsider
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

const r = {
  flow, map, diverge,
}

module.exports = r
