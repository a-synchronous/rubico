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

