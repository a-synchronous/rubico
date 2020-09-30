const isPromise = require('./isPromise')

/**
 * @name asyncIteratorFind
 *
 * @synopsis
 * var T any,
 *   asyncIterator AsyncIterator<T>,
 *   predicate T=>Promise|boolean
 *
 * asyncIteratorFind(asyncIterator, predicate) -> Promise|T|undefined
 */
const asyncIteratorFind = async function (asyncIterator, predicate) {
  let iteration = await asyncIterator.next()
  while (!iteration.done) {
    const item = iteration.value
    let predication = predicate(item)
    if (isPromise(predication)) {
      predication = await predication
    }
    if (predication) {
      return item
    }
    iteration = await asyncIterator.next()
  }
  return undefined
}

module.exports = asyncIteratorFind
