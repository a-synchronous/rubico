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

### METHOD
DESCRIPTION
```javascript
// SIGNATURE
```
RULES
```javascript
// EXAMPLE
```

# Contributing
[See this issue](https://github.com/a-synchronous/rubico/issues/41)
