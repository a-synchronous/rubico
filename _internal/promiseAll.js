/**
 * @name promiseAll
 *
 * @synopsis
 * promiseAll(Iterable<Promise|any>) -> Promise<Array>
 *
 * @description
 * Dereferenced Promise.all
 */
const promiseAll = Promise.all.bind(Promise)

module.exports = promiseAll
