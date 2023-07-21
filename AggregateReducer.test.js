const assert = require('assert')
const reduce = require('./reduce')
const AggregateReducer = require('./AggregateReducer')

describe('AggregateReducer', () => {
  it('Combines reducers', async () => {
    const reducerA = (state, action) => {
      if (action.type == 'A') {
        return { ...state, A: true }
      }
      return state
    }
    const reducerB = (state, action) => {
      if (action.type == 'B') {
        return { ...state, B: true }
      }
      return state
    }
    const reducerC = (state, action) => {
      if (action.type == 'C') {
        return { ...state, C: true }
      }
      return state
    }

    const combinedReducer = AggregateReducer([
      reducerA,
      reducerB,
      reducerC,
    ])

    const stateA = [{ type: 'A' }].reduce(combinedReducer, {})
    assert.deepEqual(stateA, { A: true })

    const stateAB = [{ type: 'A' }, { type: 'B' }].reduce(combinedReducer, {})
    assert.deepEqual(stateAB, { A: true, B: true })

    const stateABC = [{ type: 'A' }, { type: 'B' }, { type: 'C' }].reduce(combinedReducer, {})
    assert.deepEqual(stateABC, { A: true, B: true, C: true })
  })

  it('Combines async reducers', async () => {
    const reducerA = async (state, action) => {
      if (action.type == 'A') {
        return { ...state, A: true }
      }
      return state
    }
    const reducerB = async (state, action) => {
      if (action.type == 'B') {
        return { ...state, B: true }
      }
      return state
    }
    const reducerC = async (state, action) => {
      if (action.type == 'C') {
        return { ...state, C: true }
      }
      return state
    }

    const combinedReducer = AggregateReducer([
      reducerA,
      reducerB,
      reducerC,
    ])

    const stateA = await reduce([{ type: 'A' }], combinedReducer, {})
    assert.deepEqual(stateA, { A: true })

    const stateAB = await reduce([{ type: 'A' }, { type: 'B' }], combinedReducer, {})
    assert.deepEqual(stateAB, { A: true, B: true })

    const stateABC = await reduce([{ type: 'A' }, { type: 'B' }, { type: 'C' }], combinedReducer, {})
    assert.deepEqual(stateABC, { A: true, B: true, C: true })
  })

  it('Identity', async () => {
    const identity = AggregateReducer([])
    assert.equal(1, identity(1))
  })
})
