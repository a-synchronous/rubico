# rubico
🏞 a shallow river in northeastern Italy, just south of Ravenna

functional programming for humans

## Why?
- [monads are hard to explain](https://stackoverflow.com/questions/44965/what-is-a-monad)
- but I still want to program functionally

well you can, and rubico can help you do it. And no, you do not need to know what a monad is.

## Okay, show me some stuff
rubico's `flow` chains functions, sync or async, together. Let's get some json data.
```javascript
flow(
  fetch,
  response => response.json(),
  console.log,
)('https://jsonplaceholder.typicode.com/todos/1')
// > { userId: 1, id: 1, title: 'delectus aut autem', completed: false }
```

No variables. the above is a more expressive version of
```javascript
void (async (url) => {
  const response = await fetch(url)
  const data = await response.json()
  console.log(data)
})('https://jsonplaceholder.typicode.com/todos/1')
// > { userId: 1, id: 1, title: 'delectus aut autem', completed: false }
```

Chaining functions is cool, but you don't need a whole library to do that.

Let's make a post request. This time, rubico is namespaced to `_`.
```javascript
// url (string) => body (object) => response (object)
const makePostRequest = url => _.flow(
  JSON.stringify,
  _.diverge([
    url,
    _.diverge({
      method: 'POST',
      body: _.id,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }),
  ]),
  _.spread(fetch),
  response => response.json(),
)

const postToHttpBin = makePostRequest('https://httpbin.org/post')

_.flow(postToHttpBin, _.get('json'), console.log)({ a: 1 })
```

What's going on at a high level:
1. make a post request with body `{ a: 1 }` to http bin (`postToHttpBin`)
2. get the `json` prop of that response (`_.get('json')`)
3. log that value out to the console

What's going on in `postToHttpBin`:
1. partially apply 'https://httpbin.org/post' to `makePostRequest`,  
a higher order function that takes a url

What's going on in makePostRequest after applying `url`:
1. json stringify the input body (`JSON.stringify`)
2. create a structure that resembles `[url, { method, body, headers }]` (`_.diverge`)
3. spread that structure as arguments into fetch (`_.spread(fetch)`)
4. format the response payload (`response => response.json()`)

The powerful idea here is <b>functions as modules</b>; that you can solve a problem once,  
name it something you can remember, and use it anywhere you see fit.

These examples are but the tip of the iceburg. For more examples, see the `examples` folder.  
For the full documentation, please visit https://rubico.land
