const isPromise = require('./_internal/isPromise')
const __ = require('./_internal/placeholder')
const curry3 = require('./_internal/curry3')
const curryArgs3 = require('./_internal/curryArgs3')
const genericReduce = require('./_internal/genericReduce')

/**
 * @name reduce
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Reducer<T> = (any, T)=>Promise|any
 * Foldable<T> = Iterable<T>|AsyncIterable<T>|{ reduce: Reducer<T>=>any }|Object<T>
 *
 * var T any,
 *   args ...any,
 *   reducer Reducer<T>,
 *   init (...args=>Promise|any)|any,
 *   foldable Foldable<T>
 *   generatorFunction ...args=>Generator<Promise|T>,
 *   asyncGeneratorFunction ...args=>AsyncGenerator<T>,
 *   moreReducers ...Reducer<T>
 *
 * reduce(reducer, init?)(foldable) -> Promise|any
 *
 * reduce(reducer, init?)(generatorFunction) -> ...args=>Promise|any
 *
 * reduce(reducer, init?)(asyncGeneratorFunction) -> ...args=>Promise|any
 *
 * reduce(reducer, init?)(...moreReducers) -> ...args=>Promise|any
 * ```
 *
 * @description
 * Execute a reducer for each item of a collection, returning a single output value.
 *
 * ```javascript [playground]
 * const max = (a, b) => a > b ? a : b
 *
 * console.log(
 *   reduce(max)([1, 3, 5, 4, 2]),
 * ) // 5
 * ```
 *
 * If an optional initialization parameter is supplied, the result starts as that parameter rather than the first item of the collection. For memory and performance, this library makes no assumptions about immutability. Handle references for this initial value with care, as they could be mutated.
 *
 * ```javascript [playground]
 * const add = (a, b) => a + b
 *
 * console.log(
 *   reduce(add)([1, 2, 3, 4, 5], 0),
 * ) // 15
 * ```
 *
 * If the initialization parameter is a function, it is treated as a resolver and called with the input arguments to resolve an initial value for the accumulator at execution time.
 *
 * ```javascript [playground]
 * const concatSquares = (array, value) => array.concat(value ** 2)
 *
 * const initEmptyArray = () => []
 *
 * console.log(
 *   reduce(concatSquares, initEmptyArray)([1, 2, 3, 4, 5]),
 * ) // [1, 4, 9, 16, 25]
 * ```
 *
 * Fully asynchronous reducing operations are possible with asynchronous reducers and asynchronous data streams.
 *
 * ```javascript [playground]
 * const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
 *
 * // asyncAppReducer(
 * //   state { todos: Array },
 * //   action { type: string, todoID: string },
 * // ) -> state
 * const asyncAppReducer = async function (state, action) {
 *   if (action.type == 'FETCH_TODO') {
 *     const todo = await fetch(
 *       'https://jsonplaceholder.typicode.com/todos/' + action.todoID,
 *     ).then(response => response.json())
 *     console.log('fetched', todo)
 *     state.todos.push(todo)
 *     return state
 *   }
 *   return state
 * }
 *
 * const asyncFetchActions = async function* (count) {
 *   let idCount = 0
 *   while (++idCount <= count) {
 *     await sleep(1000)
 *     yield { type: 'FETCH_TODO', todoID: idCount }
 *   }
 * }
 *
 * const state = { todos: [] }
 *
 * reduce(asyncAppReducer, state)(asyncFetchActions(5)).then(
 *   reducedState => console.log('finalState', reducedState))
 *
 * // fetched { userId: 1, id: 1, title: 'delectus aut autem', completed: false }
 * // fetched { userId: 1, id: 2, title: 'quis ut nam facilis...', completed: false }
 * // fetched { userId: 1, id: 3, title: 'fugiat veniam minus', completed: false }
 * // fetched { userId: 1, id: 4, title: 'et porro tempora', completed: true }
 * // fetched { userId: 1, id: 5, title: 'laboriosam mollitia...', completed: false }
 * // finalState {
 * //   todos: [
 * //     { userId: 1, id: 1, title: 'delectus aut autem', completed: false },
 * //     { userId: 1, id: 2, title: 'quis ut nam facilis...', completed: false },
 * //     { userId: 1, id: 3, title: 'fugiat veniam minus', completed: false },
 * //     { userId: 1, id: 4, title: 'et porro tempora', completed: true },
 * //     { userId: 1, id: 5, title: 'laboriosam mollitia...', completed: false },
 * //   ],
 * // }
 * ```
 *
 * If the first argument to a reducing function is a reducer, `reduce` concatenates any reducers in argument position onto the initial reducer, producing a combined reducer that performs a chained operation per each item in a reducing operation.
 *
 * ```javascript [playground]
 * const reducerA = (state, action) => {
 *   if (action.type == 'A') return { ...state, A: true }
 *   return state
 * }
 *
 * const reducerB = (state, action) => {
 *   if (action.type == 'B') return { ...state, B: true }
 *   return state
 * }
 *
 * const reducerC = (state, action) => {
 *   if (action.type == 'C') return { ...state, C: true }
 *   return state
 * }
 *
 * // state => state
 * const traceMiddleware = tap(
 *   (state, action) => console.log('state, action', state, action))
 *
 * const reducingABC = reduce(
 *   traceMiddleware, () => ({}))(reducerA, reducerB, reducerC)
 *
 * const actions = [{ type: 'A' }, { type: 'B' }, { type: 'C' }]
 *
 * console.log(
 *   'final state:',
 *   reducingABC(actions),
 * ) // { A: true, B: true, C: true }
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

const reduce = function (reducer, init) {
  if (typeof init == 'function') {
    return function reducing(...args) {
      const result = init(...args)
      return isPromise(result)
        ? result.then(curry3(genericReduce, args, reducer, __))
        : genericReduce(args, reducer, result)
    }
  }
  return curryArgs3(genericReduce, __, reducer, init)
}

module.exports = reduce
