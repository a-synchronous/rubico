const timeInLoop = require('../x/timeInLoop')

/**
 * @name typeofNumber
 *
 * @benchmarks
 * typeof (1) == 'number': 1e+7: 12.459ms
 * (1).constructor == Number: 1e+7: 12.729ms
 */

// timeInLoop('typeof (1) == \'number\'', 1e7, () => { typeof (1) == 'number' })

// timeInLoop('(1).constructor == Number', 1e7, () => { (1).constructor == Number })

/**
 * @name copyArray
 *
 * @benchmarks
 * arr.slice(0): 1e+6: 16.683ms
 * arr.slice(): 1e+6: 16.358ms
 * arr.concat(): 1e+6: 176.57ms
 * Array.from(arr): 1e+6: 27.923ms
 * arrayFromForLoopPush(arr): 1e+6: 84.221ms
 * [...arr]: 1e+6: 23.789ms
 */

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const arrayFromForLoopPush = x => {
  const y = []
  for (const xi of x) y.push(xi)
  return y
}

// timeInLoop('arr.slice(0)', 1e6, () => arr.slice(0))

// timeInLoop('arr.slice()', 1e6, () => arr.slice())

// timeInLoop('arr.concat()', 1e6, () => arr.concat())

// timeInLoop('Array.from(arr)', 1e6, () => Array.from(arr))

// timeInLoop('arrayFromForLoopPush(arr)', 1e6, () => arrayFromForLoopPush(arr))

// timeInLoop('[...arr]', 1e6, () => [...arr])

/**
 * @name copyObject
 *
 * @benchmarks
 * Object.assign({}, obj): 1e+6: 163.58ms
 * objectFromForLoop(obj): 1e+6: 179.523ms
 * { ...obj }: 1e+6: 46.614ms
 */

const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 }

const objectFromForLoop = x => {
  const y = {}
  for (const key in x) y[key] = x[key]
  return y
}

// timeInLoop('Object.assign({}, obj)', 1e6, () => Object.assign({}, obj))

// timeInLoop('objectFromForLoop(obj)', 1e6, () => objectFromForLoop(obj))

// timeInLoop('{ ...obj }', 1e6, () => ({ ...obj }))

/**
 * @name copySet
 *
 * @benchmarks
 * new Set(set): 1e+5: 91.358ms
 * setFromForLoop(set): 1e+5: 66.598ms
 */

const set = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

const setFromForLoop = x => {
  const y = new Set()
  for (const item of x) y.add(item)
  return y
}

// timeInLoop('new Set(set)', 1e5, () => new Set(set))

// timeInLoop('setFromForLoop(set)', 1e5, () => setFromForLoop(set))

/**
 * @name copyMap
 *
 * @benchmarks
 * new Map(map): 1e+5: 65.702ms
 * mapFromForLoopSpreadOperator(set): 1e+5: 53.743ms
 * mapFromForLoopDestructuring(set): 1e+5: 55.4ms
 */

const map = new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]])

const mapFromForLoopSpreadOperator = x => {
  const y = new Map()
  for (const entry of x) y.set(...entry)
  return y
}

const mapFromForLoopDestructuring = x => {
  const y = new Map()
  for (const [k, v] of x) y.set(k, v)
  return y
}

// timeInLoop('new Map(map)', 1e5, () => new Map(map))

// timeInLoop('mapFromForLoopSpreadOperator(map)', 1e5, () => mapFromForLoopSpreadOperator(map))

// timeInLoop('mapFromForLoopDestructuring(map)', 1e5, () => mapFromForLoopDestructuring(map))
