# rubico
![rubico](https://raw.githubusercontent.com/a-synchronous/assets/master/rubico-logo.png)
> a shallow river in northeastern Italy, just south of Ravenna

<br />

![Node.js CI](https://github.com/a-synchronous/rubico/workflows/Node.js%20CI/badge.svg?branch=master)
[![codecov](https://codecov.io/gh/a-synchronous/rubico/branch/master/graph/badge.svg)](https://codecov.io/gh/a-synchronous/rubico)

### [a]synchronous functional programming

<br />

```javascript
import { pipe, map, filter } from 'rubico'

const isOdd = number => number % 2 == 1

const square = number => number ** 2

const squaredOdds = pipe([
  filter(isOdd),
  map(square),
])

console.log(
  squaredOdds([1, 2, 3, 4, 5]),
) // [1, 9, 25]

const asyncSquare = async number => number ** 2

const asyncSquaredOdds = pipe([
  filter(isOdd),
  map(asyncSquare),
])

asyncSquaredOdds([1, 2, 3, 4, 5]).then(console.log) // [1, 9, 25]
```

# Motivation
A note from the author
> At a certain point in my career, I grew frustrated with the entanglement of my own code. While looking for something better, I found functional programming. I was excited by the idea of functional composition, but disillusioned by the redundancy of effectful types. I started rubico to capitalize on the prior while rebuking the latter. Many iterations since then, the library has grown into something I personally enjoy using, and continue to use to this day.

rubico is founded on the following principles:
 * [asynchronous code should be simple](https://dev.to/richytong/rubico-a-synchrnous-functional-syntax-motivation-20hf)
 * functional style should not care about async
 * functional transformations should be composable, performant, and simple to express

When you use this library, you obtain the freedom that comes from having those three points fulfilled. The result is something you may enjoy.

# Introduction
rubico is a module of 24 operators for [a]synchronous functional programming in JavaScript.

```javascript
const {
  pipe, fork, assign,
  tap, tryCatch, switchCase,
  map, filter, reduce, transform, flatMap,
  any, all, and, or, not,
  eq, gt, lt, gte, lte,
  get, pick, omit,
} = rubico
```

The style and naming conventions of rubico are idiomatic across languages and other libraries - using this library should feel second nature. Just like vanilla JavaScript operators, rubico's operators act sensibly on sync or async JavaScript functions to create declarative, highly extensible, and async-enabled compositions.

```javascript
import { pipe, map } from 'rubico'

const toTodosUrl = id => 'https://jsonplaceholder.typicode.com/todos/' + id

const fetchedToJson = fetched => fetched.json()

const logTodoByID = pipe([ // fetch a Todo and log it
  toTodosUrl,
  fetch,
  fetchedToJson,
  console.log,
])

const todoIDs = [1, 2, 3, 4, 5]

map(logTodoByID)(todoIDs) // fetch Todos per id of TodoIDs and log them
// { userId: 1, id: 4, title: 'et porro tempora', completed: true }
// { userId: 1, id: 1, title: 'delectus aut autem', completed: false }
// { userId: 1, id: 3, title: 'fugiat veniam minus', completed: false }
// { userId: 1, id: 2, title: 'quis ut nam facilis...', completed: false }
// { userId: 1, id: 5, title: 'laboriosam mollitia...', completed: false }
```

Functional compositions with rubico are flexible, and apply sensibly to the full spectrum of vanilla JavaScript types. This kind of flexibility is enabled by newer language features like `Symbol.iterator` and `Symbol.asyncIterator`.

```javascript
import { pipe, map } from 'rubico'

const toTodosUrl = id => 'https://jsonplaceholder.typicode.com/todos/' + id

const fetchedToJson = fetched => fetched.json()

const logTodoByID = pipe([ // fetch a Todo and log it
  toTodosUrl,
  fetch,
  fetchedToJson,
  console.log,
])

const todoIDsRange = function* (from, to) {
  for (let id = from; id <= to; id++) {
    yield id
  }
}

const logTodosRange = map(logTodoByID)(todoIDsRange)
// the Todos aren't logged here yet because mapping a generator function
// returns another generator function with all values mapped

;[...logTodosRange(1, 100)]
// { userId: 1, id: 4, title: 'et porro tempora', completed: true }
// { userId: 1, id: 1, title: 'delectus aut autem', completed: false }
// ...
// ...
// { userId: 5, id: 100, title: 'excepturi a et neque...', completed: false }
```

Code reuse by category theory enables similar semantics when working with reducers. The following example uses transducers (`reducer=>reducer`) and a Semigroup `Stdout` to accomplish the same transformation as above with purer functional programming.

```javascript
import { pipe, map, transform } from 'rubico'

const toTodosUrl = id => 'https://jsonplaceholder.typicode.com/todos/' + id

const fetchedToJson = fetched => fetched.json()

const fetchTodo = pipe([
  toTodosUrl,
  fetch,
  fetchedToJson,
])

const Stdout = {
  concat(...args) {
    console.log(...args)
    return this
  }
}

const asyncTodoIDsRange = async function* (from, to) { // async because why not
  for (let id = from; id <= to; id++) {
    yield id
  }
}

const transformTodosToStdoutRange = transform(
  map(fetchTodo), Stdout)(asyncTodoIDsRange)

transformTodosToStdoutRange(1, 100)
// { userId: 1, id: 4, title: 'et porro tempora', completed: true }
// { userId: 1, id: 1, title: 'delectus aut autem', completed: false }
// ...
// ...
// { userId: 1, id: 100, title: 'excepturi a et neque...', completed: false }
```

rubico exposes semantically related methods of its core API as property functions. For example,

 * `map` - apply a mapper function concurrently
 * `map.pool` - apply a mapper function concurrently with a concurrency limit
 * `map.series` - apply a mapper function serially

Advanced functions may be found in `rubico/x`.

# Getting Started
 1. [check out the docs](https://doc.rubico.land)
 2. [take the tour](https://tour.rubico.land)
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

browser module
```javascript
import rubico from 'https://unpkg.com/rubico/es.js'
```

### System Requirements
 * minimum node version: 10.3
 * minimum Chrome version: 63
 * minimum Firefox version: 57
 * minimum Edge version: 79
 * minimum Safari version: 11.1

# Awesome Resources
 * [Practical Functional Programming in JavaScript - Why it's worth it](https://dev.to/richytong/practical-functional-programming-in-javascript-why-it-s-worth-it-ep1)
 * [Practical Functional Programming in JavaScript - Data last](https://dev.to/richytong/practical-functional-programming-in-javascript-data-last-1gjo)
 * [Practical Functional Programming in JavaScript - Side Effects and Purity](https://dev.to/richytong/practical-functional-programming-in-javascript-side-effects-and-purity-revised-420h)
 * [Practical Functional Programming in JavaScript - Intro to Transformation](https://dev.to/richytong/practical-functional-programming-in-javascript-intro-to-transformation-55hm)
 * [Practical Functional Programming in JavaScript - Techniques for Composing Data](https://dev.to/richytong/practical-functional-programming-in-javascript-techniques-for-composing-data-c39)
 * [Practical Functional Programming in JavaScript - Control Flow](https://dev.to/richytong/practical-functional-programming-in-javascript-control-flow-2fim)
 * [Practical Functional Programming in JavaScript - Error Handling](https://dev.to/richytong/practical-functional-programming-in-javascript-error-handling-8g5)
 * [Transducers](https://github.com/a-synchronous/rubico/blob/master/TRANSDUCERS.md)

# Contributing
Your feedback and contributions are welcome. If you have a suggestion, please raise an issue. Prior to that, please search through the issues first in case your suggestion has been made already. If you decide to work on an issue, please announce on the issue thread that you will work on it.

Pull requests should provide some basic context and link the relevant issue. Here is an [example pull request](https://github.com/a-synchronous/rubico/pull/12). If you are interested in contributing, the [help wanted](https://github.com/a-synchronous/rubico/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) tag is a good place to start.

# License
rubico is [MIT Licensed](https://github.com/a-synchronous/rubico/blob/master/LICENSE).
