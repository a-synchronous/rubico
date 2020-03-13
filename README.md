# rubico
🏞 a shallow river in northeastern Italy, just south of Ravenna

functional programming for humans

## Why?
- [monads are hard to explain](https://stackoverflow.com/questions/44965/what-is-a-monad)
- current functional programming constructs are [impractical](https://ramdajs.com/docs/#andThen)
- but I still want to program functionally

well you can, and rubico can help you do it. And no, you do not need to know what a monad is.

## Okay, show me some stuff
rubico's `flow` executes functions specified in its arguments sequentially,  
plugging in the return value from one function directly into the next function  
regardless of whether the function returns a promise.

Let's get some json data with just functions.
```javascript
flow(
  fetch,
  response => response.json(),
  console.log,
)('https://jsonplaceholder.typicode.com/todos/1')
// > { userId: 1, id: 1, title: 'delectus aut autem', completed: false }
```

The above block executes `fetch`, `response => response.json()`, and `console.log`  
in sequence. The url 'https://jsonplaceholder.typicode.com/todos/1' is passed to  
fetch, the return value of which is passed to `response => response.json()`,  
and so forth. it is the more expressive version of
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
  JSON.stringify, // (5)
  _.diverge([ // (6)
    url,
    _.diverge({
      method: 'POST',
      body: _.id,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }),
  ]),
  _.spread(fetch), // (7)
  response => response.json(), // (8)
)

const postToHttpBin = makePostRequest('https://httpbin.org/post') // (4)

_.flow(
  postToHttpBin, // (1)
  _.get('json'), // (2)
  console.log, // (3)
)({ a: 1 })
```

What's going on at a high level:  
(1) make a post request with body `{ a: 1 }` to http bin  
(2) get the `json` prop of that response  
(3) log that value out to the console  

What's going on in `postToHttpBin`:  
(4) partially apply 'https://httpbin.org/post' to `makePostRequest`,  
a higher order function that takes a url

What's going on in `makePostRequest` after applying `url`:  
(5) json stringify the input body  
(6) create a structure with stringified body that resembles `[url, { method, body, headers }]`  
(7) spread that structure as arguments into fetch  
(8) format the response payload  

The powerful idea here is <b>functions as modules</b>; that you can solve a problem once,  
name it something you can remember, and use it anywhere you see fit.

That's the gist of it. For more examples, see the `examples` folder.  
For the full documentation, please visit [rubico.land](https://rubico.land)
