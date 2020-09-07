# rubico/monad

This is a place for JavaScript monads.

Warning: this entire directory is experimental; APIs here are subject to change.

# Specification

Each rubico monad must be constructable via the `new` keyword and implement `.chain` on its prototype, while having some notion of `.map` and `.concat`. Similarly, `empty` is not strictly required, though there should be some notion of an empty instance of a Monad. For example, `[]` is `empty` for Arrays. All of these methods as well as any others are free to implement; only the constructor and `.chain` are required. Monads should throw TypeErrors from the constructor for invalid types of arguments.

## Monad constructor - required
```coffeescript but-not-really
new Monad(...any) -> Monad {...}
```

## Monad.prototype.chain - required
```coffeescript but-not-really
new Monad(value any).chain(
  flatMapper value=>(result Monad|any)) -> result
```

## Monad.prototype.map
```coffeescript
new Monad(value).map(mapper value=>Monad)
```

## Monad.prototype.concat
```coffeescript
new Monad(value any).concat(anotherMonad Monad) -> combinedMonad Monad
```

If a monad implements `.concat`, it can be transformed as a Semigroup with a transducer and `transform`.

```javascript
const { transform } = require('rubico')

const Max = function (number) {
  this.number = number
}

Max.prototype.concat = function (otherMax) {
  return new Max(Math.max(
    this.number,
    otherMax.constructor == Max ? otherMax.number : otherMax,
  ))
}

transform(
  map(Math.abs), new Max(-Infinity),
)([-1, -2, -3, -4, -5]) // Max { 5 }
```
