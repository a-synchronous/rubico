/**
 * @name Transducer
 *
 * @description
 * Temporary repository of transducer functionality throughout rubico v1
 */
const Transducer = function () {}

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
Transducer.map = function map() {}

module.exports = Transducer
