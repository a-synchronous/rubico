const { pipe, switchCase, reduce, or, get } = require('..')
const is = require('./is')

const isDefined = x => typeof x !== 'undefined' && x !== null

const entries = function*(x) {
  for (const k in x) {
    yield [k, x[k]]
  }
}

const isArrayOrObject = or([is(Array), is(Object)])

/*
 * @synopsis
 * defaultsDeepArrayOrObject(
 *   defaultCollection Array|Object,
 *   checkingFunc any=>boolean,
 *   x Array|Object,
 * ) -> deeplyDefaulted Array|Object
 */
const defaultsDeepArrayOrObject = (
  defaultCollection, checkingFunc, x,
) => reduce(
  (y, [k, defaultValue]) => switchCase([
    isArrayOrObject, xk => {
      y[k] = defaultsDeepArrayOrObject(defaultValue, checkingFunc, xk)
      return y
    },
    checkingFunc, xk => {
      y[k] = xk
      return y
    },
    () => {
      y[k] = defaultValue
      return y
    },
  ])(get(k)(x)),
  () => new x.constructor(x),
)(entries(defaultCollection))

/*
 * @synopsis
 * defaultsDeep(
 *   defaultCollection Array|Object,
 *   checkingFunc any=>boolean = isDefined,
 * )(x Array|Object) -> deeplyDefaulted Array|Object
 */
const defaultsDeep = (defaultCollection, checkingFunc = isDefined) => {
  if (!isArrayOrObject(defaultCollection)) {
    throw new TypeError([
      'defaultsDeep(defaultCollection)',
      'defaultCollection is not an Array or Object',
    ].join('; '))
  }
  return x => {
    if (isArrayOrObject(x)) {
      return defaultsDeepArrayOrObject(defaultCollection, checkingFunc, x)
    }
    throw new TypeError('defaultsDeep(...)(x); x invalid')
  }
}

module.exports = defaultsDeep
