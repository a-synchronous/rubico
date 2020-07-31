const { tryCatch } = require('..')
const { timeInLoop } = require('../x')

const noop = () => {}

timeInLoop('noop', 1e5, () => {
  noop()
})

const throwError = err => { throw err }

timeInLoop('tryCatch_vanilla', 1e5, () => {
  try {
    throwError(new Error('hey'))
  } catch (err) {
    noop()
  }
})

const runner = tryCatch(throwError, noop)

timeInLoop('tryCatch_rubicoHappyPath', 1e5, () => {
  runner(new Error('hey'))
})

timeInLoop('tryCatch_rubicoIncludingInit', 1e5, () => {
  tryCatch(throwError, noop)(new Error('hey'))
})
