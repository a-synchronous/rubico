## v1.5.0
 * PossiblePromise - Possibly a promise

## v1.3.2
 * rubico/x/defaultsDeep - enforce Array or Object inputs

## v1.3.0
 * large rubico core refactor (~75% done) to PossiblePromise
 * large rubico core documentation initiative (~75% done)
 * rubico/x/index.js for comfier times with rubico/x
 * benchmark groundwork (and, or, and switchCase)
 * rubico/x/timeInLoop - measures time a function takes in a loop
 * flatMap includes unflattenable elements instead of throwing

## v1.2.5
 * tap no longer transduces; use map(tap) or rubico/x/forEach instead if you want to use tap in a transducer

## v1.2.2
 * rubico/x/isEmpty - check if a collection is empty
 * rubico/x/first - get first item from a collection
 * rubico/x/last - get last item from a collection

## v1.2.0
 * flatMap; map + flatten
 * transform(f, init), reduce(f, init); init can be a function
 * rubico/x/defaultsDeep - deeply assign defaults
 * rubico/x/isDeepEqual - left deeply equals right? eager version of eq.deep
 * rubico/x/find - get the first item in a collection that passes the test
 * rubico/x/forEach - execute a function for each item of a collection, returning input
 * rubico/x/is - directly checks the constructor
 * rubico/x/isEqual - left strictly equals right? eager version of eq
 * rubico/x/isObject - is object?
 * rubico/x/isString - is string?
 * rubico/x/pluck - create a new collection by getting a path from every item of an old collection
 * rubico/x/unionWith - create a flattened unique array with uniques given by a binary predicate
