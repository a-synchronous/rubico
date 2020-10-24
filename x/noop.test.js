const noop = require('./noop')
const ThunkTest = require('thunk-test')

describe('noop', () => {
  it('doesn\'t do anything', ThunkTest('noop', noop)
    .case(123, undefined)
    .case(null, undefined)
    .case({}, undefined)
    .case([], undefined)
  )
})
