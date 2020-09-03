# rubico/monad

This is a place for JavaScript monads.

Each monad must implement on its prototype three methods
 * `.map` - `myMonad.map(mapper function) -> anotherMyMonad`
 * `.concat` - `myMonad.concat(anotherMyMonad) -> yetAnotherMyMonad`
 * `.empty` - `myMonad.empty() -> emptyMyMonad`
