/**
 * @name NextIteration
 *
 * @synopsis
 * NextIteration(value any) -> nextIteration { value, done: false }
 *
 * @description
 * Create an object to send for the next iteration
 */
const NextIteration = value => ({ value, done: false })

module.exports = NextIteration
