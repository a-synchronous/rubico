# rubico/monad

This is a place for type constructors that are close in syntax to the constructors of the JavaScript language.

Each monad must implement on its prototype two methods
 * `.map` - `myMonad.map(mapper function) -> anotherMyMonad`
 * `.concat` - `myMonad.concat(anotherMyMonad) -> yetAnotherMyMonad`

Everything else is up to you.
