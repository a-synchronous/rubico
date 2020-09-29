const globalThisHasBuffer = require('./globalThisHasBuffer')
const noop = require('./noop')

/**
 * @name bufferAlloc
 *
 * @synopsis
 * Dereferenced `Buffer.alloc` or noop
 */
const bufferAlloc = globalThisHasBuffer ? Buffer.alloc : noop

module.exports = bufferAlloc
