const pipe = require('./pipe')
const fork = require('./fork')
const assign = require('./assign')
const tap = require('./tap')
const tryCatch = require('./tryCatch')
const switchCase = require('./switchCase')
const map = require('./map')
const filter = require('./filter')
const reduce = require('./reduce')
const transform = require('./transform')
const flatMap = require('./flatMap')
const any = require('./any')
const all = require('./all')
const and = require('./and')
const or = require('./or')
const not = require('./not')
const eq = require('./eq')
const gt = require('./gt')
const lt = require('./lt')
const gte = require('./gte')
const lte = require('./lte')
const get = require('./get')
const set = require('./set')
const pick = require('./pick')
const omit = require('./omit')
const thunkify = require('./thunkify')
const always = require('./always')
const curry = require('./curry')
const __ = require('./__')

/**
 * design principles
 *
 * rubico is a module, not a grab bag
 * functional code should not care about async
 * exported methods are time and space optimal
 * memory used by exported methods is properly garbage collected
 * no special types; use built-in types
 * avoid variadic functions; use lists
 * avoid anonymous function creation; use names and factory functions
 * avoid creating functions inside functions
 */

const rubico = {
  pipe, tap,
  switchCase, tryCatch,
  fork, assign, get, set, pick, omit,
  map, filter, reduce, transform, flatMap,
  and, or, not, any, all,
  eq, gt, lt, gte, lte,
  thunkify, always,
  curry, __,
}

module.exports = rubico
