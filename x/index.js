const defaultsDeep = require('./defaultsDeep')
const find = require('./find')
const first = require('./first')
const flatten = require('./flatten')
const forEach = require('./forEach')
const identity = require('./identity')
const isDeepEqual = require('./isDeepEqual')
const isEmpty = require('./isEmpty')
const isEqual = require('./isEqual')
const isFunction = require('./isFunction')
const isObject = require('./isObject')
const isString = require('./isString')
const last = require('./last')
const noop = require('./noop')
const pluck = require('./pluck')
const size = require('./size')
const trace = require('./trace')
const unionWith = require('./unionWith')
const uniq = require('./uniq')

const rubicoX = {
  defaultsDeep,
  find,
  first,
  flatten,
  forEach,
  identity,
  is,
  isDeepEqual,
  isEmpty,
  isEqual,
  isFunction,
  isObject,
  isString,
  last,
  noop,
  pluck,
  size,
  timeInLoop,
  trace,
  tracef,
  unionWith,
  uniq,
}

module.exports = rubicoX
