const PossiblePromise = require('../monad/possible-promise')
const isObject = require('./isObject')

const identity = x => x

const isDefined = x => x !== undefined && x !== null

const isPromise = x => x && typeof x.then === 'function'

const isIterable = x => x && isDefined(x[Symbol.iterator])

const isFunction = x => typeof x === 'function'

const asyncFindIterator = async (f, iter) => {
  for (const xi of iter) {
    if (await f(xi)) return xi
  }
  return undefined
}

const findIterator = (f, iter) => {
  for (const xi of iter) {
    const ok = f(xi)
    if (isPromise(ok)) {
      return ok.then(res => (
        res ? xi : asyncFindIterator(f, iter)))
    } else if (ok) {
      return xi
    }
  }
  return undefined
}

const ObjectValuesIterator = function*(x) {
  for (const k in x) {
    yield x[k]
  }
}

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
    if (isIterable(x)) return findIterator(f, x[Symbol.iterator]())
    if (isObject(x)) return findIterator(f, ObjectValuesIterator(x))
    throw new TypeError('find(...)(x); x invalid')
  })
}

module.exports = find
