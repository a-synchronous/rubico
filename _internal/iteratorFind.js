const isPromise = require('./isPromise')
const curry3 = require('./curry3')
const __ = require('./placeholder')
const thunkify2 = require('./thunkify2')
const thunkConditional = require('./thunkConditional')
const always = require('./always')

/**
 * @name iteratorFindAsync
 *
 * @synopsis
 * var T any,
 *   iterator Iterator<T>,
 *   predicate T=>Promise|boolean
 *
 * iteratorFindAsync(iterator, predicate) -> Promise<T|undefined>
 */
const iteratorFindAsync = async function (iterator, predicate) {
  let iteration = iterator.next()
  while (!iteration.done) {
    const item = iteration.value
    let predication = predicate(item)
    if (isPromise(predication)) {
      predication = await predication
    }
    if (predication) {
      return item
    }
    iteration = iterator.next()
  }
  return undefined
}

/**
 * @name iteratorFind
 *
 * @synopsis
 * var T any,
 *   iterator Iterator<T>,
 *   predicate T=>Promise|boolean
 *
 * iteratorFind(iterator, predicate) -> Promise|T|undefined
 */
const iteratorFind = function (iterator, predicate) {
  let iteration = iterator.next()
  while (!iteration.done) {
    const item = iteration.value,
      predication = predicate(item)
    if (isPromise(predication)) {
      return predication.then(curry3(
        thunkConditional,
        __,
        always(item),
        thunkify2(iteratorFindAsync, iterator, predicate)))
    } else if (predication) {
      return item
    }
    iteration = iterator.next()
  }
  return undefined
}

module.exports = iteratorFind
