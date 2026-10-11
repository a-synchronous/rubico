import pipe from './pipe.mjs'
import compose from './compose.mjs'
import tap from './tap.mjs'
import all from './all.mjs'
import assign from './assign.mjs'
import tryCatch from './tryCatch.mjs'
import switchCase from './switchCase.mjs'
import map from './map.mjs'
import filter from './filter.mjs'
import reduce from './reduce.mjs'
import transform from './transform.mjs'
import flatMap from './flatMap.mjs'
import forEach from './forEach.mjs'
import some from './some.mjs'
import every from './every.mjs'
import and from './and.mjs'
import or from './or.mjs'
import not from './not.mjs'
import eq from './eq.mjs'
import gt from './gt.mjs'
import lt from './lt.mjs'
import gte from './gte.mjs'
import lte from './lte.mjs'
import get from './get.mjs'
import set from './set.mjs'
import pick from './pick.mjs'
import omit from './omit.mjs'
import thunkify from './thunkify.mjs'
import always from './always.mjs'
import curry from './curry.mjs'
import __ from './__.mjs'

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
  pipe, compose,

  tap, forEach,

  switchCase,

  tryCatch,

  all, assign, get, set, pick, omit,

  map, filter, flatMap, reduce, transform,

  and, or, not, some, every,

  eq, gt, lt, gte, lte,

  thunkify, always, curry, __,
}

export default rubico
