const timeInLoop = require('../x/timeInLoop')
const rubico = require('..')

const { or } = rubico

const isPromise = value => value != null && typeof value.then == 'function'

const isOdd = x => x % 2 == 1

const threeOddChecks = number => isOdd(number) || isOdd(number) || isOdd(number)

const threeIsOdd = or([isOdd, isOdd, isOdd])

const arrayOr = (fns, x) => {
  const promises = []
  for (let i = 0; i < fns.length; i++) {
    const point = fns[i](x)
    if (isPromise(point)) promises.push(point)
    else if (point) return (promises.length > 0
      ? Promise.all(promises).then(() => true)
      : true)
  }
  return (promises.length > 0
    ? Promise.all(promises).then(res => res.some(x => x))
    : false)
}

const isOddArray = [isOdd, isOdd, isOdd]

/**
 * @name or
 *
 * @benchmark
 * isOdd(value) || isOdd(value) || isOdd(value): 1e+6: 5.96ms
 * arrayOr([isOdd, isOdd, isOdd]): 1e+6: 27.249ms
 * or([isOdd, isOdd, isOdd]): 1e+6: 15.245ms
 *
 * @remarks
 * ...args slows down from ~48ms
 */

{
  // console.log(arrayOr(isOddArray, 2))
  // console.log(or([isOdd, isOdd, isOdd])(2))

  // timeInLoop('isOdd(value) || isOdd(value) || isOdd(value)', 1e6, () => threeOddChecks(2))

  // timeInLoop('arrayOr([isOdd, isOdd, isOdd])', 1e6, () => arrayOr(isOddArray, 2))

  // timeInLoop('or([isOdd, isOdd, isOdd])', 1e6, () => threeIsOdd(2))
}
