const { pipe, switchCase, or, eq, get } = require('..')
const isString = require('./isString')
const is = require('./is')

const isEmpty = switchCase([
  is(Array), eq(0, get('length')),
  or([
    is(Set),
    is(Map),
  ]), eq(0, get('size')),
  is(Object), eq(0, pipe([Object.keys, get('length')])),
  () => {
    throw new TypeError('isEmpty(x); x invalid')
  },
])

module.exports = isEmpty
