const curryFunction = (fn, ...args) => {
  if (args.length >= fn.length) return fn(...args)
  return (...moreArgs) => curryFunction(fn, ...args.concat(moreArgs))
}

const curry = fn => {
  if (typeof fn !== 'function') {
    throw new TypeError('curry(f); f is not a function')
  }
  return (...args) => curryFunction(fn, ...args)
}

module.exports = curry
