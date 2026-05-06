# Monad

This is a place for JavaScript monads.

Warning: this entire directory is experimental; APIs here are subject to change.

# Specification

Each monad must have a way to wrap one or more values, either using the constructor or using the `of` method.

Each monad must implement the `chain`, `flatMap`, or `then` methods, or have a combination of the `map` and `concat` methods. Similarly, while `empty` is not strictly required, there should be some notion of an empty instance of a Monad. For example, `[]` is `empty` for Arrays. All of these methods as well as any others not listed may be implemented; only the `chain`, `flatMap`, or `then` methods and the constructor or `of` methods are required.

Each monad should throw TypeErrors from the constructor for invalid types of arguments.

## Monad constructor
```coffeescript [specscript]
new Monad(...arguments) -> Monad {
  of: function,
  chain: function,
  flatMap: function,
  then: function,
  map: function,
  concat: function,
}
```

## Monad of method
```coffeescript [specscript]
Monad.of(...arguments) -> Monad {
  of: function,
  chain: function,
  flatMap: function,
  then: function,
  map: function,
  concat: function,
}
```

## Monad chain method
```coffeescript [specscript]
monad Monad

monad.chain(any=>(Monad|any)) -> Monad
```

## Monad flatMap method
```coffeescript [specscript]
monad Monad

monad.flatMap(any=>(Monad|any)) -> Monad
```

## Monad then method
```coffeescript [specscript]
monad Monad

monad.then(any=>(Monad|any)) -> Monad
```

## Monad map method
```coffeescript [specscript]
monad Monad

monad.map(any=>any) -> Monad
```

## Monad concat method
```coffeescript [specscript]
monad Monad

monad.concat(Monad) -> Monad
```

## Monad empty method
```coffeescript [specscript]
Monad.empty() -> Monad
```

# Example
A monad's effect is activated by calling its `chain` method with a function.

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

