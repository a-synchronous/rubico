## v1.5.0
 * monad/PossiblePromise - Possibly a promise
 * monad/Instance - Type checking
 * monad/Flattenable - Flattening things
 * monad/Struct - Finite data structure
 * x/find performance revamp + benchmarks
 * x/defaultsDeep performance revamp + benchmarks
 * x/flatten performance revamp + benchmarks
 * x/isDeepEqual performance revamp + benchmarks
 * x/isEmpty performance revamp + benchmarks
 * x/isEqual performance revamp + benchmarks
 * improve PossiblePromise.args stack trace

## v1.3.2
 * x/defaultsDeep - enforce Array or Object inputs

## v1.3.0
 * large rubico core refactor (~75% done) to PossiblePromise
 * large rubico core documentation initiative (~75% done)
 * rubico/x/index.js for comfier times with rubico/x
 * benchmark groundwork (and, or, and switchCase)
 * x/timeInLoop - measures time a function takes in a loop
 * flatMap includes unflattenable elements instead of throwing

## v1.2.5
 * tap no longer transduces; use map(tap) or x/forEach instead if you want to use tap in a transducer

## v1.2.2
 * x/isEmpty - check if a collection is empty
 * x/first - get first item from a collection
 * x/last - get last item from a collection

## v1.2.0
 * flatMap; map + flatten
 * transform(f, init), reduce(f, init); init can be a function
 * x/defaultsDeep - deeply assign defaults
 * x/isDeepEqual - left deeply equals right? eager version of eq.deep
 * x/find - get the first item in a collection that passes the test
 * x/forEach - execute a function for each item of a collection, returning input
 * x/is - directly checks the constructor
 * x/isEqual - left strictly equals right? eager version of eq
 * x/isObject - is object?
 * x/isString - is string?
 * x/pluck - create a new collection by getting a path from every item of an old collection
 * x/unionWith - create a flattened unique array with uniques given by a binary predicate
