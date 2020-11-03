const groupBy = require('./groupBy')
const Test = require('thunk-test')

describe('groupBy', () => {
  it('Groups a foldable collection into a Map of arrays by a property on each of its elements', async () => {
    Test(groupBy('age'))
      .case(
        [{ age: 21 }, { age: 22 }, { age: 21 }, { age: 23 }, { age: 21 }],
        new Map([
          [21, [{ age: 21 }, { age: 21 }, { age: 21 }]],
          [22, [{ age: 22 }]],
          [23, [{ age: 23 }]],
        ]))
      .case(
        new Set([{ age: 21 }, { age: 22 }, { age: 21 }, { age: 23 }, { age: 21 }]),
        new Map([
          [21, [{ age: 21 }, { age: 21 }, { age: 21 }]],
          [22, [{ age: 22 }]],
          [23, [{ age: 23 }]],
        ]))()
  })
  it('Groups a foldable collection into a Map of arrays by a resolver for each of its elements', async () => {
    Test(groupBy(object => object.age))
      .case(
        [{ age: 21 }, { age: 22 }, { age: 21 }, { age: 23 }, { age: 21 }],
        new Map([
          [21, [{ age: 21 }, { age: 21 }, { age: 21 }]],
          [22, [{ age: 22 }]],
          [23, [{ age: 23 }]],
        ]))
      .case(
        new Set([{ age: 21 }, { age: 22 }, { age: 21 }, { age: 23 }, { age: 21 }]),
        new Map([
          [21, [{ age: 21 }, { age: 21 }, { age: 21 }]],
          [22, [{ age: 22 }]],
          [23, [{ age: 23 }]],
        ]))()
  })
  it('above but async', async () => {
    Test(groupBy(async object => object.age))
      .case(
        [{ age: 21 }, { age: 22 }, { age: 21 }, { age: 23 }, { age: 21 }],
        new Map([
          [21, [{ age: 21 }, { age: 21 }, { age: 21 }]],
          [22, [{ age: 22 }]],
          [23, [{ age: 23 }]],
        ]))
      .case(
        new Set([{ age: 21 }, { age: 22 }, { age: 21 }, { age: 23 }, { age: 21 }]),
        new Map([
          [21, [{ age: 21 }, { age: 21 }, { age: 21 }]],
          [22, [{ age: 22 }]],
          [23, [{ age: 23 }]],
        ]))()
  })
})
