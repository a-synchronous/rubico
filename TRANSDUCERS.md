# Transducers
Transducers enable wrangling of very large or infinite streams of data in a composable and memory efficient way. Say you had `veryBigData` in an array

```javascript
const veryBigData = [/* many items in here */]

const veryBigFilteredData = veryBigData.filter(data => data.isBig === true)

const veryBigProcessedData = veryBigFilteredData.map(memoryIntensiveProcess)

console.log(veryBigProcessedData) // massive console.log
```

<br />

The above is not very memory efficient because of the intermediate arrays `veryBigFilteredData` and `veryBigProcessedData`. We're also logging out a large quantity of data at once to the console.

With rubico, you could express the above transformation as a single pass without incurring a memory penalty

<br />

```javascript
const dataIsBig = data => data.isBig

const Stdout = {
  concat(...args) {
    console.log(...args)
    return this
  }
}

const veryBigData = [/* many items in here */]

transform(
  pipe([
    filter(dataIsBig),
    map(memoryIntensiveProcess),
  ]),
  Stdout, // console.log by Stdout.concat
)(veryBigData) // -> Stdout
```

<br />

`pipe([filter(...), map(...)])` understands it is in transducer position, and behaves as a transducer, writing each data point to the console via `Stdout.concat`. By defining a self-referencing `.concat`, `Stdout` is regarded by `transform` as a Semigroup ([fantasy-land](https://github.com/fantasyland/fantasy-land#semigroup)). In general, `transform` acts on any vanilla JavaScript type with a notion of concatenation.

<br />

```coffeescript [specscript]
Reducer<T> = (any, T)=>Promise|any

Transducer = Reducer=>Reducer
```

<br />

A `Reducer` is a function that takes two arguments - one accumulator, and some item of a reducing operation - and returns anything. By default in rubico's `reduce`, Promises returned from reducers are resolved before supplying their value to the next iteration.

A `Transducer` is a function that takes a Reducer and returns another Reducer. This signature enables declarative, lazy processing of the items of a reducing operation. It also enables creating chained reducers by passing reducers to pipes of transducers. Imagine dominos falling over.

<br />

![dominoes.png](https://www.pngkit.com/png/detail/220-2206099_junior-alex-berlaga-helps-set-dominoes-world-records.png)

<br />

The reducer that sets off a chain of transducers is called last. Because of this implementation detail, rubico's `pipe` will behave as `compose` when passed a reducer. You can use `pipe` to create chained functionality for reducers - `pipe` will read left to right in all cases.

The following functions comprise the entirety of rubico's core transducer API.

 * `map` - map a function over items of a reducing operation
 * `filter` - filter out items from a reducing operation
 * `flatMap` - additionally flatten the result of a mapping of a function over items of a reducing operation

Note: the above functions also eagerly transform non-function values like Arrays.

The following example show correct usage of the transducer API.

<br />

```javascript
import { pipe, map, filter, transform } from 'rubico'

const square = number => number ** 2

const isOdd = number => number % 2 == 1

const squaredOdds = pipe([
  filter(isOdd),
  map(square),
])

transform(
  squaredOdds, [],
)([1, 2, 3, 4, 5]) // [1, 9, 25]

transform(
  squaredOdds, '',
)([1, 2, 3, 4, 5]) // '1925'

transform(
  squaredOdds, new Set(),
)([1, 2, 3, 4, 5]) // Set { 1, 9, 25 }

transform(
  squaredOdds, new Uint8Array(0),
)([1, 2, 3, 4, 5]) // Uint8Array(3) [1, 9, 25]

transform(
  squaredOdds, null,
)([1, 2, 3, 4, 5]) // null
```

<br />

The following example depicts an eager version of the above transformation - it does not use the transducer API.

<br />

```javascript
import { pipe, map, filter } from 'rubico'

const square = number => number ** 2

const isOdd = number => number % 2 == 1

const squaredOdds = pipe([
  filter(isOdd),
  map(square),
])

squaredOdds([1, 2, 3, 4, 5]) // [1, 9, 25]
```

<br />

By default, `concat` is the last step of a transforming operation. If customization of this functionality is required beyond the defaults for `transform`, `reduce` is another viable provider of rubico's transducer API. The only difference between `reduce` and `transform` is that you must provide the final concatenation step for `reduce`.

<br />

```javascript
import { pipe, map, filter, reduce } from 'rubico'

const square = number => number ** 2

const isOdd = number => number % 2 == 1

const arrayConcat = (array, values) => array.concat(values)

const squaredOdds = pipe([
  filter(isOdd),
  map(square),
])

reduce(
  squaredOdds(arrayConcat), [],
)([1, 2, 3, 4, 5]) // [1, 9, 25]
```

<br />

Further reading:
 * https://tgvashworth.com/2014/08/31/csp-and-transducers.html
