const { tap, reduce, switchCase } = require('..')

const identity = x => x

const isDefined = x => x !== undefined && x !== null

const isFunction = x => typeof x === 'function'

const find = f => {
  if (!isFunction(f)) {
    throw new TypeError('find(f); f is not a function')
  }
  return x => reduce(
    (y, xi) => isDefined(y) ? y : switchCase([
      f, identity,
      () => undefined,
    ])(xi),
    () => null,
  )(x)
}

module.exports = find
