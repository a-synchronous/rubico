# rubico/x/

a home for programs created with rubico that prefer the rubico namespace

All modules in `rubico/x/` fall under the rubico namespace, which means you can use any `rubico/x/` module like
```javascript
const myUtil = require('rubico/x/my-util') // CommonJS

import myUtil from 'rubico/x/my-util' // ESM
```

# Documentation

### defaultsDeep
Deeply assigns defaults
```javascript
y = defaultsDeep(defaultObj, xk => boolean)(x)
```

`defaultObj` is an Object or Array

`xk` is an element of `x` or any nested Objects or Arrays of `x`

`xk => boolean` determines whether to assign a corresponding value from `defaultObj` in `y`

`xk => boolean` is optional (defaults to `xk => typeof xk !== 'undefined' && xk !== null`)

`x` is an Object or Array

`y` is `x` deeply defaulted by `defaultObj`

```javascript
defaultsDeep({
  a: 1,
  b: { c: 2 },
  e: [1, 2, { f: 3 }],
})({
  a: 1,
  b: { d: 3 },
  e: [1, 2, { g: 5 }],
}) /* {
  a: 1,
  b: { c: 2, d: 3 },
  e: [1, 2, { f: 3, g: 5 }],
} */
```

### find
get the first item in a collection that passes the test
```javascript
y = find(xi => boolean)(x)
```

`xi` is an element of `x`

`x` is an Iterable or Object

`y` is the first `xi` that passes the test `xi => boolean`

`y` is a Promise if any of the following is true
 * `xi => boolean` is asynchronous

```javascript
find(number => number > 2)([1, 2, 3]) // 3
find(number => number > 2)({ a: 1, b: 2, c: 3 }) // 3
```

### first
get the first element from a collection
```javascript
y = first(x)
```

### flatten
Create a new collection with all sub-collections concatenated
```javascript
y = flatten(x)
```
`x` is an Array or Set of anything or Iterables of anything

`y` is the concatenation of all sub-collections of `x`

```javascript
flatten([[1], [2], [3]]), // > [1, 2, 3]
```

`x` is a String or Array

`y` is the last item of `x`

```javascript
first([1,2,3]) // 1
```

### forEach
execute a function for each item of a collection, returning input
```javascript
y = forEach(f)(x)
```
`f` is a function

`f` is called for each item of `x`

`x` is an Iterable, AsyncIterable, Object, or reducer function

`y` is `x`

```javascript
forEach(console.log)([1, 2, 3])
// 1
// 2
// 3
// [1, 2, 3]

[1, 2, 3].reduce(
  forEach(console.log)((a, b) => a + b),
  0,
)
// 1
// 2
// 3
// 6
```

### isDeepEqual
left deeply equals right? eager version of eq.deep
```javascript
y = isDeepEqual(a, b)
```
`a` is anything but a function

`b` is anything but a function

`y` is a boolean, true if `a` deeply equals `b`

```javascript
isDeepEqual({ a: 1 }, { b: 2 }) // false
isDeepEqual(
  [1, 2, { a: new Set([3, 4, new Map([[5, { b: 6 }]])]) }],
  [1, 2, { a: new Set([3, 4, new Map([[5, { b: 6 }]])]) }],
) // true
isDeepEqual(
  [1, 2, { a: new Set([3, 4, new Map([[5, { b: 6 }]])]) }],
  [1, 2, { a: new Set([3, 4, new Map([[5, { b: 7 }]])]) }],
) // false
```

### isEmpty
Checks if a collection is empty
```javascript
y = isEmpty(x)
```
`x` is an Object, Array, String, Set, or Map

`y` is a boolean value, true if `x` is empty

```javascript
isEmpty({}) // true
isEmpty([1, 2, 3]) // false
isEmpty('hey') // false
isEmpty(0) // TypeError
```

### isEqual
left strictly equals right? eager version of [eq](https://doc.rubico.land/#eq)
```javascript
y = isEqual(a, b)
```
`a` is anything but a function

`b` is anything but a function

`y` is a boolean, true if `a` strictly equals `b`

```javascript
isEqual({}, {}) // false
isEqual(1, 1) // true
```

### is
directly checks the constructor
```javascript
y = is(constructor)(x)
```

`constructor` is any function

`x` is anything

`y` is a boolean

```javascript
is(Array)([]) // true
is(Array)({}) // false
is(Object)([]) // false
```

### isObject
is object?
```javascript
y = isObject(x)
```
`x` is anything

`y` is a boolean, True if `x` is directly an Object

```javascript
isObject({}) // true
isObject([]) // false
```

### isString
is string?
```javascript
y = isString(x)
```
`x` is anything

`y` is a boolean, True if `x` is a string

```javascript
isString('hey') // true
isString(1) // false
isString(new String('ayo')) // true
```

### last
get the last element from a collection
```javascript
y = last(x)
```

`x` is a String or Array

`y` is the last item of `x`

```javascript
last([1,2,3]) // 3
```

### pluck
create a new collection by getting a path from every item of an old collection
```javascript
y = pluck(path, defaultValue)(x)
```
`path` is a Number, String, dot-deliminated String, or Array

`defaultValue` is anything, including a function

if `defaultValue` is a function, it is lazily evaluated with `x`

`x` is an Iterable, AsyncIterable, Object, or reducer function

```javascript
pluck('a.b')([{ a: { b: 1 } }, { a: { b: 2 } }]) // [1, 2]

transform(pluck('a'), () => [])([{ a: 1 }, { a: 2 }, { a: 3 }]) // [1, 2, 3]
```

### trace
logs data to console, returning data
```javascript
y = trace(x)
```

`y` is `x`

console logs `x`

```javascript
pipe([
  trace, // > hello
  message => `${message} world`,
  trace, // > hello world
])('hello')
```

### timeInLoop
times a function's synchronous completion with a loop
```javascript
time = timeInLoop(numLoops, f)
```
`numLoops` is a number and specifies the number of loops to call `f`

`f` is a function. While looping, `f` is called with no arguments as `f()`

`time` is the amount of time in milliseconds elapsed between the first and last call of `f`

```javascript
timeInLoop(1e6, () => 'yo') // 3
```

### tracef
logs transformed data to console, returning original data
```javascript
y = tracef(f)(x)
```

`y` is `x`

console logs `f(x)`

```javascript
pipe([
  tracef(x => x.name), // > george
  tracef(x => x.location), // > the jungle
])({ name: 'george', location: 'the jungle' })
```

### unionWith
create a flattened unique array with uniques given by a binary predicate
```javascript
y = unionWith((a, b) => boolean)(x)
```
`a` and `b` are items of items of `x`

`(a, b) => boolean` returns True if a and b are duplicates

`x` is an Array of Arrays of anything

`y` is a flattened Array of unique items of items of `x` determined by `(a, b) => boolean`

`y` is a Promise if any of the following are true
 * `(a, b) => boolean` is asynchronous

```javascript
unionWith((a, b) => a.a === b.a)([
  [{ a: 1 }, { a: 2 }],
  [{ a: 2 }, { a: 3 }],
  [{ b: 5 }, { a: 5 }],
]) // [{ a: 1 }, { a: 2 }, { a: 3 }, { b: 5 }, { a: 5 }]
```

### uniq

*uniq* returns an array with unique values.

```javascript
result = uniq(arr)
```

`arr` and `result` are Arrays


```javascript
uniq([1, 2, 2, 3]) // [1, 2, 3]
```

# Contributing
**Additions to this list are welcome and encouraged!**. If you have a suggestion, open a new issue as `rubico/x/your-suggested-module`.

project structure
```
x/
  yourUtilHere.js
  yourUtilHere.test.js - uses mocha, run this with `npm test`
```

Requirements for modules in `rubico/x/`
 * must work in node environment
 * must include a documentation entry following this format

### METHOD
DESCRIPTION
```javascript
// SIGNATURE
```
RULES
```javascript
// EXAMPLE
```
