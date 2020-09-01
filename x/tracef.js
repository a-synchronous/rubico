const { pipe, tap } = require('..')

/**
 * @name tracef
 *
 * @DEPRECATED
 */
const tracef = f => tap(pipe([f, console.log]))

module.exports = tracef
