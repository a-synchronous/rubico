const pipe = require('../pipe')
const tap = require('../tap')

/**
 * @name tracef
 *
 * @DEPRECATED
 */
const tracef = f => tap(pipe([f, console.log]))

module.exports = tracef
