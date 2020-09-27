/**
 * @name promiseRace
 *
 * @synopsis
 * promiseRace(Iterable<Promise|any>) -> firstResolvedOrRejected Promise
 *
 * @description
 * Dereferenced Promise.race
 */
const promiseRace = Promise.race.bind(Promise)

module.exports = promiseRace
