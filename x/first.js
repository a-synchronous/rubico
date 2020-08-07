const PossiblePromise = require('../monad/PossiblePromise')
const Instance = require('../monad/Instance')

/*
 * @synopsis
 * new Orderable(x string|Array) -> Orderable
 */
const Orderable = function(x) {
  this.value = x
}

/*
 * @synopsis
 * Orderable.isOrderable(x string|Array) -> boolean
 */
Orderable.isOrderable = x => (Instance.isInstance(x)
  && (Instance.isArray(x) || Instance.isString(x)))

/*
 * @synopsis
 * new Orderable(x string).item(i number) -> string
 *
 * new Orderable(x Array).item(i number) -> any
 */
Orderable.prototype.item = function(i) {
  return this.value[i]
}

/*
 * @name
 * first
 *
 * @synopsis
 * first(x Promise<string>|string) -> firstChar string
 *
 * first(x Promise<Array>|Array) -> firstItem any
 *
 * @catchphrase
 * Get the first item from an orderable collection
 */
const first = PossiblePromise.args(x => {
  if (Orderable.isOrderable(x)) return new Orderable(x).item(0)
  throw new TypeError('first(x); x is not an Array or String')
})

module.exports = first
