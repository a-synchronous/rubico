# Transducers
Transducers enable composable and memory efficient wrangling of very large or infinite sets of data. Say you wanted to square just the odd numbers from 1 - 1000.

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

`manyNumbers` above goes through two batch transformations from `.filter` and `.map`. It is not very memory efficient. With transducers, you could express the above transformation as a single pass without incurring a memory penalty.

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

A `Reducer` is a function that takes an accumulator and some item of a reducing operation and returns anything.

A `Transducer` is a function that takes a Reducer and returns another Reducer. This signature enables declarative, lazy processing of the items of a reducing operation. It also enables creating chained reducers by passing reducers to pipes of transducers. Imagine dominos falling over.

<br />

![dominoes.png](https://www.pngkit.com/png/detail/220-2206099_junior-alex-berlaga-helps-set-dominoes-world-records.png)

<br />

The reducer that sets off a chain of transducers is called last. Because of this implementation detail, `pipe` will behave as `compose` when passed a reducer. You can use `pipe` to create chained functionality for reducers - `pipe` will read left to right in all cases.

The following operators are the core building blocks of rubico's transducer API. It is possible to perform the full spectrum of tranducer transformations with just these.

 * `map` - map a function over items of a reducing operation
 * `filter` - filter out items from a reducing operation
 * `flatMap` - additionally flatten the result of a mapping of a function over items of a reducing operation

Due to rubico's polymorphism, transducers must be used with reducing implementations to have a transducing effect. This library provides async-capable implementations as `transform` and `reduce`, though it's entirely possible to execute a synchronous transducer with `Array.prototype.reduce`.

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

<br />

The below is an eager version of the above - `squaredOdds` is not a transducer below because it is not used with a reducing operation.

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
  squaredOdds(manyNumbers),
) // [1, 9, 25, 36, 49, ...]
```

<br />

Dominos photo credits:
 * https://www.pngkit.com/view/u2w7e6u2y3o0o0y3_junior-alex-berlaga-helps-set-dominoes-world-records/

Further reading:
 * https://tgvashworth.com/2014/08/31/csp-and-transducers.html
