# rubico
🏞 a shallow river in northeastern Italy, just south of Ravenna

a functional promise library

[Installation](https://github.com/richytong/rubico#installation)

[Examples](https://github.com/richytong/rubico#examples)

[Documentation](https://github.com/richytong/rubico#documentation)

[Transducers](https://github.com/richytong/rubico#transducers)

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

This was fine until we missed imperative programming

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

Meanwhile...
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

rubico is a functional (programming) promise library.

rubico resolves on two promises:
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
} from 'https://deno.land/x/rubico/rubico.js'
```

with npm; `npm i rubico`

# Examples
The following examples compare promise chains, async/await, and rubico

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
import { pipe } from 'rubico.js'

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
import { pipe, map, filter } from 'rubico.js'

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
chains functions from left to right; `functionN(...(function2(function1(function0(x)))))`
```javascript
y = pipe(functions)(x)
```
`functions` is an array of functions

`x` is anything

if `x` is a function, pipe chains `functions` from right to left,
see [transducers](https://github.com/richytong/rubico#transducers)

`y` is the output of running `x` through the chain of `functions`

`y` is wrapped in a Promise if:
  * any function of `functions` is asynchronous

```javascript
pipe([
  x => x + ' ',
  x => x + 'world',
])('hello') // => 'hello world'

pipe([
  async x => x + ' ',
  x => x + 'world',
])('hello') // => Promise { 'hello world' }
```

## fork
parallelizes functions with input, retaining functions' type and shape
```javascript
y = fork(functions)(x)
```
`functions` is an array of functions or an object of functions

all functions of `functions` are run concurrently

`x` is anything

if `functions` is an array, `y` is `functions.map(f => f(x))`

if `functions` is an object, `y` is an object of entries `key: f(x)` for entry `key: f` of `functions`

`y` is wrapped in a Promise if:
  * any function of `functions` is asynchronous

```javascript
fork([
  x => x + 'world',
  x => x + 'mom'
])('hello') // => ['hello world', 'hello mom']

fork([
  x => x + 'world',
  async x => x + 'mom'
])('hello') // => Promise { ['hello world', 'hello mom'] }

fork({
  a: x => x + 'world',
  b: x => x + 'mom',
})('hello') // => { a: 'hello world', b: 'hello mom' }

fork({
  a: x => x + 'world',
  b: async x => x + 'mom',
})('hello') // => Promise { { a: 'hello world', b: 'hello mom' } }
```

## assign
parallelizes functions with input, merging output into input
```javascript
y = assign(functions)(x)
```
`functions` is an object of functions

all functions of `functions` are run concurrently

`x` is an object

`output` is an object of entries `key: f(x)` for entry `key: f` of `functions`

`y` is `output` merged into `x`

`y` is wrapped in a Promise if:
  * any function of `functions` is asynchronous

```javascript
assign({
  hi: x => 'hi ' + x,
  bye: x => 'bye ' + x,
})({ name: 'Ed' }) // => { name: 'Ed', hi: 'hi Ed', bye: 'bye Ed' }

assign({
  async hi: x => 'hi ' + x,
  bye: x => 'bye ' + x,
})({ name: 'Ed' }) // => Promise { { name: 'Ed', hi: 'hi Ed', bye: 'bye Ed' } }

assign({
  name: () => 'not Ed',
})({ name: 'Ed' }) // => { name: 'not Ed' }
```

## tap
calls a function with input, returning input
```javascript
y = tap(f)(x)
```
`x` is anything

`f` is a function that expects one argument `x`

`y` is `x`

`y` is wrapped in a Promise if:
  * `f` is asynchronous

if `x` is a function, `y` is a transduced reducing function, see [transducers](https://github.com/richytong/rubico#transducers)
```javascript
y = tap(f)(x); reduced = reduce(y)(z)
```
`reduce` is [reduce](https://github.com/richytong/rubico#reduce),

`z` is an iterable, async iterable, or object

`zi` is an element of `z`

`f` is a function that expects one argument `zi`

`reduced` is equivalent to `reduce(x)(z)`
```javascript
tap(
  console.log, // > 'hey'
)('hey') // => 'hey'

const asyncConsoleLog = async x => console.log(x)

tap(
  asyncConsoleLog, // > 'hey'
)('hey') // => Promise { 'hey' }

const concat = (y, xi) => y.concat([xi])

reduce(
  tap(console.log)(concat), // > 1 2 3 4 5
  [],
)([1, 2, 3, 4, 5]) // => [1, 2, 3, 4, 5]
```

## tryCatch
tries a function with input, catches with another function
```javascript
y = tryCatch(f, g)(x)
```
`f` is a function that expects one argument `x`

`g` is a function that expects two arguments `err` and `x`

`x` is anything

`err` is a value potentially thrown by `f(x)`

if `f(x)` throws `err`, `y` is `g(err, x)`, else `y` is `f(x)`

`y` is wrapped in a Promise if:
  * `f` is asynchronous
  * `f` is synchronous, `g` is asynchronous, and `f(x)` threw

```javascript
const onError = (e, x) => `${x} is invalid: ${e.message}`

tryCatch(
  x => x,
  onError,
)('hello') // => 'hello'

const throwGoodbye = () => { throw new Error('goodbye') }

tryCatch(
  throwGoodbye,
  onError,
)('hello') // => 'hello is invalid: goodbye'

const rejectWithGoodbye = () => Promise.reject(new Error('goodbye'))

tryCatch(
  rejectWithGoodbye,
  onError,
)('hello') // => Promise { 'hello is invalid: goodbye' }
```

## switchCase
an if, else if, else construct for functions
```javascript
y = switchCase(functions)(x)
```
`x` is anything

`functions` is an array of functions

given
  * predicate `if` functions     `if1, if2, ..., ifN`
  * corresponding `do` functions `do1, do2, ..., doN`
  * an `else` function           `elseDo`

`functions` is an array of functions
```javascript
[
  if1, do1,
  if2, do2,
  ..., ...,
  elseDo,
]
```

switchCase evaluates functions in `functions` from left to right

`y` is the first `do(x)` whose corresponding `if(x)` is truthy

`y` is wrapped in a Promise if:
  * any evaluated functions are asynchronous

```javascript
const isOdd = x => x % 2 === 1

switchCase([
  isOdd, () => 'odd',
  () => 'even',
])(1) // => 'odd'

switchCase([
  async isOdd, () => 'odd',
  () => 'even',
])(1) // => Promise { 'odd' }
```

## map
applies a function to each element of input, retaining input type and shape
```javascript
y = map(f)(x)
```
`x` is an iterable, an async iterable, an object, or a function

`xi` is an element of `x`

`f` is a function that expects one argument `xi`

`y` is of type and shape `x` with `f` applied to each element, with some exceptions:
  * if `x` is an async iterable but not a built-in type, `y` is a generated async iterable
  * if `x` is an iterable but not a built-in type, `y` is a generated iterable
  * if `x` is an iterable but not a built-in type and `f` is asynchronous,
    `y` is an iterable of promises

`y` is wrapped in a Promise if:
  * `f` is asynchronous and `x` is not an async iterable

if `x` is a function, `y` is a transduced reducing function, see [transducers](https://github.com/richytong/rubico#transducers)
```javascript
y = map(f)(x); reduced = reduce(y)(z)
```
`reduce` is [reduce](https://github.com/richytong/rubico#reduce),

`z` is an iterable, async iterable, or object

`zi` is an element of `z`

`f` is a function that expects one argument `zi`

`x` is a reducing function that expects two arguments `y` and `f(zi)`

`reduced` is equivalent to `reduce(x)(map(f)(z))`

```javascript
const square = x => x ** 2

map(
  square,
)([1, 2, 3, 4, 5]) // => [1, 4, 9, 16, 25]

const asyncSquare = async x => x ** 2

map(
  asyncSquare,
)([1, 2, 3, 4, 5]) // => Promise { [1, 4, 9, 16, 25] }

map(
  Math.abs,
)(new Set([-2, -1, 0, 1, 2])) // => { Set { 0, 1, 2 } }

const double = ([k, v]) => [k + k, v + v]

map(
  double,
)(new Map([['a', 1], ['b', 2]])) // => Map { 'aa' => 2, 'bb' => 4 }

map(
  byte => byte + 1,
)(new Uint8Array([97, 98, 99])) // Uint8Array [ 98, 99, 100 ]

map(
  word => word + 'z',
)({ a: 'lol', b: 'cat' }) // => { a: 'lolz', b: 'catz' }
```

## filter
filters elements out of input based on provided predicate
```javascript
y = filter(f)(x)
```
`x` is an iterable, an async iterable, an object, or a function

`xi` is an element of `x`

`f` is a function that expects one argument `xi`

`y` is of type and shape `x` with elements `xi` where `f(xi)` is truthy, with some exceptions:
  * if `x` is an async iterable but not a built-in type, `y` is a generated async iterable
  * if `x` is an iterable but not a built-in type, `y` is a generated iterable
  * if `x` is an iterable but not a bulit-in type and `f` is asynchronous,
    filter will throw a TypeError

`y` is wrapped in a Promise if:
  * `f` is asynchronous and `x` is not an async iterable

if `x` is a function, `y` is a transduced reducing function, see [transducers](https://github.com/richytong/rubico#transducers)
```javascript
y = filter(f)(x); reduced = reduce(y)(z)
```
`reduce` is [reduce](https://github.com/richytong/rubico#reduce),

`z` is an iterable, async iterable, or object

`zi` is an element of `z`

`f` is a function that expects one argument `zi`

`x` is a reducing function that expects two arguments `y` and `zi`

`reduced` is equivalent to `reduce(x)(filter(f)(z))`

```javascript
const isOdd = x => x % 2 === 1
filter(
  isOdd,
)([1, 2, 3, 4, 5]) // => [1, 3, 5]

const asyncIsOdd = async x => x % 2 === 1
filter(
  asyncIsOdd,
)([1, 2, 3, 4, 5]) // => Promise { [1, 3, 5] }

filter(
  letter => letter !== 'y',
)('yoyoyo') // => 'ooo'

const abcSet = new Set(['a', 'b', 'c'])
filter(
  letter => abcSet.has(letter),
)(new Set(['a', 'z'])) // => Set { 'a' }

filter(
  ([key, value]) => key === value,
)(new Map([[0, 1], [1, 1], [2, 1]])) // => { Map { 1 => 1 } }

filter(
  bigint => bigint <= 3n,
)(new BigInt64Array([1n, 2n, 3n, 4n, 5n])) // => BigInt64Array [1n, 2n, 3n]

filter(
  value => value === 1,
)({ a: 1, b: 2, c: 3 }) // => { a: 1 }
```

## reduce
transforms input according to provided reducing function and initial value
```javascript
y = reduce(f, x0)(x)
```
`x` is an iterable, an async iterable, or an object

`xi` is an element of `x`

`f` is a reducing function that expects two arguments `y` and `xi`

`x0` is optional, and if provided:
  * `y` starts as `x0`
  * iteration begins with the first element of `x`

if `x0` is not provided:
  * `y` starts as the first element of `x`
  * iteration begins with the second element of `x`

`y` is `f(y, xi)` for each successive `xi`

`y` is wrapped in a Promise if:
  * `f` is asynchronous
  * `x` is an async iterable

```javascript
const add = (y, xi) => y + xi

reduce(
  add,
)([1, 2, 3, 4, 5]) // => 15

reduce(
  add, 100,
)([1, 2, 3, 4, 5]) // => 115

const asyncAdd = async (y, xi) => y + xi

reduce(
  asyncAdd,
)([1, 2, 3, 4, 5]) // => Promise { 15 }

const asyncNumbersGeneratedIterable = (async function*() {
  for (let i = 0; i < 5; i++) { yield i + 1 }
})() // generated async iterable that yields 1 2 3 4 5

const concat = (y, xi) => y.concat([xi])

reduce(
  concat, [],
)(asyncNumbersGeneratedIterable) // => Promise { [1, 2, 3, 4, 5] }

reduce(
  concat, [],
)({ a: 1, b: 1, c: 1, d: 1, e: 1 }) // => [1, 2, 3, 4, 5]
```

## transform
transforms input according to provided transducer and initial value
```javascript
y = transform(f, x0)(x)
```

`x` is an iterable, an async iterable, or an object

`f` is a transducer, see [transducers](https://github.com/richytong/rubico#transducers)

`x0` is null, an array, a string, a set, a map, a typed array, or a writable

`y` is `x` transformed with `f` into `x0`

`y` is wrapped in a Promise if:
  * `f` is asynchronous
  * `x` is an async iterable

in the following examples, `map` is [map](https://github.com/richytong/rubico#map)
```javascript
const square = x => x ** 2

transform(map(
  square,
), null)([1, 2, 3, 4, 5]) // => null

const asyncSquare = async x => x ** 2

transform(map(
  asyncSquare,
), [])([1, 2, 3, 4, 5]) // => Promise { [1, 4, 9, 16, 25] }

transform(map(
  square,
), '')([1, 2, 3, 4, 5]) // => '1491625'

transform(map(
  square,
), new Set())([1, 2, 3, 4, 5]) // => Set { 1, 4, 9, 16, 25 }

transform(map(
  number => [number, square(number)],
), new Map())([1, 2, 3, 4, 5]) // => Map { 1 => 1, 2 => 4, 3 => 9, 4 => 16, 5 => 25 }

const charToByte = x => x.charCodeAt(0)

transform(map(
  square,
), new Uint8Array())([1, 2, 3, 4, 5]), // => Uint8Array [1, 4, 9, 16, 25]

const asyncNumbersGeneratedIterable = (async function*() {
  for (let i = 0; i < 5; i++) { yield i + 1 }
})() // generated async iterable that yields 1 2 3 4 5

transform(map(
  square,
), process.stdout)(asyncNumbersGeneratedIterable) // > 1 4 9 16 25
// => Promise { process.stdout }
```

## any
applies a function to each element of input, returns any evaluations truthy
```javascript
y = any(f)(x)
```

`x` is an iterable or an object

## all
applies a function to each element of input, returns all evaluations truthy
```javascript
y = all(f)(x)
```

`x` is an iterable or an object

## and
applies each function of functions to input, returns all evaluations truthy
```javascript
y = and(functions)(x)
```

`x` is anything

## or
applies each function of functions to input, returns any evaluations truthy
```javascript
y = or(functions)(x)
```

`x` is anything

## not
applies a function to input, logically inverting the result
```javascript
y = not(f)(x)
```

`x` is anything

## eq
applies input to two provided functions, returns both evaluations strict equal
```javascript
y = eq(f, g)(x)
```

`x` is anything

## gt
applies input to two provided functions, returns first evaluation greater than second
```javascript
y = gt(f, g)(x)
```

`x` is anything

## lt
applies input to two provided functions, returns first evaluation less than second
```javascript
y = lt(f, g)(x)
```

`x` is anything

## gte
applies input to two provided functions, returns first evaluation greater than or equal to second
```javascript
y = gte(f, g)(x)
```

`x` is anything

## lte
applies input to two provided functions, returns first evaluation less than or equal to second
```javascript
y = lte(f, g)(x)
```

`x` is anything

## get
accesses a property by path
```javascript
y = get(path)(x)
```

`x` is anything

## pick
constructs a new object from input composed of the provided properties
```javascript
y = pick(properties)(x)
```

`x` is an object

## omit
constructs a new object from input without the provided properties
```javascript
y = omit(properties)(x)
```

`x` is an object

# Transducers
Transducers enable us to wrangle very large or infinite streams of data in a<br>
composable and memory efficient way. Say you had `veryBigData` in an array
```javascript
veryBigData = [...]
veryBigFilteredData = veryBigData.filter(datum => datum.isBig === true)
veryBigProcessedData = veryBigFilteredData.map(memoryIntensiveProcess)
console.log(veryBigProcessedData)
```
The above is not very memory efficient because of the intermediate arrays `veryBigFilteredData`<br>
and `veryBigProcessedData`. We're also logging out a large quantity of data at once to the console.

With rubico, you could express the above transformation as a single pass<br>
without incurring a memory penalty
```javascript
veryBigData = [...]
transform(pipe([
  filter(datum => datum.isBig === true),
  map(memoryIntensiveProcess),
]), process.stdout)(veryBigData)
```
In this case, `pipe([filter(...), map(...)])` is a transducer, and we're writing each datum<br>
to the console via `process.stdout`. `transform` consumes our `pipe([filter(...), map(...)])`<br>
transducer and supplies it with `veryBigData`.

Behind the scenes, `transform` is calling `reduce` with a reducing function suitable for writing<br>
to `process.stdout` converted from the transducer `pipe([filter(...), map(...)])`

`reducer` is an alias for reducing function, very much the same as the one supplied to [reduce](https://github.com/richytong/rubico#reduce)
```javascript
y = reduce(reducer)(x)
```
A reducer takes two arguments: an aggregate `y` and an iterative value `xi`.<br>
It can be something like `(y, xi) => doSomethingWith(y, xi)`

A `transducer` is a function that takes a reducer and returns another reducer
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

given `x` is a reducer, `f` is a mapping function; `map(f)(x)` is a transduced reducer<br>
that applies `f` to each element in the final transform pipeline.

given `x` is a reducer, `f` is a predicate function; `filter(f)(x)` is a transduced reducer<br>
that filters each element in the final transform pipeline based on `f`

The following transformations `isOdd`, `square`, and `squaredOdds` are used as transducers
```javascript
const concat = (y, xi) => y.concat([xi])

const isOdd = filter(x => x % 2 === 1)

transform(isOdd, [])([1, 2, 3, 4, 5]) // => [1, 3, 5]
reduce(
  isOdd(concat),
  [],
)([1, 2, 3, 4, 5]) // => [1, 3, 5]

const square = map(x => x ** 2)

transform(square, [])([1, 2, 3, 4, 5]) // => [1, 4, 9, 16, 25]
reduce(
  square(concat),
  [],
)([1, 2, 3, 4, 5]) // => [1, 4, 9, 16, 25]

const squaredOdds = pipe([isOdd, square])

transform(squaredOdds, [])([1, 2, 3, 4, 5]) // => [1, 9, 25]
reduce(
  squaredOdds(concat),
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
### A webserver using map, transform, and https://deno.land/std/http serve
```javascript
import { serve } from "https://deno.land/std/http/server.ts";
import { map, transform } from "https://deno.land/x/rubico/rubico.js"
const s = serve({ port: 8001 });
console.log("http://localhost:8001/");
transform(map(req => {
  req.respond({ body: "Hello World\n" });
}), null)(s);
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
} from 'https://deno.land/x/rubico/rubico.js'

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
transform(map(onRequest), null)(s)
```
