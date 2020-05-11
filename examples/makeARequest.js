const fetch = require('node-fetch')

// promise chains
fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(res => res.json())
  .then(data => console.log('promise chains', data)) // > {...}

// async/await
void (async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/1')
  const data = await res.json()
  console.log('async/await', data) // > {...}
})()

// rubico
const { pipe } = require('..')

pipe([
  fetch,
  res => res.json(),
  data => console.log('rubico', data), // > {...}
])('https://jsonplaceholder.typicode.com/todos/1')
