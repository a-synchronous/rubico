Welcome to the rubico tour. This tour covers high level concepts and provides runnable and editable code examples. All code areas have the rubico core methods imported globally.

```javascript [theme=default]
const {
  pipe, fork, assign,
  tap, tryCatch, switchCase,
  map, filter, reduce, transform, flatMap,
  any, all, and, or, not,
  eq, gt, lt, gte, lte,
  get, pick, omit,
} = rubico // available globally
```

# Table of Contents

 1. [[a]synchrony](#a-synchrony)
 2. [Function Composition](#function-composition)
 3. [Object Composition](#object-composition)
 4. [Polymorphism](#polymorphism)
 5. [Control Flow](#control-flow)
 6. [Error Handling](#error-handling)
 7. [Transducers](#transducers)

# [a]synchrony
**Stop worrying about async** - you can pass synchronous or asynchronous functions to any rubico method, hence the `[a]` (optionally asynchronous). All rubico methods handle promise resolution for you, meaning you can run things in parallel without having to call `Promise.all`. More on this behavior [here](https://dev.to/richytong/rubico-a-synchrnous-functional-syntax-motivation-20hf).

```javascript [playground]
const getTodo = id => fetch('https://jsonplaceholder.typicode.com/todos/' + id)

map(pipe([
  getTodo,
  res => res.json(),
  console.log,
]))([1, 2, 3, 4, 5]) // try adding a 6
```

# Function Composition
**Reduce code complexity** by chaining functions together with `pipe`. You can think about `pipe` as an analog to the Unix pipe, though with JavaScript functions instead of command line utilities. Enjoy less bugs, more code reuse, and easier maintenance by composing your application as a combination of smaller components via `pipe`.

```javascript [playground]
const square = number => number ** 2

const isOdd = number => number % 2 === 1

const add = (a, b) => a + b

const squaredOdds = pipe([
  filter(isOdd),
  map(square),
  // reduce(add), // try uncommenting this reducing function
])

const numbers = [1, 2, 3, 4, 5]

console.log('input:', numbers) // [1, 2, 3, 4, 5]
console.log('output:', squaredOdds(numbers)) // [1, 9, 25]
```

# Object Composition
**Declaratively massage object shape** to fit the next function in your pipeline. There may be times when you'll want to extend an object with new properties, or construct a new object from an existing one. For times like these, use the property accessor function `get` in conjunction with object composers `fork` or `assign`.

```javascript [playground]
const identity = value => value

const square = number => number ** 2

const double = number => number * 2

const add = (a, b) => a + b

const doMaths = pipe([
  fork({
    original: identity,
    doubled: double,
    squared: square,
  }),
  /* try uncommenting this assignment
  assign({
    total: pipe([
      fork([
        get('original'),
        get('doubled'),
        get('squared'),
      ]),
      reduce(add),
    ]),
  }),
  */
])

console.log('maths on 3:', doMaths(3)) // { original: 3, doubled: 6, squared: 9 }
```

# Polymorphism
**Act on any collection** - in addition to arrays, you can use `map` to transform async iterables, strings, sets, maps, binary arrays, and object values. This concept applies generally to any function of rubico; if a transformation + data structure pairing makes sense by math, it should be supported.

```javascript [playground]
const square = number => number ** 2

const iterables = [
  [1, 2, 3, 4, 5],
  '12345',
  new Set([1, 2, 3, 4, 5]),
  new Uint8Array([1, 2, 3, 4, 5]),
  { a: 1, b: 2, c: 3, d: 4, e: 5 },
  new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]]),
]

iterables.forEach(pipe([map(square), console.log]))
// [1, 2, 3, 4, 5]
// '1491625'
// Set { 1, 4, 9, 16, 25 }
// Uint8Array [1, 4, 9, 16, 25]
// { a: 1, b: 4, c: 9, d: 16, e: 25 }
// Map { 'a' => 1, 'b' => 4, 'c' => 9, 'd' => 16, 'e' => 25 }
```

# Control Flow
**Create declarative, SQL-esque logical expressions** by composing predicates with rubico's logical operators. Below is a map of vanilla JavaScript operators to their functional analogs in rubico.

* Conditional (Ternary), `a ? b : c` → `switchCase([f, g, h])`
* Logical And, `a && b` → `and([f, g])`
* Logical Or, `a || b` → `or([f, g])`
* Logical Not, `!a` → `not(f)`
* Identity, `a === b` → `eq(f, g)`
* Greater Than, `a > b` → `gt(f, g)`
* Less Than, `a < b` → `lt(f, g)`
* Greater Than or Equal, `a >= b` → `gte(f, g)`
* Less Than or Equal, `a <= b` → `lte(f, g)`

```javascript [playground]
const hasFlag = flag => array => array.includes(flag)

const log = message => () => console.log(message)

const cli = switchCase([
  or([
    hasFlag('-h'),
    hasFlag('--help'),
  ]), log('USAGE: ...'),
  or([
    hasFlag('-v'),
    hasFlag('--version'),
  ]), log('v0.0.0'),
  log('USAGE: ...'),
])

cli(['-h']) // USAGE: ...
cli(['--version']) // v0.0.0
cli(['???']) // USAGE: ...
```

# Error Handling
**Handle errors with functions** - a `tryer` and a `catcher`. The `tryer` is tried, while the `catcher` catches any errors thrown or Promises rejected.

```javascript [playground]
console.log(
  tryCatch(
    JSON.parse,
    error => ({ error, timestamp: Date.now() })
  )('hello')
)
// {
//   error: SyntaxError: Unexpected token h in JSON at position 0,
//   timestamp: number,
// }
```

# Transducers
**Wrangle large or infinite streams of data** with rubico's transducers. Create transducers via the transformation functions `map`, `filter`, or `flatMap`, then consume them with `reduce` or `transform`. Additionally, transducers created with rubico can act on asynchronous data streams or operate asynchronously. More on this behavior [here](https://github.com/a-synchronous/rubico/blob/master/TRANSDUCERS.md).

```javascript [playground]
// length number => string => Generator<string>
const generateSegmentsOfLength = length => function* (string) {
  for (let i = 0; i < string.length; i += length) {
    yield string.slice(i, i + length)
  }
}

// bigint -> string
const toBinaryString = value => value.toString(2)

// string -> number
const toBinaryInt = value => parseInt(value, 2)

// decimal string -> notes string
const decimalStringToNotes = pipe([
  BigInt,
  toBinaryString,
  generateSegmentsOfLength(7),
  transform(map(pipe([
    toBinaryInt,
    String.fromCharCode,
  ])), ''), // map(pipe([...])) is a transducer consumed by transform
])

console.log(
  decimalStringToNotes('16791573288892525934609440079317541905554393653557736896280802239551592289061061348368963')
) // CCGGAAGFFEEDDCGGFFEEDGGFFEEDCCGGAAGFFEEDDC
```

That concludes the rubico tour. From here, you could get started with rubico in a project ([installation](/#installation)) or read more at the [docs](/docs).
