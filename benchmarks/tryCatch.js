const { tryCatch } = require('..')
const { timeInLoop } = require('../x')

const noop = () => {}

timeInLoop('noop', 1e5, () => {
  noop()
})

const throwError = err => { throw err }

// 1e+5: 771.797ms
timeInLoop('tryCatch_caught_vanilla', 1e5, () => {
  try {
    throwError(new Error('hey'))
  } catch (err) {
    noop()
  }
})

const tryCatchThrow = tryCatch(throwError, noop)

// 1e+5: 764.897ms
timeInLoop('tryCatch_caught_rubicoHappyPath', 1e5, () => {
  tryCatchThrow(new Error('hey'))
})

// 1e+5: 783.742ms
timeInLoop('tryCatch_caught_rubicoFullInit', 1e5, () => {
  tryCatch(throwError, noop)(new Error('hey'))
})

const identity = x => x

// 1e+6: 9.086ms
timeInLoop('identity', 1e6, () => {
  identity(1)
})

// 1e+6: 9.388ms
timeInLoop('tryCatch_identity_vanilla', 1e6, () => {
  try {
    identity(1)
  } catch (err) {
    // unreachable
  }
})

const tryCatchIdentity = tryCatch(identity, noop)

// 1e+6: 12.05ms
timeInLoop('tryCatch_identity_rubicoHappyPath', 1e6, () => {
  tryCatchIdentity(1)
})

// 1e+6: 54.061ms
timeInLoop('tryCatch_identity_rubicoFullInit', 1e6, () => {
  tryCatch(identity, noop)(1)
})
