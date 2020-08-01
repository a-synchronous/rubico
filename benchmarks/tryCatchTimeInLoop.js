const { tryCatch } = require('..')
const { timeInLoop } = require('../x')

const noop = () => {}

timeInLoop('noop', 1e5, () => {
  noop()
})

const throwError = err => { throw err }

// Bo5: 771.797ms
timeInLoop('tryCatch_vanilla', 1e5, () => {
  try {
    throwError(new Error('hey'))
  } catch (err) {
    noop()
  }
})

const runner = tryCatch(throwError, noop)

// Bo5: 764.897ms
timeInLoop('tryCatch_rubicoHappyPath', 1e5, () => {
  runner(new Error('hey'))
})

// Bo5: 783.742ms
timeInLoop('tryCatch_rubicoIncludingInit', 1e5, () => {
  tryCatch(throwError, noop)(new Error('hey'))
})
