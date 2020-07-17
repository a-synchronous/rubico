const { pipe, tap, map, or, all, eq, get, transform, switchCase } = require('..')
const is = require('./is')

const identity = x => x

const isTraversable = (a, b) => or([
  ([a, b]) => is(Object)(a) && is(Object)(b),
  ([a, b]) => is(Array)(a) && is(Array)(b),
  ([a, b]) => is(Set)(a) && is(Set)(b),
  ([a, b]) => is(Map)(a) && is(Map)(b),
])([a, b])

const entries = x => {
  if (is(Object)(x)) return (function*(obj) {
    for (const k in obj) yield [k, x[k]]
  })(x)
  return x.entries()
}

const findValueByKey = (key, collection) => switchCase([
  is(Set), col => col.has(key) ? key : null,
  is(Map), col => col.get(key),
  col => get(key)(col),
])(collection)

const isDeepEqual = (collection, x) => isTraversable(collection, x) ? pipe([
  transform(
    map(([k, v]) => isDeepEqual(findValueByKey(k, collection), v)),
    () => [],
  ),
  all(eq(true, identity)),
])(entries(x)) && pipe([
  transform(
    map(([k, v]) => isDeepEqual(findValueByKey(k, x), v)),
    () => [],
  ),
  all(eq(true, identity)),
])(entries(collection)) : collection === x

module.exports = isDeepEqual
