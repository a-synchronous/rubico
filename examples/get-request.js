const _ = require('..')
const fetch = require('node-fetch')

// string => object
_.flow(
  fetch,
  response => response.json(),
  _.trace,
)('https://jsonplaceholder.typicode.com/todos/1')

void (async (url) => {
  const response = await fetch(url)
  const returnValue = await response.json()
  console.log(returnValue)
})('https://jsonplaceholder.typicode.com/todos/1')
