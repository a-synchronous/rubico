# rubico/monad

This is a place for JavaScript monads.

Each monad must implement the following two methods on its prototype
 * `.map` - `myMonad.map(mapper function) -> anotherMyMonad`
 * `.concat` - `myMonad.concat(anotherMyMonad|any) -> combinedMyMonad`

While `.empty` is not strictly required, there should be some notion of an empty instance of a given monad. For example, `[]` is `empty` for Arrays.
