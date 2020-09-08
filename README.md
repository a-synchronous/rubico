# rubico
![rubico](https://raw.githubusercontent.com/a-synchronous/assets/master/rubico-logo-192x192.png)

&nbsp; &nbsp; a shallow river in northeastern Italy, just south of Ravenna

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
> At a certain point in my career, I grew frustrated with the entanglement of my own code. While looking for something better, I found functional programming. I was excited by the idea of functional composition, but disillusioned by the redundant hierarchy of effectful types. I started rubico to capitalize on the prior while rebuking the latter. Many iterations since then, the library has grown into something I personally enjoy using, and continue to use to this day.

rubico's value resides at the intersection of the following principles:
 * [asynchronous code should be simple](https://dev.to/richytong/rubico-a-synchrnous-functional-syntax-motivation-20hf)
 * functional style should not care about async
 * functional transformations should be composable, performant, and simple to express

When you use this library, you obtain the freedom that comes only from having those three points fulfilled. The result is something you may enjoy.

# Introduction
**rubico** is a powerful, flexible, and thoroughly benchmarked module of 24 higher order operators for async agnostic functional programming in JavaScript.

<br />

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

<br />

The style and naming conventions of rubico are idiomatic across languages and other libraries - using this library should feel second nature. Just like vanilla JavaScript operators, rubico operators act sensibly on sync or async JavaScript functions to create declarative, highly extensible, and async-enabled compositions.

<br />

```javascript
import { pipe, map } from 'rubico'

const toTodosUrl = id => 'https://jsonplaceholder.typicode.com/todos/' + id

const fetchedToJson = fetched => fetched.json()

const todoIDs = [1, 2, 3, 4, 5]

map(pipe([
  toTodosUrl,
  fetch,
  fetchedToJson,
  console.log,
]))(todoIDs) // here, we map an array
// { userId: 1, id: 4, title: 'et porro tempora', completed: true }
// { userId: 1, id: 1, title: 'delectus aut autem', completed: false }
// { userId: 1, id: 3, title: 'fugiat veniam minus', completed: false }
// { userId: 1, id: 2, title: 'quis ut nam facilis...', completed: false }
// { userId: 1, id: 5, title: 'laboriosam mollitia...', completed: false }
```

<br />

Functional compositions with rubico are flexible, and apply sensibly to a wide range of vanilla JavaScript types. This kind of flexibility is enabled in part by rubico's theoretical roots in traditional functional programming.

<br />

```javascript
const { pipe, map } = require('rubico')

const toTodosUrl = id => 'https://jsonplaceholder.typicode.com/todos/' + id

const fetchedToJson = fetched => fetched.json()

const todoIDsRange = function* (from, to) {
  for (let id = from; id <= to; id++) {
    yield id
  }
}

const logTodosRange = map(pipe([
  toTodosUrl,
  fetch,
  fetchedToJson,
  console.log,
]))(todoIDsRange) // here, map is applied to a generator function,
                  // returning a function that logs todos in a range

;[...logTodosRange(1, 100)]
// { userId: 1, id: 4, title: 'et porro tempora', completed: true }
// { userId: 1, id: 1, title: 'delectus aut autem', completed: false }
// ...
// ...
// { userId: 1, id: 100, title: 'hello world', completed: false }
```

<br />

For semantically related functionality, rubico provides variations for some of the operators as property functions, e.g. `map.pool` or `map.series`. When something goes wrong, rubico throws meaningful and ergonomic errors to aid in the debugging process. You should get started with rubico if you aspire to be a more effective programmer, write cleaner and more concise code, or harness the expressive power of functional programming in production.

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
