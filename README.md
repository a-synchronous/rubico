# rubico
🏞 a shallow river in northeastern Italy, just south of Ravenna

[a]synchronous functional syntax

# Motivation
A note from the author
> At a certain point in my career, I grew frustrated with the entanglement of my own code. While looking for something better, I found functional programming. I was excited by the idea of functional composition, but disillusioned by the complex hierarchy of effectful types. I started rubico to capitalize on the prior while rebuking the latter. Many iterations since then, the library has grown into something I personally enjoy using, and continue to use to this day.

rubico's value resides at the intersection of the following principles:
 * [asynchronous code should be simple](https://dev.to/richytong/rubico-a-synchrnous-functional-syntax-motivation-20hf)
 * functional style should not care about async
 * functional transformations should be composable, performant, and simple to express

When you use this library, you obtain the freedom that comes only from having those three points fulfilled. Just as a compiler would optimize the performance of the code it compiles, rubico optimizes the performance of the JavaScript it exports. The result is something you may enjoy.

# Introduction
Here are my recommendations for getting started with rubico
 1. [take the tour](https://tour.rubico.land)
 2. [read the docs](#documentation)
 3. use rubico in a project
 4. at your leisure, [peruse the awesome resources](#awesome-resources)
 5. [help with rubico](https://github.com/a-synchronous/rubico/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)

# Installation
with `npm`
```bash
npm i rubico
```

browser script, global `rubico`
```html
<script src="https://unpkg.com/rubico"></script>
```

with `deno`
```javascript
import rubico from 'https://deno.land/x/rubico/rubico.js'
```

### System Requirements
 * minimum node version: 10.3
 * minimum Chrome version: 63
 * minimum Firefox version: 57
 * minimum Edge version: 79
 * minimum Safari version: 11.1

# Usage
```javascript
const {
  pipe, fork, assign,
  tap, tryCatch, switchCase,
  map, filter, reduce, transform,
  any, all, and, or, not,
  eq, gt, lt, gte, lte,
  get, pick, omit,
} = rubico
```

# Documentation
rubico hits the sweet spot between expressivity and interface surface area. Some methods have property functions that represent the same signature (i.e. `map` vs `map.series`) but exhibit differences in asynchronous behavior; `map` executes in parallel while `map.series` executes in series.

**series** and **parallel** are tags to denote the asynchronous behavior of methods that accept multiple functions. A `series` tag means the method executes its provided functions one at a time. If order is not implied, it is left to the implementation. (i.e. iterating an `Object`). A `parallel` tag means the method executes its provided functions in parallel.

All higher order functions accept sync or async functions; if all provided functions are synchronous, the entire execution is synchronous.

### function composition
 * [pipe](#pipe) [series] - chain functions together
 * [tap](#tap) - spy on data
 * [tryCatch](#tryCatch) [series] - try a function, catch with another
 * [switchCase](#switchCase) [series] - control flow

### function + data composition
 * [fork](#fork) [parallel] - multiply data by functions
   * `fork.series` [series]
 * [assign](#assign) [parallel] - set properties on data by functions

### data transformation
 * [map](#map) [parallel] - apply a function to data
   * `map.pool` [parallel] - `map` with asynchronous limit
   * `map.withIndex` [parallel] - `map` with index
   * `map.series` [series]
   * `map.sleep` [series] - `map.series` with delay in between [todo](https://github.com/a-synchronous/rubico/issues/13)
 * [filter](#filter) [parallel] - exclude data by predicate
   * `filter.withIndex` [parallel] - `filter` with index
 * [reduce](#reduce) [series] - execute data transformation (powerful)
 * [transform](#transform) [series] - execute data transformation (convenient)

### predicate composition
 * [any](#any) [parallel] - is function of any data truthy?
 * [all](#all) [parallel] - is function of all data truthy?
 * [and](#and) [parallel] - any functions of data truthy?
 * [or](#or) [parallel] - all functions of data truthy?
 * [not](#not) - `not(equals)(x)` is `!equals(x)`

### comparison
 * [eq](#eq) [parallel] - left equals right?
 * [gt](#gt) [parallel] - left > right?
 * [lt](#lt) [parallel] - left < right?
 * [gte](#gte) [parallel] - left >= right?
 * [lte](#lte) [parallel] - left <= right?

### property + index access
 * [get](#get) - access a value by path or index

### data composition
 * [pick](#pick) - only allow provided properties
   * `pick.range` - only allow provided range [todo](https://github.com/a-synchronous/rubico/issues/13)
 * [omit](#omit) - exclude provided properties

## pipe
chains functions from left to right in series
```javascript
y = pipe(functions)(x)
```
`functions` is an array of functions

`x` is anything

if `x` is a function, pipe chains `functions` from right to left,
see [transducers](#transducers)

`y` is the output of running `x` through the chain of `functions`

`y` is wrapped in a Promise if any of the following are true:
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

[back to documentation](#documentation)

## fork
parallelizes functions with data, retaining functions' type and shape
```javascript
y = fork(functions)(x)
```
`functions` is an array of functions or an object of functions

all functions of `functions` are run concurrently

`x` is anything

if `functions` is an array, `y` is `functions.map(f => f(x))`

if `functions` is an object, `y` is an object of entries `key: f(x)` for entry `key: f` of `functions`

`y` is wrapped in a Promise if any of the following are true:
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

`fork.series`
executes functions with data in series, retaining functions' type and shape
```javascript
y = fork.series(functions)(x)
```

[back to documentation](#documentation)

## assign
parallelizes functions with data, merging output into data
```javascript
y = assign(functions)(x)
```
`functions` is an object of functions

all functions of `functions` are run concurrently

`x` is an object

`output` is an object of entries `key: f(x)` for entry `key: f` of `functions`

`y` is `output` merged into `x`

`y` is wrapped in a Promise if any of the following are true:
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

[back to documentation](#documentation)

## tap
calls a function with data, returning data
```javascript
y = tap(f)(x)
```
`x` is anything

`f` is a function that expects one argument `x`

`y` is `x`

`y` is wrapped in a Promise if any of the following are true:
  * `f` is asynchronous

if `x` is a function, `y` is a transduced reducing function, see [transducers](#transducers)
```javascript
y = tap(f)(x); reduced = reduce(y)(z)
```
`reduce` is [reduce](#reduce),

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

[back to documentation](#documentation)

## tryCatch
tries a function with data, catches with another function
```javascript
y = tryCatch(f, g)(x)
```
`f` is a function that expects one argument `x`

`g` is a function that expects two arguments `err` and `x`

`x` is anything

`err` is a value potentially thrown by `f(x)`

if `f(x)` throws `err`, `y` is `g(err, x)`, else `y` is `f(x)`

`y` is wrapped in a Promise if any of the following are true:
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

[back to documentation](#documentation)

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

`y` is wrapped in a Promise if any of the following are true:
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

[back to documentation](#documentation)

## map
applies a function to each element of data in parallel, retaining data type and shape
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

`y` is wrapped in a Promise if any of the following are true:
  * `f` is asynchronous and `x` is not an async iterable

if `x` is a function, `y` is a transduced reducing function, see [transducers](#transducers)
```javascript
y = map(f)(x); reduced = reduce(y)(z)
```
`reduce` is [reduce](#reduce),

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

`map.pool`
Apply a function to every element of data in parallel with limited concurrency
```javascript
y = map.pool(size, f)(x)
```

`map.withIndex`
Apply a function to every element of data in parallel with index and reference to data
```javascript
y = map.withIndex(f)(x); yi = f(xi, i, x)
```

`map.series`
Apply a function to every element of data in series
```javascript
y = map.series(f)(x)
```

`map.seriesWithIndex`
Apply a function to every element of data in series with index and reference to data
```javascript
 = map.seriesWithIndex(f)(x); yi = f(xi, i, x)
```

[back to documentation](#documentation)

## filter
filters elements out of data in parallel based on provided predicate
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

`y` is wrapped in a Promise if any of the following are true:
  * `f` is asynchronous and `x` is not an async iterable

if `x` is a function, `y` is a transduced reducing function, see [transducers](#transducers)
```javascript
y = filter(f)(x); reduced = reduce(y)(z)
```
`reduce` is [reduce](#reduce),

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

`filter.withIndex`
Filter, but with each predicate called with index and reference to data
```javascript
y = filter.withIndex(f)(x); yi = f(xi, i, x)
```

[back to documentation](#documentation)

## reduce
transforms data in series according to provided reducing function and initial value
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

`y` is wrapped in a Promise if any of the following are true:
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

[back to documentation](#documentation)

## transform
transforms data in series according to provided transducer and initial value
```javascript
y = transform(f, x0)(x)
```

`x` is an iterable, an async iterable, or an object

`f` is a transducer, see [transducers](#transducers)

`x0` is null, an array, a string, a set, a map, a typed array, or a writable

`y` is `x` transformed with `f` into `x0`

`y` is wrapped in a Promise if any of the following are true:
  * `f` is asynchronous
  * `x` is an async iterable

in the following examples, `map` is [map](#map)
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

[back to documentation](#documentation)

## any
applies a function to each element of data parallel, returns true if any evaluations truthy
```javascript
y = any(f)(x)
```

`x` is an iterable or an object

`xi` is an element of `x`

`f` is a function that expects one argument `xi`

`y` is true if all `f(xi)` are truthy, false otherwise

`y` is wrapped in a Promise if any of the following are true:
  * `f` is asynchronous

```javascript
const isOdd = x => x % 2 === 1

any(
  isOdd,
)([1, 2, 3, 4, 5]) // => true

const asyncIsOdd = async x => x % 2 === 1

any(
  asyncIsOdd,
)([1, 2, 3, 4, 5]) // => Promise { true }

any(
  isOdd,
)({ b: 2, d: 4 }) // => false
```

[back to documentation](#documentation)

## all
applies a function to each element of data in parallel, returns true if all evaluations truthy
```javascript
y = all(f)(x)
```

`x` is an iterable or an object

`xi` is an element of `x`

`f` is a function that expects one argument `xi`

`y` is true if any `f(xi)` are truthy, false otherwise

`y` is wrapped in a Promise if any of the following are true:
  * `f` is asynchronous

```javascript
const isOdd = x => x % 2 === 1

all(
  isOdd,
)([1, 2, 3, 4, 5]) // => false

const asyncIsOdd = async x => x % 2 === 1

all(
  asyncIsOdd,
)([1, 2, 3, 4, 5]) // => Promise { false }

all(
  isOdd,
)({ a: 1, c: 3 }) // => true
```

[back to documentation](#documentation)

## and
applies each function of functions in parallel to data, returns true if all evaluations truthy
```javascript
y = and(functions)(x)
```

`x` is anything

`functions` is an array of functions

`f` is a function of `functions`

`y` is true if all `f(x)` are truthy, false otherwise

`y` is wrapped in a Promise if any of the following are true:
  * any `f` is asynchronous

```javascript
const isOdd = x => x % 2 === 1

const asyncIsOdd = async x => x % 2 === 1

const lessThan3 = x => x < 3

and([
  isOdd,
  lessThan3,
])(1) // => true

and([
  asyncIsOdd,
  lessThan3,
])(1) // => Promise { true }

and([
  isOdd,
  lessThan3,
])(2) // => false
```

[back to documentation](#documentation)

## or
applies each function of functions in parallel to data, returns true if any evaluations truthy
```javascript
y = or(functions)(x)
```

`x` is anything

`functions` is an array of functions

`f` is a function of `functions`

`y` is true if any `f(x)` are truthy, false otherwise

`y` is wrapped in a Promise if any of the following are true:
  * any `f` is asynchronous

```javascript
const isOdd = x => x % 2 === 1

const asyncIsOdd = async x => x % 2 === 1

const lessThan3 = x => x < 3

or([
  isOdd,
  lessThan3,
])(5) // => true

or([
  asyncIsOdd,
  lessThan3,
])(5) // => Promise { true }

or([
  isOdd,
  lessThan3,
])(6) // => false
```

[back to documentation](#documentation)

## not
applies a function to data, logically inverting the result
```javascript
y = not(f)(x)
```

`x` is anything

`f` is a function that expects one argument `x`

`y` is true if `f(x)` is falsy, false otherwise

`y` is wrapped in a Promise if any of the following are true:
  * `f` is asynchronous

```javascript
const isOdd = x => x % 2 === 1

const asyncIsOdd = async x => x % 2 === 1

not(
  isOdd,
)(2) // => true

not(
  asyncIsOdd,
)(2) // => Promise { true }

not(
  isOdd,
)(3) // => false
```

[back to documentation](#documentation)

## eq
tests left strictly equals right
```javascript
y = eq(left, right)(x)
```

`x` is anything

`left` is a non-function value or a function that expects one argument `x`

`right` is a non-function value or a function that expects one argument `x`

`leftCompare` is `left` if `left` is a non-function value, else `left(x)`

`rightCompare` is `right` if `right` is a non-function value, else `right(x)`

`y` is true if `leftCompare` strictly equals `rightCompare`, false otherwise

`y` is wrapped in a Promise if any of the following are true:
  * `left` is asynchronous
  * `right` is asynchronous

```javascript
const square = x => x ** 2

const asyncSquare = async x => x ** 2

eq(
  square,
  1,
)(1) // => true

eq(
  asyncSquare,
  1,
)(1) // => Promise { true }

eq(
  square,
  asyncSquare,
)(1) // => Promise { true }

eq(
  1,
  square,
)(2) // => false

eq(1, 1)() // => true
eq(0, 1)() // => false
```

[back to documentation](#documentation)

## gt
tests left greater than right
```javascript
y = gt(left, right)(x)
```

`x` is anything

`left` is a non-function value or a function that expects one argument `x`

`right` is a non-function value or a function that expects one argument `x`

`leftCompare` is `left` if `left` is a non-function value, else `left(x)`

`rightCompare` is `right` if `right` is a non-function value, else `right(x)`

`y` is true if `leftCompare` is greater than `rightCompare`

`y` is wrapped in a Promise if any of the following are true:
  * `left` is asynchronous
  * `right` is asynchronous

```javascript
gt(
  x => x,
  10,
)(11) // => true

gt(
  async x => x,
  10,
)(11) // => Promise { true }

gt(
  x => x,
  10,
)(9) // => false

gt(2, 1)() // => true
gt(1, 1)() // => false
gt(0, 1)() // => false
```

[back to documentation](#documentation)

## lt
tests left less than right
```javascript
y = lt(left, right)(x)
```

`x` is anything

`left` is a non-function value or a function that expects one argument `x`

`right` is a non-function value or a function that expects one argument `x`

`leftCompare` is `left` if `left` is a non-function value, else `left(x)`

`rightCompare` is `right` if `right` is a non-function value, else `right(x)`

`y` is true if `leftCompare` is less than `rightCompare`

`y` is wrapped in a Promise if any of the following are true:
  * `left` is asynchronous
  * `right` is asynchronous

```javascript
lt(
  x => x,
  10,
)(9) // => true

lt(
  async x => x,
  10,
)(9) // => Promise { true }

lt(
  x => x,
  10,
)(11) // => false

lt(0, 1)() // => true
lt(1, 1)() // => false
lt(2, 1)() // => false
```

[back to documentation](#documentation)

## gte
tests left greater than or equal right
```javascript
y = gte(left, right)(x)
```

`x` is anything

`left` is a non-function value or a function that expects one argument `x`

`right` is a non-function value or a function that expects one argument `x`

`leftCompare` is `left` if `left` is a non-function value, else `left(x)`

`rightCompare` is `right` if `right` is a non-function value, else `right(x)`

`y` is true if `leftCompare` is greater than or equal to `rightCompare`

`y` is wrapped in a Promise if any of the following are true:
  * `left` is asynchronous
  * `right` is asynchronous

```javascript
gte(
  x => x,
  10,
)(11) // => true

gte(
  async x => x,
  10,
)(11) // => Promise { true }

gte(
  x => x,
  10,
)(9) // => false

gte(2, 1)() // => true
gte(1, 1)() // => true
gte(0, 1)() // => false
```

[back to documentation](#documentation)

## lte
tests left less than or equal right
```javascript
y = lte(left, right)(x)
```

`x` is anything

`left` is a non-function value or a function that expects one argument `x`

`right` is a non-function value or a function that expects one argument `x`

`leftCompare` is `left` if `left` is a non-function value, else `left(x)`

`rightCompare` is `right` if `right` is a non-function value, else `right(x)`

`y` is true if `leftCompare` is less than or equal to `rightCompare`

`y` is wrapped in a Promise if any of the following are true:
  * `left` is asynchronous
  * `right` is asynchronous

```javascript
lte(
  x => x,
  10,
)(9) // => true

lte(
  async x => x,
  10,
)(9) // => Promise { true }

lte(
  x => x,
  10,
)(11) // => false

lte(0, 1)() // => true
lte(1, 1)() // => true
lte(2, 1)() // => false
```

[back to documentation](#documentation)

## get
accesses a property by path
```javascript
y = get(path, defaultValue)(x)
```

`x` is an object

`path` is a number, string, a dot-delimited string, or an array

`defaultValue` is optional; if not provided, it is undefined

`y` depends on `path`:
  * if `path` is a number or string, `y` is `x[path]`
  * if `path` is a dot-delimited string `'p.a...t.h'`, `y` is `x['p']['a']...['t']['h']`
  * if `path` is an array `['p', 'a', ..., 't', 'h']`, `y` is `x['p']['a']...['t']['h']`
  * if `path` is not found in `x`, `y` is `defaultValue`

```javascript
get('a')({ a: 1, b: 2 }) // => 1

get('a')({}) // => undefined

get('a', 10)({}) // => 10

get(0)(['hello', 'world']) // => 'hello'

get('a.b.c')({ a: { b: { c: 'hey' } } }) // => 'hey'

get([0, 'user', 'id'])([
  { user: { id: '1' } },
  { user: { id: '2' } },
]) // => '1'
```

[back to documentation](#documentation)

## pick
constructs a new object from data composed of the provided properties
```javascript
y = pick(properties)(x)
```

`x` is an object

`properties` is an array of strings

`y` is an object composed of all properties enumerated in `properties` and defined in `x`

```javascript
pick(['a', 'b'])({ a: 1, b: 2, c: 3 }) // => { a: 1, b: 2 }

pick(['d'])({ a: 1, b: 2, c: 3 }) // => {}
```

[back to documentation](#documentation)

## omit
constructs a new object from data without the provided properties
```javascript
y = omit(properties)(x)
```

`x` is an object

`properties` is an array of strings

`y` is an object composed of every property in `x` except for those enumerated in `properties`

```javascript
omit(['a', 'b'])({ a: 1, b: 2, c: 3 }) // => { c: 3 }

omit(['d'])({ a: 1, b: 2, c: 3 }) // => { a: 1, b: 2, c: 3 }
```

# Transducers
Transducers enable us to wrangle very large or infinite streams of data in a composable and memory efficient way. Say you had `veryBigData` in an array
```javascript
veryBigData = [...]
veryBigFilteredData = veryBigData.filter(datum => datum.isBig === true)
veryBigProcessedData = veryBigFilteredData.map(memoryIntensiveProcess)
console.log(veryBigProcessedData)
```
The above is not very memory efficient because of the intermediate arrays `veryBigFilteredData` and `veryBigProcessedData`. We're also logging out a large quantity of data at once to the console.

With rubico, you could express the above transformation as a single pass without incurring a memory penalty
```javascript
veryBigData = [...]
transform(pipe([
  filter(datum => datum.isBig === true),
  map(memoryIntensiveProcess),
]), process.stdout)(veryBigData)
```
In this case, `pipe([filter(...), map(...)])` is a transducer, and we're writing each datum to the console via `process.stdout`. `transform` consumes our `pipe([filter(...), map(...)])` transducer and supplies it with `veryBigData`.

Behind the scenes, `transform` is calling `reduce` with a reducing function suitable for writing to `process.stdout` converted from the transducer `pipe([filter(...), map(...)])`

`reducer` is an alias for reducing function, very much the same as the one supplied to [reduce](#reduce)
```javascript
y = reduce(reducer)(x)
```
A reducer takes two arguments: an aggregate `y` and an iterative value `xi`. It can be something like `(y, xi) => doSomethingWith(y, xi)`

A `transducer` is a function that takes a reducer and returns another reducer
```javascript
transducer = reducer => (y, xi) => reducer(doSomethingWith(y, xi))
```
The transducer above, when passed a reducer, returns another reducer that will do something with `y` and `xi`, then pass it to the input `reducer`

We can create a chained reducer by passing a reducer to a chain of transducers. Imagine dominos falling over. The reducer you pass to a chain of transducers is called last. Because of this implementation detail,

> if `x` is a function, pipe chains `functions` from right to left

You can use `pipe` to construct chains of transducers. Pipe will read left to right in all cases.

There are two other functions you'll need to get started with transducers, `map` and `filter`.

given `x` is a reducer, `f` is a mapping function; `map(f)(x)` is a transduced reducer that applies `f` to each element in the final transform pipeline.

given `x` is a reducer, `f` is a predicate function; `filter(f)(x)` is a transduced reducer that filters each element in the final transform pipeline based on `f`

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

# Awesome Resources
[Practical Functional Programming in JavaScript - Why it's worth it](https://dev.to/richytong/practical-functional-programming-in-javascript-why-it-s-worth-it-ep1) - richytong

# Contributing
Your feedback and contributions are welcome. If you have a suggestion, please raise an issue. Prior to that, make sure to search through the issues first in case your suggestion has been made already. If you decide to work on an issue, please announce on the issue thread that you will work on it.

Enhancements should follow the principles of the library:
 * asynchronous code should be simple
 * functional style should not care about async
 * functional transformations should be composable, performant, and simple to express

Pull requests should provide some basic context and link the relevant issue. My intention is that progress on the library follow an issue -> pull request format. See this [pull request](https://github.com/a-synchronous/rubico/pull/12) for an example.

If you are interested in contributing, the [help wanted](https://github.com/a-synchronous/rubico/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) tag is a good place to start.

# License
rubico is [MIT Licensed](https://github.com/a-synchronous/rubico/blob/master/LICENSE).
