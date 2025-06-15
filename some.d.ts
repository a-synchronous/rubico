export = some;
/**
 * @name some
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Foldable = Array|Iterable|AsyncIterable|{ reduce: function }|Object
 *
 * some(collection Foldable, predicate function) -> Promise|boolean
 *
 * some(predicate function)(collection Foldable) -> Promise|boolean
 * ```
 *
 * @description
 * Test a predicate concurrently across all elements of a collection, returning true if any executions return truthy.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * console.log(
 *   some([1, 2, 3, 4, 5], isOdd),
 * ) // true
 * ```
 *
 * The collection can be any iterable, async iterable, or object values iterable collection. Below is an example of `some` accepting an async generator as the collection.
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
 * const promise = some(todoIDsGenerator(), async id => {
 *   const todo = await fetchTodo(id)
 *   return todo.title.startsWith('fugiat')
 * })
 *
 * promise.then(console.log) // true
 * ```
 *
 * `some` supports a lazy API for composability.
 *
 * ```javascript [playground]
 * pipe([1, 2, 3], [
 *   some(number => number < 5),
 *   console.log, // true
 * ])
 * ```
 *
 * @execution concurrent
 *
 * @muxing
 *
 * @related or
 */
declare function some(...args: any[]): any;
