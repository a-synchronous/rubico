const timeInLoop = require('../x/timeInLoop')
const isObject = require('./isObject')
const _ = require('lodash')

/**
 * @name isObject
 *
 * @benchmark
 * isObject({}): 1e+7: 14.796ms
 * _.isObject({}): 1e+7: 14.601ms
 *
 * richytong 2020-10-01
 * isObject({}): 1e+7: 14.69ms
 * _.isObject({}): 1e+7: 14.536ms
 */

// timeInLoop('isObject({})', 1e7, () => isObject({}))

const _isObject = _.isObject

// timeInLoop('_.isObject({})', 1e7, () => _isObject({}))
