const Test = require('thunk-test')
const values = require('./values')

describe('values', () => {
  const Foo = function () {
    this.a = 1
    this.b = 2
  }

  Foo.prototype.toString = () => '[object Foo]'

  Foo.prototype.c = 3

  it('gets an array of an object\'s values', async () => {
    Test(values)
      .case([1, 2, 3], [1, 2, 3])
      .case([], [])
      .case({ a: 1, b: 2, c: 3 }, [1, 2, 3])
      .case({}, [])
      .case(new Set([1, 2, 3]), [1, 2, 3])
      .case(new Set(), [])
      .case(new Map([[1, 1], [2, 2], [3, 3]]), [1, 2, 3])
      .case(new Map(), [])
      .case('hey', ['h', 'e', 'y'])
      .case(10, [])
      .case(new Foo(), [1, 2])
      .case(null, [])
      .case(undefined, [])()
  })
})
