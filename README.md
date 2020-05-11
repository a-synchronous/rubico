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

// rubico - pipe, map
import { pipe, map, filter } from 'rubico'

pipe([
  filter(id => id <= 3),
  map(id => `https://jsonplaceholder.typicode.com/todos/${id}`),
  map(fetch),
  map(res => res.json()),
  map(console.log), // > {...} {...} {...}
])(todoIDs)

// rubico - transform + transducer
import { pipe, map, filter, transform } from 'rubico'

transform(null, pipe([
  filter(id => id <= 3),
  map(id => `https://jsonplaceholder.typicode.com/todos/${id}`),
  map(fetch),
  map(res => res.json()),
  map(console.log), // > {...} {...} {...}
]))(todoIDs)
```

# Documentation
