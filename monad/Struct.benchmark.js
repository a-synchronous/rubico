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

const arr = [1, 2, 3]

const structGet = Struct.get

// timeInLoop('structGet(arr, 0)', 1e7, () => structGet(x, 0))

// const structGetTernary = Struct.get.ternary

// timeInLoop('structGetTernary(arr, 0)', 1e7, () => structGetTernary(x, 0))

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

const structSize = Struct.size

const _size = _.size

// timeInLoop('structSize(arr)', 1e7, () => structSize(arr))

// timeInLoop('_.size(arr)', 1e7, () => _.size(arr))

const obj = { a: 1, b: 2, c: 3 }

// timeInLoop('structSize(obj)', 1e7, () => structSize(obj))

// const structSizeObjectKeys = structSize.objectKeys

// timeInLoop('structSize(obj)', 1e7, () => structSizeObjectKeys(obj))

// timeInLoop('_.size(obj)', 1e7, () => _.size(obj))
