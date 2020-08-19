const { tryCatch } = require('..')
const { timeInLoop } = require('../x')

/**
 * @name tryCatch
 *
 * @benchmark
 * tryCatch1Run: 1e+6: 35.7ms
 * tryCatch2Run: 1e+6: 37.875ms
 */

{
  const identity = value => value

  const noop = () => {}

  const tryCatch1 = tryCatch(identity, noop)

  const isPromise = value => value != null && typeof value.then == 'function'

  const tryCatchApplyCall = (tryer, catcher) => function tryCatcher(...args) {
    try {
      const output = tryer.apply(null, args)
      return isPromise(output)
        ? output.catch(err => catcher.call(null, err, ...args))
        : output
    } catch (err) {
      return catcher.call(null, err, ...args)
    }
  }

  const tryCatch2 = tryCatchApplyCall(identity, noop)

  const tryCatch1Run = () => tryCatch1('yo')

  const tryCatch2Run = () => tryCatch2('yo')

  // const func = tryCatch1Run
  const func = tryCatch2Run

  console.log('func()', func())

  timeInLoop(func.name, 1e6, func)
}
