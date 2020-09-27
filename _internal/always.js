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
const always = value => function getter() { return value }

module.exports = always
