/**
 * @name iterationMap
 *
 * @synopsis
 * iterationMap<
 *   T any,
 *   iteration { value: T, done: boolean },
 *   mapper T=>any,
 * >(iteration, mapper) -> nextIteration { value: any, done: boolean }
 *
 * @description
 * Apply a mapper to an iteration. Noop if iteration is done.
 */
const iterationMap = (iteration, mapper) =>
  iteration.done ? iteration : { value: mapper(iteration.value), done: false }

module.exports = iterationMap
