const isPromise = require('./isPromise')
const __ = require('./placeholder')
const curry3 = require('./curry3')
const thunkify3 = require('./thunkify3')
const thunkConditional = require('./thunkConditional')
const always = require('./always')

/**
 * @name arrayFindAsync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var T any,
 *   array Array<T>,
 *   predicate T=>Promise|boolean,
 *   result Promise<T|undefined>
 *
 * arrayFindAsync(array, predicate) -> result
 * ```
 */
const arrayFindAsync = async function (array, predicate, index) {
  const length = array.length
  while (++index < length) {
    const element = array[index]
    let predication = predicate(element)
    if (isPromise(predication)) {
      predication = await predication
    }
    if (predication) {
      return element
    }
  }
  return undefined
}

/**
 * @name arrayFind
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var T any,
 *   array Array<T>,
 *   predicate T=>Promise|boolean,
 *   result Promise|T|undefined
 *
 * arrayFind(array, predicate) -> result
 * ```
 */
const arrayFind = function (array, predicate) {
  const length = array.length
  let index = -1
  while (++index < length) {
    const element = array[index],
      predication = predicate(element)
    if (isPromise(predication)) {
      return predication.then(curry3(
        thunkConditional,
        __,
        always(element),
        thunkify3(arrayFindAsync, array, predicate, index)))
    } else if (predication) {
      return element
    }
  }
  return undefined
}

module.exports = arrayFind
