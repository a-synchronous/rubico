const fetch = require('node-fetch')

const todoIDs = [1, 2, 3, 4, 5]

// promise chains
Promise.resolve(todoIDs.filter(id => id <= 3))
  .then(filtered => Promise.all(filtered.map(
    id => `https://jsonplaceholder.typicode.com/todos/${id}`
  )))
  .then(urls => Promise.all(urls.map(url => fetch(url))))
  .then(responses => Promise.all(responses.map(res => res.json())))
  .then(data => data.map(x => console.log('promise chains', x))) // > {...} {...} {...}

// async await
void (async () => {
  const filtered = todoIDs.filter(id => id <= 3)
  const urls = await Promise.all(filtered.map(id => `https://jsonplaceholder.typicode.com/todos/${id}`))
  const responses = await Promise.all(urls.map(url => fetch(url)))
  const data = await Promise.all(responses.map(res => res.json()))
  data.map(x => console.log('async/await', x)) // > {...} {...} {...}
})()

const { pipe, map, filter, transform } = require('..')

// rubico
pipe([
  filter(id => id <= 3),
  map(id => `https://jsonplaceholder.typicode.com/todos/${id}`),
  map(fetch),
  map(res => res.json()),
  map(x => console.log('rubico', x)), // > {...} {...} {...}
])(todoIDs)

// transform - a special way to consume transducers
// transform(null, pipe(...))(x) transforms input x to null according to transducer pipe([...])
transform(pipe([
  filter(id => id <= 3),
  map(id => `https://jsonplaceholder.typicode.com/todos/${id}`),
  map(fetch),
  map(res => res.json()),
  map(x => console.log('transform', x)), // > {...} {...} {...}
]), null)(todoIDs)
