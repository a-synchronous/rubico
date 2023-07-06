declare module "Transducer" {
    /**
     * @name Transducer.pipe
     *
     * @description
     * Composes transducers
     */
    export function pipe(): void;
    /**
     * @name Transducer.map
     *
     * @description
     * Create a mapping transducer by supplying `map` with a reducer. A reducer is a variadic function that depicts a relationship between an accumulator and any number of arguments. A transducer is a function that accepts a reducer as an argument and returns another reducer.
     *
     * ```coffeescript [specscript]
     * Reducer<T> = (any, T)=>Promise|any
     *
     * Transducer = Reducer=>Reducer
     * ```
     *
     * The transducer signature enables chaining functionality for reducers. `map` is core to this mechanism, and provides a way via transducers to transform items of reducers. To `map`, reducers are just another category.
     *
     * ```javascript [playground]
     * const square = number => number ** 2
     *
     * const concat = (array, item) => array.concat(item)
     *
     * const mapSquare = map(square)
     * // mapSquare could potentially be a transducer, but at this point, it is
     * // undifferentiated and not necessarily locked in to transducer behavior.
     *
     * console.log(
     *   mapSquare([1, 2, 3, 4, 5]),
     * ) // [1, 4, 9, 16, 25]
     *
     * const squareConcatReducer = mapSquare(concat)
     * // now mapSquare is passed the function concat, so it assumes transducer
     * // position. squareConcatReducer is a reducer with chained functionality
     * // square and concat.
     *
     * console.log(
     *   [1, 2, 3, 4, 5].reduce(squareConcatReducer, []),
     * ) // [1, 4, 9, 16, 25]
     *
     * console.log(
     *   [1, 2, 3, 4, 5].reduce(squareConcatReducer, ''),
     * ) // '1491625'
     * ```
     *
     */
    export function map(): void;
    /**
     * @name Transducer.filter
     *
     * @description
     * A reducer in filterable position creates a filtering reducer - one that skips items of the reducer's reducing operation if they test falsy by the predicate. It is possible to use an asynchronous predicate when filtering a reducer, however the implementation of `reduce` must support asynchronous operations. This library provides such an implementation as `reduce`.
     *
     * ```javascript [playground]
     * const isOdd = number => number % 2 == 1
     *
     * const concat = (array, item) => array.concat(item)
     *
     * const concatOddNumbers = filter(isOdd)(concat)
     *
     * console.log(
     *   [1, 2, 3, 4, 5].reduce(concatOddNumbers, []),
     * ) // [1, 3, 5]
     * ```
     */
    export function filter(): void;
    /**
     * @name Transducer.flatMap
     *
     * @synopsis
     * ```coffeescript [specscript]
     * flatMap(flatMapper)(reducer) -> Reducer<T>
     * ```
     *
     * @description
     * Additionally, `flatMap` is a powerful option when working with transducers. A flatMapping transducer applies a flatMapper to each item of a reducer's reducing operation, calling each item of each execution with the reducer.
     *
     * ```javascript [playground]
     * const isOdd = number => number % 2 == 1
     *
     * const powers = number => [number, number ** 2, number ** 3]
     *
     * const oddPowers = pipe([
     *   filter(isOdd),
     *   flatMap(powers),
     * ])
     *
     * const arrayConcat = (array, value) => array.concat(value)
     *
     * console.log(
     *   reduce(oddPowers(arrayConcat), [])([1, 2, 3, 4, 5]),
     * ) // [1, 1, 1, 3, 9, 27, 5, 25, 125]
     * ```
     *
     * In the case above, each item of the array of numbers returned by `powers` is called with the reducer `arrayConcat` for flattening into the final result.
     */
    export function flatMap(): void;
}
declare module "_internal/placeholder" {
    export = __;
    const __: unique symbol;
}
declare module "__" {
    export = __;
    import __ = require("_internal/placeholder");
}
declare module "_internal/isArray" {
    export = isArray;
    /**
     * @name isArray
     *
     * @synopsis
     * isArray(value any) -> boolean
     *
     * @description
     * Determine whether a value is an array.
     */
    const isArray: (arg: any) => arg is any[];
}
declare module "_internal/curry3" {
    export = curry3;
    /**
     * @name curry3
     *
     * @synopsis
     * ```coffeescript [specscript]
     * __ = Symbol('placeholder')
     *
     * curry3(
     *   baseFunc function,
     *   arg0 __|any,
     *   arg1 __|any,
     *   arg2 __|any
     * ) -> function
     * ```
     *
     * @description
     * Curry a 3-ary function.
     *
     * Note: exactly one argument must be the placeholder
     */
    function curry3(baseFunc: any, arg0: any, arg1: any, arg2: any): (arg0: any) => any;
}
declare module "_internal/isPromise" {
    export = isPromise;
    /**
     * @name isPromise
     *
     * @synopsis
     * isPromise(value any) -> boolean
     *
     * @description
     * Determine whether a value is a promise.
     */
    function isPromise(value: any): boolean;
}
declare module "_internal/promiseAll" {
    export = promiseAll;
    /**
     * @name promiseAll
     *
     * @synopsis
     * promiseAll(Iterable<Promise|any>) -> Promise<Array>
     *
     * @description
     * Dereferenced Promise.all
     */
    const promiseAll: any;
}
declare module "_internal/callPropUnary" {
    export = callPropUnary;
    /**
     * @name callPropUnary
     *
     * @synopsis
     * ```coffeescript [specscript]
     * callPropUnary(
     *   value object,
     *   property string,
     *   arg0 any,
     * ) -> value[property](arg0)
     * ```
     *
     * @description
     * Call a property function on a value with a single argument.
     */
    function callPropUnary(value: any, property: any, arg0: any): any;
}
declare module "_internal/arrayAll" {
    export = arrayAll;
    /**
     * @name arrayAll
     *
     * @synopsis
     * ```coffeescript [specscript]
     * arrayAll(array Array, predicate ...any=>boolean) -> boolean
     * ```
     */
    function arrayAll(array: any, predicate: any): any;
}
declare module "_internal/iteratorAll" {
    export = iteratorAll;
    /**
     * @name iteratorAll
     *
     * @synopsis
     * ```coffeescript [specscript]
     * iteratorAll(iterator Iterator, predicate ...any=>boolean) -> boolean
     * ```
     *
     * @TODO use .next() calls
     */
    function iteratorAll(iterator: any, predicate: any): any;
}
declare module "_internal/SelfReferencingPromise" {
    export = SelfReferencingPromise;
    /**
     * @name SelfReferencingPromise
     *
     * @synopsis
     * ```coffeescript [specscript]
     * SelfReferencingPromise(basePromise Promise<T>) -> Promise<[T, basePromise]>
     * ```
     */
    function SelfReferencingPromise(basePromise: any): any;
}
declare module "_internal/promiseRace" {
    export = promiseRace;
    /**
     * @name promiseRace
     *
     * @synopsis
     * promiseRace(Iterable<Promise|any>) -> firstResolvedOrRejected Promise
     *
     * @description
     * Dereferenced Promise.race
     */
    const promiseRace: any;
}
declare module "_internal/asyncIteratorAll" {
    export = asyncIteratorAll;
    /**
     * @name asyncIteratorAll
     *
     * @synopsis
     * var T any,
     *   asyncIterator AsyncIterator<T>,
     *   predicate T=>Promise|boolean,
     *   promisesInFlight Set<Promise<[T, Promise]>>,
     *   maxConcurrency number
     *
     * asyncIteratorAll(
     *   asyncIterator, predicate, promisesInFlight, maxConcurrency,
     * ) -> Promise<boolean>
     */
    function asyncIteratorAll(asyncIterator: any, predicate: any, promisesInFlight: any, maxConcurrency?: number): Promise<boolean>;
}
declare module "_internal/objectValues" {
    export = objectValues;
    /**
     * @name objectValues
     *
     * @synopsis
     * objectValues<T>(object Object<T>) -> Array<T>
     *
     * @description
     * Dereferenced `Object.values`
     */
    const objectValues: any;
}
declare module "_internal/reducerAllSync" {
    export = reducerAllSync;
    /**
     * @name reducerAllSync
     *
     * @synopsis
     * ```coffeescript [specscript]
     * reducerAllSync(predicate any=> boolean, result boolean, item any) -> boolean
     * ```
     */
    function reducerAllSync(predicate: any, result: any, item: any): any;
}
declare module "_internal/reducerAll" {
    export = reducerAll;
    /**
     * @name reducerAll
     *
     * @synopsis
     * ```coffeescript [specscript]
     * reducerAll(
     *   predicate any=>boolean,
     * ) -> reducer(result boolean, item any)=>boolean
     * ```
     */
    function reducerAll(predicate: any): (result: any, item: any) => any;
}
declare module "_internal/symbolIterator" {
    export = symbolIterator;
    /**
     * @name symbolIterator
     *
     * @synopsis
     * symbolIterator = Symbol.iterator
     *
     * @description
     * Dereferenced `Symbol.iterator`
     */
    const symbolIterator: symbol;
}
declare module "_internal/symbolAsyncIterator" {
    export = symbolAsyncIterator;
    /**
     * @name symbolAsyncIterator
     *
     * @synopsis
     * symbolAsyncIterator = Symbol.asyncIterator
     *
     * @description
     * Dereferenced `Symbol.asyncIterator`
     */
    const symbolAsyncIterator: any;
}
declare module "all" {
    export = all;
    /**
     * @name all
     *
     * @synopsis
     * ```coffeescript [specscript]
     * type Foldable = Iterable|AsyncIterable|Object
     *
     * all(predicate function)(collection Foldable) -> result Promise|boolean
     * ```
     *
     * @description
     * Test a predicate concurrently across all items of a collection, returning true if all predications are truthy.
     *
     * ```javascript [playground]
     * const isOdd = number => number % 2 == 1
     *
     * console.log(
     *   all(isOdd)([1, 2, 3, 4, 5]),
     * ) // false
     *
     * console.log(
     *   all(isOdd)([1, 3, 5]),
     * ) // true
     * ```
     *
     * The collection can be any iterable, async iterable, or object values iterable collection. Below is an example of `all` accepting an async generator as the collection.
     *
     * ```javascript [playground]
     * const asyncNumbers = async function* () {
     *   yield 1; yield 2; yield 3; yield 4; yield 5
     * }
     *
     * all(async number => number < 6)(asyncNumbers()).then(console.log) // true
     * ```
     *
     * @execution concurrent
     *
     * @muxing
     */
    function all(predicate: any): (value: any) => any;
}
declare module "_internal/always" {
    export = always;
    /**
     * @name always
     *
     * @synopsis
     * ```coffeescript [specscript]
     * always(value any) -> getter ()=>value
     * ```
     *
     * @description
     * Create a function that always returns a value.
     */
    function always(value: any): () => any;
}
declare module "always" {
    export = always;
    import always = require("_internal/always");
}
declare module "_internal/thunkConditional" {
    export = thunkConditional;
    /**
     * @name thunkConditional
     *
     * @synopsis
     * ```coffeescript [specscript]
     * thunkConditional<
     *   conditionalExpression boolean,
     *   thunkOnTruthy ()=>any,
     *   thunkOnFalsy ()=>any,
     * >(conditionalExpression, thunkOnTruthy, thunkOnFalsy) -> any
     * ```
     *
     * @description
     * Like the conditional operator `a ? b : c` but for thunks.
     */
    function thunkConditional(conditionalExpression: any, thunkOnTruthy: any, thunkOnFalsy: any): any;
}
declare module "_internal/areAllValuesNonfunctions" {
    export = areAllValuesNonfunctions;
    /**
     * @name areAllValuesNonfunctions
     *
     * @synopsis
     * ```coffeescript [specscript]
     * areAllValuesNonfunctions(values Array<function|value>) -> boolean
     * ```
     */
    function areAllValuesNonfunctions(values: any): boolean;
}
declare module "_internal/thunkify2" {
    export = thunkify2;
    /**
     * @name thunkify2
     *
     * @synopsis
     * ```coffeescript [specscript]
     * thunkify2<
     *   arg0 any,
     *   arg1 any,
     *   func (arg0, arg1)=>any,
     * >(func, arg0, arg1) -> thunk ()=>func(arg0, arg1)
     * ```
     *
     * @description
     * Create a thunk from a function and two arguments.
     */
    function thunkify2(func: any, arg0: any, arg1: any): () => any;
}
declare module "_internal/thunkify3" {
    export = thunkify3;
    /**
     * @name thunkify3
     *
     * @synopsis
     * ```coffeescript [specscript]
     * thunkify3<
     *   arg0 any,
     *   arg1 any,
     *   arg2 any,
     *   func (arg0, arg1, arg2)=>any,
     * >(func, arg0, arg1, arg2) -> thunk ()=>func(arg0, arg1, arg2)
     * ```
     *
     * @description
     * Create a thunk from a function and three arguments.
     */
    function thunkify3(func: any, arg0: any, arg1: any, arg2: any): () => any;
}
declare module "and" {
    export = and;
    /**
     * @name and
     *
     * @synopsis
     * ```coffeescript [specscript]
     * and(values Array<boolean>) -> result boolean
     *
     * and(
     *   predicatesOrValues Array<function|boolean>
     * )(value any) -> result Promise|boolean
     * ```
     *
     * @description
     * Tests an array of boolean values, returning true if all boolean values are truthy.
     *
     * ```javascript [playground]
     * const oneIsLessThanThree = 1 < 3
     * const twoIsGreaterThanOne = 2 > 1
     * const threeIsEqualToThree = 3 === 3
     *
     * console.log(
     *   and([oneIsLessThanThree, twoIsGreaterThanOne, threeIsEqualToThree]),
     * ) // true
     * ```
     *
     * If any values in the array are synchronous or asynchronous predicate functions, `and` takes another argument to test concurrently against the predicate functions, returning true if all array values and resolved values from the predicates are truthy.
     *
     * ```javascript [playground]
     * const isOdd = number => number % 2 == 1
     *
     * const isPositive = number => number > 0
     *
     * const isLessThan3 = number => number < 3
     *
     * console.log(
     *   and([isOdd, isPositive, isLessThan3])(1),
     * ) // true
     * ```
     *
     * @execution series
     *
     * @note ...args slows down here by an order of magnitude
     */
    function and(predicates: any): any;
}
declare module "_internal/arrayAny" {
    export = arrayAny;
    /**
     * @name arrayAny
     *
     * @synopsis
     * ```coffeescript [specscript]
     * arrayAny(
     *   array Array,
     *   predicate any=>Promise|boolean,
     * ) -> boolean
     * ```
     */
    function arrayAny(array: any, predicate: any): boolean | Promise<boolean>;
}
declare module "_internal/asyncIteratorAny" {
    export = asyncIteratorAny;
    /**
     * @name asyncIteratorAny
     *
     * @synopsis
     * ```coffeescript [specscript]
     * asyncIteratorAny(
     *   iterator Iterator|AsyncIterator,
     *   predicate any=>Promise|boolean,
     *   index number,
     *   promisesInFlight Set<Promise>,
     *   maxConcurrency number=20,
     * ) -> boolean
     * ```
     */
    function asyncIteratorAny(iterator: any, predicate: any, promisesInFlight: any, maxConcurrency?: number): Promise<boolean>;
}
declare module "_internal/iteratorAny" {
    export = iteratorAny;
    /**
     * @name iteratorAny
     *
     * @synopsis
     * ```coffeescript [specscript]
     * iteratorAny(
     *   iterator Iterator,
     *   predicate any=>Promise|boolean,
     * ) -> boolean
     * ```
     */
    function iteratorAny(iterator: any, predicate: any): boolean | Promise<boolean>;
}
declare module "_internal/reducerAnySync" {
    export = reducerAnySync;
    /**
     * @name reducerAnySync
     *
     * @synopsis
     * ```coffeescript [specscript]
     * reducerAnySync(predicate T=>boolean) -> anyReducer (any, any)=>any
     * ```
     */
    function reducerAnySync(predicate: any): (result: any, item: any) => any;
}
declare module "_internal/curry2" {
    export = curry2;
    /**
     * @name curry2
     *
     * @synopsis
     * ```coffeescript [specscript]
     * __ = Symbol('placeholder')
     *
     * curry2(
     *   baseFunc function,
     *   arg0 __|any,
     *   arg1 __|any,
     * ) -> function
     * ```
     *
     * @description
     * Curry a binary function.
     *
     * Note: exactly one argument must be the placeholder
     */
    function curry2(baseFunc: any, arg0: any, arg1: any): (arg0: any) => any;
}
declare module "_internal/reducerAny" {
    export = reducerAny;
    /**
     * @name reducerAny
     *
     * @synopsis
     * ```coffeescript [specscript]
     * reducerAny(
     *   predicate any=>boolean,
     * ) -> anyReducer (result boolean, item any)=>boolean
     * ```
     *
     * @related foldableAllReducer
     *
     * @TODO throw to break early?
     */
    function reducerAny(predicate: any): (result: any, item: any) => any;
}
declare module "any" {
    export = any;
    /**
     * @name any
     *
     * @synopsis
     * ```coffeescript [specscript]
     * type Foldable = Iterable|AsyncIterable|Object
     *
     * any(predicate function)(collection Foldable) -> result Promise|boolean
     * ```
     *
     * @description
     * Test a predicate concurrently across all items of a collection, returning true if any executions return truthy.
     *
     * ```javascript [playground]
     * const isOdd = number => number % 2 == 1
     *
     * console.log(
     *   any(isOdd)([1, 2, 3, 4, 5]),
     * ) // true
     * ```
     *
     * The collection can be any iterable, async iterable, or object values iterable collection. Below is an example of `any` accepting an async generator as the collection.
     *
     * ```javascript [playground]
     * const toTodosUrl = id => 'https://jsonplaceholder.typicode.com/todos/' + id
     *
     * const fetchedToJson = fetched => fetched.json()
     *
     * const fetchTodo = pipe([
     *   toTodosUrl,
     *   fetch,
     *   fetchedToJson,
     * ])
     *
     * const todoIDsGenerator = async function* () {
     *   yield 1; yield 2; yield 3; yield 4; yield 5
     * }
     *
     * any(pipe([
     *   fetchTodo,
     *   todo => todo.title.startsWith('fugiat'),
     * ]))(todoIDsGenerator()).then(console.log) // true
     * ```
     *
     * @execution concurrent
     *
     * @muxing
     *
     * @related or
     */
    function any(predicate: any): (value: any) => any;
}
declare module "_internal/objectAssign" {
    export = objectAssign;
    /**
     * @name objectAssign
     *
     * @synopsis
     * ```coffeescript [specscript]
     * objectAssign<
     *   targetObject Object, sourceObjects ...Object,
     * >(targetObject, ...sourceObjects) -> merged Object
     * ```
     *
     * @description
     * Dereferenced `Object.assign`
     */
    const objectAssign: {
        <T extends {}, U>(target: T, source: U): T & U;
        <T_1 extends {}, U_1, V>(target: T_1, source1: U_1, source2: V): T_1 & U_1 & V;
        <T_2 extends {}, U_2, V_1, W>(target: T_2, source1: U_2, source2: V_1, source3: W): T_2 & U_2 & V_1 & W;
        (target: object, ...sources: any[]): any;
    };
}
declare module "_internal/objectSet" {
    export = objectSet;
    /**
     * @name objectSet
     *
     * @synopsis
     * ```coffeescript [specscript]
     * objectSet(
     *   object Object,
     *   property string,
     *   value any,
     * ) -> object
     * ```
     */
    function objectSet(object: any, property: any, value: any): any;
}
declare module "_internal/funcObjectAll" {
    export = funcObjectAll;
    /**
     * @name funcObjectAll
     *
     * @synopsis
     * ```coffeescript [specscript]
     * funcObjectAll(
     *   funcs Object<args=>Promise|any>
     * )(args ...any) -> objectAllFuncs ...args=>Promise|Object
     * ```
     *
     * @description
     * Concurrently execute the same arguments for each function of an object of functions, returning an object of results.
     */
    function funcObjectAll(funcs: any): (...args: any[]) => any;
}
declare module "assign" {
    export = assign;
    /**
     * @name assign
     *
     * @synopsis
     * ```coffeescript [specscript]
     * assign(resolvers Object<function>)(object Object) -> result Promise|Object
     * ```
     *
     * @description
     * Function executor and composer. Accepts an object of resolver functions and an argument object. Creates a result object from the argument object, evaluates each resolver with the argument object, and assigns to the result object the evaluations at the corresponding resolver keys.
     *
     * ```javascript [playground]
     * const assignSquaredAndCubed = assign({
     *   squared: ({ number }) => number ** 2,
     *   cubed: ({ number }) => number ** 3,
     * })
     *
     * console.log(assignSquaredAndCubed({ number: 2 }))
     * // { number: 2, squared: 4, cubed: 8 }
     *
     * console.log(assignSquaredAndCubed({ number: 3 }))
     * // { number: 3, squared: 9, cubed: 27 }
     * ```
     *
     * Any of the resolvers may be asynchronous and return Promises.
     *
     * ```javascript [playground]
     * const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
     *
     * const asyncAssignTotal = assign({
     *   async total({ numbers }) {
     *     await sleep(500)
     *     return numbers.reduce((a, b) => a + b)
     *   },
     * })
     *
     * asyncAssignTotal({ numbers: [1, 2, 3, 4, 5] }).then(console.log)
     * // { numbers: [1, 2, 3, 4, 5], total: 15 }
     * ```
     *
     * @execution concurrent
     */
    function assign(funcs: any): (value: any) => any;
}
declare module "_internal/curryArity" {
    export = curryArity;
    /**
     * @name curryArity
     *
     * @synopsis
     * ```coffeescript [specscript]
     * __ = Symbol(placeholder)
     *
     * var arity number,
     *   func function,
     *   args Array<__|any>,
     *   curried function
     *
     * curryArity(arity, func, args) -> curried|any
     * ```
     *
     * @description
     * Create a curried version of a function with specified arity.
     */
    function curryArity(arity: any, func: any, args: any): any;
}
declare module "curry" {
    export = curry;
    /**
     * @name curry
     *
     * @synopsis
     * ```coffeescript [specscript]
     * type __ = Symbol(placeholder)
     * type ArgsWithPlaceholder = Array<__|any>
     *
     * args ArgsWithPlaceholder
     * moreArgs ArgsWithPlaceholder
     *
     * curry(
     *   func function,
     *   ...args
     * ) -> curriedFuncOrResult function|any
     *
     * curriedFuncOrResult(...moreArgs) -> anotherCurriedFuncOrResult function|any
     * ```
     *
     * @description
     * Enable partial application of a function's arguments in any order. Provide the placeholder value `__` to specify an argument to be resolved in the partially applied function.
     *
     * ```javascript [playground]
     * const add = (a, b, c) => a + b + c
     *
     * console.log(curry(add, 'a', 'b', 'c')) // 'abc'
     * console.log(curry(add)('a', 'b', 'c')) // 'abc'
     * console.log(curry(add, 'a')('b', 'c')) // 'abc'
     * console.log(curry(add, 'a', 'b')('c')) // 'abc'
     * console.log(curry(add)('a')('b')('c')) // 'abc'
     *
     * console.log(curry(add, __, 'b', 'c')('a')) // abc
     * console.log(curry(add, __, __, 'c')('a', 'b')) // abc
     * console.log(curry(add, __, __, 'c')(__, 'b')('a')) // abc
     * ```
     */
    function curry(func: any, ...args: any[]): any;
    namespace curry {
        /**
         * @name curry.arity
         *
         * @synopsis
         * ```coffeescript [specscript]
         * type __ = Symbol(placeholder)
         * type ArgsWithPlaceholder = Array<__|any>
         *
         * args ArgsWithPlaceholder
         * moreArgs ArgsWithPlaceholder
         *
         * curry.arity(
         *   arity number,
         *   func function,
         *   ...args
         * ) -> curriedFuncOrResult function|any
         *
         * curriedFuncOrResult(...moreArgs) -> anotherCurriedFuncOrResult function|any
         * ```
         *
         * @description
         * `curry` with specified arity (number of arguments taken by the function) as the first parameter.
         *
         * ```javascript [playground]
         * const add = (a, b, c = 0) => a + b + c
         *
         * console.log(curry.arity(2, add, 1, 2)) // 3
         * ```
         */
        function arity(arity: any, func: any, ...args: any[]): any;
    }
}
declare module "_internal/funcConcatSync" {
    export = funcConcatSync;
    /**
     * @name funcConcatSync
     *
     * @synopsis
     * ```coffeescript [specscript]
     * funcConcatSync<
     *   args ...any,
     *   intermediate any,
     *   result any,
     * >(
     *   funcA ...args=>intermediate,
     *   funcB intermediate=>result
     * ) -> pipedFunction ...args=>result
     * ```
     */
    function funcConcatSync(funcA: any, funcB: any): (...args: any[]) => any;
}
declare module "_internal/thunkify1" {
    export = thunkify1;
    /**
     * @name thunkify1
     *
     * @synopsis
     * ```coffeescript [specscript]
     * thunkify1<
     *   arg0 any,
     *   func arg0=>any,
     * >(func, arg0) -> thunk ()=>func(arg0)
     * ```
     *
     * @description
     * Create a thunk from a function and one argument.
     */
    function thunkify1(func: any, arg0: any): () => any;
}
declare module "_internal/mapFrom" {
    export = mapFrom;
    /**
     * @name mapFrom
     *
     * @synopsis
     * ```coffeescript [specscript]
     * mapFrom(object Object) -> Map
     * ```
     *
     * @description
     * Create a new Map from an object.
     */
    function mapFrom(object: any): Map<any, any>;
}
declare module "_internal/noop" {
    export = noop;
    /**
     * @name noop
     *
     * @synopsis
     * noop() -> ()
     *
     * @description
     * Takes nothing, returns `undefined`
     */
    function noop(): void;
}
declare module "_internal/funcConcat" {
    export = funcConcat;
    /**
     * @name funcConcat
     *
     * @synopsis
     * ```coffeescript [specscript]
     * funcConcat<
     *   args ...any,
     *   intermediate any,
     *   result any,
     * >(
     *   funcA ...args=>Promise|intermediate,
     *   funcB intermediate=>result
     * ) -> pipedFunction ...args=>Promise|result
     * ```
     */
    function funcConcat(funcA: any, funcB: any): (...args: any[]) => any;
}
declare module "_internal/objectToString" {
    export = objectToString;
    /**
     * @name objectToString
     *
     * @synopsis
     * objectToString(value any) -> string
     *
     * @description
     * Get the tag of an object
     */
    function objectToString(value: any): any;
}
declare module "_internal/isGeneratorFunction" {
    export = isGeneratorFunction;
    /**
     * @name isGeneratorFunction
     *
     * @synopsis
     * isGeneratorFunction(value any) -> boolean
     *
     * @description
     * Determine whether a value is a generator function.
     */
    function isGeneratorFunction(value: any): boolean;
}
declare module "_internal/isAsyncGeneratorFunction" {
    export = isAsyncGeneratorFunction;
    /**
     * @name isAsyncGeneratorFunction
     *
     * @synopsis
     * isAsyncGeneratorFunction(value any) -> boolean
     *
     * @description
     * Determine whether a value is an async generator function.
     */
    function isAsyncGeneratorFunction(value: any): boolean;
}
declare module "pipe" {
    export = pipe;
    /**
     * @name pipe
     *
     * @synopsis
     * ```coffeescript [specscript]
     * pipe(funcs Array<function>)(...args) -> result Promise|any
     *
     * pipe(...args, funcs Array<function>) -> result Promise|any
     * ```
     *
     * @description
     * Creates a function pipeline with an array of functions where each function passes its return value as a single argument to the next function until all functions have executed. The result of a pipeline execution is the return of its last function. If any function of the pipeline is asynchronous, the result of the execution is a Promise.
     *
     * ```javascript [playground]
     * const syncAdd123 = pipe([
     *   number => number + 1,
     *   number => number + 2,
     *   number => number + 3,
     * ])
     *
     * console.log(syncAdd123(5)) // 11
     *
     * const asyncAdd123 = pipe([
     *   async number => number + 1,
     *   async number => number + 2,
     *   async number => number + 3,
     * ])
     *
     * asyncAdd123(5).then(console.log) // 11
     * ```
     *
     * When passed any amount of arguments before the array of functions, `pipe` executes eagerly; the array of functions is immediately invoked with the supplied arguments.
     *
     * ```javascript [playground]
     * pipe(1, 2, 3, [
     *   Array.of,
     *   map(number => number * 3),
     *   console.log, // [3, 6, 9]
     * ])
     * ```
     *
     * @execution series
     *
     * @transducing
     *
     * @since 1.6.0
     */
    function pipe(...args: any[]): any;
    namespace pipe {
        export { pipeSync as sync };
    }
    function pipeSync(funcs: any): any;
}
declare module "_internal/funcAll" {
    export = funcAll;
    /**
     * @name funcAll
     *
     * @synopsis
     * ```coffeescript [specscript]
     * funcAll<args ...any>(
     *   funcs Array<args=>Promise|any>
     * ) -> allFuncs args=>Promise|Array
     * ```
     */
    function funcAll(funcs: any): (...args: any[]) => any;
}
declare module "_internal/curry4" {
    export = curry4;
    /**
     * @name curry4
     *
     * @synopsis
     * ```coffeescript [specscript]
     * __ = Symbol('placeholder')
     *
     * curry4(
     *   baseFunc function,
     *   arg0 __|any,
     *   arg1 __|any,
     *   arg2 __|any,
     *   arg3 __|any,
     * ) -> function
     * ```
     *
     * @description
     * Curry a 4-ary function.
     *
     * Note: exactly one argument must be the placeholder
     */
    function curry4(baseFunc: any, arg0: any, arg1: any, arg2: any, arg3: any): (arg0: any) => any;
}
declare module "_internal/funcAllSeries" {
    export = funcAllSeries;
    /**
     * @name funcAllSeries
     *
     * @synopsis
     * ```coffeescript [specscript]
     * funcAllSeries<args ...any>(
     *   funcs Array<...args=>any>,
     * ) -> allFuncsSeries ...args=>Promise|Array
     * ```
     */
    function funcAllSeries(funcs: any): (...args: any[]) => any;
}
declare module "fork" {
    export = fork;
    /**
     * @name fork
     *
     * @synopsis
     * ```coffeescript [specscript]
     * fork(funcsArray Array<function>)(...args) -> result Promise|Array
     *
     * fork(funcsObject Object<function>)(...args) -> result Promise|Object
     * ```
     *
     * @description
     * Function executor and composer. Accepts either an array of functions or an object of functions as the values. Calls each function of the provided array or object in parallel with the provided arguments. Returns either an array or object of the results of the function executions.
     *
     * ```javascript [playground]
     * const createArrayOfGreetingsFor = fork([
     *   name => `Hi ${name}`,
     *   name => `Hey ${name}`,
     *   name => `Hello ${name}`,
     * ])
     *
     * const arrayOfGreetingsForFred = createArrayOfGreetingsFor('Fred')
     *
     * console.log(arrayOfGreetingsForFred)
     * // ['Hi Fred', 'Hey Fred', 'Hello Fred']
     *
     * const createObjectOfGreetingsFor = fork({
     *   hi: name => `Hi ${name}`,
     *   hey: name => `Hey ${name}`,
     *   hello: name => `Hello ${name}`,
     * })
     *
     * const objectOfGreetingsForJane = createObjectOfGreetingsFor('Jane')
     *
     * console.log(objectOfGreetingsForJane)
     * // { hi: 'Hi Jane', hey: 'Hey Jane', hello: 'Hello Jane' }
     * ```
     *
     * `fork` can simultaneously compose objects and handle promises.
     *
     * ```javascript [playground]
     * const identity = value => value
     *
     * const userbase = new Map()
     * userbase.set('1', { _id: 1, name: 'George' })
     *
     * const getUserByID = async id => userbase.get(id)
     *
     * const getAndLogUserById = pipe([
     *   fork({
     *     id: identity,
     *     user: getUserByID,
     *   }),
     *   tap(({ id, user }) => {
     *     console.log(`Got user ${JSON.stringify(user)} by id ${id}`)
     *   }),
     * ])
     *
     * getAndLogUserById('1') // Got user {"_id":1,"name":"George"} by id 1
     * ```
     *
     * @execution concurrent
     */
    function fork(funcs: any): (...args: any[]) => any;
    namespace fork {
        /**
         * @name fork.series
         *
         * @synopsis
         * ```coffeescript [specscript]
         * fork.series(funcsArray Array<function>)(...args) -> result Promise|Array
         *
         * fork.series(funcsObject Object<function>)(...args) -> result Promise|Object
         * ```
         *
         * @description
         * Same as `fork` but with serial instead of parallel execution.
         *
         * ```javascript [playground]
         * const sleep = ms => () => new Promise(resolve => setTimeout(resolve, ms))
         *
         * fork.series([
         *   greeting => console.log(greeting + ' world'),
         *   sleep(1000),
         *   greeting => console.log(greeting + ' mom'),
         *   sleep(1000),
         *   greeting => console.log(greeting + ' goodbye'),
         * ])('hello') // hello world
         *             // hello mom
         *             // hello goodbye
         * ```
         *
         * @execution series
         */
        function series(funcs: any): (...args: any[]) => any;
    }
}
declare module "_internal/tapSync" {
    export = tapSync;
    /**
     * @name tapSync
     *
     * @synopsis
     * ```coffeescript [specscript]
     * tapSync<
     *   tapper function,
     *   args ...any,
     * >(tapper)(...args) -> args[0]
     * ```
     *
     * @description
     * Call a function with arguments, returning the first argument. Promises are not handled.
     */
    function tapSync(func: any): (...args: any[]) => any;
}
declare module "_internal/thunkifyArgs" {
    export = thunkifyArgs;
    /**
     * @name thunkifyArgs
     *
     * @synopsis
     * ```coffeescript [specscript]
     * thunkifyArgs(func function, args Array) -> ()=>func(...args)
     * ```
     *
     * @synopsis
     * Create a thunk from a function and an arguments array.
     */
    function thunkifyArgs(func: any, args: any): () => any;
}
declare module "tap" {
    export = tap;
    /**
     * @name tap
     *
     * @synopsis
     * ```coffeescript [specscript]
     * tap(func function)(...args) -> Promise|args[0]
     * ```
     *
     * @description
     * Call a function with any number of arguments, returning the first argument. Promises created by the tapper are resolved before returning the value.
     *
     * ```javascript [playground]
     * const pipeline = pipe([
     *   tap(value => console.log(value)),
     *   tap(value => console.log(value + 'bar')),
     *   tap(value => console.log(value + 'barbaz')),
     * ])
     *
     * pipeline('foo') // 'foo'
     *                 // 'foobar'
     *                 // 'foobarbaz'
     * ```
     */
    function tap(func: any): (...args: any[]) => any;
    namespace tap {
        export { tapSync as sync };
        /**
         * @name tap.if
         *
         * @synopsis
         * ```coffeescript [specscript]
         * tap.if(predicate function, func function)(...args) -> Promise|args[0]
         * ```
         *
         * @description
         * A version of `tap` that accepts a predicate function (a function that returns a boolean value) before the function to execute. Only executes the function if the predicate function tests true for the same arguments provided to the execution function.
         *
         * ```javascript [playground]
         * const isOdd = number => number % 2 == 1
         *
         * const logIfOdd = tap.if(
         *   isOdd,
         *   number => console.log(number, 'is an odd number')
         * )
         *
         * logIfOdd(2)
         * logIfOdd(3) // 3 is an odd number
         * ```
         */
        function _if(predicate: any, func: any): (...args: any[]) => any;
        export { _if as if };
    }
    import tapSync = require("_internal/tapSync");
}
declare module "_internal/catcherApply" {
    export = catcherApply;
    /**
     * @name catcherApply
     *
     * @synopsis
     * ```coffeescript [specscript]
     * catcherApply<
     *   args ...any,
     *   err Error|any,
     *   catcher (err, ...args)=>any,
     * >(catcher, err, args) -> catcher(err, ...args)
     * ```
     *
     * @description
     * Apply an error and arguments to a catcher.
     */
    function catcherApply(catcher: any, err: any, args: any): any;
}
declare module "tryCatch" {
    export = tryCatch;
    /**
     * @name tryCatch
     *
     * @synopsis
     * ```coffeescript [specscript]
     * tryCatch(tryer function, catcher function)(...args) -> Promise|any
     *
     * tryCatch(...args, tryer function, catcher function) -> Promise|any
     * ```
     *
     * @description
     * Handles errors with a `tryer` and a `catcher` function. Calls the `tryer` function with the provided arguments and catches any errors thrown by the `tryer` function with the `catcher` function. If the `tryer` function is asynchronous and returns a rejected promise, the `catcher` function will execute with the value of the rejected promise. The `catcher` function is called with the error and all arguments supplied to the `tryer` function.
     *
     * ```javascript [playground]
     * const throwsIfOdd = number => {
     *   if (number % 2 == 1) {
     *     throw new Error(`${number} is odd`)
     *   }
     *   console.log('did not throw for', number)
     * }
     *
     * const errorHandler = tryCatch(throwsIfOdd, (error, number) => {
     *   console.log('caught error from number', number)
     *   console.log(error)
     * })
     *
     * errorHandler(2) // did not throw for 2
     * errorHandler(3) // caught error from number 3
     *                 // Error: 3 is odd
     *
     * ```
     *
     * `tryCatch` behaves eagerly (executes immediately with a single call and not with multiple calls like a higher order function) when passed any amount of nonfunction (primitive or object) arguments before the `tryer` and `catcher` functions.
     *
     * ```javascript [playground]
     * const add = (a, b) => a + b
     *
     * tryCatch(1, 2, 3, function throwSum(...numbers) {
     *   const sum = numbers.reduce(add)
     *   throw new Error(`the sum is ${sum}`)
     * }, function logErrorMessage(error) {
     *   console.error(error.message) // the sum is 6
     * })
     * ```
     */
    function tryCatch(...args: any[]): any;
}
declare module "_internal/arrayConditional" {
    export = arrayConditional;
    /**
     * @name arrayConditional
     *
     * @synopsis
     * ```coffeescript [specscript]
     * arrayConditional(
     *   array Array<function|value>,
     *   args Array,
     *   funcsIndex number,
     * ) -> Promise|any
     * ```
     *
     * @description
     * Conditional operator `a ? b : c ? d : e ? ...` for functions.
     *
     * @TODO isPromise conditional await
     * @TODO benchmark vs regular promise handling
     */
    function arrayConditional(array: any, args: any, funcsIndex: any): any;
}
declare module "_internal/nonfunctionsConditional" {
    export = nonfunctionsConditional;
    /**
     * @name nonfunctionsConditional
     *
     * @synopsis
     * ```coffeescript [specscript]
     * nonfunctionsConditional(array Array<value>, index number) -> boolean
     * ```
     */
    function nonfunctionsConditional(array: any, index: any): any;
}
declare module "switchCase" {
    export = switchCase;
    /**
     * @name switchCase
     *
     * @synopsis
     * ```coffeescript [specscript]
     * switchCase(conditionalValues Array<boolean|any>) -> Promise|any
     *
     * switchCase(
     *   conditionalFuncsOrValues Array<function|boolean|any>
     * )(...args) -> Promise|any
     * ```
     *
     * @description
     * Functional equivalent to the [Conditional (ternary) operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator). Accepts an array of conditional functions that specifies cases as pairings of `predicate` and `resolver` functions with the exception of the last, default resolver. All functions are provided with the same arguments and executed in series. The result of a `switchCase` execution is either the result of the execution the last default resolver, or the result of the execution of the first resolver where the associated predicate tested truthy.
     *
     * ```javascript [playground]
     * const fruitIsYellow = fruit => fruit.color == 'yellow'
     *
     * const fruitsGuesser = switchCase([
     *   fruitIsYellow,
     *   fruit => fruit.name + ' is possibly a banana',
     *   fruit => fruit.name + ' is probably not a banana',
     * ])
     *
     * console.log(fruitsGuesser({ name: 'plantain', color: 'yellow' }))
     * // plantain is possibly a banana
     *
     * console.log(fruitsGuesser({ name: 'apple', color: 'red' }))
     * // apple is probably not a banana
     * ```
     *
     * Any function can be replaced with a nonfunction (object or primitive) value so that the value is treated as an already resolved value.
     *
     * ```javascript [playground]
     * switchCase([
     *   async function asyncIdentity(value) {
     *     return value
     *   },
     *   'something',
     *   'default',
     * ])(false).then(console.log) // default
     * ```
     *
     * If every item in the conditional array is a nonfunction value, `switchCase` executes eagerly.
     *
     * ```javascript [playground]
     * const age = 26
     *
     * const myDrink = switchCase([age >= 21, 'Beer', 'Juice'])
     *
     * console.log(myDrink) // Beer
     * ```
     *
     * @execution series
     */
    function switchCase(values: any): any;
}
declare module "_internal/MappingIterator" {
    export = MappingIterator;
    /**
     * @name MappingIterator
     *
     * @synopsis
     * ```coffeescript [specscript]
     * MappingIterator<
     *   T any,
     *   iterator Iterator<T>,
     *   mapper T=>any,
     * >(iterator, mapper) -> mappingIterator Object
     *
     * mappingIterator.next() -> nextIteration { value: any, done: boolean }
     * ```
     *
     * @description
     * Creates a mapping iterator, i.e. an iterator that applies a mapper to each item of a source iterator.
     *
     * Note: consuming the mapping iterator also consumes the source iterator.
     */
    function MappingIterator(iterator: any, mapper: any): {
        [x: symbol]: () => {
            [x: symbol]: any;
            toString(): string;
            next(): any;
        };
        toString(): string;
        next(): any;
    };
}
declare module "_internal/NextIteration" {
    export = NextIteration;
    /**
     * @name NextIteration
     *
     * @synopsis
     * NextIteration(value any) -> nextIteration { value, done: false }
     *
     * @description
     * Create an object to send for the next iteration
     */
    function NextIteration(value: any): {
        value: any;
        done: boolean;
    };
}
declare module "_internal/MappingAsyncIterator" {
    export = MappingAsyncIterator;
    /**
     * @name MappingAsyncIterator
     *
     * @synopsis
     * ```coffeescript [specscript]
     * mappingAsyncIterator = new MappingAsyncIterator(
     *   asyncIter AsyncIterator<T>,
     *   mapper T=>Promise|any,
     * ) -> mappingAsyncIterator AsyncIterator
     *
     * mappingAsyncIterator.next() -> Promise<{ value: any, done: boolean }>
     * ```
     */
    function MappingAsyncIterator(asyncIterator: any, mapper: any): {
        [x: number]: () => {
            [x: number]: any;
            next(): Promise<any>;
        };
        next(): Promise<any>;
    };
}
declare module "_internal/isObject" {
    export = isObject;
    /**
     * @name isObject
     *
     * @synopsis
     * isObject(value any) -> boolean
     *
     * @description
     * Determine whether a value is an object. Note that Arrays are also objects in JS.
     */
    function isObject(value: any): boolean;
}
declare module "_internal/arrayMap" {
    export = arrayMap;
    /**
     * @name arrayMap
     *
     * @synopsis
     * ```coffeescript [specscript]
     * arrayMap(
     *   array Array,
     *   mapper (item any, index number, array Array)=>Promise|any,
     * ) -> Promise|Array
     * ```
     *
     * @description
     * Apply a mapper to each item of an array, returning an array. Mapper may be asynchronous.
     */
    function arrayMap(array: any, mapper: any): any;
}
declare module "_internal/generatorFunctionMap" {
    export = generatorFunctionMap;
    /**
     * @name generatorFunctionMap
     *
     * @synopsis
     * ```coffeescript [specscript]
     * generatorFunctionMap<
     *   T any,
     *   args ...any,
     *   generatorFunc ...args=>Generator<T>,
     *   mapper T=>any,
     * >(generatorFunc, mapper) -> mappingGeneratorFunc ...args=>Generator
     * ```
     *
     * @description
     * Create a mapping generator function from a generator function and a mapper. A mapping generator function produces mapping generators that apply the mapper to each item of the original generator.
     *
     * @TODO playground example
     */
    function generatorFunctionMap(generatorFunc: any, mapper: any): (...args: any[]) => Generator<any, void, unknown>;
}
declare module "_internal/asyncGeneratorFunctionMap" {
    export = asyncGeneratorFunctionMap;
    /**
     * @name asyncGeneratorFunctionMap
     *
     * @synopsis
     * ```coffeescript [specscript]
     * asyncGeneratorFunctionMap<
     *   T any,
     *   args ...any,
     *   asyncGeneratorFunc ...args=>AsyncGenerator<T>,
     *   mapper T=>Promise|any,
     * >(asyncGeneratorFunc, mapper)
     *   -> mappingAsyncGeneratorFunc ...args=>AsyncGenerator,
     * ```
     *
     * @description
     * Create a mapping async generator function from an async generator function and a mapper. A mapping async generator function produces async mapping generators that apply the mapper to each item of the original async generator.
     *
     * `mapper` may be asynchronous.
     *
     * @TODO isPromise optimization
     */
    function asyncGeneratorFunctionMap(asyncGeneratorFunc: any, mapper: any): (...args: any[]) => {};
}
declare module "_internal/reducerMap" {
    export = reducerMap;
    /**
     * @name reducerMap
     *
     * @synopsis
     * ```coffeescript [specscript]
     * reducerMap<
     *   T any,
     *   reducer (any, T)=>Promise|any,
     *   mapper T=>Promise|any,
     * >(reducer, mapper) -> mappingReducer (any, any)=>Promise|any
     * ```
     *
     * @description
     * Apply a mapper to elements of a reducer's operation. `mapper` may be asynchronous
     *
     * Note: If the mapper is asynchronous, the implementation of reduce that consumes the mapping reducer must resolve promises
     */
    function reducerMap(reducer: any, mapper: any): (result: any, reducerItem: any) => any;
}
declare module "_internal/stringMap" {
    export = stringMap;
    /**
     * @name stringMap
     *
     * @synopsis
     * ```coffeescript [specscript]
     * stringMap<
     *   character string,
     *   str String<character>,
     *   mapper character=>Promise|string|any,
     * >(str, mapper) -> stringWithCharactersMapped string
     * ```
     *
     * @description
     * Apply a mapper concurrently to each character of a string, returning a string result. `mapper` may be asynchronous.
     *
     * @related stringFlatMap
     */
    function stringMap(string: any, mapper: any): any;
}
declare module "_internal/setMap" {
    export = setMap;
    /**
     * @name setMap
     *
     * @synopsis
     * ```coffeescript [specscript]
     * setMap<
     *   T any,
     *   value Set<T>,
     *   mapper T=>Promise|any,
     * >(value, mapper) -> Promise|Set
     * ```
     *
     * @description
     * Apply a mapper concurrently to each item of a set, returning a set of results.
     */
    function setMap(set: any, mapper: any): any;
}
declare module "_internal/callPropBinary" {
    export = callPropBinary;
    /**
     * @name callPropBinary
     *
     * @synopsis
     * ```coffeescript [specscript]
     * callPropBinary(
     *   value object,
     *   property string,
     *   arg0 any,
     *   arg1 any,
     * ) -> value[property](arg0, arg1)
     * ```
     *
     * @description
     * Call a property function on a value with two arguments.
     */
    function callPropBinary(value: any, property: any, arg0: any, arg1: any): any;
}
declare module "_internal/mapMap" {
    export = mapMap;
    /**
     * @name mapMap
     *
     * @synopsis
     * ```coffeescript [specscript]
     * mapMap(
     *   value Map,
     *   mapper (item any, key any, value)=>Promise|any
     * ) -> Promise|Map<any=>any>
     * ```
     *
     * @description
     * Apply a mapper concurrently to each value (not entry) of a Map, returning a Map of results. `mapper` may be asynchronous.
     */
    function mapMap(value: any, mapper: any): any;
}
declare module "_internal/promiseObjectAll" {
    export = promiseObjectAll;
    /**
     * @name promiseObjectAll
     *
     * @synopsis
     * ```coffeescript [specscript]
     * promiseObjectAll(object<Promise|any>) -> Promise<object>
     * ```
     *
     * @description
     * Like `Promise.all` but for objects.
     */
    function promiseObjectAll(object: any): Promise<any>;
}
declare module "_internal/objectMap" {
    export = objectMap;
    /**
     * @name objectMap
     *
     * @synopsis
     * ```coffeescript [specscript]
     * objectMap<
     *   T any,
     *   object Object<T>,
     *   mapper T=>Promise|any,
     * >(object, mapper) -> Promise|Object
     * ```
     *
     * @description
     * Apply a mapper concurrently to each value of an object, returning an object of results. Mapper may be asynchronous.
     */
    function objectMap(object: any, mapper: any): {};
}
declare module "_internal/arrayMapSeries" {
    export = arrayMapSeries;
    /**
     * @name arrayMapSeries
     *
     * @synopsis
     * ```coffeescript [specscript]
     * arrayMapSeries<
     *   T any,
     *   array Array<T>,
     *   mapper T=>Promise|any,
     * >(array, mapper) -> mappedInSeries Promise|Array
     * ```
     *
     * @description
     * Apply a mapper in series to each item of an array, returning an array of results.
     */
    function arrayMapSeries(array: any, mapper: any): any;
}
declare module "_internal/arrayMapPool" {
    export = arrayMapPool;
    /**
     * @name
     * arrayMapPool
     *
     * @synopsis
     * ```coffeescript [specscript]
     * arrayMapPool<
     *   T any,
     *   array Array<T>
     *   mapper T=>Promise|any,
     *   concurrentLimit number,
     * >(array, mapper, concurrentLimit) -> Promise|Array
     * ```
     *
     * @description
     * Apply a mapper with limited concurrency to each item of an array, returning an array of results.
     */
    function arrayMapPool(array: any, mapper: any, concurrentLimit: any): any[] | Promise<any>;
}
declare module "_internal/arrayMapWithIndex" {
    export = arrayMapWithIndex;
    /**
     * @name arrayMapWithIndex
     *
     * @synopsis
     * ```coffeescript [specscript]
     * arrayMapWithIndex<
     *   T any,
     *   array Array<T>,
     *   index number,
     *   indexedMapper (T, index, array)=>Promise|any,
     * >(array, mapper) -> mappedWithIndex Promise|Array
     * ```
     *
     * @description
     * Apply an indexed mapper to each item of an array, returning an array of results.
     */
    function arrayMapWithIndex(array: any, mapper: any): any;
}
declare module "_internal/hasOwn" {
    export = hasOwn;
    function hasOwn(obj: any, key: any): any;
}
declare module "_internal/objectMapOwn" {
    export = objectMapOwn;
    /**
     * @name objectMapOwn
     *
     * @synopsis
     * ```coffeescript [specscript]
     * objectMapOwn<
     *   T any,
     *   object Object<T>,
     *   mapper T=>Promise|any,
     * >(object, mapper) -> Promise|Object
     * ```
     *
     * @description
     * Apply a mapper concurrently to an object's own values, returning an object of results. Mapper may be asynchronous.
     * Guards mapping by validating that each property is the object's own and not inherited from the prototype chain.
     */
    function objectMapOwn(object: any, mapper: any): {};
}
declare module "_internal/spread2" {
    export = spread2;
    /**
     * @name spread2
     *
     * @synopsis
     * ```coffeescript [specscript]
     * spread2<
     *   func function,
     *   arg0 any,
     *   arg1 any,
     * >(func) -> spreading2 ([arg0, arg1])=>func(arg0, arg1)
     * ```
     */
    function spread2(func: any): ([arg0, arg1]: [any, any]) => any;
}
declare module "_internal/objectMapEntries" {
    export = objectMapEntries;
    /**
     * @name objectMapEntries
     *
     * @synopsis
     * ```coffeescript [specscript]
     * objectMapEntries(
     *   object Object,
     *   mapper ([key string, value any])=>Promise|[string, any],
     * ) -> Promise|Object
     * ```
     */
    function objectMapEntries(object: any, mapper: any): any;
}
declare module "_internal/mapSet" {
    export = mapSet;
    /**
     * @name mapSet
     *
     * @synopsis
     * ```coffeescript [specscript]
     * mapSet(source Map, key any, value any) -> source
     * ```
     */
    function mapSet(source: any, key: any, value: any): any;
}
declare module "_internal/mapMapEntries" {
    export = mapMapEntries;
    /**
     * @name mapMapEntries
     *
     * @synopsis
     * ```coffeescript [specscript]
     * mapMapEntries(
     *   source Map,
     *   mapper ([key string, source any])=>Promise|[string, any],
     * ) -> Promise|Map
     * ```
     */
    function mapMapEntries(source: any, mapper: any): any;
}
declare module "map" {
    export = map;
    /**
     * @name map
     *
     * @synopsis
     * ```coffeescript [specscript]
     * arrayMapperFunc (value any, index number, array Array)=>Promise|any
     *
     * map(arrayMapperFunc)(value Array) -> result Promise|Array
     * map(value Array, arrayMapperFunc) -> result Promise|Array
     *
     * objectMapperFunc (value any, key string, object Object)=>Promise|any
     *
     * map(objectMapperFunc)(value Object) -> result Promise|Array
     * map(value Object, objectMapperFunc) -> result Promise|Array
     *
     * setMapperFunc (value any, value, set Set)=>Promise|any
     *
     * map(setMapperFunc)(value Set) -> result Promise|Set
     * map(value Set, setMapperFunc) -> result Promise|Set
     *
     * mapMapperFunc (value any, key any, originalMap Map)=>Promise|any
     *
     * map(mapMapperFunc)(value Map) -> result Promise|Map
     * map(value Map, mapMapperFunc) -> result Promise|Map
     *
     * iteratorMapperFunc (value any)=>any
     *
     * map(iteratorMapperFunc)(value Iterator|Generator) -> result Iterator
     * map(value Iterator|Generator, iteratorMapperFunc) -> result Iterator
     *
     * asyncIteratorMapperFunc (value any)=>Promise|any
     *
     * map(asyncIteratorMapperFunc)(value AsyncIterator|AsyncGenerator)
     *   -> result AsyncIterator
     * map(value AsyncIterator|AsyncGenerator, asyncIteratorMapperFunc)
     *   -> result AsyncIterator
     * ```
     *
     * @description
     * Applies a synchronous or asynchronous mapper function concurrently to each item of a collection, returning the results in a new collection of the same type. If order is implied by the collection, it is maintained in the result. `map` accepts the following collections:
     *
     *  * `Array`
     *  * `Object`
     *  * `Set`
     *  * `Map`
     *  * `Iterator`/`Generator`
     *  * `AsyncIterator`/`AsyncGenerator`
     *
     * With arrays (type `Array`), `map` applies the mapper function to each item of the array, returning the transformed results in a new array ordered the same as the original array.
     *
     * ```javascript [playground]
     * const square = number => number ** 2
     *
     * const array = [1, 2, 3, 4, 5]
     *
     * console.log(
     *   map(array, square)
     * ) // [1, 4, 9, 16, 25]
     *
     * console.log(
     *   map(square)(array)
     * ) // [1, 4, 9, 16, 25]
     * ```
     *
     * With objects (type `Object`), `map` applies the mapper function to each value of the object, returning the transformed results as values in a new object ordered by the keys of the original object
     *
     * ```javascript [playground]
     * const square = number => number ** 2
     *
     * const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 }
     *
     * console.log(
     *   map(square)(obj)
     * ) // { a: 1, b: 4, c: 9, d: 16, e: 25 }
     *
     * console.log(
     *   map(obj, square)
     * ) // { a: 1, b: 4, c: 9, d: 16, e: 25 }
     * ```
     *
     * With sets (type `Set`), `map` applies the mapper function to each value of the set, returning the transformed results unordered in a new set.
     *
     * ```javascript [playground]
     * const square = number => number ** 2
     *
     * const set = new Set([1, 2, 3, 4, 5])
     *
     * console.log(
     *   map(set, square)
     * ) // [1, 4, 9, 16, 25]
     *
     * console.log(
     *   map(square)(set)
     * ) // [1, 4, 9, 16, 25]
     * ```
     *
     * With maps (type `Map`), `map` applies the mapper function to each value of the map, returning the results at the same keys in a new map. The entries of the resulting map are in the same order as those of the original map
     *
     * ```javascript [playground]
     * const square = number => number ** 2
     *
     * const m = new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]])
     *
     * console.log(
     *   map(square)(m)
     * ) // Map { 'a' => 1, 'b' => 4, 'c' => 9, 'd' => 16, 'e' => 25 }
     *
     * console.log(
     *   map(m, square)
     * ) // Map { 'a' => 1, 'b' => 4, 'c' => 9, 'd' => 16, 'e' => 25 }
     * ```
     *
     * With iterators (type `Iterator`) or generators (type `Generator`), `map` applies the mapper function lazily to each value of the iterator/generator, creating a new iterator with transformed iterations.
     *
     * ```javascript [playground]
     * const capitalize = string => string.toUpperCase()
     *
     * const abcGeneratorFunc = function* () {
     *   yield 'a'; yield 'b'; yield 'c'
     * }
     *
     * const abcGenerator = abcGeneratorFunc()
     * const ABCGenerator = map(abcGeneratorFunc(), capitalize)
     * const ABCGenerator2 = map(capitalize)(abcGeneratorFunc())
     *
     * console.log([...abcGenerator]) // ['a', 'b', 'c']
     *
     * console.log([...ABCGenerator]) // ['A', 'B', 'C']
     *
     * console.log([...ABCGenerator2]) // ['A', 'B', 'C']
     * ```
     *
     * With asyncIterators (type `AsyncIterator`, or `AsyncGenerator`), `map` applies the mapper function lazily to each value of the asyncIterator, creating a new asyncIterator with transformed iterations
     *
     * ```javascript [playground]
     * const capitalize = string => string.toUpperCase()
     *
     * const abcAsyncGeneratorFunc = async function* () {
     *   yield 'a'; yield 'b'; yield 'c'
     * }
     *
     * const abcAsyncGenerator = abcAsyncGeneratorFunc()
     * const ABCGenerator = map(abcAsyncGeneratorFunc(), capitalize)
     * const ABCGenerator2 = map(capitalize)(abcAsyncGeneratorFunc())
     *
     * ;(async function () {
     *   for await (const letter of abcAsyncGenerator) {
     *     console.log(letter)
     *     // a
     *     // b
     *     // c
     *   }
     *
     *   for await (const letter of ABCGenerator) {
     *     console.log(letter)
     *     // A
     *     // B
     *     // C
     *   }
     *
     *   for await (const letter of ABCGenerator2) {
     *     console.log(letter)
     *     // A
     *     // B
     *     // C
     *   }
     * })()
     * ```
     *
     * @execution concurrent
     *
     * @TODO streamMap
     */
    function map(...args: any[]): any;
    namespace map {
        /**
         * @name map.entries
         *
         * @synopsis
         * ```coffeescript [specscript]
         * map.entries(
         *   mapper ([key any, value any])=>Promise|[any, any],
         * )(value Map|Object) -> Promise|Map|Object
         * ```
         *
         * @description
         * `map` over the entries rather than the values of a collection. Accepts collections of type `Map` or `Object`.
         *
         * ```javascript [playground]
         * const upperCaseKeysAndSquareValues =
         *   map.entries(([key, value]) => [key.toUpperCase(), value ** 2])
         *
         * console.log(upperCaseKeysAndSquareValues({ a: 1, b: 2, c: 3 }))
         * // { A: 1, B: 4, C: 9 }
         *
         * console.log(upperCaseKeysAndSquareValues(new Map([['a', 1], ['b', 2], ['c', 3]])))
         * // Map(3) { 'A' => 1, 'B' => 4, 'C' => 9 }
         * ```
         *
         * @since v1.7.0
         */
        function entries(mapper: any): (value: any) => any;
        /**
         * @name map.series
         *
         * @synopsis
         * ```coffeescript [specscript]
         * map.series(
         *   mapperFunc (value any)=>Promise|any,
         * )(array Array) -> Promise|Array
         * ```
         *
         * @description
         * `map` with serial execution.
         *
         * ```javascript [playground]
         * const delayedLog = number => new Promise(function (resolve) {
         *   setTimeout(function () {
         *     console.log(number)
         *     resolve()
         *   }, 1000)
         * })
         *
         * console.log('start')
         * map.series(delayedLog)([1, 2, 3, 4, 5])
         * ```
         *
         * @execution series
         */
        function series(mapper: any): (value: any) => any;
        /**
         * @name map.pool
         *
         * @synopsis
         * ```coffeescript [specscript]
         * map.pool(
         *   maxConcurrency number,
         *   mapper (value any)=>Promise|any,
         * )(array Array) -> result Promise|Array
         * ```
         *
         * @description
         * `map` that specifies the maximum concurrency (number of ongoing promises at any time) of the execution. Only works for arrays.
         *
         * ```javascript [playground]
         * const ids = [1, 2, 3, 4, 5]
         *
         * const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
         *
         * const delayedIdentity = async value => {
         *   await sleep(1000)
         *   return value
         * }
         *
         * map.pool(2, pipe([
         *   delayedIdentity,
         *   console.log,
         * ]))(ids)
         * ```
         *
         * @TODO objectMapPool
         *
         * @execution concurrent
         */
        function pool(concurrencyLimit: any, mapper: any): (value: any) => any[] | Promise<any>;
        /**
         * @name map.withIndex
         *
         * @synopsis
         * ```coffeescript [specscript]
         * map.withIndex(
         *   indexedMapperFunc (item any, index numberl, array Array)=>Promise|any,
         * )(array Array) -> result Promise|Array
         * ```
         *
         * @description
         * `map` with an indexed mapper.
         *
         * ```javascript [playground]
         * const range = length =>
         *   map.withIndex((_, index) => index + 1)(Array(length))
         *
         * console.log(range(5)) // [1, 2, 3, 4, 5]
         * ```
         *
         * @execution concurrent
         *
         * @related
         * map, filter.withIndex
         *
         * @DEPRECATED
         */
        function withIndex(mapper: any): (value: any) => any;
        /**
         * @name map.own
         *
         * @synopsis
         * ```coffeescript [specscript]
         * map.own(
         *   mapperFunc (item any)=>Promise|any,
         * )(object Object) -> result Promise|Object
         * ```
         *
         * @description
         * Applies a mapper function concurrently to an object's own values, returning an object of results. Mapper may be asynchronous.
         * Guards mapping by validating that each property is the object's own and not inherited from the prototype chain.
         *
         * ```javascript [playground]
         * const Person = function (name) {
         *   this.name = name
         * }
         *
         * Person.prototype.greet = function () {}
         *
         * const david = new Person('david')
         * david.a = 1
         * david.b = 2
         * david.c = 3
         *
         * const square = number => number ** 2
         * console.log(
         *   map.own(square)(david)
         * ) // { name: NaN, a: 1, b: 4, c: 9 }
         * ```
         *
         * @DEPRECATED
         */
        function own(mapper: any): (value: any) => {};
    }
}
declare module "_internal/FilteringIterator" {
    export = FilteringIterator;
    /**
     * @name FilteringIterator
     *
     * @synopsis
     * ```coffeescript [specscript]
     * FilteringIterator<
     *   T any,
     *   iterator Iterator<T>,
     *   predicate T=>boolean, # no async
     * >(iterator, predicate) -> filteringIterator Iterator<T>
     *
     * filteringIterator.next() -> { value: T, done: boolean }
     * ```
     *
     * @description
     * Creates a filtering iterator, i.e. an iterator that filteres a source iterator by predicate.
     */
    function FilteringIterator(iterator: any, predicate: any): {
        [x: symbol]: () => {
            [x: symbol]: any;
            next(): any;
        };
        next(): any;
    };
}
declare module "_internal/FilteringAsyncIterator" {
    export = FilteringAsyncIterator;
    /**
     * @name FilteringAsyncIterator
     *
     * @synopsis
     * ```coffeescript [specscript]
     * const filteringAsyncIterator = new FilteringAsyncIterator(
     *   asyncIterator AsyncIterator<T>,
     *   predicate T=>boolean,
     * ) -> FilteringAsyncIterator<T>
     *
     * filteringAsyncIterator.next() -> { value: Promise, done: boolean }
     * ```
     */
    function FilteringAsyncIterator(asyncIterator: any, predicate: any): {
        [x: number]: () => {
            [x: number]: any;
            isAsyncIteratorDone: boolean;
            next(): Promise<{
                value: any;
                done: boolean;
            }>;
        };
        isAsyncIteratorDone: boolean;
        next(): Promise<{
            value: any;
            done: boolean;
        }>;
    };
}
declare module "_internal/arrayExtendMap" {
    export = arrayExtendMap;
    /**
     * @name arrayExtendMap
     *
     * @synopsis
     * ```coffeescript [specscript]
     * any -> value; any -> mapped
     *
     * arrayExtendMap(
     *   array Array<mapped>,
     *   values Array<value>,
     *   valuesIndex number,
     *   valuesMapper value=>mapped,
     * ) -> array
     * ```
     *
     * @description
     * `arrayExtend` while mapping
     */
    function arrayExtendMap(array: any, values: any, valuesMapper: any, valuesIndex: any): any;
}
declare module "_internal/arrayFilterByConditions" {
    export = arrayFilterByConditions;
    /**
     * @name arrayFilterByConditions
     *
     * @synopsis
     * ```coffeescript [specscript]
     * arrayFilterByConditions(
     *   array Array,
     *   result Array,
     *   index number,
     *   conditions Array<boolean>,
     * ) -> result
     * ```
     *
     * @description
     * Filter an array by a boolean array of conditions
     *
     * @TODO switch positions of index and conditions
     */
    function arrayFilterByConditions(array: any, result: any, index: any, conditions: any): any;
}
declare module "_internal/arrayFilter" {
    export = arrayFilter;
    /**
     * @name arrayFilter
     *
     * @synopsis
     * ```coffeescript [specscript]
     * arrayFilter<T>(
     *   array Array<T>,
     *   predicate T=>Promise|boolean,
     * ) -> result Promise|Array<T>
     * ```
     *
     * @description
     * Filter an array concurrently by predicate. `predicate` may be asynchronous.
     */
    function arrayFilter(array: any, predicate: any): any;
}
declare module "_internal/generatorFunctionFilter" {
    export = generatorFunctionFilter;
    /**
     * @name generatorFunctionFilter
     *
     * @synopsis
     * ```coffeescript [specscript]
     * generatorFunctionFilter<
     *   T any,
     *   args ...any,
     *   generatorFunction ...args=>Generator<T>,
     *   predicate T=>boolean,
     * >(generatorFunction, predicate)
     *   -> filteringGeneratorFunction ...args=>Generator
     * ```
     *
     * @description
     * Filter a generator function by predicate.
     *
     * Note: async predicates may beget unexpected results
     */
    function generatorFunctionFilter(generatorFunction: any, predicate: any): (...args: any[]) => Generator<any, void, unknown>;
}
declare module "_internal/asyncGeneratorFunctionFilter" {
    export = asyncGeneratorFunctionFilter;
    /**
     * @name asyncGeneratorFunctionFilter
     *
     * @synopsis
     * ```coffeescript [specscript]
     * asyncGeneratorFunctionFilter<
     *   T any,
     *   args ...any,
     *   asyncGeneratorFunction ...args=>AsyncGenerator<T>,
     *   predicate T=>Promise|boolean,
     * >(asyncGeneratorFunction, predicate)
     *   -> filteringAsyncGeneratorFunction ...args=>AsyncGenerator<T>
     * ```
     *
     * @description
     * Filter an async generator function by predicate. Predicate may be asynchronous, in which case its evaluation is awaited.
     */
    function asyncGeneratorFunctionFilter(asyncGeneratorFunction: any, predicate: any): (...args: any[]) => {};
}
declare module "_internal/reducerFilter" {
    export = reducerFilter;
    /**
     * @name reducerFilter
     *
     * @synopsis
     * ```coffeescript [specscript]
     * reducerFilter<
     *   T any,
     *   reducer (any, T)=>Promise|any,
     *   predicate T=>Promise|boolean,
     * >(reducer, predicate) -> filteringReducer (any, any)=>Promise|any
     * ```
     *
     * @description
     * Filter items from a reducer's operation by predicate. `predicate` may be asynchronous.
     *
     * Note: If the predicate is asynchronous, the implementation of reduce that consumes the filtering reducer must resolve promises
     */
    function reducerFilter(reducer: any, predicate: any): (result: any, item: any) => any;
}
declare module "_internal/stringFilter" {
    export = stringFilter;
    /**
     * @name stringMap
     *
     * @synopsis
     * ```coffeescript [specscript]
     * stringMap<
     *   character string,
     *   str String<character>,
     *   mapper character=>Promise|string|any,
     * >(str, mapper) -> stringWithCharactersMapped string
     * ```
     *
     * @description
     * Filter a string's characters by predicate.
     */
    function stringFilter(string: any, predicate: any): any;
}
declare module "_internal/setFilter" {
    export = setFilter;
    /**
     * @name setFilter
     *
     * @synopsis
     * ```coffeescript [specscript]
     * setFilter<T>(
     *   set Set<T>,
     *   predicate T=>Promise|boolean,
     * ) -> filteredSet Promise|Set<T>
     * ```
     *
     * @description
     * Filter items of a Set concurrently by predicate. `predicate` may be asynchronous.
     */
    function setFilter(value: any, predicate: any): any;
}
declare module "_internal/thunkify4" {
    export = thunkify4;
    /**
     * @name thunkify4
     *
     * @synopsis
     * ```coffeescript [specscript]
     * thunkify4<
     *   arg0 any,
     *   arg1 any,
     *   arg2 any,
     *   arg3 any,
     *   func (arg0, arg1, arg2, arg3)=>any,
     * >(func, arg0, arg1, arg2, arg3) -> thunk ()=>func(arg0, arg1, arg2, arg3)
     * ```
     *
     * @description
     * Create a thunk from a function and four arguments.
     */
    function thunkify4(func: any, arg0: any, arg1: any, arg2: any, arg3: any): () => any;
}
declare module "_internal/mapFilter" {
    export = mapFilter;
    /**
     * @name mapFilter
     *
     * @synopsis
     * ```coffeescript [specscript]
     * mapFilter<
     *   T any,
     *   map Map<any=>T>,
     *   predicate T=>Promise|boolean,
     * >(map, predicate) -> filteredValuesByPredicate Map<any=>T>
     * ```
     *
     * @description
     * Filter the values of a Map concurrently by predicate. `predicate` may be asynchronous.
     *
     * Note: for asynchronous predicates, the order of the resulting Map is not guaranteed
     *
     * @TODO mapFilterSeries (will guarantee order for asynchronous predicates)
     */
    function mapFilter(map: any, predicate: any): any;
}
declare module "_internal/objectSetIf" {
    export = objectSetIf;
    /**
     * @name objectSetIf
     *
     * @synopsis
     * ```coffeescript [specscript]
     * objectSetIf<
     *   object Object,
     *   key string,
     *   value any,
     *   condition boolean,
     * >(object, key, value, condition) -> object
     * ```
     */
    function objectSetIf(object: any, key: any, value: any, condition: any): void;
}
declare module "_internal/objectFilter" {
    export = objectFilter;
    /**
     * @name objectFilter
     *
     * @synopsis
     * ```coffeescript [specscript]
     * objectFilter<T>(
     *   object Object<T>,
     *   predicate T=>boolean,
     * ) -> result Object<T>
     * ```
     */
    function objectFilter(object: any, predicate: any): any;
}
declare module "_internal/arrayExtendMapWithIndex" {
    export = arrayExtendMapWithIndex;
    /**
     * @name arrayExtendMapWithIndex
     *
     * @catchphrase
     * internal extend while mapping with index
     *
     * @synopsis
     * ```coffeescript [specscript]
     * arrayExtendMapWithIndex<
     *   T any,
     *   array Array<T>,
     *   values Array<T>,
     *   mapper T=>Promise|any,
     *   index number,
     * >(array, values, mapper, index) -> Promise|array
     * ```
     *
     * @description
     * Extend an array with values from a mapping operation.
     */
    function arrayExtendMapWithIndex(array: any, values: any, valuesMapper: any, valuesIndex: any): any;
}
declare module "_internal/arrayFilterWithIndex" {
    export = arrayFilterWithIndex;
    /**
     * @name arrayFilterWithIndex
     *
     * @synopsis
     * ```coffeescript [specscript]
     * arrayFilterWithIndex<
     *   T any,
     *   array Array<T>,
     *   index number,
     *   indexedPredicate (T, index, array)=>Promise|boolean,
     * >(array, indexedPredicate) -> filteredWithIndex Array<T>
     * ```
     *
     * @description
     * Filter an array concurrently by predicate.
     */
    function arrayFilterWithIndex(array: any, predicate: any): any;
}
declare module "filter" {
    export = filter;
    /**
     * @name filter
     *
     * @synopsis
     * ```coffeescript [specscript]
     * arrayPredicate (value any, index number, array Array)=>Promise|boolean
     *
     * filter(arrayPredicate)(array Array) -> filteredArray Promise|Array
     * filter(array Array, arrayPredicate) -> filteredArray Promise|Array
     *
     * objectPredicate (value any, key string, object Object)=>Promise|boolean
     *
     * filter(objectPredicate)(object Object) -> filteredObject Promise|Object
     * filter(object Object, objectPredicate) -> filteredObject Promise|Object
     *
     * setPredicate (value any, value, set Set)=>Promise|boolean
     *
     * filter(setPredicate)(set Set) -> filteredSet Promise|Set
     * filter(set Set, setPredicate) -> filteredSet Promise|Set
     *
     * mapPredicate (value any, key any, map Map)=>Promise|boolean
     *
     * filter(mapPredicate)(map Map) -> filteredMap Promise|Map
     * filter(map Map, mapPredicate) -> filteredMap Promise|Map
     *
     * iteratorPredicate (value any)=>any
     *
     * filter(iteratorPredicate)(iterator Iterator|Generator)
     *   -> filteredIterator Iterator|Generator
     * filter(iterator Iterator|Generator, iteratorPredicate)
     *   -> filteredIterator Iterator|Generator
     *
     * asyncIteratorPredicate (value any)=>Promise|any
     *
     * filter(asyncIteratorPredicate)(asyncIterator AsyncIterator|AsyncGenerator)
     *   -> filteredAsyncIterator AsyncIterator|AsyncGenerator
     * filter(asyncIterator AsyncIterator|AsyncGenerator, asyncIteratorPredicate)
     *   -> filteredAsyncIterator AsyncIterator|AsyncGenerator
     * ```
     *
     * @description
     * Filter out items from a collection based on the results of their concurrent executions with a synchronous or asynchronous predicate function. `filter` accepts the following collections:
     *
     *  * `Array`
     *  * `Object`
     *  * `Set`
     *  * `Map`
     *  * `Iterator`/`Generator`
     *  * `AsyncIterator`/`AsyncGenerator`
     *
     * With arrays (type `Array`), `filter` applies the predicate function to each item of the array, returning a new array containing only the items that tested truthy by the predicate. The order of the items is preserved.
     *
     * ```javascript [playground]
     * const isOdd = number => number % 2 == 1
     *
     * const array = [1, 2, 3, 4, 5]
     *
     * console.log(filter(isOdd)(array)) // [1, 3, 5]
     * console.log(filter(array, isOdd)) // [1, 3, 5]
     * ```
     *
     * With objects (type `Object`), `filter` applies the predicate function to each value of the object, returning a new object containing only the values that tested truthy by the predicate.
     *
     * ```javascript [playground]
     * const isOdd = number => number % 2 == 1
     *
     * const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 }
     *
     * console.log(filter(isOdd)(obj)) // { a: 1, c: 3, e: 5 }
     * console.log(filter(obj, isOdd)) // { a: 1, c: 3, e: 5 }
     * ```
     *
     * With sets (type `Set`), `filter` applies the predicate function to each item in the set, returning a new set containing only the items that tested truthy by the predicate.
     *
     * ```javascript [playground]
     * const isOdd = number => number % 2 == 1
     *
     * const set = new Set([1, 2, 3, 4, 5])
     *
     * console.log(filter(isOdd)(set)) // Set { 1, 3, 5 }
     * console.log(filter(set, isOdd)) // Set { 1, 3, 5 }
     * ```
     *
     * With maps (type `Map`), `filter` applies the predicate function to the value of each entry of the map, returning a new map containing only the entries where the values tested truthy by the predicate. The order of the entries are preserved.
     *
     * ```javascript [playground]
     * const isOdd = number => number % 2 == 1
     *
     * const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 }
     * const m = new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]])
     *
     * console.log(filter(isOdd)(m)) // Map(3) { 'a' => 1, 'c' => 3, 'e' => 5 }
     * console.log(filter(m, isOdd)) // Map(3) { 'a' => 1, 'c' => 3, 'e' => 5 }
     * ```
     *
     * With iterators (type `Iterator`) or generators (type `Generator`), `filter` returns a lazily filtered iterator/generator; all values that are normally yielded by the iterator/generator that test falsy by the predicate function are skipped by the lazily filtered iterator/generator.
     *
     * ```javascript [playground]
     * const isOdd = number => number % 2 == 1
     *
     * const numbersGeneratorFunction = function* () {
     *   yield 1; yield 2; yield 3; yield 4; yield 5
     * }
     *
     * const numbersGenerator = numbersGeneratorFunction()
     * const oddNumbersGenerator = filter(numbersGeneratorFunction(), isOdd)
     * const oddNumbersGenerator2 = filter(isOdd)(numbersGeneratorFunction())
     *
     * for (const number of numbersGenerator) {
     *   console.log(number) // 1
     *                       // 2
     *                       // 3
     *                       // 4
     *                       // 5
     * }
     *
     * for (const number of oddNumbersGenerator) {
     *   console.log(number) // 1
     *                       // 3
     *                       // 5
     * }
     *
     * for (const number of oddNumbersGenerator2) {
     *   console.log(number) // 1
     *                       // 3
     *                       // 5
     * }
     * ```
     *
     * With asyncIterators (type `AsyncIterator`) or asyncGenerators (type `AsyncGenerator`), `filter` returns a lazily filtered asyncIterator/asyncGenerator; all values that are normally yielded by the asyncIterator/asyncGenerator that test falsy by the predicate function are skipped by the lazily filtered asyncIterator/asyncGenerator.
     *
     * ```javascript [playground]
     * const asyncIsOdd = async number => number % 2 == 1
     *
     * const asyncNumbersGeneratorFunction = async function* () {
     *   yield 1; yield 2; yield 3; yield 4; yield 5
     * }
     *
     * const asyncNumbersGenerator = asyncNumbersGeneratorFunction()
     *
     * const asyncOddNumbersGenerator = filter(asyncNumbersGeneratorFunction(), asyncIsOdd)
     *
     * const asyncOddNumbersGenerator2 = filter(asyncIsOdd)(asyncNumbersGeneratorFunction())
     *
     * for await (const number of asyncNumbersGenerator) {
     *   console.log(number) // 1
     *                       // 2
     *                       // 3
     *                       // 4
     *                       // 5
     * }
     *
     * for await (const number of asyncOddNumbersGenerator) {
     *   console.log(number) // 1
     *                       // 3
     *                       // 5
     * }
     *
     * for await (const number of asyncOddNumbersGenerator2) {
     *   console.log(number) // 1
     *                       // 3
     *                       // 5
     * }
     * ```
     *
     * @execution concurrent
     *
     * @transducing
     */
    function filter(...args: any[]): any;
    namespace filter {
        /**
         * @name filter.withIndex
         *
         * @synopsis
         * ```coffeescript [specscript]
         * filter.withIndex(
         *   indexedPredicate (item any, index number, array Array)=>Promise|boolean
         * )(array Array) -> result Array
         * ```
         *
         * @description
         * `filter` with each predicate call supplemented by index and reference to original collection.
         *
         * ```javascript [playground]
         * const uniq = filter.withIndex(
         *   (item, index, array) => item !== array[index + 1]
         * )
         *
         * console.log(
         *   uniq([1, 1, 1, 2, 2, 2, 3, 3, 3]),
         * ) // [1, 2, 3]
         * ```
         *
         * @DEPRECATED
         *
         * @execution concurrent
         */
        function withIndex(predicate: any): (value: any) => any;
    }
}
declare module "_internal/curryArgs3" {
    export = curryArgs3;
    /**
     * @name curryArgs3
     *
     * @synopsis
     * ```coffeescript [specscript]
     * __ = Symbol('placeholder')
     *
     * curryArgs3(
     *   baseFunc function,
     *   arg0 __|any,
     *   arg1 __|any,
     *   arg2 __|any
     * ) -> function
     * ```
     *
     * @description
     * Curry arguments for a 3-ary function. Arguments are supplied in placeholder position as an array.
     *
     * Note: at least one argument must be the placeholder
     */
    function curryArgs3(baseFunc: any, arg0: any, arg1: any, arg2: any): (...args: any[]) => any;
}
declare module "_internal/iteratorReduce" {
    export = iteratorReduce;
    /**
     * @name iteratorReduce
     *
     * @synopsis
     * ```coffeescript [specscript]
     * var T any,
     *   iterator Iterator<T>,
     *   reducer (any, T)=>Promise|any,
     *   result any,
     *
     * iteratorReduce(iterator, reducer, result?) -> Promise|any
     * ```
     *
     * @description
     * Execute a reducer for each item of an iterator, returning a single value.
     */
    function iteratorReduce(iterator: any, reducer: any, result: any): any;
}
declare module "_internal/asyncIteratorReduce" {
    export = asyncIteratorReduce;
    /**
     * @name asyncIteratorReduce
     *
     * @synopsis
     * ```coffeescript [specscript]
     * asyncIteratorReduce(
     *   asyncIterator AsyncIterator<T>,
     *   reducer (any, T)=>Promise|any,
     *   result any,
     * ) -> result any
     * ```
     */
    function asyncIteratorReduce(asyncIterator: any, reducer: any, result: any): Promise<any>;
}
declare module "_internal/arrayReduce" {
    export = arrayReduce;
    /**
     * @name arrayReduce
     *
     * @synopsis
     * ```coffeescript [specscript]
     * arrayReduce<T>(
     *   array Array<T>,
     *   reducer (any, T)=>Promise|any,
     *   result any,
     * ) -> Promise|result
     * ```
     */
    function arrayReduce(array: any, reducer: any, result: any): any;
}
declare module "_internal/curry5" {
    export = curry5;
    /**
     * @name curry5
     *
     * @synopsis
     * ```coffeescript [specscript]
     * __ = Symbol('placeholder')
     *
     * curry5(
     *   baseFunc function,
     *   arg0 __|any,
     *   arg1 __|any,
     *   arg2 __|any,
     *   arg3 __|any,
     *   arg4 __|any,
     * ) -> function
     * ```
     *
     * @description
     * Curry a 5-ary function.
     *
     * Note: exactly one argument must be the placeholder
     */
    function curry5(baseFunc: any, arg0: any, arg1: any, arg2: any, arg3: any, arg4: any): (arg0: any) => any;
}
declare module "_internal/objectKeys" {
    export = objectKeys;
    /**
     * @name objectKeys
     *
     * @synopsis
     * objectKeys<T>(object Object<T>) -> Array<T>
     *
     * @description
     * Dereferenced `Object.keys`
     */
    const objectKeys: {
        (o: object): string[];
        (o: {}): string[];
    };
}
declare module "_internal/objectGetFirstKey" {
    export = objectGetFirstKey;
    /**
     * @name objectGetFirstKey
     *
     * @synopsis
     * ```coffeescript [specscript]
     * objectGetFirstKey(object Object) -> firstKey string
     * ```
     */
    function objectGetFirstKey(object: any): string;
}
declare module "_internal/objectReduce" {
    export = objectReduce;
    /**
     * @name objectReduce
     *
     * @synopsis
     * ```coffeescript [specscript]
     * objectReduce(
     *   object Object,
     *   reducer (any, item any, key string, object)=>Promise|any,
     *   result any,
     * ) -> Promise|result
     * ```
     */
    function objectReduce(object: any, reducer: any, result: any): any;
}
declare module "_internal/mapReduce" {
    export = mapReduce;
    /**
     * @name mapReduce
     *
     * @synopsis
     * ```coffeescript [specscript]
     * mapReduce(
     *   map Map,
     *   reducer (result any, value any, key string, map)=>Promise|any,
     *   result any,
     * ) -> Promise|result
     * ```
     */
    function mapReduce(map: any, reducer: any, result: any): any;
}
declare module "_internal/generatorFunctionReduce" {
    export = generatorFunctionReduce;
    /**
     * @name generatorFunctionReduce
     *
     * @synopsis
     * ```coffeescript [specscript]
     * generatorFunctionReduce<
     *   T any,
     *   args ...any,
     *   generatorFunction ...args=>Generator<Promise|T>,
     *   reducer (any, T)=>Promise|any,
     *   result any,
     * >(generatorFunction, reducer, result)
     *   -> reducingFunction ...args=>Promise|result
     * ```
     *
     * @description
     * Execute a reducer for each item of a generator function, returning a single value.
     */
    function generatorFunctionReduce(generatorFunction: any, reducer: any, result: any): (...args: any[]) => any;
}
declare module "_internal/asyncGeneratorFunctionReduce" {
    export = asyncGeneratorFunctionReduce;
    /**
     * @name asyncGeneratorFunctionReduce
     *
     * @synopsis
     * ```coffeescript [specscript]
     * asyncGeneratorFunctionReduce(
     *   asyncGeneratorFunction ...args=>AsyncGenerator<T>,
     *   reducer (any, T)=>any,
     *   result any,
     * ) -> (...any args)=>any
     * ```
     */
    function asyncGeneratorFunctionReduce(asyncGeneratorFunction: any, reducer: any, result: any): (...args: any[]) => any;
}
declare module "_internal/reducerConcat" {
    export = reducerConcat;
    /**
     * @name reducerConcat
     *
     * @synopsis
     * ```coffeescript [specscript]
     * reducerConcat<
     *   T any,
     *   intermediate any,
     *   reducerA (any, T)=>Promise|intermediate,
     *   reducerB (intermediate, T)=>Promise|any,
     * >(reducerA, reducerB) -> pipedReducer (any, T)=>Promise|any
     * ```
     */
    function reducerConcat(reducerA: any, reducerB: any): (result: any, item: any) => any;
}
declare module "_internal/genericReduce" {
    export = genericReduce;
    /**
     * @name genericReduce
     *
     * @synopsis
     * ```coffeescript [specscript]
     * Foldable<T> = Iterable<T>|AsyncIterable<T>
     *   |{ reduce: (any, T)=>any }|Object<T>
     *
     * genericReduce<T>(
     *   args [collection Foldable<T>, ...any],
     *   reducer (any, T)=>any,
     *   result any?,
     * ) -> result
     * ```
     *
     * @related genericReduceConcurrent
     *
     * @TODO genericReduceSync(args, reducer, init) - performance optimization for some of these genericReduces that we know are synchronous
     *
     * @TODO genericReducePool(poolSize, args, reducer, init) - for some of these genericReduces that we want to race - result should not care about order of concatenations
     * reduce.pool
     * transform.pool
     * flatMap.pool
     */
    function genericReduce(args: any, reducer: any, result: any): any;
}
declare module "reduce" {
    export = reduce;
    /**
     * @name reduce
     *
     * @synopsis
     * ```coffeescript [specscript]
     * arrayReducer (result any, value any, index number, array Array)=>(result Promise|any)
     * initialValue function|any
     *
     * reduce(arrayReducer, initialValue?)(array Array) -> result Promise|any
     * reduce(array Array, arrayReducer, initialValue?) -> result Promise|any
     *
     * objectReducer (result any, value any, key string, object Object)=>(result Promise|any)
     *
     * reduce(objectReducer, initialValue?)(object Object) -> result Promise|any
     * reduce(object Object, objectReducer, initialValue?) -> result Promise|any
     *
     * mapReducer (result any, value any, key any, map Map)=>(result Promise|any)
     *
     * reduce(mapReducer, initialValue?)(m Map) -> result Promise|any
     * reduce(m Map, mapReducer, initialValue?) -> result Promise|any
     *
     * reducer (result any, value any)=>(result Promise|any)
     *
     * reduce(reducer, initialValue?)(iterator Iterator) -> result Promise|any
     * reduce(iterator Iterator, reducer, initialValue?) -> result Promise|any
     *
     * reduce(reducer, initialValue?)(asyncIterator AsyncIterator)
     *   -> result Promise|any
     * reduce(asyncIterator AsyncIterator, reducer, initialValue?)
     *   -> result Promise|any
     * ```
     *
     * @description
     * Transforms a collection based on a reducer function and optional initial value. In a reducing operation, the result is defined in the beginning as either the initial value if supplied or the first item of the collection. The reducing operation then iterates through the remaining items in the collection, executing the reducer at each iteration to return the result to be used in the next iteration. The final result is the result of the execution of the reducer at the last item of the iteration. `reduce` accepts the following collections:
     *
     *  * `Array`
     *  * `Object`
     *  * `Set`
     *  * `Map`
     *  * `Iterator`/`Generator`
     *  * `AsyncIterator`/`AsyncGenerator`
     *
     * For arrays (type `Array`), `reduce` executes the reducer function for each item of the array in order, returning a new result at each execution to be used in the next execution.
     *
     * ```javascript [playground]
     * const max = (a, b) => a > b ? a : b
     *
     * console.log(
     *   reduce([1, 3, 5, 4, 2], max)
     * ) // 5
     *
     * console.log(
     *   reduce(max)([1, 3, 5, 4, 2])
     * ) // 5
     * ```
     *
     * If an optional initial value is provided, the result starts as the provided initial value rather than the first item of the collection.
     *
     * ```javascript [playground]
     * const add = (a, b) => a + b
     *
     * console.log(reduce([1, 2, 3, 4, 5], add, 0)) // 15
     * console.log(reduce(add, 0)([1, 2, 3, 4, 5])) // 15
     * ```
     *
     * If the initialization parameter is a function, it is treated as a resolver and called with the arguments to resolve the initial value.
     *
     * ```javascript [playground]
     * const concatSquares = (array, value) => array.concat(value ** 2)
     *
     * const contrivedInitializer = array => [`initial length ${array.length}`]
     *
     * const array = [1, 2, 3, 4, 5]
     *
     * console.log(reduce(concatSquares, contrivedInitializer)(array))
     * // ['initial length 5', 1, 4, 9, 16, 25]
     * console.log(reduce(array, concatSquares, contrivedInitializer))
     * // ['initial length 5', 1, 4, 9, 16, 25]
     * ```
     *
     * For objects (type `Object`), `reduce` executes the reducer function for each value of the object.
     *
     * ```javascript [playground]
     * const add = (a, b) => a + b
     *
     * const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 }
     *
     * console.log(
     *   reduce(obj, add)
     * ) // 15
     *
     * console.log(
     *   reduce(add)(obj)
     * ) // 15
     * ```
     *
     * For sets (type `Set`), `reduce` executes the reducer function for each item of the set.
     *
     * ```javascript [playground]
     * const add = (a, b) => a + b
     *
     * const set = new Set([1, 2, 3, 4, 5])
     *
     * console.log(
     *   reduce(set, add)
     * ) // 15
     *
     * console.log(
     *   reduce(add)(set)
     * ) // 15
     * ```
     *
     * For maps (type `Map`), `reduce` executes the reducer function for each value of each entry of the map.
     *
     * ```javascript [playground]
     * const add = (a, b) => a + b
     *
     * const m = new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]])
     *
     * console.log(
     *   reduce(m, add)
     * ) // 15
     *
     * console.log(
     *   reduce(add)(m)
     * ) // 15
     * ```
     *
     * For iterators (type `Iterator`) and generators (type `Generator`), `reduce` executes the reducer function for each value of the iterator/generator. The iterator/generator is consumed in the process.
     *
     * ```javascript [playground]
     * const add = (a, b) => a + b
     *
     * const generate12345 = function* () {
     *   yield 1; yield 2; yield 3; yield 4; yield 5
     * }
     *
     * console.log(
     *   reduce(generate12345(), add)
     * ) // 15
     *
     * console.log(
     *   reduce(add)(generate12345())
     * ) // 15
     * ```
     *
     * For asyncIterators (type `AsyncIterator`) and asyncGenerators (type `AsyncGenerator`), `reduce` executes the reducer function for each value of the asyncIterator/asyncGenerator. The asyncIterator/asyncGenerator is consumed in the process.
     *
     * ```javascript [playground]
     * const asyncAdd = async (a, b) => a + b
     *
     * const asyncGenerate12345 = async function* () {
     *   yield 1; yield 2; yield 3; yield 4; yield 5
     * }
     *
     * reduce(asyncGenerate12345(), asyncAdd).then(console.log) // 15
     *
     * reduce(asyncAdd)(asyncGenerate12345()).then(console.log) // 15
     * ```
     *
     * @execution series
     *
     * @transducing
     *
     * @TODO readerReduce
     *
     * @TODO reduce.concurrent
     */
    function reduce(...args: any[]): any;
}
declare module "_internal/isBinary" {
    export = isBinary;
    /**
     * @name isBinary
     *
     * @synopsis
     * isBinary(value any) -> boolean
     *
     * @description
     * Determine whether a value is binary. This could be `true` for `TypedArray` or a Node.js `Buffer`.
     */
    const isBinary: (arg: any) => arg is ArrayBufferView;
}
declare module "_internal/add" {
    export = add;
    /**
     * @name add
     *
     * @synopsis
     * add (a any, b any) -> a + b
     *
     * @description
     * `+` two things
     */
    function add(a: any, b: any): any;
}
declare module "_internal/isArrayLike" {
    export = isArrayLike;
    /**
     * @name isArrayLike
     *
     * @synopsis
     * ```coffeescript [specscript]
     * isArrayLike(value any) -> boolean
     * ```
     *
     * @description
     * Tell if a value has positive `length` like an Array.
     */
    function isArrayLike(value: any): boolean;
}
declare module "_internal/arrayExtend" {
    export = arrayExtend;
    /**
     * @name arrayExtend
     *
     * @synopsis
     * ```coffeescript [specscript]
     * arrayExtend(array Array, values Array) -> array
     * ```
     *
     * @description
     * Extend an array with values.
     */
    function arrayExtend(array: any, values: any): any;
}
declare module "_internal/globalThisHasBuffer" {
    export = globalThisHasBuffer;
    /**
     * @name globalThisHasBuffer
     *
     * @synopsis
     * globalThisHasBuffer boolean
     *
     * @description
     * Is there a global `Buffer`
     */
    const globalThisHasBuffer: boolean;
}
declare module "_internal/bufferAlloc" {
    export = bufferAlloc;
    /**
     * @name bufferAlloc
     *
     * @synopsis
     * Dereferenced `Buffer.alloc` or noop
     */
    const bufferAlloc: any;
}
declare module "_internal/binaryExtend" {
    export = binaryExtend;
    /**
     * @name binaryExtend
     *
     * @synopsis
     * ```coffeescript [specscript]
     * binaryExtend(
     *   typedArray TypedArray,
     *   array Array|TypedArray|any,
     * ) -> concatenatedTypedArray
     * ```
     *
     * @description
     * Types branching for _binaryExtend
     */
    function binaryExtend(typedArray: any, array: any): any;
}
declare module "_internal/isNodeReadStream" {
    export = isNodeReadStream;
    /**
     * @name isNodeReadStream
     *
     * @synopsis
     * isNodeReadStream(value any) -> boolean
     *
     * @description
     * Determine whether a value is a Node.js Readable Stream.
     */
    function isNodeReadStream(value: any): boolean;
}
declare module "_internal/streamExtend" {
    export = streamExtend;
    /**
     * @name streamExtend
     *
     * @synopsis
     * ```coffeescript [specscript]
     * Stream = { read: function, write: function }
     *
     * streamExtend<
     *   stream Stream,
     *   values Stream|any,
     * >(stream, values) -> Promise|stream
     * ```
     *
     * @TODO maybe support `.read`
     */
    function streamExtend(stream: any, values: any): any;
}
declare module "_internal/setExtend" {
    export = setExtend;
    /**
     * @name setExtend
     *
     * @synopsis
     * ```coffeescript [specscript]
     * setExtend(set, values Set|any) -> set
     * ```
     *
     * @related arrayExtend
     */
    function setExtend(set: any, values: any): any;
}
declare module "_internal/callConcat" {
    export = callConcat;
    /**
     * @name callConcat
     *
     * @synopsis
     * callConcat(object Object, values any) -> object.concat(values)
     */
    function callConcat(object: any, values: any): any;
}
declare module "_internal/genericTransform" {
    export = genericTransform;
    /**
     * @name genericTransform
     *
     * @synopsis
     * ```coffeescript [specscript]
     * Reducer = (any, any)=>Promise|any
     * Semigroup = Array|string|Set|TypedArray
     *   |{ concat: function }|{ write: function }|Object
     *
     * genericTransform<
     *   args ...any,
     *   transducer Reducer=>Reducer,
     *   result Semigroup|any,
     * >(args, transducer, result) -> result
     * ```
     */
    function genericTransform(args: any, transducer: any, result: any): any;
}
declare module "transform" {
    export = transform;
    /**
     * @name transform
     *
     * @synopsis
     * ```coffeescript [specscript]
     * type Reducer = (result any, item any)=>(result any)
     * type Transducer = Reducer=>Reducer
     * type Semigroup = Array|String|Set|TypedArray|{ concat: function }|{ write: function }|Object
     * type Foldable = Iterable|AsyncIterable|Object
     *
     * initialValue Semigroup|((foldable Foldable)=>Promise|Semigroup)
     *
     * transform(
     *   transducer Transducer,
     *   initialValue?,
     * )(foldable Foldable) -> result Promise|Semigroup
     * ```
     *
     * @description
     * Transforms a semigroup collection into any other semigroup collection. The type of transformation depends on the collection provided by the initial value. If the initial is a function it is used as a resolver for the provided collection. `transform` accepts semigroup collections, or collections that support a concatenation operation:
     *
     *  * `Array`; concatenation defined by `result.concat(values)`
     *  * `string`; concatenation defined by `result + values`
     *  * `Set`; concatenation defined by `result.add(...values)`
     *  * `TypedArray`; concatenation defined by `result.set(prevResult); result.set(values, offset)`
     *  * `{ concat: function }`; concatenation defined by `result.concat(values)`
     *  * `{ write: function }`; concatenation defined by `result.write(item)`
     *  * `Object`; concatenation defined by `({ ...result, ...values })`
     *
     * `transform` can transform any of the above collections into any of the other above collections.
     *
     * ```javascript [playground]
     * const square = number => number ** 2
     *
     * const isOdd = number => number % 2 == 1
     *
     * const squaredOdds = pipe([
     *   filter(isOdd),
     *   map(square),
     * ])
     *
     * // transform arrays into arrays
     * console.log(
     *   transform(squaredOdds, [])([1, 2, 3, 4, 5])
     * ) // [1, 9, 25]
     *
     * // transform arrays into strings
     * console.log(
     *   transform(squaredOdds, '')([1, 2, 3, 4, 5])
     * ) // '1925'
     *
     * // transform arrays into sets
     * console.log(
     *   transform(squaredOdds, new Set())([1, 2, 3, 4, 5])
     * ) // Set (3) { 1, 9, 25 }
     *
     * // transform arrays into typed arrays
     * console.log(
     *   transform(squaredOdds, new Uint8Array())([1, 2, 3, 4, 5]),
     * ) // Uint8Array(3) [ 1, 9, 25 ]
     * ```
     *
     * `transform` arrays into objects that implement `.concat`.
     *
     * ```javascript [playground]
     * const square = number => number ** 2
     *
     * const Stdout = {
     *   concat(...args) {
     *     console.log(...args)
     *     return this
     *   },
     * }
     *
     * transform(map(square), Stdout)([1, 2, 3, 4, 5])
     * // 1
     * // 4
     * // 9
     * // 16
     * // 25
     * ```
     *
     * `transform` an async generator into `process.stdout`, a Node.js writable stream that implements `.write`.
     *
     * ```javascript [node]
     * // this example is duplicated in rubico/examples/transformStreamRandomInts.js
     *
     * const { pipe, map, transform } = require('rubico')
     *
     * const square = number => number ** 2
     *
     * const toString = value => value.toString()
     *
     * const randomInt = () => Math.ceil(Math.random() * 100)
     *
     * const streamRandomInts = async function* () {
     *   while (true) {
     *     yield randomInt()
     *   }
     * }
     *
     * transform(
     *   map(pipe([square, toString])), process.stdout,
     * )(streamRandomInts()) // 9216576529289484980147613249169774446246768649...
     * ```
     *
     * @execution series
     *
     * @transducing
     *
     * TODO explore Semigroup = Iterator|AsyncIterator
     */
    function transform(transducer: any, init: any): (...args: any[]) => any;
}
declare module "_internal/arrayPush" {
    export = arrayPush;
    /**
     * @name arrayPush
     *
     * @synopsis
     * arrayPush(
     *   array Array,
     *   value any
     * ) -> array
     */
    function arrayPush(array: any, value: any): any;
}
declare module "_internal/FlatMappingIterator" {
    export = FlatMappingIterator;
    /**
     * @name FlatMappingIterator
     *
     * @synopsis
     * ```coffeescript [specscript]
     * FlatMappingIterator(
     *   iterator Iterator, flatMapper function,
     * ) -> FlatMappingIterator { next, SymbolIterator }
     * ```
     */
    function FlatMappingIterator(iterator: any, flatMapper: any): {
        [x: symbol]: () => any;
        next(): any;
    };
}
declare module "_internal/sleep" {
    export = sleep;
    /**
     * @name sleep
     *
     * @synopsis
     * ```coffeescript [specscript]
     * sleep(time number) -> promiseThatResolvesAfterTime Promise
     * ```
     */
    function sleep(time: any): Promise<any>;
}
declare module "_internal/FlatMappingAsyncIterator" {
    export = FlatMappingAsyncIterator;
    /**
     * @name FlatMappingAsyncIterator
     *
     * @synopsis
     * ```coffeescript [specscript]
     * new FlatMappingAsyncIterator(
     *   asyncIterator AsyncIterator, flatMapper function,
     * ) -> FlatMappingAsyncIterator AsyncIterator
     * ```
     *
     * @execution concurrent
     *
     * @muxing
     */
    function FlatMappingAsyncIterator(asyncIterator: any, flatMapper: any): {
        [x: number]: () => any;
        isAsyncIteratorDone: boolean;
        toString(): string;
        /**
         * @name FlatMappingAsyncIterator.prototype.next
         *
         * @synopsis
         * ```coffeescript [specscript]
         * new FlatMappingAsyncIterator(
         *   asyncIterator AsyncIterator, flatMapper function,
         * ).next() -> Promise<{ value, done }>
         * ```
         */
        next(): Promise<{
            value: any;
            done: boolean;
        }>;
    };
}
declare module "_internal/getArg1" {
    export = getArg1;
    /**
     * @name getArg1
     *
     * @synopsis
     * getArg1(arg0 any, arg1 any) -> arg1
     */
    function getArg1(arg0: any, arg1: any): any;
}
declare module "_internal/identity" {
    export = identity;
    /**
     * @name identity
     *
     * @synopsis
     * identity(value any) -> value
     *
     * @description
     * Returns the first argument
     */
    function identity(value: any): any;
}
declare module "_internal/asyncIteratorForEach" {
    export = asyncIteratorForEach;
    /**
     * @name asyncIteratorForEach
     *
     * @synopsis
     * ```coffeescript [specscript]
     * var T any,
     *   asyncIterator AsyncIterator<T>,
     *   callback T=>()
     *
     * asyncIteratorForEach(asyncIterator, callback) -> Promise<>
     * ```
     *
     * @description
     * Execute a callback function for each item of an async iterator
     */
    function asyncIteratorForEach(asyncIterator: any, callback: any): Promise<any>;
}
declare module "_internal/arrayFlatten" {
    export = arrayFlatten;
    /**
     * @name arrayFlatten
     *
     * @synopsis
     * ```coffeescript [specscript]
     * Stream<T> = { read: ()=>T, write: T=>() }
     * Monad<T> = Array<T>|String<T>|Set<T>
     *   |TypedArray<T>|Stream<T>|Iterator<Promise|T>
     *   |{ chain: T=>Monad<T> }|{ flatMap: T=>Monad<T> }|Object<T>
     * Reducer<T> = (any, T)=>Promise|any
     * Foldable<T> = Iterable<T>|AsyncIterable<T>|{ reduce: Reducer<T> }|Object<T>
     *
     * arrayFlatten<
     *   T any,
     *   array Array<Monad<T>|Foldable<T>|T>
     * >(array) -> Array<T>
     * ```
     */
    function arrayFlatten(array: any): any;
}
declare module "_internal/arrayFlatMap" {
    export = arrayFlatMap;
    /**
     * @name arrayFlatMap
     *
     * @synopsis
     * ```coffeescript [specscript]
     * Stream<T> = { read: ()=>T, write: T=>() }
     * Monad<T> = Array<T>|String<T>|Set<T>
     *   |TypedArray<T>|Stream<T>|Iterator<Promise|T>
     *   |{ chain: T=>Monad<T> }|{ flatMap: T=>Monad<T> }|Object<T>
     * Reducer<T> = (any, T)=>Promise|any
     * Foldable<T> = Iterable<T>|AsyncIterable<T>|{ reduce: Reducer<T> }|Object<T>
     *
     * arrayFlatMap<T>(
     *   array Array<T>,
     *   flatMapper T=>Promise|Monad<T>|Foldable<T>|T,
     * ) -> Promise|Array<T>
     * ```
     */
    function arrayFlatMap(array: any, flatMapper: any): any;
}
declare module "_internal/objectFlatten" {
    export = objectFlatten;
    /**
     * @name objectFlatten
     *
     * @synopsis
     * ```coffeescript [specscript]
     * Stream<T> = { read: ()=>T, write: T=>() }
     * Monad<T> = Array<T>|String<T>|Set<T>
     *   |TypedArray<T>|Stream<T>|Iterator<Promise|T>
     *   |{ chain: T=>Monad<T> }|{ flatMap: T=>Monad<T> }|Object<T>
     * Reducer<T> = (any, T)=>Promise|any
     * Foldable<T> = Iterable<T>|AsyncIterable<T>|{ reduce: Reducer<T> }|Object<T>
     *
     * objectFlatten<T>(
     *   object Object<Monad<T>|Foldable<T>|T>,
     * ) -> Object<T>
     * ```
     *
     * @TODO change objectAssign to objectDeepAssign
     */
    function objectFlatten(object: any): any;
}
declare module "_internal/objectFlatMap" {
    export = objectFlatMap;
    /**
     * @name objectFlatMap
     *
     * @synopsis
     * ```coffeescript [specscript]
     * Stream<T> = { read: ()=>T, write: T=>() }
     * Monad<T> = Array<T>|String<T>|Set<T>
     *   |TypedArray<T>|Stream<T>|Iterator<Promise|T>
     *   |{ chain: T=>Monad<T> }|{ flatMap: T=>Monad<T> }|Object<T>
     * Reducer<T> = (any, T)=>Promise|any
     * Foldable<T> = Iterable<T>|AsyncIterable<T>|{ reduce: Reducer<T> }|Object<T>
     *
     * objectFlatMap<
     *   T any,
     *   object Object<T>,
     *   flatMapper T=>Promise|Monad<T>|Foldable<T>|T,
     * >(object, flatMapper) -> Promise|Object<T>
     * ```
     *
     * @description
     * Apply a flatMapper to each value of an object, assigning all items of all results into a new object.
     *
     * @TODO "deeply copies" after objectFlatten changes to deep assignment
     */
    function objectFlatMap(object: any, flatMapper: any): any;
}
declare module "_internal/setFlatten" {
    export = setFlatten;
    /**
     * @name setFlatten
     *
     * @synopsis
     * ```coffeescript [specscript]
     * Stream<T> = { read: ()=>T, write: T=>() }
     * Monad<T> = Array<T>|String<T>|Set<T>
     *   |TypedArray<T>|Stream<T>|Iterator<Promise|T>
     *   |{ chain: T=>Monad<T> }|{ flatMap: T=>Monad<T> }|Object<T>
     * Reducer<T> = (any, T)=>Promise|any
     * Foldable<T> = Iterable<T>|AsyncIterable<T>|{ reduce: Reducer<T> }|Object<T>
     *
     * setFlatten<T>(
     *   set Set<Monad<T>|Foldable<T>|T>,
     * ) -> flattened Set<T>
     * ```
     */
    function setFlatten(set: any): any;
}
declare module "_internal/setFlatMap" {
    export = setFlatMap;
    /**
     * @name setFlatMap
     *
     * @synopsis
     * ```coffeescript [specscript]
     * Stream<T> = { read: ()=>T, write: T=>() }
     * Monad<T> = Array<T>|String<T>|Set<T>
     *   |TypedArray<T>|Stream<T>|Iterator<Promise|T>
     *   |{ chain: T=>Monad<T> }|{ flatMap: T=>Monad<T> }|Object<T>
     * Reducer<T> = (any, T)=>Promise|any
     * Foldable<T> = Iterable<T>|AsyncIterable<T>|{ reduce: Reducer<T> }|Object<T>
     *
     * setFlatMap<
     *   T any,
     *   set Set<T>,
     *   flatMapper T=>Promise|Monad<T>|Foldable<T>|T,
     * >(set, flatMapper) -> Promise|Set<T>
     * ```
     */
    function setFlatMap(set: any, flatMapper: any): any;
}
declare module "_internal/arrayJoin" {
    export = arrayJoin;
    /**
     * @name arrayJoin
     *
     * @synopsis
     * ```coffeescript [specscript]
     * arrayJoin(array Array, delimiter string) -> string
     * ```
     *
     * @description
     * Call `.join` on an array.
     */
    function arrayJoin(array: any, delimiter: any): any;
}
declare module "_internal/stringFlatMap" {
    export = stringFlatMap;
    /**
     * @name stringFlatMap
     *
     * @synopsis
     * ```coffeescript [specscript]
     * Stream<T> = { read: ()=>T, write: T=>() }
     * Monad<T> = Array<T>|String<T>|Set<T>
     *   |TypedArray<T>|Stream<T>|Iterator<Promise|T>
     *   |{ chain: T=>Monad<T> }|{ flatMap: T=>Monad<T> }|Object<T>
     * Reducer<T> = (any, T)=>Promise|any
     * Foldable<T> = Iterable<T>|AsyncIterable<T>|{ reduce: Reducer<T> }|Object<T>
     *
     * stringFlatMap<T>(
     *   string String<T>,
     *   flatMapper T=>Promise|Monad<T>|Foldable<T>|T,
     * ) -> Promise|String<T>
     * ```
     *
     * @related arrayFlatMap
     */
    function stringFlatMap(string: any, flatMapper: any): any;
}
declare module "_internal/streamWrite" {
    export = streamWrite;
    /**
     * @name streamWrite
     *
     * @synopsis
     * ```coffeescript [specscript]
     * streamWrite(
     *   stream Writable,
     *   chunk string|Buffer|Uint8Array|any,
     *   encoding string|undefined,
     *   callback function|undefined,
     * ) -> stream
     * ```
     *
     * @description
     * Call `.write` on a Node.js stream
     */
    function streamWrite(stream: any, chunk: any, encoding: any, callback: any): any;
}
declare module "_internal/streamFlatExtend" {
    export = streamFlatExtend;
    /**
     * @name streamFlatExtend
     *
     * @synopsis
     * ```coffeescript [specscript]
     * Stream<T> = { read: ()=>T, write: T=>() }
     * Monad<T> = Array<T>|String<T>|Set<T>
     *   |TypedArray<T>|Stream<T>|Iterator<Promise|T>
     *   |{ chain: T=>Monad<T> }|{ flatMap: T=>Monad<T> }|Object<T>
     * Reducer<T> = (any, T)=>Promise|any
     * Foldable<T> = Iterable<T>|AsyncIterable<T>|{ reduce: Reducer<T> }|Object<T>
     *
     * streamFlatExtend<T>(
     *   stream Stream<T>,
     *   item <Monad<T>|Foldable<T>|T>
     * ) -> stream
     * ```
     */
    function streamFlatExtend(stream: any, item: any): Promise<any>;
}
declare module "_internal/streamFlatMap" {
    export = streamFlatMap;
    /**
     * @name streamFlatMap
     *
     * @synopsis
     * ```coffeescript [specscript]
     * Stream<T> = { read: ()=>T, write: T=>() }
     * Monad<T> = Array<T>|String<T>|Set<T>
     *   |TypedArray<T>|Stream<T>|Iterator<Promise|T>
     *   |{ chain: T=>Monad<T> }|{ flatMap: T=>Monad<T> }|Object<T>
     * Reducer<T> = (any, T)=>Promise|any
     * Foldable<T> = Iterable<T>|AsyncIterable<T>|{ reduce: Reducer<T> }|Object<T>
     *
     * streamFlatMap<T>(
     *   stream Stream<T>,
     *   flatMapper T=>Promise|Monad<T>|Foldable<T>|T,
     * ) -> Promise|Stream<T>
     * ```
     */
    function streamFlatMap(stream: any, flatMapper: any): Promise<any>;
}
declare module "_internal/binaryFlatMap" {
    export = binaryFlatMap;
    /**
     * @name binaryFlatMap
     *
     * @synopsis
     * ```coffeescript [specscript]
     * Stream<T> = { read: ()=>T, write: T=>() }
     * Monad<T> = Array<T>|String<T>|Set<T>
     *   |TypedArray<T>|Stream<T>|Iterator<Promise|T>
     *   |{ chain: T=>Monad<T> }|{ flatMap: T=>Monad<T> }|Object<T>
     * Reducer<T> = (any, T)=>Promise|any
     * Foldable<T> = Iterable<T>|AsyncIterable<T>|{ reduce: Reducer<T> }|Object<T>
     *
     * binaryFlatMap<T>(
     *   binary TypedArray<T>|Buffer<T>,
     *   flatMapper T=>Promise|Monad<T>|Foldable<T>|T,
     * ) -> TypedArray<T>|Buffer<T>
     * ```
     */
    function binaryFlatMap(binary: any, flatMapper: any): any;
}
declare module "_internal/reducerFlatMap" {
    export = reducerFlatMap;
    /**
     * @name reducerFlatMap
     *
     * @synopsis
     * ```coffeescript [specscript]
     * Stream<T> = { read: ()=>T, write: T=>() }
     * Monad<T> = Array<T>|String<T>|Set<T>
     *   |TypedArray<T>|Stream<T>|Iterator<Promise|T>
     *   |{ chain: T=>Monad<T> }|{ flatMap: T=>Monad<T> }|Object<T>
     * Reducer<T> = (any, T)=>Promise|any
     * Foldable<T> = Iterable<T>|AsyncIterable<T>|{ reduce: Reducer<T> }|Object<T>
     *
     * reducerFlatMap<T>(
     *   reducer (any, T)=>Promise|any,
     *   flatMapper T=>Promise|Monad<T>|Foldable<T>|T,
     * ) -> flatMappingReducer (any, T)=>Promise|any
     * ```
     */
    function reducerFlatMap(reducer: any, flatMapper: any): (result: any, value: any) => any;
}
declare module "_internal/generatorFunctionFlatMap" {
    export = generatorFunctionFlatMap;
    /**
     * @name generatorFunctionFlatMap
     *
     * @synopsis
     * ```coffeescript [specscript]
     * Stream<T> = { read: ()=>T, write: T=>() }
     * Monad<T> = Array<T>|String<T>|Set<T>
     *   |TypedArray<T>|Stream<T>|Iterator<Promise|T>
     *   |{ chain: T=>Monad<T> }|{ flatMap: T=>Monad<T> }|Object<T>
     * Reducer<T> = (any, T)=>Promise|any
     * Foldable<T> = Iterable<T>|AsyncIterable<T>|{ reduce: Reducer<T> }|Object<T>
     *
     * generatorFunctionFlatMap<
     *   T any,
     *   args ...any,
     *   generatorFunction ...args=>Generator<Promise|T>,
     *   flatMapper T=>Promise|Monad<T>|Foldable<T>|T,
     * >(generatorFunction, flatMapper) ->
     *   flatMappingGeneratorFunction ...args=>Generator<Promise|T>
     * ```
     */
    function generatorFunctionFlatMap(generatorFunction: any, flatMapper: any): (...args: any[]) => Generator<any, void, unknown>;
}
declare module "_internal/asyncGeneratorFunctionFlatMap" {
    export = asyncGeneratorFunctionFlatMap;
    /**
     * @name asyncGeneratorFunctionFlatMap
     *
     * @synopsis
     * ```coffeescript [specscript]
     * Stream<T> = { read: ()=>T, write: T=>() }
     * Monad<T> = Array<T>|String<T>|Set<T>
     *   |TypedArray<T>|Stream<T>|Iterator<Promise|T>
     *   |{ chain: T=>Monad<T> }|{ flatMap: T=>Monad<T> }|Object<T>
     * Reducer<T> = (any, T)=>Promise|any
     * Foldable<T> = Iterable<T>|AsyncIterable<T>|{ reduce: Reducer<T> }|Object<T>
     *
     * asyncGeneratorFunctionFlatMap<
     *   T any,
     *   args ...any,
     *   asyncGeneratorFunction ...args=>Generator<Promise<T>>,
     *   flatMapper T=>Promise|Monad<T>|Foldable<T>|T,
     * >(asyncGeneratorFunction, flatMapper) ->
     *   flatMappingAsyncGeneratorFunction ...args=>Generator<Promise<T>>
     * ```
     */
    function asyncGeneratorFunctionFlatMap(asyncGeneratorFunction: any, flatMapper: any): (...args: any[]) => {};
}
declare module "flatMap" {
    export = flatMap;
    /**
     * @name flatMap
     *
     * @synopsis
     * ```coffeescript [specscript]
     * type Monad = Array|String|Set|Iterator|AsyncIterator
     * type Foldable = Iterable|AsyncIterable|Object
     *
     * flatMap(
     *   flatMapper (item any)=>Promise|Foldable,
     * )(value Monad) -> result Promise|Monad
     * ```
     *
     * @description
     * Applies a synchronous or asynchronous flatMapper function concurrently to each item of a collection, creating a new collection of the same type. A flatMapping operation iterates through each item of a collection and applies the flatMapper function to each item, flattening the result of the execution into the result collection. The result of an individual execution can be any iterable, async iterable, or object values iterable collection.
     *
     *  * `Iterable` - the execution result is iterated and each item is added to the result collection
     *  * `AsyncIterable` - the execution result is asynchronously iterated and each item is added to the result collection
     *  * `Object` - the execution result values are added to the result collection
     *
     * The following example demonstrates various execution results being flattened into the same array.
     *
     * ```javascript [playground]
     * const identity = value => value
     *
     * flatMap(identity)([
     *   [1, 1], // array
     *   new Set([2, 2]), // set
     *   (function* () { yield 3; yield 3 })(), // generator
     *   (async function* () { yield 7; yield 7 })(), // asyncGenerator
     *   { a: 5, b: 5 }, // object
     *   new Uint8Array([8]), // typedArray
     * ]).then(console.log)
     * // [1, 1, 2, 3, 3, 5, 5, 8, 7, 7]
     * ```
     *
     * A flatMapping operation concatenates onto the result collection synchronous values and muxes any asynchronous values. Muxing, or asynchronously "mixing", is the process of combining multiple asynchronous sources into one source, with order determined by the asynchronous resolution of the individual items.
     *
     * ```javascript [playground]
     * const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
     *
     * const repeat3 = function* (message) {
     *   yield message; yield message; yield message
     * }
     *
     * console.log( // sync is concatenated
     *   flatMap(repeat3)(['foo', 'bar', 'baz']),
     * ) // ['foo', 'foo', 'foo', 'bar', 'bar', 'bar', 'baz', 'baz', 'baz']
     *
     * const asyncRepeat3 = async function* (message) {
     *   yield message
     *   await sleep(100)
     *   yield message
     *   await sleep(1000)
     *   yield message
     * }
     *
     * // async is muxed
     * flatMap(asyncRepeat3)(['foo', 'bar', 'baz']).then(console.log)
     * // ['foo', 'bar', 'baz', 'foo', 'bar', 'baz', 'foo', 'bar', 'baz']
     * ```
     *
     * For arrays (type `Array`), `flatMap` applies the flatMapper function to each item, pushing (`.push`) the items of each execution into a new array.
     *
     * ```javascript [playground]
     * const duplicate = value => [value, value]
     *
     * console.log(
     *   flatMap(duplicate)([1, 2, 3, 4, 5])
     * ) // [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]
     * ```
     *
     * For strings (type `String`), `flatMap` applies the flatMapper function to each character, adding (`+`) the items of each execution into a new string
     *
     * ```javascript [playground]
     * const duplicate = value => [value, value]
     *
     * console.log(
     *   flatMap(duplicate)('12345')
     * ) // 1122334455
     * ```
     *
     * For sets (type `Set`), `flatMap` applies the flatMapper function to each item, adding (`.add`) the items of each execution into a new set
     *
     * ```javascript [playground]
     * const pairPlus100 = value => [value, value + 100]
     *
     * console.log(
     *   flatMap(pairPlus100)(new Set([1, 2, 3, 4, 5]))
     * ) // Set(10) { 1, 101, 2, 102, 3, 103, 4, 104, 5, 105 }
     * ```
     *
     * @execution concurrent
     *
     * @transducing
     *
     * @archive
     *  * For typed arrays (type [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray#typedarray_objects)) and Node.js buffers (type [`Buffer`](https://nodejs.org/api/buffer.html)), `flatMap` applies a flatMapper function to each value of the typed array/buffer, joining the result of each execution with `.set` into the resulting typed array
     *
     *  * For Node.js duplex streams (type [Stream](https://nodejs.org/api/stream.html#class-streamduplex)), `flatMap` applies a flatMapper function to each item of the stream, writing (`.write`) each item of each execution into the duplex stream
     */
    function flatMap(flatMapper: any): (value: any) => any;
}
declare module "or" {
    export = or;
    /**
     * @name or
     *
     * @synopsis
     * ```coffeescript [specscript]
     * or(values Array<boolean>) -> result boolean
     *
     * or(
     *   predicatesOrValues Array<function|boolean>
     * )(value any) -> result Promise|boolean
     * ```
     *
     * @description
     * Tests an array of boolean values, returning true if any boolean values are truthy.
     *
     * ```javascript [playground]
     * const oneIsLessThanZero = 1 < 0
     * const oneIsGreaterThanTwo = 1 > 2
     * const threeIsNotEqualToThree = 3 !== 3
     *
     * console.log(
     *   or([oneIsLessThanZero, oneIsGreaterThanTwo, threeIsNotEqualToThree]),
     * ) // false
     * ```
     *
     * If any values in the array are synchronous or asynchronous predicate functions, `or` takes another argument to test concurrently against the predicate functions, returning true if any array values or resolved values from the predicates are truthy.
     *
     * ```javascript [playground]
     * const isOdd = number => number % 2 == 1
     *
     * const isEven = number => number % 2 == 0
     *
     * console.log(
     *   or([isOdd, isEven])(0),
     * ) // true
     * ```
     *
     * @execution series
     *
     * @note ...args slows down here by an order of magnitude
     */
    function or(predicates: any): any;
}
declare module "not" {
    export = not;
    /**
     * @name not
     *
     * @synopsis
     * ```coffeescript [specscript]
     * not(value boolean) -> negated boolean
     *
     * not(predicate function)(...args) -> negatedPredicateResult boolean
     * ```
     *
     * @description
     * Negate a value like the [logical NOT (`!`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_NOT) operator.
     *
     * ```javascript [playground]
     * const myObj = { a: 1 }
     *
     * console.log(not('a' in myObj)) // false
     * console.log(not('b' in myObj)) // true
     * ```
     *
     * If provided a predicate function, `not` returns a logically inverted predicate that returns true everywhere the original predicate would have returned false.
     *
     * ```javascript [playground]
     * const isOdd = number => number % 2 == 1
     *
     * console.log(
     *   not(isOdd)(3),
     * ) // false
     * ```
     */
    function not(funcOrValue: any): boolean | ((value: any) => any);
    namespace not {
        export { notSync as sync };
    }
    /**
     * @name notSync
     *
     * @synopsis
     * ```coffeescript [specscript]
     * notSync(func ...any=>boolean) -> negated ...any=>boolean
     * ```
     */
    function notSync(func: any): (...args: any[]) => boolean;
}
declare module "_internal/sameValueZero" {
    export = sameValueZero;
    /**
     * @name sameValueZero
     *
     * @synopsis
     * ```coffeescript [specscript]
     * sameValueZero(left any, right any) -> boolean
     * ```
     *
     * @description
     * Determine if two values are the same value. [SameValueZero](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero).
     */
    function sameValueZero(left: any, right: any): boolean;
}
declare module "eq" {
    export = eq;
    /**
     * @name eq
     *
     * @synopsis
     * ```coffeescript [specscript]
     * eq(leftValue any, rightValue any) -> boolean
     * eq(leftValue any, right function)(value any) -> Promise|boolean
     * eq(left function, rightValue any)(value any) -> Promise|boolean
     * eq(left function, right function)(value any) -> Promise|boolean
     * ```
     *
     * @description
     * Test for [SameValueZero](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero) between the returns of two functions. Either parameter may be an actual value for comparison.
     *
     * If both arguments are values, `eq` eagerly computes and returns a boolean value.
     *
     * ```javascript [playground]
     * const areNamesEqual = eq('Ted', 'George')
     *
     * console.log(areNamesEqual) // false
     * ```
     *
     * If both arguments are functions, `eq` treats those functions as argument resolvers and returns a function that first resolves its arguments by the argument resolvers before making the comparison.
     *
     * If only one argument is a function, `eq` still returns a function that resolves its arguments by the argument resolver, treating the value (non function) argument as an already resolved value for comparison.
     *
     * ```javascript [playground]
     * const personIsGeorge = eq(person => person.name, 'George')
     *
     * console.log(
     *   personIsGeorge({ name: 'George', likes: 'bananas' }),
     * ) // true
     * ```
     *
     * More on SameValueZero: [Equality comparisons and sameness](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)
     *
     * @execution concurrent
     */
    function eq(left: any, right: any): boolean | ((value: any) => any);
}
declare module "_internal/greaterThan" {
    export = greaterThan;
    /**
     * @name greaterThan
     *
     * @synopsis
     * ```coffeescript [specscript]
     * greaterThan(left any, right any) -> boolean
     * ```
     */
    function greaterThan(left: any, right: any): boolean;
}
declare module "gt" {
    export = gt;
    /**
     * @name gt
     *
     * @synopsis
     * ```coffeescript [specscript]
     * gt(leftValue any, rightValue any) -> boolean
     * gt(leftValue any, right function)(value any) -> Promise|boolean
     * gt(left function, rightValue any)(value any) -> Promise|boolean
     * gt(left function, right function)(value any) -> Promise|boolean
     * ```
     *
     * @description
     * Test if a left value is greater than (`>`) a right value. Either parameter may be an actual value.
     *
     * If both arguments are values, `gt` eagerly computes and returns a boolean value.
     *
     * ```javascript [playground]
     * const age = 40
     *
     * const isAgeGreaterThan21 = gt(age, 21)
     *
     * console.log(isAgeGreaterThan21) // true
     * ```
     *
     * If both arguments are functions, `gt` treats those functions as argument resolvers and returns a function that first resolves its arguments by the argument resolvers before making the comparison.
     *
     * If only one argument is a function, `gt` still returns a function that resolves its arguments by the argument resolver, treating the value (non function) argument as an already resolved value for comparison.
     *
     * ```javascript [playground]
     * const isOfLegalAge = gt(21, person => person.age)
     *
     * const juvenile = { age: 16 }
     *
     * console.log(isOfLegalAge(juvenile)) // false
     * ```
     */
    function gt(left: any, right: any): boolean | ((value: any) => any);
}
declare module "_internal/lessThan" {
    export = lessThan;
    /**
     * @name lessThan
     *
     * @synopsis
     * ```coffeescript [specscript]
     * lessThan(left any, right any) -> boolean
     * ```
     */
    function lessThan(left: any, right: any): boolean;
}
declare module "lt" {
    export = lt;
    /**
     * @name lt
     *
     * @synopsis
     * ```coffeescript [specscript]
     * lt(leftValue any, rightValue any) -> boolean
     * lt(leftValue any, right function)(value any) -> Promise|boolean
     * lt(left function, rightValue any)(value any) -> Promise|boolean
     * lt(left function, right function)(value any) -> Promise|boolean
     * ```
     *
     * @description
     * Test if a left value is less than (`<`) a right value. Either parameter may be an actual value.
     *
     * If both arguments are values, `lt` eagerly computes and returns a boolean value.
     *
     * ```javascript [playground]
     * console.log(lt(1, 3)) // true
     * console.log(lt(3, 3)) // false
     * console.log(lt(4, 3)) // false
     * ```
     *
     * If both arguments are functions, `lt` treats those functions as argument resolvers and returns a function that first resolves its arguments by the argument resolvers before making the comparison.
     *
     * If only one argument is a function, `lt` still returns a function that resolves its arguments by the argument resolver, treating the value (non function) argument as an already resolved value for comparison.
     *
     * ```javascript [playground]
     * const identity = value => value
     *
     * const isLessThan3 = lt(identity, 3)
     *
     * console.log(isLessThan3(1), true)
     * console.log(isLessThan3(3), false)
     * console.log(isLessThan3(5), false)
     * ```
     */
    function lt(left: any, right: any): boolean | ((value: any) => any);
}
declare module "_internal/greaterThanOrEqual" {
    export = greaterThanOrEqual;
    /**
     * @name greaterThanOrEqual
     *
     * @synopsis
     * ```coffeescript [specscript]
     * greaterThanOrEqual(left any, right any) -> boolean
     * ```
     */
    function greaterThanOrEqual(left: any, right: any): boolean;
}
declare module "gte" {
    export = gte;
    /**
     * @name gte
     *
     * @synopsis
     * ```coffeescript [specscript]
     * gte(leftValue any, rightValue any) -> boolean
     * gte(leftValue any, right function)(value any) -> Promise|boolean
     * gte(left function, rightValue any)(value any) -> Promise|boolean
     * gte(left function, right function)(value any) -> Promise|boolean
     * ```
     *
     * @description
     * Test if a left value is greater than or equal (`>=`) to a right value. Either parameter may be an actual value.
     *
     * If both arguments are values, `gte` eagerly computes and returns a boolean value.
     *
     * ```javascript [playground]
     * const age = 20
     *
     * const isAdultAge = gte(age, 18)
     *
     * console.log(isAdultAge) // true
     * ```
     *
     * If both arguments are functions, `gte` treats those functions as argument resolvers and returns a function that first resolves its arguments by the argument resolvers before making the comparison.
     *
     * If only one argument is a function, `gte` still returns a function that resolves its arguments by the argument resolver, treating the value (non function) argument as an already resolved value for comparison.
     *
     * ```javascript [playground]
     * const identity = value => value
     *
     * const isAtLeast100 = gte(identity, 100)
     *
     * console.log(isAtLeast100(99)) // false
     * console.log(isAtLeast100(100)) // true
     * console.log(isAtLeast100(101)) // true
     * ```
     */
    function gte(left: any, right: any): boolean | ((value: any) => any);
}
declare module "_internal/lessThanOrEqual" {
    export = lessThanOrEqual;
    /**
     * @name lessThanOrEqual
     *
     * @synopsis
     * ```coffeescript [specscript]
     * lessThanOrEqual(left any, right any) -> boolean
     * ```
     */
    function lessThanOrEqual(left: any, right: any): boolean;
}
declare module "lte" {
    export = lte;
    /**
     * @name lte
     *
     * @synopsis
     * ```coffeescript [specscript]
     * lte(leftValue any, rightValue any) -> boolean
     * lte(leftValue any, right function)(value any) -> Promise|boolean
     * lte(left function, rightValue any)(value any) -> Promise|boolean
     * lte(left function, right function)(value any) -> Promise|boolean
     * ```
     *
     * @description
     * Test if a left value is less than or equal (`<=`) to a right value. Either parameter may be an actual value.
     *
     * If both arguments are values, `lte` eagerly computes and returns a boolean value.
     *
     * ```javascript [playground]
     * console.log(lte(1, 3)) // true
     * console.log(lte(3, 3)) // true
     * console.log(lte(4, 3)) // false
     * ```
     *
     * If both arguments are functions, `lte` treats those functions as argument resolvers and returns a function that first resolves its arguments by the argument resolvers before making the comparison.
     *
     * If only one argument is a function, `lte` still returns a function that resolves its arguments by the argument resolver, treating the value (non function) argument as an already resolved value for comparison.
     *
     * ```javascript [playground]
     * const identity = value => value
     *
     * const isLessThanOrEqualTo3 = lte(identity, 3)
     *
     * console.log(isLessThanOrEqualTo3(1), true)
     * console.log(isLessThanOrEqualTo3(3), true)
     * console.log(isLessThanOrEqualTo3(5), false)
     * ```
     */
    function lte(left: any, right: any): boolean | ((value: any) => any);
}
declare module "_internal/memoizeCappedUnary" {
    export = memoizeCappedUnary;
    /**
     * @name memoizeCappedUnary
     *
     * @synopsis
     * ```coffeescript [specscript]
     * memoizeCappedUnary(func function, cap number) -> memoized function
     * ```
     *
     * @description
     * Memoize a function. Clear cache when size reaches cap.
     *
     * @todo explore Map reimplementation
     */
    function memoizeCappedUnary(func: any, cap: any): {
        (arg0: any): any;
        cache: Map<any, any>;
    };
}
declare module "_internal/propertyPathToArray" {
    export = propertyPathToArray;
    /**
     * @name propertyPathToArray
     *
     * @synopsis
     * ```coffeescript [specscript]
     * propertyPathToArray(path string|number|Array<string|number>) -> Array
     * ```
     */
    function propertyPathToArray(path: any): any;
}
declare module "_internal/getByPath" {
    export = getByPath;
    /**
     * @name getByPath
     *
     * @synopsis
     * ```coffeescript [specscript]
     * getByPath<
     *   value any,
     *   path string|number|Array<string|number>,
     * >(value, path) -> valueAtPath any
     * ```
     */
    function getByPath(value: any, path: any): any;
}
declare module "get" {
    export = get;
    /**
     * @name get
     *
     * @synopsis
     * ```coffeescript [specscript]
     * get(
     *   path string|number|Array<string|number>,
     *   defaultValue function|any
     * )(object Object) -> result Promise|Object
     * ```
     *
     * @description
     * Accesses a property of an object given a path denoted by a string, number, or an array of string or numbers.
     *
     * ```javascript [playground]
     * const getHello = get('hello')
     *
     * console.log(getHello({ hello: 'world' })) // world
     * ```
     *
     * If the value at the end of the path is not found on the object, returns an optional default value. The default value can be a function resolver that takes the object as an argument. If no default value is provided, returns `undefined`. The function resolver may be asynchronous (returns a promise).
     *
     * ```javascript [playground]
     * const getHelloWithDefaultValue = get('hello', 'default')
     *
     * console.log(getHelloWithDefaultValue({ foo: 'bar' })) // default
     *
     * const getHelloWithDefaultResolver = get('hello', object => object.foo)
     *
     * console.log(getHelloWithDefaultResolver({ foo: 'bar' })) // bar
     * ```
     *
     * `get` supports three types of path patterns for nested property access.
     *
     *  * dot delimited - `'a.b.c'`
     *  * bracket notation - `'a[0].value'`
     *  * an array of keys or indices - `['a', 0, 'value']`
     *
     * ```javascript [playground]
     * const getABC0 = get('a.b.c[0]')
     *
     * console.log(getABC0({ a: { b: { c: ['hello'] } } })) // hello
     *
     * const get00000DotNotation = get('0.0.0.0.0')
     * const get00000BracketNotation = get('[0][0][0][0][0]')
     * const get00000ArrayNotation = get([0, 0, 0, 0, 0])
     *
     * console.log(get00000DotNotation([[[[['foo']]]]])) // foo
     * console.log(get00000BracketNotation([[[[['foo']]]]])) // foo
     * console.log(get00000ArrayNotation([[[[['foo']]]]])) // foo
     * ```
     */
    function get(path: any, defaultValue: any): (value: any) => any;
}
declare module "_internal/setByPath" {
    export = setByPath;
    /**
     * @name setByPath
     *
     * @synopsis
     * ```coffeescript [specscript]
     * setByPath<
     *   obj any,
     *   value any,
     *   path string|number|Array<string|number>,
     * >(obj, value, path) -> obj any
     * ```
     */
    function setByPath(obj: any, value: any, path: any): any;
}
declare module "set" {
    export = set;
    /**
     * @name set
     *
     * @synopsis
     * ```coffeescript [specscript]
     * set(
     *   path string|Array<string|number>,
     *   value function|any,
     * )(object Object) -> result Promise|Object
     * ```
     *
     * @description
     * Sets a property on a new object shallow cloned from the argument object given a path denoted by a string, number, or an array of string or numbers.
     *
     * `set` supports three types of path patterns for nested property access.
     *
     *  * dot delimited - `'a.b.c'`
     *  * bracket notation - `'a[0].value'`
     *  * an array of keys or indices - `['a', 0, 'value']`
     *
     * ```javascript [playground]
     * console.log(set('a', 1)({ b: 2 })) // { a: 1, b: 2 }
     *
     * const nestedAC2 = { a: { c: 2 } }
     *
     * console.log(set('a.b', 1)(nestedAC2)) // { a : { b: 1, c: 2 }}
     *
     * const nestedA0BC3 = { a: [{ b: { c: 3 } }] }
     *
     * console.log(set('a[0].b.c', 4)(nestedA0BC3)) // { a: [{ b: { c: 4 } }] }
     * ```
     *
     * The property value may be a function, in which case it is treated as a resolver and provided the argument object to resolve the value to set.
     *
     * ```javascript [playground]
     * const myObj = { a: 1 }
     *
     * const myNewObj = set('b', obj => obj.a + 2)(myObj)
     *
     * console.log(myNewObj) // { a: 1, b: 3 }
     * ```
     *
     * @since 1.7.0
     */
    function set(path: any, value: any): (obj: any) => any;
}
declare module "pick" {
    export = pick;
    /**
     * @name pick
     *
     * @synopsis
     * ```coffeescript [specscript]
     * pick(object Object, keys Array<string>) -> result Object
     *
     * pick(keys Array<string>)(object Object) -> result Object
     * ```
     *
     * @description
     * Creates a new object from a source object by selecting provided keys. If a provided key does not exist on the source object, excludes it from the resulting object.
     *
     * ```javascript [playground]
     * console.log(
     *   pick({ goodbye: 1, world: 2 }, ['hello', 'world']),
     * ) // { world: 2 }
     * ```
     *
     * `pick` supports three types of path patterns for nested property access
     *
     *  * dot delimited - `'a.b.c'`
     *  * bracket notation - `'a[0].value'`
     *  * an array of keys or indices - `['a', 0, 'value']`
     *
     * ```javascript [playground]
     * const nested = { a: { b: { c: { d: 1, e: [2, 3] } } } }
     *
     * console.log(pick(['a.b.c.d'])(nested)) // { a: { b: { c: { d: 1 } } } }
     * ```
     *
     * Compose `pick` inside a `pipe` with its tacit API.
     *
     * ```javascript [playground]
     * pipe({ a: 1, b: 2, c: 3 }, [
     *   map(number => number ** 2),
     *   pick(['a', 'c']),
     *   console.log, // { a: 1, c: 9 }
     * ])
     * ```
     */
    function pick(arg0: any, arg1: any): any;
}
declare module "_internal/deleteByPath" {
    export = deleteByPath;
    /**
     * @name deleteByPath
     *
     * @synopsis
     * ```coffeescript [specscript]
     * deleteByPath<
     *   object any,
     *   path string|number|Array<string|number>,
     * >(value, path) -> ()
     * ```
     */
    function deleteByPath(object: any, path: any): any;
}
declare module "_internal/copyDeep" {
    export = copyDeep;
    /**
     * @name copyDeep
     *
     * @synopsis
     * ```coffeescript [specscript]
     * copyDeep(value Array|Object) -> deepCopy Array|Object
     * ```
     *
     * @catchphrase
     * Deep copy objects or arrays.
     */
    function copyDeep(value: any): any;
}
declare module "omit" {
    export = omit;
    /**
     * @name omit
     *
     * @synopsis
     * ```coffeescript [specscript]
     * omit(paths Array<string>)(source Object) -> omitted Object
     *
     * omit(source Object, paths Array<string>) -> omitted Object
     * ```
     *
     * @description
     * Create a new object by excluding provided paths on a source object.
     *
     * ```javascript [playground]
     * console.log(
     *   omit({ _id: '1', name: 'George' }, ['_id']),
     * ) // { name: 'George' }
     * ```
     *
     * `omit` supports three types of path patterns for nested property access
     *
     *  * dot delimited - `'a.b.c'`
     *  * bracket notation - `'a[0].value'`
     *  * an array of keys or indices - `['a', 0, 'value']`
     *
     * ```javascript [playground]
     * console.log(
     *   omit(['a.b.d'])({
     *     a: {
     *       b: {
     *         c: 'hello',
     *         d: 'goodbye',
     *       },
     *     },
     *   }),
     * ) // { a: { b: { c: 'hello' } } }
     * ```
     *
     * Compose `omit` inside a `pipe` with its tacit API
     *
     * ```javascript [playground]
     * pipe({ a: 1, b: 2, c: 3 }, [
     *   map(number => number ** 2),
     *   omit(['a', 'b']),
     *   console.log, // { c: 9 }
     * ])
     * ```
     */
    function omit(arg0: any, arg1: any): any;
}
declare module "thunkify" {
    export = thunkify;
    /**
     * @name thunkify
     *
     * @synopsis
     * ```coffeescript [specscript]
     * thunkify(func function, ...args) -> thunk ()=>func(...args)
     * ```
     *
     * @description
     * Create a thunk function from another function and any number of arguments. The thunk function takes no arguments, and when called, executes the other function with the provided arguments. The other function is said to be "thunkified".
     *
     * ```javascript [playground]
     * const add = (a, b) => a + b
     *
     * const thunkAdd12 = thunkify(add, 1, 2)
     *
     * console.log(thunkAdd12()) // 3
     * ```
     */
    function thunkify(func: any, ...args: any[]): () => any;
}
declare module "rubico" {
    import pipe = require("pipe");
    import tap = require("tap");
    import switchCase = require("switchCase");
    import tryCatch = require("tryCatch");
    import fork = require("fork");
    import assign = require("assign");
    import get = require("get");
    import set = require("set");
    import pick = require("pick");
    import omit = require("omit");
    import map = require("map");
    import filter = require("filter");
    import reduce = require("reduce");
    import transform = require("transform");
    import flatMap = require("flatMap");
    import and = require("and");
    import or = require("or");
    import not = require("not");
    import any = require("any");
    import all = require("all");
    import eq = require("eq");
    import gt = require("gt");
    import lt = require("lt");
    import gte = require("gte");
    import lte = require("lte");
    import thunkify = require("thunkify");
    import always = require("_internal/always");
    import curry = require("curry");
    import __ = require("_internal/placeholder");
    export { pipe, tap, switchCase, tryCatch, fork, assign, get, set, pick, omit, map, filter, reduce, transform, flatMap, and, or, not, any, all, eq, gt, lt, gte, lte, thunkify, always, curry, __ };
}
declare module "x/isString" {
    export = isString;
    /**
     * @name isString
     *
     * @synopsis
     * ```coffeescript [specscript]
     * isString(value any) -> boolean
     * ```
     *
     * @description
     * Determine whether a value is a string.
     *
     * ```javascript [playground]
     * import isString from 'https://unpkg.com/rubico/dist/x/isString.es.js'
     *
     * console.log(
     *   isString('hey'),
     * ) // true
     * ```
     */
    function isString(value: any): boolean;
}
declare module "x/append" {
    export = append;
    /**
     * @name append
     *
     * @synopsis
     * ```coffeescript [specscript]
     * append(
     *   item string|Array,
     * )(value string|Array) -> string|array
     * ```
     *
     * @description
     * Append a string or an array.
     *
     * ```javascript [playground]
     * import append from 'https://unpkg.com/rubico/dist/x/append.es.js'
     *
     * const myArray = ['orange', 'apple']
     *
     * {
     *   const result = append(['ananas'])(myArray)
     *   console.log(result) // ['orange', 'apple', 'ananas']
     * }
     *
     * {
     *   const result = append('ananas')(myArray)
     *   console.log(result) // ['orange', 'apple', 'ananas']
     * }
     *
     * {
     *   const result = append('world')('hello ')
     *   console.log(result) // 'hello world'
     * }
     * ```
     *
     * @since 1.7.3
     */
    function append(item: any): (value: any) => string | any[];
}
declare module "x/callProp" {
    export = callProp;
    /**
     * @name callProp
     *
     * @synopsis
     * ```coffeescript [specscript]
     * callProp(property string, ...args)(object) -> object[property](...args)
     * ```
     *
     * @description
     * Calls a property on an object with arguments.
     *
     * ```javascript [playground]
     * import callProp from 'https://unpkg.com/rubico/dist/x/callProp.es.js'
     *
     * const priceRoundedDown = callProp('toFixed', 2)(5.992)
     * console.log('priceRoundedDown:', priceRoundedDown) // '5.99'
     * ```
     */
    function callProp(property: any, ...args: any[]): (object: any) => any;
}
declare module "x/defaultsDeep" {
    export = defaultsDeep;
    /**
     * @name defaultsDeep
     *
     * @synopsis
     * ```coffeescript [specscript]
     * var defaultCollection Array|Object,
     *   value Array|Object
     *
     * defaultsDeep(defaultCollection)(value) -> Array|Object
     * ```
     *
     * @description
     * Deeply assign default values to an array or object by an array or object of possibly nested default values.
     *
     * ```javascript [playground]
     * import defaultsDeep from 'https://unpkg.com/rubico/dist/x/defaultsDeep.es.js'
     *
     * const defaultUser = defaultsDeep({
     *   name: 'placeholder',
     *   images: [
     *     { url: 'https://via.placeholder.com/150' },
     *     { url: 'https://via.placeholder.com/150' },
     *     { url: 'https://via.placeholder.com/150' },
     *   ],
     * })
     *
     * console.log(defaultUser({
     *   name: 'George',
     *   images: [{ url: 'https://via.placeholder.com/150/0000FF/808080%20?Text=Digital.com' }],
     * }))
     * // {
     * //   name: 'George',
     * //   images: [
     * //    { url: 'https://via.placeholder.com/150/0000FF/808080%20?Text=Digital.com' },
     * //    { url: 'https://via.placeholder.com/150' },
     * //    { url: 'https://via.placeholder.com/150' },
     * //   ],
     * // }
     * ```
     */
    function defaultsDeep(defaultCollection: any): (value: any) => any;
}
declare module "_internal/thunkify5" {
    export = thunkify5;
    /**
     * @name thunkify5
     *
     * @synopsis
     * ```coffeescript [specscript]
     * thunkify5<
     *   arg0 any,
     *   arg1 any,
     *   arg2 any,
     *   arg3 any,
     *   arg4 any,
     *   func (arg0, arg1, arg2, arg3, arg4)=>any,
     * >(func, arg0, arg1, arg2, arg3, arg4) -> thunk ()=>func(arg0, arg1, arg2, arg3, arg4)
     * ```
     *
     * @description
     * Create a thunk from a function and five arguments.
     */
    function thunkify5(func: any, arg0: any, arg1: any, arg2: any, arg3: any, arg4: any): () => any;
}
declare module "x/differenceWith" {
    export = differenceWith;
    /**
     * @name differenceWith
     *
     * @synopsis
     * ```coffeescript [specscript]
     * differenceWith(
     *   comparator (any, any)=>Promise|boolean,
     *   allValues Array,
     * )(values Array) -> someOrAllValues Array
     * ```
     *
     * @description
     * Create an array of all the values in an array that are not in another array as dictated by a comparator.
     *
     * ```javascript [playground]
     * import differenceWith from 'https://unpkg.com/rubico/dist/x/differenceWith.es.js'
     * import isDeepEqual from 'https://unpkg.com/rubico/dist/x/isDeepEqual.es.js'
     *
     * console.log(
     *   differenceWith(isDeepEqual, [{ a: 1 }, { b: 2 }, { c: 3 }])([{ b: 2 }]),
     * ) // [{ a: 1 }, { c: 3 }]
     * ```
     */
    function differenceWith(comparator: any, allValues: any): (values: any) => any;
}
declare module "x/filterOut" {
    export = filterOut;
    /**
     * @name filterOut
     *
     * @synopsis
     * ```coffeescript [specscript]
     * filterOut(
     *   arrayPredicate (value any, index number, array Array)=>Promise|boolean
     * )(array) -> rejectedArray Promise|Array
     *
     * filterOut(
     *   objectPredicate (value any, key string, object Object)=>Promise|boolean
     * )(object) -> rejectedObject Promise|Object
     *
     * filterOut(
     *   setPredicate (value any, value, set Set)=>Promise|boolean
     * )(set) -> rejectedSet Promise|Set
     *
     * filterOut(
     *   mapPredicate (value any, key any, map Map)=>Promise|boolean
     * )(map) -> rejectedMap Promise|Map
     *
     * filterOut(
     *   predicate (value any)=>Promise|boolean
     * )(generatorFunction GeneratorFunction) -> rejectingGeneratorFunction GeneratorFunction
     *
     * filterOut(
     *   predicate (value any)=>Promise|boolean
     * )(asyncGeneratorFunction AsyncGeneratorFunction) -> rejectingAsyncGeneratorFunction AsyncGeneratorFunction
     *
     * filterOut(
     *   predicate (value any)=>Promise|boolean
     * )(reducer Reducer) -> rejectingReducer Reducer
     * ```
     *
     * @description
     * The inverse of `filter`. Values that test true by the predicate are filtered out, or "rejected".
     */
    function filterOut(predicate: any): any;
}
declare module "_internal/arrayFind" {
    export = arrayFind;
    /**
     * @name arrayFind
     *
     * @synopsis
     * ```coffeescript [specscript]
     * var T any,
     *   array Array<T>,
     *   predicate T=>Promise|boolean,
     *   result Promise|T|undefined
     *
     * arrayFind(array, predicate) -> result
     * ```
     */
    function arrayFind(array: any, predicate: any): any;
}
declare module "_internal/iteratorFind" {
    export = iteratorFind;
    /**
     * @name iteratorFind
     *
     * @synopsis
     * var T any,
     *   iterator Iterator<T>,
     *   predicate T=>Promise|boolean
     *
     * iteratorFind(iterator, predicate) -> Promise|T|undefined
     */
    function iteratorFind(iterator: any, predicate: any): any;
}
declare module "_internal/asyncIteratorFind" {
    export = asyncIteratorFind;
    /**
     * @name asyncIteratorFind
     *
     * @synopsis
     * var T any,
     *   asyncIterator AsyncIterator<T>,
     *   predicate T=>Promise|boolean
     *
     * asyncIteratorFind(asyncIterator, predicate) -> Promise|T|undefined
     */
    function asyncIteratorFind(asyncIterator: any, predicate: any): Promise<any>;
}
declare module "x/find" {
    export = find;
    /**
     * @name find
     *
     * @synopsis
     * ```coffeescript [specscript]
     * Foldable<T> = Iterable<T>|AsyncIterable<T>|{ reduce: (any, T)=>any }|Object<T>
     *
     * var T any,
     *   predicate T=>Promise|boolean,
     *   foldable Foldable<T>,
     *   result Promise|T|undefined
     *
     * find(predicate)(foldable) -> result
     * ```
     *
     * @description
     * Get the first item in a foldable collection that matches a predicate.
     *
     * ```javascript [playground]
     * import find from 'https://unpkg.com/rubico/dist/x/find.es.js'
     *
     * const users = [
     *   { name: 'John', age: 16 },
     *   { name: 'Jill', age: 32 },
     *   { name: 'George', age: 51 },
     * ]
     *
     * console.log(
     *   find(user => user.age > 50)(users),
     * ) // { name: 'George', age: 51 }
     * ```
     */
    function find(predicate: any): (value: any) => any;
}
declare module "x/findIndex" {
    export = findIndex;
    /**
     * @name findIndex
     *
     * @synopsis
     * ```coffeescript [specscript]
     * findIndex(predicate function)(array Array) -> index Promise|number
     * ```
     *
     * @description
     * Returns the index of the first element in an array that satisfies the predicate. Returns -1 if no element satisfies the predicate.
     *
     * ```javascript [playground]
     * import findIndex from 'https://unpkg.com/rubico/dist/x/findIndex.es.js'
     *
     * const oddNumberIndex = findIndex(function isOdd(number) {
     *   return number % 2 == 1
     * })([2, 3, 5])
     *
     * console.log(oddNumberIndex) // 1
     * ```
     *
     * @since 1.6.26
     */
    function findIndex(predicate: any): (array: any) => any;
}
declare module "x/first" {
    export = first;
    /**
     * @name first
     *
     * @synopsis
     * ```coffeescript [specscript]
     * var value Array|string
     *
     * first(value) -> any
     * ```
     *
     * @description
     * Get the first item of a collection
     *
     * ```javascript [playground]
     * import first from 'https://unpkg.com/rubico/dist/x/first.es.js'
     *
     * console.log(first([1, 2, 3])) // 1
     * console.log(first('abc')) // 'a'
     * console.log(first([])) // undefined
     * ```
     */
    function first(value: any): any;
}
declare module "x/flatten" {
    export = flatten;
    /**
     * @name flatten
     *
     * @synopsis
     * ```coffeescript [specscript]
     * Stream<T> = { read: ()=>T, write: T=>() }
     * Monad<T> = Array<T>|String<T>|Set<T>
     *   |TypedArray<T>|Stream<T>|Iterator<T>|AsyncIterator<T>
     *   |{ chain: T=>Monad<T> }|{ flatMap: T=>Monad<T> }|Object<T>
     * Reducer<T> = (any, T)=>Promise|any
     * Foldable<T> = Iterable<T>|AsyncIterable<T>|{ reduce: Reducer<T>=>any }|Object<T>
     *
     * var T any,
     *   monad Monad<Monad<T>|Foldable<T>|T>,
     *   args ...any,
     *   generatorFunction ...args=>Generator<Monad<T>|Foldable<T>|T>,
     *   asyncGeneratorFunction ...args=>AsyncGenerator<Monad<T>|Foldable<T>|T>,
     *   reducer Reducer<Monad<T>|Foldable<T>|T>
     *
     * flatten(monad) -> Monad<T>
     *
     * flatten(generatorFunction) -> ...args=>Generator<T>
     *
     * flatten(asyncGeneratorFunction) -> ...args=>AsyncGenerator<T>
     *
     * flatten(reducer) -> Reducer<T>
     * ```
     *
     * @description
     * Flatten a collection. Works in transducer position.
     *
     * ```javascript [playground]
     * import flatten from 'https://unpkg.com/rubico/dist/x/flatten.es.js'
     *
     * flatten([
     *   [1, 1],
     *   new Set([2, 2]),
     *   (function* () { yield 3; yield 3 })(),
     *   (async function* () { yield 4; yield 4 })(),
     *   { a: 5, b: 5 },
     *   6,
     *   Promise.resolve(7),
     *   new Uint8Array([8]),
     * ]).then(console.log)
     * // [1, 1, 2, 3, 3, 5, 5, 6, 7, 8, 4, 4]
     *
     * const add = (a, b) => a + b
     *
     * console.log(
     *   [[1], [2], [3], [4], [5]].reduce(flatten(add), 0),
     * ) // 15
     * ```
     *
     * @TODO flatten for each type
     */
    function flatten(value: any): any;
}
declare module "_internal/arrayForEach" {
    export = arrayForEach;
    /**
     * @name arrayForEach
     *
     * @synopsis
     * ```coffeescript [specscript]
     * var T any,
     *   array Array<T>,
     *   callback T=>()
     *
     * arrayForEach(array, callback) -> ()
     * ```
     *
     * @description
     * Call a callback for each item of an iterator. Return a promise if any executions are asynchronous.
     *
     * Note: iterator is consumed
     */
    function arrayForEach(array: any, callback: any): any;
}
declare module "_internal/objectForEach" {
    export = objectForEach;
    /**
     * @name objectForEach
     *
     * @synopsis
     * ```coffeescript [specscript]
     * var T any,
     *   object Object<T>,
     *   callback T=>()
     *
     * objectForEach(object, callback) -> ()
     * ```
     *
     * @description
     * Execute a callback for each value of an object. Return a promise if any executions are asynchronous.
     */
    function objectForEach(object: any, callback: any): any;
}
declare module "_internal/iteratorForEach" {
    export = iteratorForEach;
    /**
     * @name iteratorForEach
     *
     * @synopsis
     * ```coffeescript [specscript]
     * var T any,
     *   iterator Iterator<T>,
     *   callback T=>()
     *
     * iteratorForEach(iterator, callback) -> ()
     * ```
     *
     * @description
     * Call a callback for each item of an iterator. Return a promise if any executions are asynchronous.
     *
     * Note: iterator is consumed
     */
    function iteratorForEach(iterator: any, callback: any): any;
}
declare module "_internal/generatorFunctionForEach" {
    export = generatorFunctionForEach;
    /**
     * @name generatorFunctionForEach
     *
     * @synopsis
     * ```coffeescript [specscript]
     * var T any,
     *   generatorFunction ...args=>Generator<T>,
     *   callback T=>()
     *
     * generatorFunctionForEach(generatorFunction, callback) -> ...args=>Promise|Generator<>
     * ```
     *
     * @description
     * Create a generator executor that executes a callback for each item of a generator generated by a generator function. The executor may return a promise if any execution is asynchronous.
     */
    function generatorFunctionForEach(generatorFunction: any, callback: any): (...args: any[]) => Generator<never, any, unknown>;
}
declare module "_internal/asyncGeneratorFunctionForEach" {
    export = asyncGeneratorFunctionForEach;
    /**
     * @name asyncGeneratorFunctionForEach
     *
     * @synopsis
     * ```coffeescript [specscript]
     * var T any,
     *   asyncGeneratorFunction ...args=>AsyncGenerator<T>,
     *   callback T=>()
     *
     * asyncGeneratorFunctionForEach(asyncGeneratorFunction, callback) -> ...args=>Promise<AsyncGenerator<>>
     * ```
     *
     * @description
     * Create an async generator executor that executes a callback for each item of an async generator generated by an async generator function.
     */
    function asyncGeneratorFunctionForEach(asyncGeneratorFunction: any, callback: any): (...args: any[]) => {};
}
declare module "_internal/reducerForEach" {
    export = reducerForEach;
    /**
     * @name reducerForEach
     *
     * @synopsis
     * ```coffeescript [specscript]
     * Reducer<T> = (any, T)=>Promise|any
     *
     * var T any,
     *   reducer Reducer<T>
     *
     * reducerForEach(reducer, callback) -> reducer
     * ```
     *
     * @description
     * Create a reducer that additionally executes a callback for each item of its reducing operation.
     */
    function reducerForEach(reducer: any, callback: any): (result: any, item: any) => any;
}
declare module "x/forEach" {
    export = forEach;
    /**
     * @name forEach
     *
     * @synopsis
     * ```coffeescript [specscript]
     * Reducer<T> = (any, T)=>Promise|any
     *
     * var T any,
     *   callback T=>(),
     *   collection Iterable<T>|AsyncIterable<T>{ forEach: callback=>() }|Object<T>,
     *   args ...any,
     *   generatorFunction ...args=>Generator<T>,
     *   asyncGeneratorFunction ...args=>AsyncGenerator<T>,
     *   reducer Reducer<T>
     *
     * forEach(callback)(collection) -> Promise<>|()
     *
     * forEach(callback)(generatorFunction) -> ...args=>Promise<>|()
     *
     * forEach(callback)(asyncGeneratorFunction) -> ...args=>Promise<>
     *
     * forEach(callback)(reducer) -> Reducer<T>
     * ```
     *
     * @description
     * Execute a callback for each item of a collection, returning a Promise if any execution is asynchronous. Effectively `callback => map(tap)(callback)`. Also works in transducer position.
     *
     * ```javascript [playground]
     * import forEach from 'https://unpkg.com/rubico/dist/x/forEach.es.js'
     *
     * forEach(console.log)([1, 2, 3, 4, 5]) // 1 2 3 4 5
     * forEach(console.log)({ a: 1, b: 2, c: 3 }) // 1 2 3
     *
     * const add = (a, b) => a + b
     *
     * const logNumber = number => console.log('got number', number)
     *
     * const numbers = [1, 2, 3, 4, 5]
     * const result = numbers.reduce(forEach(logNumber)(add), 0)
     * // got number 1
     * // got number 2
     * // got number 3
     * // got number 4
     * // got number 5
     *
     * console.log('result', result) // result 10
     * ```
     */
    function forEach(callback: any): (value: any) => any;
}
declare module "_internal/EmptyMap" {
    export = EmptyMap;
    function EmptyMap(): Map<any, any>;
}
declare module "x/groupBy" {
    export = groupBy;
    /**
     * @name groupBy
     *
     * @synopsis
     * ```coffeescript [specscript]
     * Reducer<T> = (any, T)=>Promise|any
     * Foldable<T> = Iterable<T>|AsyncIterable<T>|{ reduce: Reducer<T>=>any }|Object<T>
     *
     * var property any,
     *   resolver any=>Promise|any,
     *   value Foldable
     *
     * groupBy(property)(value) -> groupedByProperty Map<any=>Array>
     *
     * groupBy(resolver)(value) -> groupedByResolver Promise|Map<any=>Array>
     * ```
     *
     * @description
     * Group a foldable collection into a Map of arrays by a property on each of its elements.
     *
     * ```javascript [playground]
     * import groupBy from 'https://unpkg.com/rubico/dist/x/groupBy.es.js'
     *
     * console.log(
     *   groupBy('age')([
     *     { name: 'George', age: 22 },
     *     { name: 'Jane', age: 22 },
     *     { name: 'Henry', age: 23 },
     *   ]),
     * )
     * // Map {
     * //   22 => [{ name: 'George', age: 22 }, { name: 'Jane', age: 22 }],
     * //   23 => [{ name: 'Henry', age: 23 }],
     * // }
     * ```
     *
     * Additionally, pass a resolver in property position to resolve a value for group membership for each item.
     *
     * ```javascript [playground]
     * import groupBy from 'https://unpkg.com/rubico/dist/x/groupBy.es.js'
     *
     * console.log(
     *   groupBy(
     *     word => word.toLowerCase(),
     *   )(['Hello', 'hello', 'Hey']),
     * ) // Map { 'hello' => ['Hello', 'hello'], 'hey' => ['Hey'] }
     * ```
     */
    function groupBy(propertyOrResolver: any): any;
}
declare module "x/has" {
    export = has;
    /**
     * @name has
     *
     * @synopsis
     * ```coffeescript [specscript]
     * has(key any)(container Set|Map|{ has: function }|Object) -> Promise|boolean
     * ```
     *
     * @description
     * Check if a collection has a key.
     *
     * ```javascript [playground]
     * import has from 'https://unpkg.com/rubico/dist/x/has.es.js'
     *
     * console.log(
     *   has('a')({ a: 1, b: 2, c: 3 }),
     * ) // true
     *
     * console.log(
     *   has('a')({}),
     * ) // false
     * ```
     */
    function has(key: any): (container: any) => any;
}
declare module "x/identity" {
    export = identity;
    /**
     * @name identity
     *
     * @synopsis
     * ```coffeescript [specscript]
     * identity(value any) -> value
     * ```
     *
     * @description
     * Pass a value and receive the same value back.
     *
     * ```javascript [playground]
     * import identity from 'https://unpkg.com/rubico/dist/x/identity.es.js'
     *
     * console.log(
     *   identity(1),
     * ) // 1
     * ```
     */
    function identity(value: any): any;
}
declare module "x/includes" {
    export = includes;
    /**
     * @name includes
     *
     * @synopsis
     * ```coffeescript [specscript]
     * includes(value any)(container Array|String|Object) -> boolean
     * ```
     *
     * @description
     * Check if a collection includes another value by [SameValueZero](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero).
     *
     * ```javascript [playground]
     * import includes from 'https://unpkg.com/rubico/dist/x/includes.es.js'
     *
     * console.log(
     *   includes(5)([1, 2, 3, 4, 5])
     * ) // true
     *
     * console.log(
     *   includes(5)([1, 2, 3])
     * ) // false
     * ```
     */
    function includes(value: any): (container: any) => any;
}
declare module "_internal/objectKeysLength" {
    export = objectKeysLength;
    /**
     * @name objectKeysLength
     *
     * @synopsis
     * ```coffeescript [specscript]
     * objectKeysLength(object Object) -> number
     * ```
     */
    function objectKeysLength(object: any): number;
}
declare module "x/isDeepEqual" {
    export = isDeepEqual;
    /**
     * @name isDeepEqual
     *
     * @synopsis
     * ```coffeescript [specscript]
     * Nested<T> = Array<Array<T>|Object<T>|Iterable<T>|T>|Object<Array<T>|Object<T>|Iterable<T>|T>
     *
     * var left Nested,
     *   right Nested
     *
     * isDeepEqual(left, right) -> boolean
     * ```
     *
     * @description
     * Check two values for deep [SameValueZero](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero) equality.
     *
     * ```javascript [playground]
     * import isDeepEqual from 'https://unpkg.com/rubico/dist/x/isDeepEqual.es.js'
     *
     * console.log(
     *   isDeepEqual({ a: 1, b: 2, c: [3] }, { a: 1, b: 2, c: [3] }),
     * ) // true
     *
     * console.log(
     *   isDeepEqual({ a: 1, b: 2, c: [3] }, { a: 1, b: 2, c: [5] }),
     * ) // false
     * ```
     *
     * When passed a resolver function as the left or right argument or resolvers as both arguments, returns a function that resolves the value by the resolver before performing the deep equal comparison.
     *
     * ```javascript [playground]
     * import isDeepEqual from 'https://unpkg.com/rubico/dist/x/isDeepEqual.es.js'
     *
     * const isPropADeepEqualTo123Array = isDeepEqual(object => object.a, [1, 2, 3])
     *
     * console.log(
     *   isPropADeepEqualTo123Array({ a: [1, 2, 3] }),
     * ) // true
     * ```
     */
    function isDeepEqual(left: any, right: any): any;
}
declare module "x/isEmpty" {
    export = isEmpty;
    /**
     * @name isEmpty
     *
     * @synopsis
     * ```coffeescript [specscript]
     * isEmpty(value any) -> boolean
     * ```
     *
     * @description
     * Check if a value is empty.
     *
     * ```javascript [playground]
     * import isEmpty from 'https://unpkg.com/rubico/dist/x/isEmpty.es.js'
     *
     * console.log('', isEmpty('')) // true
     * console.log([], isEmpty([])) // true
     * console.log({}, isEmpty({})) // true
     * console.log([1, 2, 3], isEmpty([1, 2, 3])) // false
     * console.log(new Set([1, 2, 3]), isEmpty(new Set([1, 2, 3]))) // false
     * console.log({ a: 1, b: 2, c: 3 }, isEmpty({ a: 1, b: 2, c: 3 })) // false
     * ```
     */
    function isEmpty(value: any): boolean;
}
declare module "x/isEqual" {
    export = isEqual;
    function isEqual(a: any, b: any): boolean;
}
declare module "x/isFunction" {
    export = isFunction;
    /**
     * @name isFunction
     *
     * @synopsis
     * ```coffeescript [specscript]
     * isFunction(value any) -> boolean
     * ```
     *
     * @description
     * Determine whether a value is a function.
     *
     * ```javascript [playground]
     * import isFunction from 'https://unpkg.com/rubico/dist/x/isFunction.es.js'
     *
     * const add = (a, b) => a + b
     *
     * console.log(
     *   isFunction(add),
     * ) // true
     * ```
     */
    function isFunction(value: any): boolean;
}
declare module "x/isObject" {
    export = isObject;
    import isObject = require("_internal/isObject");
}
declare module "x/keys" {
    export = keys;
    /**
     * @name keys
     *
     * @synopsis
     * ```coffeescript [specscript]
     * keys(value string|Array|Set|Map|object) -> Array<key number|string>
     * ```
     *
     * @description
     * Get an array of keys from an instance.
     *
     * ```javascript [playground]
     * import keys from 'https://unpkg.com/rubico/dist/x/keys.es.js'
     *
     * console.log(keys({ a: 1, b: 2, c: 3 })) // ['a', 'b', 'c']
     * console.log(keys(['hello', 'world'])) // [0, 1]
     * console.log(keys(new Map([['hello', 1], ['world', 2]]))) // ['hello', 'world']
     * ```
     *
     * @since 1.6.25
     */
    function keys(object: any): any[];
}
declare module "x/last" {
    export = last;
    /**
     * @name last
     *
     * @synopsis
     * ```coffeescript [specscript]
     * var value Array|string
     *
     * last(value) -> any
     * ```
     *
     * @description
     * Get the last item of a collection
     *
     * ```javascript [playground]
     * import last from 'https://unpkg.com/rubico/dist/x/last.es.js'
     *
     * console.log(last([1, 2, 3])) // 3
     * console.log(last([])) // undefined
     * ```
     */
    function last(value: any): any;
}
declare module "x/maxBy" {
    export = maxBy;
    /**
     * @name maxBy
     *
     * @synopsis
     * ```coffeescript [specscript]
     * maxBy(array Array, path string) -> maxItemByPath any
     *
     * maxBy(path string)(array Array) -> maxItemByPath any
     * ```
     *
     * @description
     * Finds the item that is the max by a property denoted by path.
     *
     * ```javascript [playground]
     * import maxBy from 'https://unpkg.com/rubico/dist/x/maxBy.es.js'
     *
     * const array = [{ a: 1 }, { a: 2 }, { a: 3 }]
     *
     * const maxItem = maxBy(array, 'a')
     *
     * console.log(maxItem) // { a: 3 }
     * ```
     *
     * `maxBy` composes in a pointfree way.
     *
     * ```javascript [playground]
     * import maxBy from 'https://unpkg.com/rubico/dist/x/maxBy.es.js'
     *
     * const numbers = [1, 2, 3]
     *
     * const maxItem = pipe(numbers, [
     *   map(number => number ** 2),
     *   map(number => ({ a: { b: { c: number } } })),
     *   maxBy('a.b.c')
     * ])
     *
     * console.log(maxItem) // { a: { b: { c: 9 } } }
     * ```
     */
    function maxBy(...args: any[]): any;
}
declare module "x/noop" {
    export = noop;
    /**
     * @name noop
     *
     * @synopsis
     * ```coffeescript [specscript]
     * noop() -> undefined
     * ```
     *
     * @description
     * Doesn't do anything.
     *
     * ```javascript [playground]
     * import noop from 'https://unpkg.com/rubico/dist/x/noop.es.js'
     *
     * console.log(
     *   noop(),
     * ) // undefined
     * ```
     */
    function noop(): void;
}
declare module "x/pluck" {
    export = pluck;
    /**
     * @name pluck
     *
     * @synopsis
     * ```coffeescript [specscript]
     * Functor<T> = Array<T>|Object<T>|Iterator<T>|AsyncIterator<T>|{ map: T=>any }
     * Reducer<T> = (any, T)=>Promise|any
     *
     * var T any,
     *   mapper T=>Promise|any,
     *   functor Functor<T>
     *   args ...any,
     *   generatorFunction ...args=>Generator<T>,
     *   asyncGeneratorFunction ...args=>AsyncGenerator<T>,
     *   reducer Reducer<T>
     *
     * pluck(functor) -> Promise|Functor
     *
     * pluck(generatorFunction) -> ...args=>Generator
     *
     * pluck(asyncGeneratorFunction) -> ...args=>AsyncGenerator
     *
     * pluck(reducer) -> Reducer
     * ```
     *
     * @description
     * Apply a getter denoted by path across all items of a collection, creating a new collection of plucked values. Also works in transducer position.
     *
     * ```javascript [playground]
     * import pluck from 'https://unpkg.com/rubico/dist/x/pluck.es.js'
     *
     * const users = [
     *   { name: 'George', age: 33 },
     *   { name: 'Jane', age: 51 },
     *   { name: 'Jim', age: 22 },
     * ]
     *
     * const usernames = pluck('name')(users)
     *
     * console.log(usernames) // ['George', 'Jane', 'Jim']
     *
     * const add = (a, b) => a + b
     *
     * console.log(
     *   'total age:',
     *   users.reduce(pluck('age')(add), 0),
     * ) // total age: 96
     * ```
     */
    const pluck: (...args: any[]) => any;
}
declare module "x/prepend" {
    export = prepend;
    /**
     * @name prepend
     *
     * @synopsis
     * ```coffeescript [specscript]
     * prepend(
     *   item string|Array,
     * )(value string|Array) -> string|array
     * ```
     *
     * @description
     * Prepend a string or an array.
     *
     * ```javascript [playground]
     * import prepend from 'https://unpkg.com/rubico/dist/x/prepend.es.js'
     *
     * const myArray = ['orange', 'apple']
     *
     * {
     *   const result = prepend(['ananas'])(myArray)
     *   console.log(result) // ['ananas', 'orange', 'apple']
     * }
     *
     * {
     *   const result = prepend('ananas')(myArray)
     *   console.log(result) // ['ananas', 'orange', 'apple']
     * }
     *
     * {
     *   const result = prepend('hello ')('world')
     *   console.log(result) // 'hello world'
     * }
     * ```
     *
     * @since 1.7.3
     */
    function prepend(item: any): (value: any) => string | any[];
}
declare module "x/size" {
    export = size;
    /**
     * @name size
     *
     * @synopsis
     * ```coffeescript [specscript]
     * size(value any) -> number
     * ```
     *
     * @description
     * Get the count of items in a value.
     *
     * ```javascript [playground]
     * import size from 'https://unpkg.com/rubico/dist/x/size.es.js'
     *
     * console.log(size([1, 2, 3])) // 3
     * console.log(size('hey')) // 3
     * console.log(size(new Set([1, 2, 3]))) // 3
     * ```
     */
    function size(value: any): any;
}
declare module "x/trace" {
    export = trace;
    /**
     * @name trace
     *
     * @synopsis
     * ```coffeescript [specscript]
     * var args ...any,
     *   resolved any,
     *   resolver ...args=>resolved
     *
     * trace(...args) -> args[0]
     *
     * trace(resolver)(...args) -> resolved
     * ```
     *
     * @description
     * Log a value out to the console, returning the value. If the value is a function, treat it as a resolver.
     *
     * ```javascript [playground]
     * import trace from 'https://unpkg.com/rubico/dist/x/trace.es.js'
     *
     * pipe([
     *   trace,
     *   trace(value => value.toUpperCase()),
     * ])('hey') // hey
     *           // HEY
     * console.log('check your console')
     * ```
     */
    function trace(...args: any[]): any;
}
declare module "x/unionWith" {
    export = unionWith;
    /**
     * @name unionWith
     *
     * @synopsis
     * ```coffeescript [specscript]
     * var T any,
     *   arrayOfArrays Array<Array<T>>,
     *   comparator (T, T)=>Promise|boolean
     *
     * unionWith(comparator)(arrayOfArrays) -> Array<T>
     * ```
     *
     * @description
     * Create an array of unique values from an array of arrays with uniqueness determined by a comparator. The comparator is a function that returns a boolean value, `true` if two given values are distinct.
     *
     * ```javascript [playground]
     * import isDeepEqual from 'https://unpkg.com/rubico/dist/x/isDeepEqual.es.js'
     * import unionWith from 'https://unpkg.com/rubico/dist/x/unionWith.es.js'
     *
     * console.log(
     *   unionWith(isDeepEqual)([
     *     [{ a: 1 }, { b: 2 }, { a: 1 }],
     *     [{ b: 2 }, { b: 2 }, { b: 2 }],
     *   ]),
     * ) // [{ a: 1 }, { b: 2 }]
     * ```
     *
     * @TODO setUnionWith
     */
    function unionWith(comparator: any): (value: any) => any;
}
declare module "x/uniq" {
    export = uniq;
    /**
     * @name uniq
     *
     * @synopsis
     * ```coffeescript [specscript]
     * var T any,
     *   array Array<T>
     *
     * uniq(array) -> Array
     * ```
     *
     * @description
     * Get an array of unique values from an array.
     *
     * ```javascript [playground]
     * import uniq from 'https://unpkg.com/rubico/dist/x/uniq.es.js'
     *
     * console.log(
     *   uniq([1, 2, 2, 3]),
     * ) // [1, 2, 3]
     * ```
     */
    function uniq(arr: any): any[];
}
declare module "x/unless" {
    export = unless;
    /**
     * @name unless
     *
     * @synopsis
     * ```coffeescript [specscript]
     * unless(
     *   predicate any=>Promise|boolean,
     *   func function,
     * )(value any) -> Promise|any
     * ```
     *
     * @description
     * Execute a function and return the result unless a condition is true, otherwise return the original value.
     *
     * ```javascript [playground]
     * import unless from 'https://unpkg.com/rubico/dist/x/unless.es.js'
     *
     * const isEven = num => num % 2 === 0
     * const doubleIfOdd = unless(isEven, num => num * 2)
     *
     * console.log(doubleIfOdd(100)) // 100
     * console.log(doubleIfOdd(101)) // 202
     * ```
     *
     * @since 1.7.3
     */
    function unless(predicate: any, func: any): (value: any) => any;
}
declare module "x/values" {
    export = values;
    /**
     * @name values
     *
     * @synopsis
     * ```coffeescript [specscript]
     * values<T>(
     *   object String<T>|Array<T>|Set<T>|Map<any=>T>|Object<T>,
     * ) -> Array<T>
     * ```
     *
     * @description
     * Get an array of values from an instance.
     *
     * ```javascript [playground]
     * import values from 'https://unpkg.com/rubico/dist/x/values.es.js'
     *
     * console.log(values({ a: 1, b: 2, c: 3 })) // [1, 2, 3]
     * console.log(values('abc')) // ['a', 'b', 'c']
     * console.log(values(new Map([[1, 'hello'], [2, 'world']]))) // ['hello', 'world']
     * ```
     */
    function values(object: any): any;
}
declare module "x/when" {
    export = when;
    /**
     * @name when
     *
     * @synopsis
     * ```coffeescript [specscript]
     * when(
     *   predicate any=>Promise|boolean,
     *   func function,
     * )(value any) -> Promise|any
     * ```
     *
     * @description
     * Execute a function and return the result when a condition is true, otherwise return the original value.
     *
     * ```javascript [playground]
     * import when from 'https://unpkg.com/rubico/dist/x/when.es.js'
     *
     * const isEven = num => num % 2 === 0
     * const doubleIfEven = when(isEven, num => num * 2)
     *
     * console.log(doubleIfEven(100)) // 200
     * console.log(doubleIfEven(101)) // 101
     * ```
     *
     * @since 1.7.1
     */
    function when(predicate: any, func: any): (value: any) => any;
}
declare module "x/isIn" {
    export = isIn;
    /**
     * @name isIn
     *
     * @synopsis
     * ```coffeescript [specscript]
     * isIn(container Array|Object|String|Set|Map)(value any) -> boolean
     * ```
     *
     * @description
     * Counterpart to includes. Check if a collection includes another value.
     *
     * ```javascript [playground]
     * import isIn from 'https://unpkg.com/rubico/dist/x/isIn.es.js'
     *
     * console.log(
     *   isIn([1, 2, 3](1)
     * ) // true
     *
     * console.log(
     *   isIn([1, 2, 3](4)
     * ) // false
     *
     * console.log(
     *   isIn({ a: 1 })(1)
     * ) // true
     *
     * console.log(
     *   isIn({ a: 1 })(2)
     * ) // true
     *
     * console.log(
     *   isIn('abc')('a')
     * ) // true
     *
     * console.log(
     *   isIn('abc')('ab')
     * ) // true
     *
     * console.log(
     *   isIn('abc')('d')
     * ) // false
     *
     * console.log(
     *   isIn(new Set([1, 2, 3]))(1)
     * ) // true
     *
     * console.log(
     *   isIn(new Set([1, 2, 3]))(4)
     * ) // false
     *
     * console.log(
     *   isIn(new Map([[1, 1], [2, 2], [3, 3]]))(1)
     * ) // true
     *
     * console.log(
     *   isIn(new Map([[1, 1], [2, 2], [3, 3]]))(4)
     * ) // false
     * ```
     */
    function isIn(...args: any[]): any;
}
declare module "x/index" {
    import append = require("x/append");
    import callProp = require("x/callProp");
    import defaultsDeep = require("x/defaultsDeep");
    import differenceWith = require("x/differenceWith");
    import filterOut = require("x/filterOut");
    import find = require("x/find");
    import findIndex = require("x/findIndex");
    import first = require("x/first");
    import flatten = require("x/flatten");
    import forEach = require("x/forEach");
    import groupBy = require("x/groupBy");
    import has = require("x/has");
    import identity = require("x/identity");
    import includes = require("x/includes");
    import isDeepEqual = require("x/isDeepEqual");
    import isEmpty = require("x/isEmpty");
    import isEqual = require("x/isEqual");
    import isFunction = require("x/isFunction");
    import isObject = require("_internal/isObject");
    import isString = require("x/isString");
    import keys = require("x/keys");
    import last = require("x/last");
    import maxBy = require("x/maxBy");
    import noop = require("x/noop");
    import pluck = require("x/pluck");
    import prepend = require("x/prepend");
    import size = require("x/size");
    import trace = require("x/trace");
    import unionWith = require("x/unionWith");
    import uniq = require("x/uniq");
    import unless = require("x/unless");
    import values = require("x/values");
    import when = require("x/when");
    import isIn = require("x/isIn");
    export { append, callProp, defaultsDeep, differenceWith, filterOut, find, findIndex, first, flatten, forEach, groupBy, has, identity, includes, isDeepEqual, isEmpty, isEqual, isFunction, isObject, isString, keys, last, maxBy, noop, pluck, prepend, size, trace, unionWith, uniq, unless, values, when, isIn };
}
declare module "dist-test" {
    export {};
}
declare module "distributor" {
    export {};
}
declare module "es" {
    export default rubico;
    namespace rubico {
        export { pipe };
        export { tap };
        export { switchCase };
        export { tryCatch };
        export { fork };
        export { assign };
        export { get };
        export { set };
        export { pick };
        export { omit };
        export { map };
        export { filter };
        export { reduce };
        export { transform };
        export { flatMap };
        export { and };
        export { or };
        export { not };
        export { any };
        export { all };
        export { eq };
        export { gt };
        export { lt };
        export { gte };
        export { lte };
        export { thunkify };
        export { always };
        export { curry };
        export { __ };
    }
    function pipe(...args: any[]): any;
    namespace pipe {
        export { pipeSync as sync };
    }
    function tap(func: any): (...args: any[]) => any;
    namespace tap {
        export { tapSync as sync };
        function _if(predicate: any, func: any): (...args: any[]) => any;
        export { _if as if };
    }
    function switchCase(values: any): any;
    function tryCatch(...args: any[]): any;
    function fork(funcs: any): (...args: any[]) => any;
    namespace fork {
        function series(funcs: any): (...args: any[]) => any;
    }
    function assign(funcs: any): (value: any) => any;
    function get(path: any, defaultValue: any): (value: any) => any;
    function set(path: any, value: any): (obj: any) => any;
    function pick(arg0: any, arg1: any): any;
    function omit(arg0: any, arg1: any): any;
    function map(...args: any[]): any;
    namespace map {
        function entries(mapper: any): (value: any) => any;
        function series(mapper: any): (value: any) => any;
        function pool(concurrencyLimit: any, mapper: any): (value: any) => any[] | Promise<any>;
        function withIndex(mapper: any): (value: any) => any;
        function own(mapper: any): (value: any) => {};
    }
    function filter(...args: any[]): any;
    namespace filter {
        function withIndex(predicate: any): (value: any) => any;
    }
    function reduce(...args: any[]): any;
    function transform(transducer: any, init: any): (...args: any[]) => any;
    function flatMap(flatMapper: any): (value: any) => any;
    function and(predicates: any): any;
    function or(predicates: any): any;
    function not(funcOrValue: any): boolean | ((value: any) => any);
    namespace not {
        export { notSync as sync };
    }
    function any(predicate: any): (value: any) => any;
    function all(predicate: any): (value: any) => any;
    function eq(left: any, right: any): boolean | ((value: any) => any);
    function gt(left: any, right: any): boolean | ((value: any) => any);
    function lt(left: any, right: any): boolean | ((value: any) => any);
    function gte(left: any, right: any): boolean | ((value: any) => any);
    function lte(left: any, right: any): boolean | ((value: any) => any);
    function thunkify(func: any, ...args: any[]): () => any;
    function always(value: any): () => any;
    function curry(func: any, ...args: any[]): any;
    namespace curry {
        function arity(arity: any, func: any, ...args: any[]): any;
    }
    const __: unique symbol;
    function pipeSync(funcs: any): any;
    function tapSync(func: any): (...args: any[]) => any;
    function notSync(func: any): (...args: any[]) => boolean;
}
declare module "global" {
    export {};
}
declare module "index" {
    export = rubico;
}
declare module "_internal/sha256" {
    export = sha256;
    function sha256(value: any): any;
}
declare module "test" {
    export {};
}
