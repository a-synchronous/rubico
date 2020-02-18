# rubico
🏞 a shallow river in northeastern Italy, just south of Ravenna

functional composition that builds in promises by default

# Usage
```javascript
const _ = require('rubico')

_.promisify(callbackTakingFn) // => promiseReturningFn

_.callbackify(promiseReturningFn) // => callbackTakingFn

_.promisifyAll({ a: callbackTakingFn }) // => { a: promiseReturningFn }

_.callbackifyAll({ a: promiseReturningFn }) // => { a: callbackTakingFn }

_.map(x => x + 1)([1, 2, 3]) // => Promise([2, 3, 4])
_.map(x => x + 1)(new Set([1, 2, 3])) // => Promise(new Set(2, 3, 4))
_.map(x => x + 1)({ a: 1, b: 2, c: 3 }) // => Promise({ a: 2, b: 3, c: 4 })
_.map(x => x + 1)(new Map([['a', 1], ['b', 2], ['c', 3]]))
// => Promise(new Map([['a', 2], ['b', 3], ['c', 3]])))

_.syncMap(x => x + 1)([1, 2, 3]) // => [2, 3, 4]
_.syncMap(x => x + 1)(new Set([1, 2, 3])) // => new Set(2, 3, 4)
_.syncMap(x => x + 1)({ a: 1, b: 2, c: 3 }) // => ({ a: 2, b: 3, c: 4 })
_.syncMap(x => x + 1)(new Map([['a', 1], ['b', 2], ['c', 3]]))
// => new Map([['a', 2], ['b', 3], ['c', 3]]))

_.reduce((a, b) => a + b)()([1, 2, 3]) // => Promise(6)
_.reduce((a, b) => a + b)(10)([1, 2, 3]) // => Promise(16)

_.syncReduce((a, b) => a + b)()([1, 2, 3]) // => 6
_.syncReduce((a, b) => a + b)(10)([1, 2, 3]) // => 16

_.flow(
  x => x + 1,
  x => x + 2,
  x => x + 3,
)(1) // => Promise(7)

_.syncFlow(
  x => x + 1,
  x => x + 2,
  x => x + 3,
)(1) // => 7

_.amp(
  x => x + 1,
  () => null,
  x => x + 2,
  x => x + 3,
)(1) // => Promise(null)

_.alt(
  () => null,
  x => x + 1,
  x => x + 2,
  () => null,
  x => x + 3,
)(1) // => Promise(2)

_.parallel(
  x => x + 1,
  x => x + 2,
  x => x + 3,
)(1) // => Promise([2, 3, 4])

_.sideEffect(console.log)('hey') // > hey, => Promise('hey')

_.sideEffect(() => { throw new Error() }, x => e => console.log(x, e))('hey')
// > hey Error

_.flow(
  x => x + 1,
  trace('x'),
  x => x + 2,
  x => x + 3,
)(1) // > x 2, => Promise(7)

_.benchmark(
  x => new Promise(res => setTimeout(() => res(x + 'hey'), 10))
)('benchmark for hey')('hey') // > benchmark for hey 10ms, => 'heyhey'
```
