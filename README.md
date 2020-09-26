# rubico
![rubico](https://raw.githubusercontent.com/a-synchronous/assets/master/rubico-logo.png)
> a shallow river in northeastern Italy, just south of Ravenna

<br />

![Node.js CI](https://github.com/a-synchronous/rubico/workflows/Node.js%20CI/badge.svg?branch=master)
[![codecov](https://codecov.io/gh/a-synchronous/rubico/branch/master/graph/badge.svg)](https://codecov.io/gh/a-synchronous/rubico)

### [a]synchronous functional programming

```javascript [playground]
const { pipe, map, filter } = rubico

const isOdd = number => number % 2 == 1

const asyncSquare = async number => number ** 2

const squaredOdds = pipe([
  filter(isOdd),
  map(asyncSquare),
])

squaredOdds([1, 2, 3, 4, 5]).then(console.log) // [1, 9, 25]
```

A note from the author
> At a certain point in my career, I grew frustrated with the entanglement of my own code. While looking for something better, I found functional programming. I was excited by the idea of functional composition, but disillusioned by the redundancy of effectful types. I started rubico to capitalize on the prior while rebuking the latter. Many iterations since then, the library has grown into something I personally enjoy using, and continue to use to this day.

rubico is founded on the following principles:
 * asynchronous code should be simple
 * functional style should not care about async
 * functional transformations should be composable, performant, and simple to express

When you import this library, you obtain the freedom that comes from having those three points fulfilled. The result is something you may enjoy.

# Introduction

rubico is a module of twenty-four operators for [a]synchronous functional programming in JavaScript.

```javascript [theme=default]
const {
  pipe, fork, assign,
  tap, tryCatch, switchCase,
  map, filter, reduce, transform, flatMap,
  any, all, and, or, not,
  eq, gt, lt, gte, lte,
  get, pick, omit,
} = rubico
```

These operators act sensibly on a wide range of vanilla JavaScript types to create declarative, extensible, and async-enabled function compositions.

```javascript [playground]
const { pipe, map } = rubico

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

For different but semanticaly related functionality, rubico exposes additional methods as property functions. For example,

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
```bash [theme=default]
npm i rubico
```

browser script, global `rubico`
```html [theme=default]
<script src="https://unpkg.com/rubico"></script>
```

browser module
```javascript [theme=default]
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
