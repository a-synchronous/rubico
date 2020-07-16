const { pipe, switchCase, reduce, or, get } = require('..')
const is = require('./is')

const isDefined = x => typeof x !== 'undefined' && x !== null

const entries = function*(x) {
  for (const k in x) {
    yield [k, x[k]]
  }
}

const isArrayOrObject = or([is(Array), is(Object)])

// ([any]|object, any => boolean) => [any]|object => [any]|object
const defaultsDeep = (defaultCollection, checkingFunc = isDefined) => {
  if (!isArrayOrObject(defaultCollection)) {
    throw new TypeError([
      'defaultsDeep(defaultCollection)',
      'defaultCollection is not an Array or Object',
    ].join('; '))
  }
  return x => reduce(
    (y, [k, defaultValue]) => switchCase([
      or([
        is(Object),
        is(Array),
      ]), xk => {
        y[k] = defaultsDeep(defaultValue, checkingFunc)(xk)
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
    () => new x.constructor(x)
  )(entries(defaultCollection))
}

module.exports = defaultsDeep
