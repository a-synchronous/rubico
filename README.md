# rubico
🏞 a shallow river in northeastern Italy, just south of Ravenna

a functional promise library

[Installation](https://github.com/richytong/rubico#installation)

[Examples](https://github.com/richytong/rubico#examples)

[Documentation](https://github.com/richytong/rubico#documentation)

[More Examples](https://github.com/richytong/rubico#more-examples)

# Introduction
Asynchronous programming in JavaScript has evolved over the years

> In the beginning, there were [callbacks](http://callbackhell.com)
```javascript
function doAsyncThings(a, cb) {
  doAsyncThingA(a, function(errA, b) {
    if (errA) return cb(errA)
    doAsyncThingB(b, function(errB, c) {
      if (errB) return cb(errB)
      doAsyncThingC(c, function(errC, d) {
        if (errC) return cb(errC)
        doAsyncThingD(d, function(errD, e) {
          if (errD) return cb(errD)
          doAsyncThingE(e, function(errE, f) {
            if (errE) return cb(errE)
            cb(null, f)
          })
        })
      })
    })
  })
}
```

To stay within maximum line lengths, we created
[Promises](https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Promise)

> Then began the chains of `then`
```javascript
const doAsyncThings = a => doAsyncThingA(a)
  .then(b => doAsyncThingB(b))
  .then(c => doAsyncThingC(c))
  .then(d => doAsyncThingD(d))
  .then(e => doAsyncThingE(e))
```

This was fine until we started to miss variables

> [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), the latest in asynchrony
```javascript
const doAsyncThings = async a => {
  const b = await doAsyncThingA(a)
  const c = await doAsyncThingB(b)
  const d = await doAsyncThingC(c)
  const e = await doAsyncThingD(d)
  const f = await doAsyncThingE(e)
  return f
}
```

Some of us, however, did not miss variables

> maybe promises were on to something
```javascript
import { pipe } from 'rubico'

const doAsyncThings = pipe([
  doAsyncThingA,
  doAsyncThingB,
  doAsyncThingC,
  doAsyncThingD,
  doAsyncThingE,
])
```

Enter rubico, a functional (programming) promise library.

rubico resolves two promises:
1. simplify asynchronous programming in JavaScript
2. enable functional programming in JavaScript

programs written with rubico follow a [point-free style](https://en.wikipedia.org/wiki/Tacit_programming)

rubico works in server and browser JavaScript environments

# Installation
with deno;
```javascript
import {
  pipe, fork, assign, tap, tryCatch, switchCase,
  map, filter, reduce, transform,
  any, all, and, or, not,
  eq, gt, lt, gte, lte,
  get, pick, omit,
} from 'https://deno.land/x/rubico/mod.js'
```
with npm; `npm i rubico`

# Examples
The following examples compare algorithmically equivalent code between promise chains, async/await, and rubico

### Make a request
```javascript
// promise chains
fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(res => res.json())
  .then(console.log) // > {...}

// async/await
void (async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/1')
  const data = await res.json()
  console.log(data) // > {...}
})()

// rubico
import { pipe } from 'rubico'

pipe([
  fetch,
  res => res.json(),
  console.log, // > {...}
])('https://jsonplaceholder.typicode.com/todos/1')
```

### Make multiple requests
```javascript
const todoIDs = [1, 2, 3, 4, 5]

// promise chains
Promise.resolve(todoIDs.filter(id => id <= 3))
  .then(filtered => Promise.all(filtered.map(
    id => `https://jsonplaceholder.typicode.com/todos/${id}`
  )))
  .then(urls => Promise.all(urls.map(fetch)))
  .then(responses => Promise.all(responses.map(res => res.json())))
  .then(data => data.map(x => console.log(x))) // > {...} {...} {...}

// async/await
void (async () => {
  const filtered = todoIDs.filter(id => id <= 3)
  const urls = await Promise.all(filtered.map(id => `https://jsonplaceholder.typicode.com/todos/${id}`))
  const responses = await Promise.all(urls.map(fetch))
  const data = await Promise.all(responses.map(res => res.json()))
  data.map(x => console.log(x)) // > {...} {...} {...}
})()

// rubico
import { pipe, map, filter } from 'rubico'

pipe([
  filter(id => id <= 3),
  map(id => `https://jsonplaceholder.typicode.com/todos/${id}`),
  map(fetch),
  map(res => res.json()),
  map(console.log), // > {...} {...} {...}
])(todoIDs)
```

# Documentation
rubico exports 23 functions

[pipe](https://github.com/richytong/rubico#pipe),
[fork](https://github.com/richytong/rubico#fork),
[assign](https://github.com/richytong/rubico#assign)
[tap](https://github.com/richytong/rubico#tap),
[tryCatch](https://github.com/richytong/rubico#tryCatch),
[switchCase](https://github.com/richytong/rubico#switchCase)

[map](https://github.com/richytong/rubico#map),
[filter](https://github.com/richytong/rubico#filter),
[reduce](https://github.com/richytong/rubico#reduce),
[transform](https://github.com/richytong/rubico#transform)

[any](https://github.com/richytong/rubico#any),
[all](https://github.com/richytong/rubico#all)
[and](https://github.com/richytong/rubico#and),
[or](https://github.com/richytong/rubico#or),
[not](https://github.com/richytong/rubico#not)

[eq](https://github.com/richytong/rubico#eq),
[gt](https://github.com/richytong/rubico#gt),
[lt](https://github.com/richytong/rubico#lt),
[gte](https://github.com/richytong/rubico#gte),
[lte](https://github.com/richytong/rubico#lte)

[get](https://github.com/richytong/rubico#get),
[pick](https://github.com/richytong/rubico#pick),
[omit](https://github.com/richytong/rubico#omit)

## pipe
chains sync or async functions from left to right
```javascript
y = pipe(functions)(x)
```
`functions` is an array of functions

`x` is anything

if `x` is a function, pipe chains `functions` from right to left,
see [transducers](https://github.com/richytong/rubico#transducers)

`y` is the output of running `x` through the chain of `functions`

if all functions of `functions` are synchronous, `y` is not a Promise

if any functions of `functions` are asynchronous, `y` is a Promise
```javascript
pipe([
  x => x + 'y',
  x => x + 'e',
  x => x + 'lmao',
])('a') // => 'ayelmao'

pipe([
  x => x + 'y',
  x => Promise.resolve(x + 'e'),
  async x => x + 'lmao',
])('a') // => Promise { 'ayelmao' }
```

## fork
parallelizes sync or async functions
```javascript
y = fork(functions)(x)
```
`functions` is either an array of functions or an object of functions

all functions of `functions` are run concurrently

`x` is anything

`y` assumes the shape of `functions`

`y` is the output of mapping `x` to each function of `functions`

if all functions of `functions` are synchronous, `y` is not a Promise

if any functions of `functions` are asynchronous, `y` is a Promise
```javascript
fork([
  x => 'o' + x + 'o',
  x => 'u' + x + 'u',
  x => 'x' + x + 'x',
])('w') // => ['owo', 'uwu', 'xwx']

fork([
  x => 'o' + x + 'o',
  x => Promise.resolve('u' + x + 'u'),
  async x => 'x' + x + 'x',
])('w') // => Promise { ['owo', 'uwu', 'xwx'] }

fork({
  a: x => x + 1,
  b: x => x + 2,
  c: x => x + 3,
})(0) // => { a: 1, b: 2, c: 3 }

fork({
  a: x => x + 1,
  b: x => Promise.resolve(x + 2),
  c: async x => x + 3,
})(0) // => Promise { { a: 1, b: 2, c: 3 } }
```

## assign
parallelizes sync or async functions, then merges result with input
```javascript
y = assign(functions)(x)
```
`functions` is an object of functions

all functions of `functions` are run concurrently

`x` is an object of anything

`y` is an object of anything

`y` is the output of mapping `x` to each function of `functions`, then merging `x` with that result

if all functions of `functions` are synchronous, `y` is not a Promise

if any functions of `functions` are asynchronous, `y` is a Promise

```javascript
assign({
  hello: x => 'hello ' + x.name,
  goodbye: x => 'goodbye ' + x.name,
})({ name: 'George' }) // => { hello: 'hello George', goodbye: 'goodbye George' }

assign({
  hello: x => 'hello ' + x.name,
  goodbye: async x => 'goodbye ' + x.name,
})({ name: 'George' }) // => Promise { { hello: 'hello George', goodbye: 'goodbye George' } }

assign({
  name: () => 'not George',
})({ name: 'George' }) // => { name: 'not George' }
```

## tap
calls a sync or async function `f` with input `x`, returning `x`
```javascript
y = tap(f)(x)
```
`x` is anything

`f` is a function that expects one argument `x`

if `f` is synchronous, `y` is `x`

if `f` is asynchronous, `y` is a Promise that resolves to `x`

if `x` is a function, tap calls `f` for each element `zi` of `z`, yielding `zi`
```javascript
y = reduce(tap(f)(x))(z)
```
`reduce` is [reduce](https://github.com/richytong/rubico#reduce),

`z` is an iterable, asyncIterable, or object

`zi` is an element of `z`

`f` is a function that expects one argument `zi`

`y` is equivalent in value to `reduce(x)(z)`
```javascript
tap(
  console.log, // > 'hey'
)('hey') // => 'hey'

tap(
  async x => console.log(x), // > 'hey'
)('hey') // => Promise { 'hey' }

reduce(
  tap(
    console.log, // > 1 2 3 4 5
  )((y, xi) => y + xi),
  0,
)([1, 2, 3, 4, 5]) // => 15
```

## tryCatch
tries a sync or async function `f` with input `x`, catches with another sync or async function `g`
```javascript
y = tryCatch(f, g)(x)
```
`f` is a function that expects one argument `x`

`g` is a function that expects two arguments `err` and `x`

`err` is a value potentially thrown by `f(x)`

`x` is anything

if `f(x)` did not throw, `y` is `f(x)`

if `f(x)` threw, `y` is `g(err, x)`

if `f` and `g` are synchronous, `y` is not a Promise

if `f` is asynchronous, `y` is a Promise

if `f` is synchronous, `g` is asynchronous, and `f(x)` did not throw, `y` is not a Promise

if `f` is synchronous, `g` is asynchronous, and `f(x)` threw, `y` is a Promise
```javascript
tryCatch(
  x => x + 'yo',
  (e, x) => x + e.message,
)('a') // => 'ayo'

tryCatch(
  x => { throw new Error(x) },
  (e, x) => x + e.message,
)('a') // => 'aa'

tryCatch(
  async x => x + 'yo',
  (e, x) => x + e.message,
)('a') // => Promise { 'ayo' }

tryCatch(
  x => Promise.reject(new Error(x)),
  (e, x) => x + e.message,
)('a') // => Promise { 'aa' }
```

## switchCase
if1(x) ? do1(x) : if2(x) ? do2(x) : ... ifN(x) ? doN(x) : doDefault(x)
```javascript
y = switchCase(functions)(x)
```
`x` is anything

`functions` is an array of functions

given<br>
`if1, if2, ..., ifN` predicate functions<br>
`do1, do2, ..., doN` corresponding then functions<br>
`doDefault`          an else function

`functions` is the array of functions `[if1, do1, if2, do2, ..., ifN, doN, doDefault]`

switchCase evaluates supplied functions in series `evaluated` and breaks early on a truthy predicate

if all functions of `evaluated` are synchronous, `y` is not a Promise

if any functions of `evaluated` are asynchronous, `y` is a Promise

```javascript
switchCase([
  x => x > 0, x => `${x} is greather than zero`,
  x => `${x} is not greater than zero`,
])(1) // => '1 is greater than zero'

switchCase([
  x => x === 1, x => `${x} is one`,
  x => x === 2, x => `${x} is two`,
  x => x === 3, x => `${x} is three`,
  async () => 'not one, two, nor three',
])(1) // => '1 is one'

switchCase([
  async x => x === 1, () => 'one',
  x => x === 2, () => 'two',
  x => x === 3, () => 'three',
  x => `${x} is not one, two, nor three`,
])(5) // => Promise { '5 is not one, two, nor three' }
```

## map
applies a sync or async function `f` to each element of a collection `x`
```javascript
y = map(f)(x)
```
`x` is an array, a string, a set, a map, a typed array, an object,<br>
    an async iterator, a generated iterator, or a function

`xi` is an element of `x`

`f` is a function that expects one argument `xi`

`y` is `x` with `f` applied to each element

if `x` is an async iterator, `y` is a generated async iterator

if `f` is synchronous, `y` is not a Promise

if `f` is asynchronous and `x` is not an async iterator, `y` is a Promise

if `x` is a function, map applies `f` to each element `zi` of `z`, yielding `f(zi)`
```javascript
y = reduce(map(f)(x))(z)
```
`reduce` is [reduce](https://github.com/richytong/rubico#reduce),

`z` is an iterable, asyncIterable, or object

`zi` is an element of `z`

`f` is a function that expects one argument `zi`

`x` is a function that expects two arguments `y` and `f(zi)`

`map(f)(x)` is a transduced reducing function, see [transducers](https://github.com/richytong/rubico#transducers)

`y` is equivalent in value to `reduce(x)(map(f)(z))`
```javascript
map(
  x => x + 1,
)([1, 2, 3, 4, 5]) // => [2, 3, 4, 5, 6]

map(
  async x => x + 'yo',
)(['a', 'he']) // => Promise { ['ayo', 'heyo'] }

map(
  x => Math.abs(x)
)(new Set([-2, -1, 0, 1, 2])) // new Set([0, 1, 2])

map(
  async ([key, value]) => [key + key, value + value],
)(new Map([['a', 1], ['b', 2]])) // Promise { Map { 'aa' => 2, 'bb' => 4 } }

String.fromCharCode(
  ...map(
    x => x + 1,
  )(new Uint8Array([97, 98, 99])) // 'abc' as bytes
) // => 'bcd'

map(
  async x => x + 'z',
)({ a: 'lol', b: 'cat' }) // => Promise { { a: 'lolz', b: 'catz' } }

map(map(
  x => x + 'z',
))({ a: { a: 'lol' }, b: { b: 'cat' } }) // => { { a: { a: 'lolz' } }, { b: { b: 'catz' } } }

const asyncNumbersGeneratedIterator = (async function*() {
  for (let i = 0; i < 5; i++) { yield i + 1 }
})() // generated asyncIterator that yields 1 2 3 4 5

map(
  x => x + 1,
)(asyncNumbersGeneratedIterator) // => generated asyncIterator that yields 2 3 4 5 6

const numbersGeneratedIterator = (function*() {
  for (let i = 0; i < 5; i++) { yield i + 1 }
})() // generated iterator that yields 1 2 3 4 5

map(
  x => x + 1,
)(numbersGeneratedIterator) // => generated iterator that yields 2 3 4 5 6

reduce(
  map(
    async xi => xi + 1,
  )((y, xi) => y + xi),
  0,
)([1, 2, 3, 4, 5]) // => Promise { 20 }
```
## filter
filters elements out of a collection `x` based on sync or async predicate `f`
```javascript
y = filter(f)(x)
```
`x` is an array, a string, a set, a map, a typed array, an object,<br>
    an async iterator, a generated iterator, or a function

`xi` is an element of `x`

`f` is a function that expects one argument `xi`

`y` is `x` with elements `xi` where `f(xi)` is truthy

if `x` is an async iterator, `y` is a generated async iterator

if `f` is synchronous, `y` is not a Promise

if `f` is asynchronous and `x` is not an async iterator, `y` is a Promise

if `x` is a function, filtering is based on elements of `z`
```javascript
y = reduce(filter(f)(x))(z)
```
`reduce` is [reduce](https://github.com/richytong/rubico#reduce),

`z` is an iterable, asyncIterable, or object

`zi` is an element of `z`

`f` is a function that expects one argument `zi`

`x` is a function that expects two arguments `y` and `zi`

`filter(f)(x)` is a transduced reducing function, see [transducers](https://github.com/richytong/rubico#transducers)

`y` is equivalent in value to `reduce(x)(filter(f)(z))`
```javascript
filter(
  x => x <= 3,
)([1, 2, 3, 4, 5]) // => [1, 2, 3]

filter(
  async x => x !== 'y',
)('yoyoyo') // => Promise { 'ooo' }

const abcSet = new Set(['a', 'b', 'c'])

filter(
  x => !abcSet.has(x),
)(new Set(['a', 'b', 'c', 'd'])) // => Set { 'd' }

filter(
  async ([key, value]) => key === value,
)(new Map([[0, 1], [1, 1], [2, 1]])) // => Promise { Map { 1 => 1 } }

filter(
  x => x <= 3n,
)(new BigInt64Array([1n, 2n, 3n, 4n, 5n])) // => BigInt64Array [1n, 2n, 3n]

filter(
  async x => x === 1,
)({ a: 1, b: 2, c: 3 }) // => Promise { { a: 1 } }

const asyncNumbersGeneratedIterator = (async function*() {
  for (let i = 0; i < 5; i++) { yield i + 1 }
})() // generated asyncIterator that yields 1 2 3 4 5

filter(
  x => x <= 3,
)(asyncNumbersGeneratedIterator) // => generated asyncIterator that yields 1 2 3

const numbersGeneratedIterator = (function*() {
  for (let i = 0; i < 5; i++) { yield i + 1 }
})() // generated iterator that yields 1 2 3 4 5

filter(
  x => x <= 3,
)(numbersGeneratedIterator) // => generated iterator that yields 1 2 3

reduce(
  filter(
    async xi => xi <= 3,
  )((y, xi) => y + xi),
  0,
)([1, 2, 3, 4, 5]) // => Promise { 6 }
```
## reduce
applies a sync or async reducing function `f` to each element of a collection `x`, returning a single value
```javascript
y = reduce(f, x0)(x)
```
`x` is an iterable, an async iterable, or an object

`f` is a function that expects two arguments `y` and `xi`, an element of `x`

`x0` is optional

if `x0` is provided
 * `y` starts as `x0`
 * iteration begins with the first element of `x`

if `x0` is not provided
 * `y` starts as the first element of `x`
 * iteration begins with the second element of `x`

for each successive `xi` of `x`, `y` assumes the output of `f(y, xi)`

the returned `y` is the output of the final iteration `f(y, xi)`

if `x` is an async iterator, `y` is a promise

if `f` is synchronous and `x` is not an async iterator, `y` is not a Promise

if `f` is asynchronous, `y` is a Promise
```javascript
reduce(
  (y, xi) => y + xi,
)([1, 2, 3, 4, 5]) // => 15

reduce(
  async (y, xi) => y + xi,
  100,
)([1, 2, 3, 4, 5]) // => Promise { 115 }

const asyncNumbersGeneratedIterator = (async function*() {
  for (let i = 0; i < 5; i++) { yield i + 1 }
})() // generated async iterator that yields 1 2 3 4 5

reduce(
  (y, xi) => y.concat([xi]),
  [],
)(asyncNumbersGeneratedIterator) // => Promise { [1, 2, 3, 4, 5] }

reduce(
  (y, xi) => y.add(xi),
  new Set(),
)({ a: 1, b: 1, c: 1, d: 1, e: 1 }) // => Set { 1 }
```
## transform
transforms input according to provided transducer and initial value
```javascript
y = transform(f, x0)
```
## any
## all
## and
## or
## not
## eq
## gt
## lt
## gte
## lte
## get
## pick
## omit

# Transducers
Transducers allow us to wrangle very large or infinite streams of data in a<br>
composable and memory efficient way. Say you had `veryBigData` in an array
```javascript
veryBigData = [...]
veryBigFilteredData = veryBigData.filter(datum => datum.isBig === true)
veryBigProcessedData = veryBigFilteredData.map(memoryIntensiveProcess)
console.log(veryBigProcessedData)
```
The above is not very memory efficient because of the intermediate arrays `veryBigFilteredData`<br>
and `veryBigProcessedData`. We're also logging out a large quantity of data at once to the console.

With some rubico functions, you could express the above transformation as a single pass<br>
without incurring a memory penalty
```javascript
veryBigData = [...]
transform(process.stdout, pipe([
  filter(datum => datum.isBig === true),
  map(memoryIntensiveProcess),
]))(veryBigData)
```
In this case, `pipe([filter(...), map(...)])` is a transducer, and we're writing each datum<br>
to the console via `process.stdout`. `transform` consumes our `pipe([filter(...), map(...)])`<br>
transducer and supplies it with `veryBigData`.

Behind the scenes, `transform` is calling `reduce` with a reducer converted from<br>
the transducer `pipe([filter(...), map(...)])` suitable for `process.stdout`

A reducer is a reducing function, very much the same as the one supplied to [reduce](https://github.com/richytong/rubico#reduce)
```javascript
y = reduce(reducer)(x)
```
A reducer takes two arguments: an aggregate `y` and an iterative value `xi`.<br>
It can be something like `(y, xi) => doSomethingWith(y, xi)`

A transducer is a function that takes a reducer and returns another reducer
```javascript
transducer = reducer => (y, xi) => reducer(doSomethingWith(y, xi))
```
The transducer above, when passed a reducer, returns another reducer that will do something<br>
with `y` and `xi`, then pass it to the input `reducer`

We can create a chained reducer by passing a reducer to a chain of transducers

Imagine dominos falling over. The reducer you pass to a chain of transducers is called last.<br>
Because of this implementation detail,
> if `x` is a function, pipe chains `functions` from right to left

You can use `pipe` to construct chains of transducers. Pipe will read left to right in all cases.<br>

There are two other functions you'll need to get started with transducers, `map` and `filter`.

given `x` is a reducer, `f` is a mapping function; `map(f)(x)` is a transducer that applies `f`<br>
to each element in the final `transform` pipeline.

given `x` is a reducer, `f` is a predicate function; `filter(f)(x)` is a transducer that<br>
filters each element in the final `transform` pipeline based on `f`

The following transformations `isOdd`, `square`, and `squaredOdds` are used as transducers
```javascript
const isOdd = filter(x => x % 2 === 1)

transform([], isOdd)([1, 2, 3, 4, 5]) // => [1, 3, 5]
reduce(
  isOdd((y, xi) => y.concat([xi])),
  [],
)([1, 2, 3, 4, 5]) // => [1, 3, 5]

const square = map(x => x ** 2)

transform([], square)([1, 2, 3, 4, 5]) // => [1, 4, 9, 16, 25]
reduce(
  square((y, xi) => y.concat([xi])),
  [],
)([1, 2, 3, 4, 5]) // => [1, 4, 9, 16, 25]

const squaredOdds = pipe([isOdd, square])

transform([], squaredOdds)([1, 2, 3, 4, 5]) // => [1, 9, 25]
reduce(
  squaredOdds((y, xi) => y.concat([xi])),
  [],
)([1, 2, 3, 4, 5]) // => [1, 9, 25]
```
The following transformations `isOdd`, `square`, and `squaredOdds` are not used as transducers
```javascript
const isOdd = filter(x => x % 2 === 1)

isOdd([1, 2, 3, 4, 5]) // => [1, 3, 5]

const square = map(x => x ** 2)

square([1, 2, 3, 4, 5]) // => [1, 4, 9, 16, 25]

const squaredOdds = pipe([isOdd, square])

squaredOdds([1, 2, 3, 4, 5]) // => [1, 9, 25]
```

# More Examples
### A webserver using map, transform, and https://deno.land/std/http/server.ts serve
```javascript
import { serve } from "https://deno.land/std/http/server.ts";
import { map, transform } from "https://deno.land/x/rubico/mod.js"
const s = serve({ port: 8001 });
console.log("http://localhost:8001/");
transform(null, map(req => {
  req.respond({ body: "Hello World\n" });
}))(s);
```

### A server with middleware
```javascript
import { serve } from 'https://deno.land/std/http/server.ts'
import {
  pipe, fork, assign, tap, tryCatch, switchCase,
  map, filter, reduce, transform,
  any, all, and, or, not,
  eq, gt, lt, gte, lte,
  get, pick, omit,
} from 'https://deno.land/x/rubico/mod.js'

const join = delim => x => x.join(delim)

const addServerTime = req => {
  req.serverTime = (new Date()).toJSON()
  return req
}

const traceRequest = pipe([
  fork([
    pipe([get('serverTime'), x => '[' + x + ']']),
    get('method'),
    get('url'),
  ]),
  join(' '),
  console.log,
])

const respondWithHelloWorld = req => {
  req.respond({ body: 'Hello World\n' })
}

const respondWithServerTime = req => {
  req.respond({ body: `The server time is ${req.serverTime}\n` })
}

const respondWithNotFound = req => {
  req.respond({ body: 'Not Found\n' })
}

const route = switchCase([
  eq('/', get('url')), respondWithHelloWorld,
  eq('/time', get('url')), respondWithServerTime,
  respondWithNotFound,
])

const onRequest = pipe([
  addServerTime,
  tap(traceRequest),
  route,
])

const s = serve({ port: 8001 })
console.log('http://localhost:8001/')
transform(null, map(onRequest))(s)
```
