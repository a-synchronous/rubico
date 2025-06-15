const curry3 = require('./curry3')
const __ = require('./placeholder')
const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')
const sleep = require('./sleep')

/**
 * @name arrayMapRate
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayMapRate(
 *   array Array,
 *   rate number,
 *   f function,
 * ) -> Promise<Array>
 * ```
 */
const arrayMapRate = async function (array, rate, f) {
  const length = array.length
  const result = Array(length)
  const minPeriodMs = 1 / rate * 1000
  let index = -1
  let lastExecutionTime = 0
  const totalStart = performance.now()
  while (++index < length) {
    if (index > 0 && lastExecutionTime < minPeriodMs) {
      await sleep(minPeriodMs - lastExecutionTime)
    }
    const start = performance.now()
    let resultElement = f(array[index], index, array)
    if (isPromise(resultElement)) {
      resultElement = await resultElement
    }
    const end = performance.now()
    const executionTime = end - start
    lastExecutionTime = executionTime
    result[index] = resultElement
  }
  const totalEnd = performance.now()
  return result
}

/**
 * @name range
 *
 * @synopsis
 * ```coffeescript [specscript]
 * range(lower number, upper number) -> numbers Array<number>
 * ```
 */
const range = function (lower, upper) {
  const result = []
  let start = lower
  while (start <= upper) {
    result.push(start)
    start += 1
  }
  return result
}

/*
const start = performance.now()
arrayMapRate(
  range(0, 10),
  2,
  async n => {
    const duration = Math.random() * 1000
    console.log('duration', duration)
    // const duration = 500
    await sleep(duration)
    return n ** 2
  }
  async n => {
    console.log('n', n)
    return n ** 2
  },
).then(result => {
  const end = performance.now()
  console.log('average period:', (end - start) / result.length)
  console.log(result)
})
*/

module.exports = arrayMapRate
