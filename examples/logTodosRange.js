const { pipe, map } = require('rubico')
const fetch = require('node-fetch')

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
]))(todoIDsRange)

;[...logTodosRange(1, 100)]
