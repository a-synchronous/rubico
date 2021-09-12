## v1.8.1 - latest
 * map supplies key and reference to original value for sets
 * filter supplies key and reference to original value for sets

## v1.8.0
 * map supplies index/key and reference to original value for arrays, objects, and maps
 * filter supplies index/key and reference to original value for arrays, objects, and maps
 * reduce supplies index/key and reference to original value for arrays, objects, and maps
 * reduce object performance improvements

## v1.7.3
 * x/append - [#190](https://github.com/a-synchronous/rubico/pull/190/files) - [FredericHeem](https://github.com/FredericHeem)
 * x/prepend - [#190](https://github.com/a-synchronous/rubico/pull/190/files) - [FredericHeem](https://github.com/FredericHeem)
 * x/unless - [#190](https://github.com/a-synchronous/rubico/pull/190/files) - [FredericHeem](https://github.com/FredericHeem)

## v1.7.2
 * fix syntax error on nullish defaultItem in defaultsDeep - [#189](https://github.com/a-synchronous/rubico/pull/189/files) - [FredericHeem](https://github.com/FredericHeem)

## v1.7.1
 * x/when [#188](https://github.com/a-synchronous/rubico/pull/188) - [FredericHeem](https://github.com/FredericHeem)

## v1.7.0
 * set and pick nested properties [#187](https://github.com/a-synchronous/rubico/pull/187) - [FredericHeem](https://github.com/FredericHeem)

## v1.6.30
 * defaultsDeep handle undefined [#186](https://github.com/a-synchronous/rubico/pull/186) - [FredericHeem](https://github.com/FredericHeem)

## v1.6.29
 * fix syntax issue with map filter iterators and async iterators

## v1.6.28
 * stop supporting node 10

## v1.6.22
 * x/callProp

## v1.6.17
 * x/has
 * x/includes

## v1.6.16
 * fix omit throwing on nullish

## v1.6.15
 * omit supports nested fields [#181](https://github.com/a-synchronous/rubico/pull/181)

## v1.6.13
 * map.entries
 * License (MIT) and Chat (Gitter) readme badges
 * fix x/trace altering output
 * patch transform - strings and binary correspond 1 character = 1 byte
 * patch internal/binaryExtend - construct Buffers as per Node.js warning

## v1.6.11
 * fix: tap.if handles promises in its executor

## v1.6.10
 * and defers to `.and` if method is present
 * or defers to `.or` if method is present
 * not defers to `.not` if method is present
 * eq defers to `.eq` if method is present
 * gt defers to `.gt` if method is present
 * lt defers to `.lt` if method is present
 * gte defers to `.gte` if method is present
 * lte defers to `.lte` if method is present
 * eq compares by SameValueZero
 * isDeepEqual compares by SameValueZero
 * isObject checks for language type Object

## v1.6.9 - latest
 * x/groupBy
 * x/values

## v1.6.8
 * fix: assign creates a new object on Promise

## v1.6.6
 * new distribution setup
 * x/differenceWith

## v1.6.0
 * curry
 * __
 * thunkify
 * always
 * project structure reorganization around `_internal/`
 * new generated documentation format
 * x/size rewrite + refresh benchmarks
 * x/find works on all foldables
 * x/forEach rewrite + benchmarks
 * x/defaultsDeep rewrite + refresh benchmarks
 * x/flatten rewrite + refresh benchmarks
 * x/isDeepEqual rewrite + refresh benchmarks
 * x/unionWith rewrite + refresh benchmarks
 * better pipe performance
 * fix: x/isDeepEqual was throwing for nullish
 * **map.own** - [LMulvey](https://github.com/LMulvey)

## v1.5.19 - latest
 * pipe.sync

## v1.5.18
 * fix: Set and Map mapping

## v1.5.17
 * fix: string mapping

## v1.5.16
 * tap.if

## v1.5.15
 * get rewrite + benchmarks
 * pick rewrite + benchmarks
 * omit rewrite + benchmarks
 * not rewrite + benchmarks
 * any rewrite + benchmarks
 * all rewrite + benchmarks
 * and rewrite + benchmarks
 * or rewrite + benchmarks
 * eq rewrite + benchmarks
 * gt rewrite + benchmarks
 * lt rewrite + benchmarks
 * gte rewrite + benchmarks
 * lte rewrite + benchmarks

## v1.5.14
 * fix: flatMap async muxing

## v1.5.13
 * flatMap rewrite + benchmarks
 * improved tryCatch performance
 * improved switchCase performance

## v1.5.12
 * transform rewrite + benchmarks

## v1.5.11
 * x/heapUsedInLoop - max and avg heap used in loop
 * monad/Cancellable - make a function return cancellable Promises
 * deprecated x/tracef
 * x/trace(reducer) - lazy trace, good for adding custom formatting
 * reduce rewrite + benchmarks
 * tap accepts multiple arguments + more benchmarks

## v1.5.10
 * filter.withIndex rewrite + benchmarks
 * monad/BrokenPromise - a Promise that never comes back
 * isEmpty stops throwing TypeErrors

## v1.5.9
 * filter rewrite + benchmarks
 * map.series rewrite + benchmarks
 * map.pool rewrite + benchmarks
 * map.withIndex rewrite + benchmarks

## v1.5.8
 * fix a failing test; node10 AsyncIterator constructors were Objects

## v1.5.7
 * map rewrite + benchmarks

## v1.5.6
 * fork rewrite + benchmarks
 * fork.series rewrite + benchmarks
 * assign rewrite + benchmarks
 * tap rewrite + benchmarks
 * tryCatch rewrite + benchmarks
 * switchCase rewrite + benchmarks
 * switchCase supports even numbers of functions

## v1.5.5
 * pipe rewrite + benchmarks

## v1.5.3
 * x/uniq - export in x/index

## v1.5.2
 * x/unionWith performance revamp + benchmarks
 * x/uniq - Get unique values of a collection - [FredericHeem](https://github.com/FredericHeem)

## v1.5.0
 * monad/PossiblePromise - Possibly a promise
 * monad/Instance - Type checking
 * monad/Struct - Finite data structure
 * monad/Mux - Multiplexing for Sequences of Sequences
 * x/size - Get the size of a collection
 * x/isFunction - Tell if Function
 * x/timeInLoop.async - Like timeInLoop, but await all calls
 * x/find performance revamp + benchmarks
 * x/defaultsDeep performance revamp + benchmarks
 * x/flatten performance revamp + benchmarks
 * x/isDeepEqual performance revamp + benchmarks
 * x/isEmpty performance revamp + benchmarks
 * x/isEqual performance revamp + benchmarks
 * x/isObject performance revamp + benchmarks
 * x/isString performance revamp + benchmarks
 * x/first performance revamp + benchmarks
 * x/last performance revamp + benchmarks
 * improve PossiblePromise.args stack trace
 * fine tune PossiblePromise performance
 * fine tune core performance

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
