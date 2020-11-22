const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')
const mapSet = require('./mapSet')
const curryArity = require('./curryArity')
const spread2 = require('./spread2')
const always = require('./always')

// (mapper function, result Map, promises Array<Promise>) => (key any, value any) => ()
const mapMapEntriesForEachCallback = (
  mapper, result, promises,
) => function callback(value, key) {
  const mapping = mapper([key, value])
  if (isPromise(mapping)) {
    promises.push(mapping.then(spread2(curryArity(3, mapSet, [result]))))
  } else {
    result.set(mapping[0], mapping[1])
  }
}

/**
 * @name mapMapEntries
 *
 * @synopsis
 * ```coffeescript [specscript]
 * mapMapEntries(
 *   source Map,
 *   mapper ([key string, source any])=>Promise|[string, any],
 * ) -> Promise|Map
 * ```
 */
const mapMapEntries = function (source, mapper) {
  const result = new Map(),
    promises = []
  source.forEach(mapMapEntriesForEachCallback(mapper, result, promises))
  return promises.length == 0
    ? result
    : promiseAll(promises).then(always(result))
}

module.exports = mapMapEntries
