const { pipe, tap } = require('..')

const tracef = f => tap(pipe([f, console.log]))

module.exports = tracef
