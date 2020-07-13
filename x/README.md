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
