const timeInLoop = require('../x/timeInLoop')
const PossiblePromise = require('./PossiblePromise')

/**
 * @name PossiblePromise.then
 *
 * @benchmark
 * square(3): 1e+7: 13.162ms
 * square_PossiblePromiseThen(3): 1e+7: 15.374ms
 *
 * square_promiseThen: 1e+5: 27.686ms
 * square_PossiblePromiseThen(p5): 1e+5: 28.596ms
 */

const square = x => x ** 2

// timeInLoop('square(3)', 1e7, () => square(3))

const square_PossiblePromiseThen = p => PossiblePromise.then(p, square)

// timeInLoop('square_PossiblePromiseThen(3)', 1e7, () => square_PossiblePromiseThen(3))

const p5 = Promise.resolve(5)

const square_promiseThen = () => p5.then(square)

// timeInLoop('square_promiseThen', 1e5, () => square_promiseThen(p5))

// timeInLoop('square_PossiblePromiseThen(p5)', 1e5, () => square_PossiblePromiseThen(p5))

/**
 * @name PossiblePromise.all
 *
 * @benchmark
 * promiseAll([resolvedPromise]): 1e+5: 150.068ms
 * possiblePromiseAll([resolvedPromise]): 1e+5: 154.41ms
 *
 * sum([1, 2, 3]): 1e+6: 11.096ms
 * possiblePromiseAll([1, 2, 3]).then([sum]): 1e+6: 17.291ms
 */

const promiseAll = Promise.all.bind(Promise)

const resolvedPromise = Promise.resolve()

const possiblePromiseAll = PossiblePromise.all

const sum = ([a, b, c]) => a + b + c

// timeInLoop('promiseAll([resolvedPromise])', 1e5, () => promiseAll([resolvedPromise]))

// timeInLoop('possiblePromiseAll([resolvedPromise])', 1e5, () => possiblePromiseAll([resolvedPromise]))

// timeInLoop('sum([1, 2, 3])', 1e6, () => sum([1, 2, 3]))

// timeInLoop('possiblePromiseAll([1, 2, 3]).then([sum])', 1e6, () => possiblePromiseAll([1, 2, 3]).then(sum))

/**
 * @name PossiblePromise.args
 *
 * @benchmark
 * add(1, 2): 1e+6: 4.012ms
 * PossiblePromise.argsSome(add)(1, 2): 1e+6: 11.062ms
 * PossiblePromise.argsSomeApply(add)(1, 2): 1e+6: 11.33ms
 * PossiblePromise.argumentsLoop(add)(1, 2): 1e+6: 17.076ms
 * PossiblePromise.argsLoop(add)(1, 2): 1e+6: 47.844ms
 */

const add = (a, b) => a + b

// timeInLoop('add(1, 2)', 1e6, () => add(1, 2))

// const possiblePromiseArgsSomeAdd = PossiblePromise.args(add)

// timeInLoop('PossiblePromise.argsSome(add)(1, 2)', 1e6, () => possiblePromiseArgsSomeAdd(1, 2))

// const possiblePromiseArgsSomeApplyAdd = PossiblePromise.argsSomeApply(add)

// timeInLoop('PossiblePromise.argsSomeApply(add)(1, 2)', 1e6, () => possiblePromiseArgsSomeApplyAdd(1, 2))

// const possiblePromiseArgumentsLoopAdd = PossiblePromise.argumentsLoop(add)

// timeInLoop('PossiblePromise.argumentsLoop(add)(1, 2)', 1e6, () => possiblePromiseArgumentsLoopAdd(1, 2))

// const possiblePromiseArgsLoopAdd = PossiblePromise.argsLoop(add)

// timeInLoop('PossiblePromise.argsLoop(add)(1, 2)', 1e6, () => possiblePromiseArgsLoopAdd(1, 2))
