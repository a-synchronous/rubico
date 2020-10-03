## Transducers Crash Course

Transducers enable composable and memory efficient wrangling of very large or even infinite sets of data. Say you wanted to square the odd numbers from one to one thousand.

```javascript [playground]
const isOdd = number => number % 2 == 1

const square = number => number ** 2

const manyNumbers = Array.from({ length: 1000 }, (_, i) => i)

console.log(
  manyNumbers
    .filter(isOdd)
    .map(square),
) // [1, 9, 25, 36, 49, ...]
```

<br />

In the above example, `manyNumbers` goes through two batch transformations from `.filter` and `.map` - this is not so memory efficient.

With transducers, you could express the above transformation as a single pass without incurring a memory penalty.

<br />

```javascript [playground]
const isOdd = number => number % 2 == 1

const square = number => number ** 2

const manyNumbers = Array.from({ length: 1000 }, (_, i) => i)

const squaredOdds = pipe([
  filter(isOdd),
  map(square),
])

console.log(
  transform(squaredOdds, [])(manyNumbers),
) // [1, 9, 25, 36, 49, ...]
```

```coffeescript [specscript]
Reducer<T> = (any, T)=>Promise|any

Transducer = Reducer=>Reducer
```

<br />

A `Reducer` is a function that defines a relationship between an accumulator and any number of items, and is usually used with some reducing implementation, e.g. `Array.prototype.reduce`.

A `Transducer` is a function that takes a `Reducer` and returns another `Reducer`. Transducers enable chaining functionality on reducers - pass a reducer to a pipe of transducers to create a reducer with chained functionality. Imagine dominos falling over.

<br />

![dominoes.png](https://www.pngkit.com/png/detail/220-2206099_junior-alex-berlaga-helps-set-dominoes-world-records.png)

<br />

Note: Since the reducer that sets off a pipeline of transducers is called last, `pipe` behaves as `compose` and chains functions in reverse when a reducer is passed in data position. This decision is purly for API, and allows for all function pipelines created with `pipe`, even those of transducers, to read left to right.

The following operators are the core building blocks of rubico's transducer API. It is possible to perform the full spectrum of tranducer transformations with just these.

 * `map` - apply a mapper to each item of a reducing operation
 * `filter` - filter out items of a reducing operation by predicate
 * `flatMap` - apply a flatMapper to each item of a reducing operation, flattening each item of the result into the accumulator.

A transducer must be used with a reducing implementation to have a transducing effect. This library provides async-capable implementations as `transform` and `reduce`, though it's entirely possible to execute a synchronous transducer with `Array.prototype.reduce`.

The following example shows the function pipeline `squaredOdds` used as a transducer.

<br />

```javascript [playground]
const square = number => number ** 2

const isOdd = number => number % 2 == 1

const squaredOdds = pipe([
  filter(isOdd),
  map(square),
])

const manyNumbers = Array.from({ length: 1000 }, (_, i) => i)

console.log(
  transform(squaredOdds, [])(manyNumbers),
) // [1, 9, 25, 36, 49, ...]

const arrayConcat = (array, value) => array.concat(value)

console.log(
  manyNumbers.reduce(squaredOdds(arrayConcat), []),
) // [1, 9, 25, 36, 49, ...]
```

Due to rubico's polymorphic nature, any transducer not used in a reduce implementation is capable of eager transforomations. Below is an eager version of the above transformation.

```javascript [playground]
const square = number => number ** 2

const isOdd = number => number % 2 == 1

const squaredOdds = pipe([
  filter(isOdd),
  map(square),
])

const manyNumbers = Array.from({ length: 1000 }, (_, i) => i)

console.log(
  squaredOdds(manyNumbers),
) // [1, 9, 25, 36, 49, ...]
```

I'll leave you today with three places where transducers shine:
 1. chaining transforming operations
 2. transforming items of async iterables or potentially infinite sources
 3. modifying the functionality into an existing reducing operation


Photo credits:
 * https://www.pngkit.com/view/u2w7e6u2y3o0o0y3_junior-alex-berlaga-helps-set-dominoes-world-records/

Further reading:
 * https://tgvashworth.com/2014/08/31/csp-and-transducers.html
