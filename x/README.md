# rubico/x/

a home for programs created with rubico that prefer the rubico namespace

All modules in `rubico/x/` fall under the rubico namespace, which means you can use any `rubico/x/` module like
```javascript
const myUtil = require('rubico/x/my-util') // CommonJS

import myUtil from 'rubico/x/my-util' // ESM
```

# Documentation

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
// EXAMPLE
```

# Contributing
[See this issue](https://github.com/a-synchronous/rubico/issues/41)
