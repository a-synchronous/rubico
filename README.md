# [rubico](https://rubico.land/)
![rubico](https://raw.githubusercontent.com/a-synchronous/assets/master/rubico-logo.png)
> a shallow river in northeastern Italy, just south of Ravenna

<br />

![Node.js CI](https://github.com/a-synchronous/rubico/workflows/Node.js%20CI/badge.svg?branch=master)
[![codecov](https://codecov.io/gh/a-synchronous/rubico/branch/master/graph/badge.svg)](https://codecov.io/gh/a-synchronous/rubico)
[![npm version](https://img.shields.io/npm/v/rubico.svg?style=flat)](https://www.npmjs.com/package/rubico)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Gitter](https://badges.gitter.im/Join_Chat.svg)](https://gitter.im/a-synchronous/rubico)

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

# Installation
[Core build](https://unpkg.com/rubico/index.js) ([~6.1 kB minified and gzipped](https://unpkg.com/rubico/dist/rubico.min.js))

with `npm`
```bash
npm i rubico
```

require `rubico` in Node.js
```javascript
const rubico = require('rubico')
const pipe = require('rubico/pipe')
const tap = require('rubico/tap')
const defaultsDeep = require('rubico/x/defaultsDeep')
```

import `rubico` globally
```html [htmlmixed]
<script src="https://unpkg.com/rubico"></script>
<script src="https://unpkg.com/rubico/dist/pipe.js"></script>
<script src="https://unpkg.com/rubico/dist/tap.js"></script>
<script src="https://unpkg.com/rubico/dist/x/defaultsDeep.js"></script>
<script>
console.log(rubico) // { pipe, tap, ... }
console.log(pipe) // [Function: pipe]
console.log(tap) // [Function: tap]
console.log(defaultsDeep) // [Function: defaultsDeep]
</script>

<!-- minified -->
<script src="https://unpkg.com/rubico/dist/rubico.min.js"></script>
<script src="https://unpkg.com/rubico/dist/pipe.min.js"></script>
<script src="https://unpkg.com/rubico/dist/tap.min.js"></script>
<script src="https://unpkg.com/rubico/dist/x/defaultsDeep.min.js"></script>
<script>
console.log(rubico) // { pipe, tap, ... }
console.log(pipe) // [Function: pipe]
console.log(tap) // [Function: tap]
console.log(defaultsDeep) // [Function: defaultsDeep]
</script>
```

import `rubico` in the browser via ES ([JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)) Modules
```javascript
import rubico from 'https://unpkg.com/rubico/dist/rubico.es.js'
import pipe from 'https://unpkg.com/rubico/dist/pipe.es.js'
import tap from 'https://unpkg.com/rubico/dist/tap.es.js'
import defaultsDeep from 'https://unpkg.com/rubico/dist/x/defaultsDeep.es.js'

// minified
import rubico from 'https://unpkg.com/rubico/dist/rubico.es.min.js'
import pipe from 'https://unpkg.com/rubico/dist/pipe.es.min.js'
import tap from 'https://unpkg.com/rubico/dist/tap.es.min.js'
import defaultsDeep from 'https://unpkg.com/rubico/dist/x/defaultsDeep.es.min.js'
```

import `rubico` as ESM in Node 16 and up
```javascript
import rubico from 'rubico/dist/rubico.mjs'
import pipe from 'rubico/dist/pipe.mjs'
import tap from 'rubico/dist/tap.mjs'
import defaultsDeep from 'rubico/dist/x/defaultsDeep.mjs'

// minified
import rubico from 'rubico/dist/rubico.min.mjs'
import pipe from 'rubico/dist/pipe.min.mjs'
import tap from 'rubico/dist/tap.min.mjs'
import defaultsDeep from 'rubico/dist/x/defaultsDeep.min.mjs'
```

# Motivation

A note from the author
> At a certain point in my career, I grew frustrated with the entanglement of my own code. While looking for something better, I found functional programming. I was excited by the idea of functional composition, but disillusioned by the redundancy of effectful types. I started rubico to capitalize on the prior while rebuking the latter. Many iterations since then, the library has grown into something I personally enjoy using, and continue to use to this day.

rubico is founded on the following principles:
 * asynchronous code should be simple
 * functional style should not care about async
 * functional transformations should be composable, performant, and simple to express

When you import this library, you obtain the freedom that comes from having those three points fulfilled. The result is something you may enjoy.

# Introduction

rubico is a module of twenty-nine operators for async-enabled functional programming in JavaScript.

```javascript
const {
  pipe, tap,
  switchCase, tryCatch,
  fork, assign, get, set, pick, omit,
  map, filter, reduce, transform, flatMap,
  and, or, not, any, all,
  eq, gt, lt, gte, lte,
  thunkify, always,
  curry, __,
} = rubico
```

These operators act sensibly on a wide range of vanilla JavaScript types to create declarative, extensible, and async-enabled function compositions.

```javascript [playground]
const { pipe, map } = rubico

const toTodosUrl = id => `https://jsonplaceholder.typicode.com/todos/${id}`

const logTodoByID = pipe([ // fetch a Todo and log it
  toTodosUrl,
  fetch,
  response => response.json(),
  console.log,
])

const todoIDs = [1, 2, 3, 4, 5]

map(logTodoByID)(todoIDs) // fetch Todos per id of TodoIDs and log them
// { userId: 1, id: 4, title: 'et porro tempora', completed: true }
// { userId: 1, id: 1, title: 'delectus aut autem', completed: false }
// { userId: 1, id: 3, title: 'fugiat veniam minus', completed: false }
// { userId: 1, id: 2, title: 'quis ut nam facilis...', completed: false }
// { userId: 1, id: 5, title: 'laboriosam mollitia...', completed: false }

// same as above but with limited concurrency
// map.pool(2, logTodoByID)(todoIDs)
```

For advanced asynchronous use cases, check out some of rubico's property functions:
 * `map` - apply a mapper function concurrently
 * `map.pool` - apply a mapper function concurrently with a concurrency limit
 * `map.series` - apply a mapper function serially

For even more advanced functions, please visit `rubico/x`. You can find the full method documentation at [rubico.land/docs](https://rubico.land/docs).

# Contributing
Your feedback and contributions are welcome. If you have a suggestion, please raise an issue. Prior to that, please search through the issues first in case your suggestion has been made already. If you decide to work on an issue, or feel like taking initiative and contributing anything at all, feel free to create a pull request and I will get back to you shortly.

Pull requests should provide some basic context and link the relevant issue. Here is an [example pull request](https://github.com/a-synchronous/rubico/pull/12). If you are interested in contributing, the [help wanted](https://github.com/a-synchronous/rubico/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) tag is a good place to start.

# License
rubico is [MIT Licensed](https://github.com/a-synchronous/rubico/blob/master/LICENSE).

# Support
 * minimum Node.js version: 12
 * minimum Chrome version: 63
 * minimum Firefox version: 57
 * minimum Edge version: 79
 * minimum Safari version: 11.1
