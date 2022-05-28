const isPromise = require('./isPromise')
const curry3 = require('./curry3')
const always = require('./always')
const thunkify2 = require('./thunkify2')
const thunkConditional = require('./thunkConditional')
const __ = require('./placeholder')

/**
 * @name arrayConditional
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayConditional(array Array<value>, index number) -> boolean
 * ```
 */
const arrayConditional = function (array, index) {
  const length = array.length,
    lastIndex = length - 1
  while ((index += 2) < lastIndex) {
    const predication = array[index],
      value = array[index + 1]
    if (isPromise(predication)) {
      return predication.then(curry3(
        thunkConditional,
        __,
        always(value),
        thunkify2(arrayConditional, array, index),
      ))
    }
    if (predication) {
      return value
    }
  }
  // even number of array values
  if (index == length) {
    return undefined
  }
  return array[index]
}

module.exports = arrayConditional
