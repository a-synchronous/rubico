const timeInLoop = require('../x/timeInLoop')
const Struct = require('./Struct')

/*
 * @name Struct.get
 *
 * @benchmark
 * structGet: 1e+7: 13.472ms
 * structGetTernary: 1e+7: 13.414ms
 */

const x = [1, 2, 3]

const structGet = Struct.get

// timeInLoop('structGet', 1e7, () => structGet(x, 0))

const structGetTernary = Struct.get.ternary

// timeInLoop('structGetTernary', 1e7, () => structGetTernary(x, 0))
