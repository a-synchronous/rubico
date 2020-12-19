const timeInLoop = require('./timeInLoop')
const sameValueZero = require('../_internal/sameValueZero')

const arrayIncludes = function (array, value) {
  const length = array.length
  let index = -1
  while (++index < length) {
    if (sameValueZero(value, array[index])) {
      return true
    }
  }
  return false
}

/**
 * @name arrayIncludes
 *
 * @benchmark
 * arrayIncludes: 1e+6: 15.412ms
 */
{
  const array = [1, 2, 3, 4, 5]

  // timeInLoop('arrayIncludes', 1e6, () => arrayIncludes(array, 5))

  // timeInLoop('array.includes', 1e6, () => array.includes(5))
}
