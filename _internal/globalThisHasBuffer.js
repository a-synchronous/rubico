/**
 * @name globalThisHasBuffer
 *
 * @synopsis
 * globalThisHasBuffer boolean
 *
 * @description
 * Is there a global `Buffer`
 */
const globalThisHasBuffer = typeof Buffer == 'function'

module.exports = globalThisHasBuffer
