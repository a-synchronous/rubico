# rubico
🏞 a shallow river in northeastern Italy, just south of Ravenna

a functional promise library

# Goals
1. enable functional programming in Javascript
2. simplify asynchronous programming in Javascript

# Examples
Make a request
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

Make multiple requests
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

// async await
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
