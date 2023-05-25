const rubico = require('..')
const timeInLoop = require('../x/timeInLoop')

const {
  pipe, fork, assign,
  tap, tryCatch, switchCase,
  map, filter, reduce, transform, flatMap,
  any, all, and, or, not,
  eq, gt, lt, gte, lte,
  get, pick, omit,
} = rubico

/**
 * @name arrayExtend
 *
 * @synopsis
 * arrayExtend(array Array, values Array) -> array
 */
const arrayExtend = (array, values) => {
  const arrayLength = array.length,
    valuesLength = values.length
  let valuesIndex = -1
  while (++valuesIndex < valuesLength) {
    array[arrayLength + valuesIndex] = values[valuesIndex]
  }
  return array
}

const arrayPush = function (array, value) {
  array.push(value)
  return array
}

const square = number => number ** 2

const isOdd = number => number % 2 == 1

const squaredOddsConcatReducerVanilla = function (array, number) {
  if (isOdd(number)) {
    arrayPush(array, square(number))
  }
  return array
}

const squaredOddsConcatReducerTransduced = pipe([
  filter(isOdd),
  map(square),
])(arrayPush)

const add = (a, b) => a + b

const squaredOddsAddReducerVanilla = function (total, number) {
  if (isOdd(number)) {
    return add(total, square(number))
  }
  return total
}

const squaredOddsAddReducerTransduced = pipe([
  filter(isOdd),
  map(square),
])(add)

/**
 * @name squaredOddsTransducer
 *
 * @benchmark
 * squaredOddsConcatReducerVanilla: 1e+6: 71.788ms
 * squaredOddsConcatReducerTransduced: 1e+6: 87.329ms
 * squaredOddsAddReducerVanilla: 1e+6: 24.665ms
 * squaredOddsAddReducerTransduced: 1e+6: 38.881ms
 */

{
  const numbers = [1, 2, 3, 4, 5]
  // console.log(numbers.reduce(squaredOddsConcatReducerVanilla, []))
  // console.log(numbers.reduce(squaredOddsConcatReducerTransduced, []))
  // console.log(numbers.reduce(squaredOddsAddReducerVanilla, 0))
  // console.log(numbers.reduce(squaredOddsAddReducerTransduced, 0))

  // timeInLoop('squaredOddsConcatReducerVanilla', 1e6, () => numbers.reduce(squaredOddsConcatReducerVanilla, []))

  // timeInLoop('squaredOddsConcatReducerTransduced', 1e6, () => numbers.reduce(squaredOddsConcatReducerTransduced, []))

  // timeInLoop('squaredOddsAddReducerVanilla', 1e6, () => numbers.reduce(squaredOddsAddReducerVanilla, 0))

  // timeInLoop('squaredOddsAddReducerTransduced', 1e6, () => numbers.reduce(squaredOddsAddReducerTransduced, 0))
}
