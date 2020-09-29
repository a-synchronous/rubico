const NextIteration = require('./NextIteration')
const isPromise = require('./isPromise')

/**
 * @name iterationMap
 *
 * @synopsis
 * iterationMap<
 *   T any,
 *   iteration { value: T, done: boolean },
 *   mapper T=>any,
 * >(iteration, mapper) -> nextIteration { value: any, done: boolean }
 *
 * @description
 * Apply a mapper to an iteration. Noop if iteration is done.
 */
const iterationMap = function (iteration, mapper) {
  if (iteration.done) {
    return iteration
  }
  const mappedValue = mapper(iteration.value)
  return isPromise(mappedValue)
    ? mappedValue.then(NextIteration)
    : { value: mappedValue, done: false }
}

module.exports = iterationMap
