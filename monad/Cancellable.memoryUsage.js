const heapUsedInLoop = require('../x/heapUsedInLoop')
const BrokenPromise = require('./BrokenPromise')
const Cancellable = require('./Cancellable')
const { reduce } = require('..')

const sleep = millis => new Promise(resolve => { setTimeout(resolve, millis) })

/**
 * @name Cancellable
 *
 * @memoryUsage
 * new BrokenPromise(): 5e+5: { "max": "86.89 MiB", "avg": "46.11 MiB" }
 * Cancellable(() => new BrokenPromise())().cancel(Error): 5e+5: { "max": "20.18 MiB", "avg": "11.64 MiB" }
 * Cancellable(() => new BrokenPromise())().cancel(Error).catch: 5e+5: { "max": "19.93 MiB", "avg": "11.90 MiB" }
 * Cancellable(reduce(add, 0)).cancel(Error): 5e+5: { "max": "12.11 MiB", "avg": "6.55 MiB" }
 */

heapUsedInLoop.async.skip('new BrokenPromise()', 5e5, async function () {
  const brokenPromise = new BrokenPromise()
})

heapUsedInLoop.async.skip('Cancellable(() => new BrokenPromise())().cancel(Error)', 5e5, async function () {
  const cancellablePromise = Cancellable(() => new BrokenPromise())()
  cancellablePromise.cancel(new Error('cancelled'))
  try {
    await cancellablePromise
  } catch (err) {
    clearTimeout(cancellablePromise.value.timeout)
  }
})

heapUsedInLoop.async.skip('Cancellable(() => new BrokenPromise())().cancel(Error).catch', 5e5, async function () {
  const cancellablePromise = Cancellable(() => new BrokenPromise())()
  await cancellablePromise.cancel(new Error('cancelled')).catch(
    () => clearTimeout(cancellablePromise.value.timeout))
})

const indexTimeoutMap = new Map()

const infiniteAsyncGenerator = async function* (loop) {
  yield 1; yield 2
  await new Promise(function (resolve) {
    const timeout = setTimeout(resolve, 1e9)
    indexTimeoutMap.set(loop, timeout)
  })
  yield 3
}

heapUsedInLoop.async.skip('Cancellable(reduce(add, 0)).cancel(Error)', 5e5, async function (loop) {
  const p = Cancellable(reduce((a, b) => a + b, 0))(infiniteAsyncGenerator(loop))
  await sleep(1) // wait for async generator
  p.cancel(new Error('cancelled'))
  try {
    await p
  } catch (err) {
    if (err.message !== 'cancelled') throw err
    clearTimeout(indexTimeoutMap.get(loop))
    indexTimeoutMap.delete(loop)
  }
})
