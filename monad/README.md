# rubico/monad

This is a place for JavaScript monads.

Warning: this entire directory is experimental; APIs here are subject to change.

# Specification

Each rubico monad must return an object that implements `.chain`, `.flatMap`, `.then`, or have a combination of `.map` and `.concat`. Similarly, while `.empty` is not strictly required, there should be some notion of an empty instance of a Monad. For example, `[]` is `empty` for Arrays. All of these methods as well as any others are free to implement; only `.chain`, `.flatMap`, or `.then` is required. Monads should throw TypeErrors from the constructor for invalid types of arguments. rubico Monads should generally act on objects or primitive values and not functions. A Monad that acts on a function may be better for rubico/x.

```coffeescript [specscript]
Monad = (args ...any)=>({
  chain: function,
  flatMap: function,
  then: function,
  map: function,
  concat: function,
  empty: function,
})
```

## Monad.prototype.chain
```coffeescript [specscript]
monad Monad

monad.chain(any=>Monad|any) -> Monad
```

## Monad.prototype.flatMap
```coffeescript [specscript]
monad Monad

monad.flatMap(any=>Monad|any) -> Monad
```

## Monad.prototype.then
```coffeescript [specscript]
monad Monad

monad.then(any=>Monad|any) -> Monad
```

## Monad.prototype.map
```coffeescript [specscript]
monad Monad

monad.map(value=>any) -> Monad
```

## Monad.prototype.concat
```coffeescript [specscript]
monad Monad

monad.concat(Monad) -> Monad
```

## Monad.prototype.empty
```coffeescript [specscript]
monad Monad

monad.empty() -> Monad
```

# Example
A monad's effect is activated by calling its `.chain` method with `flatMap`.

```javascript
const Maybe = value => ({
  chain(func) {
    if (value) {
      func(value)
    }
    return this
  },
})

Maybe(null).chain(console.log)

Maybe('hello world').chain(console.log) // hello world
```

