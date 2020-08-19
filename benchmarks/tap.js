const timeInLoop = require('../x/timeInLoop')
const _ = require('lodash/fp')
const { tap } = require('..')
const R = require('ramda')

/**
 * @name pipe
 *
 * @benchmark
 * tapNoopThunk: 1e+6: 4.242ms
 * tapRegularCallNoopThunk: 1e+6: 4.969ms
 * _tapNoopThunk: 1e+6: 155.716ms
 * RTapNoopThunk: 1e+6: 291.025ms
 */

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

console.log(func())

timeInLoop(func.name, 1e6, func)
