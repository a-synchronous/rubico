const { pipe, map, transform } = require('rubico')
const fetch = require('node-fetch')

const toTodosUrl = id => 'https://jsonplaceholder.typicode.com/todos/' + id

const fetchedToJson = fetched => fetched.json()

const fetchTodo = pipe([
  toTodosUrl,
  fetch,
  fetchedToJson,
])

const Stdout = {
  concat(...args) {
    console.log(...args)
    return this
  }
}

const todoIDsRange = function* (from, to) {
  for (let id = from; id <= to; id++) {
    yield id
  }
}

const logTodosRange = transform(
  map(fetchTodo), Stdout,
)(todoIDsRange)

logTodosRange(1, 100)
