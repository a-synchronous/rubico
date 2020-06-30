# rubico/x/

a home for programs that prefer the rubico namespace and are either
 * commonly used with rubico
 * created with rubico

## trace
logs data to console, returning data
```javascript
pipe([
  trace, // > hello
  message => `${message} world`,
  trace, // > hello world
])('hello')
```

## tracef
logs transformed data to console, returning original data
```javascript
pipe([
  tracef(x => x.name), // > george
  tracef(x => x.location), // > the jungle
])({ name: 'george', location: 'the jungle' })
```

## METHOD
DESCRIPTION
```javascript
// EXAMPLE
```
