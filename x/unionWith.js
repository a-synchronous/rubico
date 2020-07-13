const { switchCase, reduce, flatMap, any } = require('..')
const is = require('./is')

const isFunction = x => typeof x === 'function'

const isPromise = x => x && typeof x.then === 'function'

const concat = (y, yi) => (isPromise(yi)
  ? yi.then(res => y.concat(res))
  : y.concat(yi))

const arrayUnionWith = (binaryPredicate, x) => reduce(
  (y, xi) => concat(y, flatMap(
    switchCase([
      xii => any(
        yi => binaryPredicate(yi, xii)
      )(y), () => [],
      xi => [xi],
    ]),
  )(xi)),
  () => new x.constructor(),
)(x)

const unionWith = binaryPredicate => {
  if (!isFunction(binaryPredicate) || binaryPredicate.length !== 2) {
    throw new TypeError('unionWith(f); f is not a binary predicate function')
  }
  return x => {
    if (!is(Array)(x)) {
      throw new TypeError('unionWith(...)(x); x is not an Array')
    }
    return arrayUnionWith(binaryPredicate, x)
  }
}

module.exports = unionWith
