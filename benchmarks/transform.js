const timeInLoop = require('../x/timeInLoop')
const rubico = require('rubico')
const R = require('ramda')
const _ = require('lodash')
const _fp = require('lodash/fp')
const { Readable, Writable } = require('stream')

const isPromise = value => value != null && typeof value.then == 'function'

const {
  pipe, fork, assign,
  tap, tryCatch, switchCase,
  map, filter, reduce, transform, flatMap,
  any, all, and, or, not,
  eq, gt, lt, gte, lte,
  get, pick, omit,
} = rubico

const square = number => number ** 2

const isOdd = number => number % 2 == 1

const squaredOdds = pipe([
  filter(isOdd),
  map(square),
])

const squaredOddsArrayConcat = transform(
  squaredOdds, [],
)

/**
 * @name squaredOddsArrayConcat
 *
 * @benchmark
 * squaredOddsArrayConcat: 1e+5: 85.147ms
 *
 * @note Bo5
 */

{
  const numbers = [1, 2, 3, 4, 5]

  const arrayEmpty = () => []

  const squaredOddsArrayConcat = transform(squaredOdds, arrayEmpty)

  // timeInLoop('squaredOddsArrayConcat', 1e5, () => squaredOddsArrayConcat(numbers))
}

/**
 * @name squaredOddsStringAdd
 *
 * @benchmark
 * squaredOddsStringAdd: 1e+5: 176.517ms
 *
 * @note Bo5
 */

{
  const numbers = [1, 2, 3, 4, 5]

  const squaredOddsStringAdd = transform(squaredOdds, '')

  // console.log(squaredOddsStringAdd(numbers))

  // timeInLoop('squaredOddsStringAdd', 1e5, () => squaredOddsStringAdd(numbers))
}

/**
 * @name squaredOddsSetAdd
 *
 * @benchmark
 * squaredOddsSetAdd: 1e+5: 93.28ms
 *
 * @note Bo5
 */

{
  const numbers = [1, 2, 3, 4, 5]

  const setEmpty = () => new Set()

  const squaredOddsSetAdd = transform(squaredOdds, setEmpty)

  // console.log(squaredOddsSetAdd(numbers))

  // timeInLoop('squaredOddsSetAdd', 1e5, () => squaredOddsSetAdd(numbers))
}

/**
 * @name squaredOddsUint8ArrayConcat
 *
 * @benchmark
 * squaredOddsUint8ArrayConcat: 1e+5: 237.538ms
 *
 * @note Bo5
 */

{
  const numbers = [1, 2, 3, 4, 5]

  const setEmpty = () => new Set()

  const uint8ArrayEmpty = () => new Uint8Array(0)

  const squaredOddsUint8ArrayConcat = transform(squaredOdds, uint8ArrayEmpty)

  // console.log(squaredOddsUint8ArrayConcat(numbers))

  // timeInLoop('squaredOddsUint8ArrayConcat', 1e5, () => squaredOddsUint8ArrayConcat(numbers))
}

const MockWritable = function (values) {
  Writable.call(this)
  this.array = [...values]
  this.handlers = new Map()
}

MockWritable.prototype.write = function (chunk, encoding, callback) {
  this.array.push(chunk)
}

MockWritable.prototype.on = function (eventName, handler) {
  if (this.handlers.has(eventName)) {
    this.handlers.get(eventName).push(handler)
  } else {
    this.handlers.set(eventName, [handler])
  }
}

MockWritable.prototype.once = function (eventName, handler) {
  this.handlers.set(eventName, [handler])
}

MockWritable.prototype.emit = function (eventName, ...args) {
  if (!this.handlers.has(eventName)) {
    return undefined
  }
  return this.handlers.get(eventName).map(handler => handler(...args))
}

/**
 * @name squaredOddsStreamConcat
 *
 * @benchmark
 *
 * @note Bo5
 * squaredOddsStreamConcat: 1e+5: 90.274ms
 */

{
  const numbers = [1, 2, 3, 4, 5]

  const setEmpty = () => new Set()

  const uint8ArrayEmpty = () => new Uint8Array(0)

  const square = number => number ** 2

  const squaredOddsStreamConcat = transform(squaredOdds, new MockWritable([]))

  // console.log(squaredOddsStreamConcat(numbers))

  // timeInLoop('squaredOddsStreamConcat', 1e5, () => squaredOddsStreamConcat(numbers))
}

/**
 * @name squaredOddsObjectAssign
 *
 * @benchmark
 * squaredOddsObjectAssign: 1e+5: 96.854ms
 *
 * @note Bo5
 */

{
  const numbers = [1, 2, 3, 4, 5]

  const setEmpty = () => new Set()

  const uint8ArrayEmpty = () => new Uint8Array(0)

  const square = number => number ** 2

  const objectEmpty = () => ({})

  const squaredOddsObjectAssign = transform(squaredOdds, objectEmpty)

  // console.log(squaredOddsObjectAssign(numbers))

  // timeInLoop('squaredOddsObjectAssign', 1e5, () => squaredOddsObjectAssign(numbers))
}

/**
 * @name squaredOddsNullTransform
 *
 * @benchmark
 * squaredOddsNullTransform: 1e+5: 78.409ms
 *
 * @note Bo5
 */

{
  const numbers = [1, 2, 3, 4, 5]

  const setEmpty = () => new Set()

  const uint8ArrayEmpty = () => new Uint8Array(0)

  const square = number => number ** 2

  const squaredOddsNullTransform = transform(squaredOdds, null)

  // console.log(squaredOddsNullTransform(numbers))

  // timeInLoop('squaredOddsNullTransform', 1e5, () => squaredOddsNullTransform(numbers))
}
