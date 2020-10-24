const assert = require('assert')
const identity = require('./identity')
const ThunkTest = require('thunk-test')

describe('identity', () => {
  it('returns whatever was passed to it', ThunkTest('identity', identity)
    .case(1, 1)
    .case('hey', 'hey')
    .case(NaN, result => assert(isNaN(result)))
  )
})
