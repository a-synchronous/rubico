const timeInLoop = require('../x/timeInLoop')
const Struct = require('./Struct')
const _ = require('lodash')

/**
 * @name Struct.get
 *
 * @benchmark
 * structGet(arr, 0): 1e+7: 13.472ms
 * structGetTernary(arr, 0): 1e+7: 13.414ms
 */

{
  const arr = [1, 2, 3]

  const structGet = Struct.get

  // timeInLoop('structGet(arr, 0)', 1e7, () => structGet(x, 0))

  // const structGetTernary = Struct.get.ternary

  // timeInLoop('structGetTernary(arr, 0)', 1e7, () => structGetTernary(x, 0))
}

/**
 * @name Struct.set
 *
 * @benchmark
 * arr[5] = 6: 1e+7: 12.785ms
 * structSet(arr, 6, 5): 1e+7: 13.989ms
 *
 * obj['f'] = 6: 1e+7: 12.857ms
 * structSet(obj, 6, 'f'): 1e+7: 14.154ms
 *
 * set.add(6): 1e+7: 95.934ms
 * structSet(set, 6): 1e+7: 97.659ms
 *
 * map.set('f', 6): 1e+7: 138.455ms
 * structSet(map, 6, 'f'): 1e+7: 139.162ms
 */

{
  const arr = [1, 2, 3, 4, 5]

  const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 }

  const set = new Set([1, 2, 3, 4, 5])

  const map = new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]])

  const structSet = Struct.set

  // timeInLoop('arr[5] = 6', 1e7, () => { arr[5] = 6 })

  // timeInLoop('structSet(arr, 6, 5)', 1e7, () => structSet(arr, 6, 5))

  // timeInLoop('obj[\'f\'] = 6', 1e7, () => { obj['f'] = 6 })

  // timeInLoop('structSet(obj, 6, \'f\')', 1e7, () => structSet(obj, 6, 'f'))

  // timeInLoop('set.add(6)', 1e7, () => set.add(6))

  // timeInLoop('structSet(set, 6)', 1e7, () => structSet(set, 6))

  // timeInLoop('map.set(\'f\', 6)', 1e7, () => map.set('f', 6))

  timeInLoop('structSet(map, 6, \'f\')', 1e7, () => structSet(map, 6, 'f'))
}

/**
 * @name Struct.size
 *
 * @benchmark
 * structSize(arr): 1e+7: 14.043ms
 * _.size(arr): 1e+7: 583.972ms
 *
 * structSize(obj): 1e+7: 117.314ms
 * structSizeObjectKeys(obj): 1e+7: 213.629ms
 * _.size(obj): 1e+7: 664.905ms
 */

{
  const structSize = Struct.size

  const _size = _.size

  // timeInLoop('structSize(arr)', 1e7, () => structSize(arr))

  // timeInLoop('_.size(arr)', 1e7, () => _.size(arr))

  const obj = { a: 1, b: 2, c: 3 }

  // timeInLoop('structSize(obj)', 1e7, () => structSize(obj))

  // const structSizeObjectKeys = structSize.objectKeys

  // timeInLoop('structSize(obj)', 1e7, () => structSizeObjectKeys(obj))

  // timeInLoop('_.size(obj)', 1e7, () => _.size(obj))
}

/**
 * @name Struct.copy
 *
 * @benchmark
 * arr.slice(): 1e+6: 18.674ms
 * Array.from(arr): 1e+6: 28.472ms
 * [...arr]: 1e+6: 24.933ms
 * Struct.copy(arr): 1e+6: 19.488ms
 *
 * ({ ...obj }): 1e+6: 40.274ms
 * Object.assign({}, obj): 1e+6: 164.081ms
 * Struct.copy(obj): 1e+6: 46.345ms
 *
 * new Set(set): 1e+6: 812.338ms
 * Struct.copy(set): 1e+6: 569.508ms
 *
 * new Map(map): 1e+6: 303.057ms
 * Struct.copy(map): 1e+6: 186.628ms
 */

{
  const structCopy = Struct.copy

  const arr = [1, 2, 3, 4, 5]

  const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 }

  const set = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

  const map = new Map([['a', 1], ['b', 2], ['c', 3]])

  // timeInLoop('arr.slice()', 1e6, () => arr.slice())

  // timeInLoop('Array.from(arr)', 1e6, () => Array.from(arr))

  // timeInLoop('[...arr]', 1e6, () => [...arr])

  // timeInLoop('Struct.copy(arr)', 1e6, () => structCopy(arr))

  // timeInLoop('({ ...obj })', 1e6, () => ({ ...obj }))

  // timeInLoop('Object.assign({}, obj)', 1e6, () => Object.assign({}, obj))

  // timeInLoop('Struct.copy(obj)', 1e6, () => structCopy(obj))

  // timeInLoop('new Set(set)', 1e6, () => new Set(set))

  // timeInLoop('Struct.copy(set)', 1e6, () => structCopy(set))

  // timeInLoop('new Map(map)', 1e6, () => new Map(map))

  // timeInLoop('Struct.copy(map)', 1e6, () => structCopy(map))
}
