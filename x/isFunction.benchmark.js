const timeInLoop = require('./timeInLoop')
const _ = require('lodash')
const isFunction = require('./isFunction')

/**
 * @name isFunction
 *
 * @benchmark
 * isFunction(f): 1e+7: 12.667ms
 * _isFunction(f): 1e+7: 12.677ms
 */

const _isFunction = _.isFunction

const f = () => {}

// timeInLoop('isFunction(f)', 1e7, () => isFunction(f))

// timeInLoop('_isFunction(f)', 1e7, () => isFunction(f))
