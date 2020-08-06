const PossiblePromise = require('./possible-promise')
const timeInLoop = require('../x/timeInLoop')

const identity = x => x

// 4.25ms
timeInLoop('call_nonPromise', 1e6, () => {
  identity(5)
})

// 12.191ms
timeInLoop('nonPromise_PossiblePromise.then', 1e6, () => {
  PossiblePromise.then(5, identity)
})

// 12.483ms
timeInLoop('nonPromise_PossiblePromise.prototype.then', 1e6, () => {
  new PossiblePromise(5).then(identity)
})

const createPromise = () => Promise.resolve(5)

const singletonPromise = Promise.resolve(5)

// 306.77ms
timeInLoop('singletonPromise.then', 1e6, () => {
  singletonPromise.then(identity)
})

// 234.458ms
timeInLoop('singletonPromise_PossiblePromise.then', 1e6, () => {
  PossiblePromise.then(singletonPromise, identity)
})

// 496.38ms
timeInLoop('singletonPromise_PossiblePromise.prototype.then', 1e6, () => {
  new PossiblePromise(singletonPromise).then(identity)
})

// 428.502ms
timeInLoop('newPromise.then', 1e6, () => {
  createPromise().then(identity)
})

// 388.951ms
timeInLoop('newPromise_PossiblePromise.then', 1e6, () => {
  PossiblePromise.then(createPromise(), identity)
})

// 363.467ms
timeInLoop('newPromise_PossiblePromise.prototype.then', 1e6, () => {
  new PossiblePromise(createPromise()).then(identity)
})

/*
 * @remarks
 * PossiblePromise.prototype.then beats PossiblePromise.then when acting on distinct (new) Promises. However, the opposite is true for operations on a singleton Promise
 */
