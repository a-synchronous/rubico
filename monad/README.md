# rubico/monad

This is a place for JavaScript monads.

Warning: this entire directory is experimental; APIs here are subject to change.

# Specification

Each rubico monad must return an object that implements `.chain`, while having some notion of `.map` and `.concat`. Similarly, while `.empty` is not strictly required, there should be some notion of an empty instance of a Monad. For example, `[]` is `empty` for Arrays. All of these methods as well as any others are free to implement; only `.chain` is required. Monads should throw TypeErrors from the constructor for invalid types of arguments. rubico Monads should generally act on objects or primitive values and not functions. A Monad that acts on a function may be better for rubico/x.

```coffeescript [specscript]
Monad = (args ...any)=>({
  chain: function,
  map: function?,
  concat: function?,
  empty: function?,
})
```

## Monad.prototype.chain - required
```coffeescript [specscript]
Monad(value any).chain(
  flatMapper value=>(result Monad|any)) -> result
```

## Monad.prototype.map
```coffeescript [specscript]
Monad(value any).map(mapper value=>any) -> mappedMonad Monad
```

## Monad.prototype.concat
```coffeescript [specscript]
Monad(value any).concat(anotherMonad Monad) -> combinedMonad Monad
```

## Monad.prototype.empty
```coffeescript [specscript]
Monad.empty() -> emptyMonad Monad
```

# Examples

A monad's effect is activated by calling its `.chain` method with `flatMap`.

```javascript
const { flatMap } = require('rubico')

const Maybe = value => ({
  chain(flatMapper) {
    return value == null ? value : flatMapper(value)
  },
})

flatMap(console.log)(Maybe(null))

flatMap(console.log)(Maybe('hello world')) // hello world
```

Additionally, if a monad implements `.concat`, it can be transformed as a Semigroup with a transducer and `transform`.

```javascript
const { transform } = require('rubico')

const Max = number => ({
  number,
  concat(value) {
    return Max(Math.max(
      number, value.constructor == Max ? value.number : value))
  },
})

transform(
  map(Math.abs), new Max(-Infinity),
)([-1, -2, -3, -4, -5]) // Max { 5 }
```
