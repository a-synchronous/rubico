const PossiblePromise = require('../monad/PossiblePromise')
const Instance = require('../monad/Instance')

const asyncFindIterator = async (f, iter) => {
  for (const xi of iter) {
    if (await f(xi)) return xi
  }
  return undefined
}

const findIterator = (f, iter) => {
  for (const xi of iter) {
    const ok = f(xi)
    if (!Instance.isInstance(ok)) continue
    if (Instance.isPromise(ok)) return ok.then(res => (
      res ? xi : asyncFindIterator(f, iter)))
    if (ok) return xi
  }
  return undefined
}

const objectValuesIterator = function*(x) {
  for (const k in x) {
    yield x[k]
  }
}

const isFunction = f => Instance.isInstance(f) && Instance.isFunction(f)

/*
 * @name find
 *
 * @synopsis
 * find(f function)(x Promise<Iterable>|Iterable) -> found any
 *
 * @catchphrase
 * Get the first item from a collection that matches a condition
 */
const find = f => {
  if (!isFunction(f)) {
    throw new TypeError('find(f); f is not a function')
  }
  return PossiblePromise.args(x => {
    if (!Instance.isInstance(x)) throw new TypeError(`find(...)(x); x cannot be ${x}`)
    if (Instance.isIterable(x)) return findIterator(f, x[Symbol.iterator]())
    if (Instance.isObject(x)) return findIterator(f, objectValuesIterator(x))
    throw new TypeError('find(...)(x); x invalid')
  })
}

module.exports = find
