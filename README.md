# rubico
🏞 a shallow river in northeastern Italy, just south of Ravenna

a functional promise library

## Introduction
Asynchronous programming in JavaScript has evolved over the years

> In the beginning, there were [callbacks](http://callbackhell.com)
```javascript
function doAsyncThings(a, cb) {
  doAsyncThingA(a, function(errA, b) {
    if (errA) return cb(errA)
    doAsyncThingB(b, function(errB, c) {
      if (errB) return cb(errB)
      doAsyncThingC(c, function(errC, d) {
        if (errC) return cb(errC)
        doAsyncThingD(d, function(errD, e) {
          if (errD) return cb(errD)
          doAsyncThingE(e, function(errE, f) {
            if (errE) return cb(errE)
            cb(null, f)
          })
        })
      })
    })
  })
}
```

To stay within maximum line lengths, we created
[Promises](https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Promise)

> Then began the chains of `then`
```javascript
const doAsyncThings = a => doAsyncThingA(a)
  .then(b => doAsyncThingB(b))
  .then(c => doAsyncThingC(c))
  .then(d => doAsyncThingD(d))
  .then(e => doAsyncThingE(e))
```

This was fine until we started to miss variables and `try catch`

> [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), the latest in asynchrony
```javascript
const doAsyncThings = async a => {
  const b = await doAsyncThingA(a)
  const c = await doAsyncThingB(b)
  const d = await doAsyncThingC(c)
  const e = await doAsyncThingD(d)
  const f = await doAsyncThingE(e)
  return f
}
```

async and await ruled my life until I discovered two hard things:
[cache invalidation and naming things](https://martinfowler.com/bliki/TwoHardThings.html)

at that point, I was like
> Maybe life would be nicer if I didn't have to name so many things

> I wonder if there's a way to do async/await but without variables

which eventually led to
> What if I just took the output of one function and just piped it into another?

> hmm, looks like they have a thing for that already called functional programming

> whoa, functional programming sounds cool, but monads seem a bit... esoteric

> ugh, I just want to chain stuff together without learning category theory

and now, async things in rubico
```javascript
import { pipe } from 'rubico'

const doAsyncThings = pipe([
  doAsyncThingA,
  doAsyncThingB,
  doAsyncThingC,
  doAsyncThingD,
  doAsyncThingE,
])
```

## Goals
rubico, a functional (programming) promise library, has two:
1. simplify asynchronous programming in JavaScript
2. enable functional programming in JavaScript

the rest of this document is examples, documentation, and more examples.

# Examples
### Make a request
```javascript
// promise chains
fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(res => res.json())
  .then(console.log) // > {...}

// async/await
void (async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/1')
  const data = await res.json()
  console.log(data) // > {...}
})()

// rubico
import { pipe } from 'rubico'

pipe([
  fetch,
  res => res.json(),
  console.log, // > {...}
])('https://jsonplaceholder.typicode.com/todos/1')
```

### Make multiple requests
```javascript
const todoIDs = [1, 2, 3, 4, 5]

// promise chains
Promise.resolve(todoIDs.filter(id => id <= 3))
  .then(filtered => Promise.all(filtered.map(
    id => `https://jsonplaceholder.typicode.com/todos/${id}`
  )))
  .then(urls => Promise.all(urls.map(fetch)))
  .then(responses => Promise.all(responses.map(res => res.json())))
  .then(data => data.map(x => console.log(x))) // > {...} {...} {...}

// async/await
void (async () => {
  const filtered = todoIDs.filter(id => id <= 3)
  const urls = await Promise.all(filtered.map(id => `https://jsonplaceholder.typicode.com/todos/${id}`))
  const responses = await Promise.all(urls.map(fetch))
  const data = await Promise.all(responses.map(res => res.json()))
  data.map(x => console.log(x)) // > {...} {...} {...}
})()

// rubico
import { pipe, map, filter } from 'rubico'

pipe([
  filter(id => id <= 3),
  map(id => `https://jsonplaceholder.typicode.com/todos/${id}`),
  map(fetch),
  map(res => res.json()),
  map(console.log), // > {...} {...} {...}
])(todoIDs)
```

# Documentation
rubico exports 23 functions

[pipe](https://github.com/richytong/rubico#pipe)
[fork](https://github.com/richytong/rubico#fork)
[assign](https://github.com/richytong/rubico#assign)

[tap](https://github.com/richytong/rubico#tap)
[tryCatch](https://github.com/richytong/rubico#tryCatch)
[ternary](https://github.com/richytong/rubico#ternary)

[map](https://github.com/richytong/rubico#map)
[filter](https://github.com/richytong/rubico#filter)
[reduce](https://github.com/richytong/rubico#reduce)
[transform](https://github.com/richytong/rubico#transform)

[get](https://github.com/richytong/rubico#get)
[pick](https://github.com/richytong/rubico#pick)
[omit](https://github.com/richytong/rubico#omit)

[any](https://github.com/richytong/rubico#any)
[all](https://github.com/richytong/rubico#all)

[and](https://github.com/richytong/rubico#and)
[or](https://github.com/richytong/rubico#or)
[not](https://github.com/richytong/rubico#not)

[eq](https://github.com/richytong/rubico#eq)
[gt](https://github.com/richytong/rubico#gt)
[lt](https://github.com/richytong/rubico#lt)
[gte](https://github.com/richytong/rubico#gte)
[lte](https://github.com/richytong/rubico#lte)


## pipe
## fork
## assign
## tap
## tryCatch
## ternary
## map
## filter
## reduce
## transform
## get
## pick
## omit
## any
## all
## and
## or
## not
## eq
## gt
## lt
## gte
## lte

# More Examples
### Sync vs async

### Transducers

### A larger program
