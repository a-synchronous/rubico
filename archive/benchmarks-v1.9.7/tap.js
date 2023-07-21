const timeInLoop = require('../x/timeInLoop')
const _ = require('lodash/fp')
const { tap } = require('..')
const R = require('ramda')

const isPromise = value => value != null && typeof value.then == 'function'

/**
 * @name tap
 *
 * @benchmark
 * tapNoopThunk: 1e+6: 4.242ms
 * tapRegularCallNoopThunk: 1e+6: 4.969ms
 * _tapNoopThunk: 1e+6: 155.716ms
 * RTapNoopThunk: 1e+6: 291.025ms
 */

{
  const noop = () => {}

  const tapNoop = tap(noop)

  const tapNoopThunk = () => tapNoop('yo')

  tap.regularCall = func => function tapping(input) {
    const call = func(input)
    return isPromise(call) ? call.then(() => input) : input
  }

  const tapRegularCallNoop = tap.regularCall(noop)

  const tapRegularCallNoopThunk = () => tapRegularCallNoop('yo')

  const _tapNoop = _.tap(noop)

  const _tapNoopThunk = () => _tapNoop('yo')

  const RTapNoop = R.tap(noop)

  const RTapNoopThunk = () => RTapNoop('yo')

  // const func = tapNoopThunk
  // const func = tapRegularCallNoopThunk
  // const func = tapNoopThunk
  // const func = _tapNoopThunk
  // const func = RTapNoopThunk

  // console.log(func())

  // timeInLoop(func.name, 1e6, func)
}

const tap0 = func => function tapping(...args) {
  const point = args[0],
    call = func(...args)
  return isPromise(call) ? call.then(() => point) : point
}

const always = value => function getter() { return value }

const tap1 = func => function tapping(...args) {
  const point = args[0],
    call = func(...args)
  return isPromise(call) ? call.then(always(point)) : point
}

/**
 * @name tap
 *
 * @benchmark
 * tap0: 1e+7: 141.116ms
 * tap1: 1e+7: 141.007ms
 */

{
  const array = []

  const noop = function () {}

  // timeInLoop('tap0', 1e7, () => tap0(noop)(0))

  // timeInLoop('tap1', 1e7, () => tap1(noop)(0))
}

/**
 * @name tap.if
 *
 * @benchmark
 * TODO
 */
