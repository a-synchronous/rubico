const { flatMap } = require('..')

/*
 * @synopsis
 * flatten(Array<any|Iterable<any>>|Set<any|Iterable<any>>)
 *   -> Array<any>|Set<any>
 */
const flatten = flatMap(x => x)

module.exports = flatten
