# rubico
🏞 a shallow river in northeastern Italy, just south of Ravenna

![Node.js CI](https://github.com/a-synchronous/rubico/workflows/Node.js%20CI/badge.svg?branch=master)
[![codecov](https://codecov.io/gh/a-synchronous/rubico/branch/master/graph/badge.svg)](https://codecov.io/gh/a-synchronous/rubico)

[a]synchronous functional programming

```javascript
import { pipe, map, filter } from 'rubico'

const isOdd = x => x % 2 === 1

const square = x => x ** 2

pipe([
  filter(isOdd),
  map(square),
])([1, 2, 3, 4, 5]) // [1, 9, 25]

const asyncSquare = async x => x ** 2

pipe([
  filter(isOdd),
  map(asyncSquare),
])([1, 2, 3, 4, 5]) // Promise { [1, 9, 25] }
```

# Motivation
A note from the author
> At a certain point in my career, I grew frustrated with the entanglement of my own code. While looking for something better, I found functional programming. I was excited by the idea of functional composition, but disillusioned by the complex hierarchy of effectful types. I started rubico to capitalize on the prior while rebuking the latter. Many iterations since then, the library has grown into something I personally enjoy using, and continue to use to this day.

rubico's value resides at the intersection of the following principles:
 * [asynchronous code should be simple](https://dev.to/richytong/rubico-a-synchrnous-functional-syntax-motivation-20hf)
 * functional style should not care about async
 * functional transformations should be composable, performant, and simple to express

When you use this library, you obtain the freedom that comes only from having those three points fulfilled. The result is something you may enjoy.

# Introduction
rubico is a robust, highly optimized syntax for async agnostic functional programming in JavaScript. The style and naming of the syntax is idiomatic across languages and other libraries; using this library should feel second nature. Just like regular vanilla JavaScript syntax and operators, rubico operates predictably on vanilla JavaScript types. When you use this library, you can stop worrying about the complex fluff of Promise management. When something goes wrong, rubico throws meaningful and ergonomic errors. You should use this library if you want to become a better programmer, write cleaner and more concise code, or harness the expressive power of functional programming in production.

Here are my recommendations for getting started.
 1. [check out the docs](https://doc.rubico.land)
 2. [take the tour](https://tour.rubico.land)
 3. use rubico in a project
 4. at your leisure, [peruse the awesome resources](#awesome-resources)
 5. [help with rubico](https://github.com/a-synchronous/rubico/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)

# API
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
## Beginner
 * [Practical Functional Programming in JavaScript - Why it's worth it](https://dev.to/richytong/practical-functional-programming-in-javascript-why-it-s-worth-it-ep1)
 * [Practical Functional Programming in JavaScript - Data last](https://dev.to/richytong/practical-functional-programming-in-javascript-data-last-1gjo)
 * [Practical Functional Programming in JavaScript - Side Effects and Purity](https://dev.to/richytong/practical-functional-programming-in-javascript-side-effects-and-purity-1838)
 * [Practical Functional Programming in JavaScript - Intro to Transformation](https://dev.to/richytong/practical-functional-programming-in-javascript-intro-to-transformation-55hm)
 * [Practical Functional Programming in JavaScript - Techniques for Composing Data](https://dev.to/richytong/practical-functional-programming-in-javascript-techniques-for-composing-data-c39)

## Advanced
 * [Practical Functional Programming in JavaScript - Transducers](#transducers)

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
