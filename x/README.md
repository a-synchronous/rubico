# x

rubico's library

## trace
logs data to console, returning data
```javascript
pipe([
  trace, // > hello
  message => `${message} world`,
  trace, // > hello world
])('hello')
```
