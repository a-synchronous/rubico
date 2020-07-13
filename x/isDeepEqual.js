const { pipe, tap, map, or, all, eq, get, transform, switchCase } = require('..')
const is = require('./is')

const identity = x => x

const isDefined = x => x !== undefined && x !== null

const isIterable = x => isDefined(x) && isDefined(x[Symbol.iterator])

const isTraversable = (a, b) => or([
  ([a, b]) => is(Object)(a) && is(Object)(b),
  ([a, b]) => is(Array)(a) && is(Array)(b),
  ([a, b]) => is(Set)(a) && is(Set)(b),
  ([a, b]) => is(Map)(a) && is(Map)(b),
])([a, b])

const entries = x => {
  if (isDefined(x) && typeof x.entries === 'function') return x.entries()
  if (is(Object)(x)) return (function*(obj) {
    for (const k in obj) yield [k, x[k]]
  })(x)
  throw new Error('cannot get entries')
}

const findByKey = (key, collection) => switchCase([
  or([
    is(Array),
    is(Object),
  ]), col => get(key)(col),
  is(Set), col => col.has(key) ? key : null,
  is(Map), col => col.get(key),
  () => {
    throw new Error('cannot find by key')
  },
])(collection)

const concat = (a, b) => a.concat(b)

const isDeepEqual = (collection, x) => isTraversable(collection, x) ? pipe([
  transform(
    map(([k, v]) => isDeepEqual(findByKey(k, collection), v)),
    () => [],
  ),
  all(eq(true, identity)),
])(entries(x)) && pipe([
  transform(
    map(([k, v]) => isDeepEqual(findByKey(k, x), v)),
    () => [],
  ),
  all(eq(true, identity)),
])(entries(collection)) : collection === x

module.exports = isDeepEqual
