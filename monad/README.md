# rubico/monad

This is a place for JavaScript monads.

Each monad must implement the following two methods on its prototype
 * `.map` - `myMonad.map(mapper function) -> anotherMyMonad`
 * `.concat` - `myMonad.concat(anotherMyMonad|any) -> combinedMyMonad`
