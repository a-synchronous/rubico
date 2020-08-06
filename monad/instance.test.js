const assert = require('assert')
const Instance = require('./instance')

describe('Instance', () => {
  describe('new Instance(x !null&!undefined) -> Instance', () => {
    it('x 1; Instance<1>', async () => {
      assert.strictEqual(new Instance(1).constructor.name, 'Instance')
      assert(new Instance(1).value === 1)
    })
    it('x null; TypeError', async () => {
      assert.throws(
        () => new Instance(null),
        new TypeError('cannot convert null to Instance'),
      )
    })
    it('x undefined; TypeError', async () => {
      assert.throws(
        () => new Instance(undefined),
        new TypeError('cannot convert undefined to Instance'),
      )
    })
  })

  describe('Instance.isInstance(x any) -> boolean', () => {
    it('x 1; true', async () => {
      assert.strictEqual(Instance.isInstance(1), true)
    })
    it('x null; false', async () => {
      assert.strictEqual(Instance.isInstance(null), false)
    })
    it('x undefined; false', async () => {
      assert.strictEqual(Instance.isInstance(undefined), false)
    })
  })

  describe('Instance.is(x !null&!undefined, constructor function) -> boolean', () => {
    it('x 1, constructor Number; true', async () => {
      assert.strictEqual(Instance.is(1, Number), true)
    })
    it('x 1, constructor String; false', async () => {
      assert.strictEqual(Instance.is(1, String), false)
    })
    it('x null; TypeError', async () => {
      assert.throws(
        () => Instance.is(null, Object),
        new TypeError('Cannot read property \'constructor\' of null'),
      )
    })
    it('x undefined; TypeError', async () => {
      assert.throws(
        () => Instance.is(undefined, Object),
        new TypeError('Cannot read property \'constructor\' of undefined'),
      )
    })
  })

  describe('new Instance(x !null&!undefined).is(constructor function) -> boolean', () => {
    it('x 1, constructor Number; true', async () => {
      assert.strictEqual(new Instance(1).is(Number), true)
    })
    it('x 1, constructor String; false', async () => {
      assert.strictEqual(new Instance(1).is(String), false)
    })
  })

  describe('Instance.isString(x !null&!undefined) -> boolean', () => {
    it('x \'hey\'; true', async () => {
      assert.strictEqual(Instance.isString('hey'), true)
    })
    it('x 3; false', async () => {
      assert.strictEqual(Instance.isString(3), false)
    })
    it('x null; TypeError', async () => {
      assert.throws(
        () => Instance.isString(null),
        new TypeError('Cannot read property \'constructor\' of null'),
      )
    })
    it('x undefined; TypeError', async () => {
      assert.throws(
        () => Instance.isString(undefined),
        new TypeError('Cannot read property \'constructor\' of undefined'),
      )
    })
  })

  describe('new Instance(x !null&!undefined).isString() -> boolean', () => {
    it('x \'hey\'; true', async () => {
      assert.strictEqual(new Instance('hey').isString(), true)
    })
    it('x 3; false', async () => {
      assert.strictEqual(new Instance(3).isString(), false)
    })
  })

  describe('Instance.isNumber(x !null&!undefined) -> boolean', () => {
    it('x 3; true', async () => {
      assert.strictEqual(Instance.isNumber(3), true)
    })
    it('x true; false', async () => {
      assert.strictEqual(Instance.isNumber(true), false)
    })
    it('x null; TypeError', async () => {
      assert.throws(
        () => Instance.isNumber(null),
        new TypeError('Cannot read property \'constructor\' of null'),
      )
    })
    it('x undefined; TypeError', async () => {
      assert.throws(
        () => Instance.isNumber(undefined),
        new TypeError('Cannot read property \'constructor\' of undefined'),
      )
    })
  })

  describe('new Instance(x !null&!undefined).isNumber() -> boolean', () => {
    it('x 3; true', async () => {
      assert.strictEqual(new Instance(3).isNumber(), true)
    })
    it('x true; false', async () => {
      assert.strictEqual(new Instance(false).isNumber(), false)
    })
  })

  describe('Instance.isArray(x !null&!undefined) -> boolean', () => {
    it('x [1, 2, 3]; true', async () => {
      assert.strictEqual(Instance.isArray([1, 2, 3]), true)
    })
    it('x 1; false', async () => {
      assert.strictEqual(Instance.isArray(1), false)
    })
    it('x null; TypeError', async () => {
      assert.throws(
        () => Instance.isArray(null),
        new TypeError('Cannot read property \'constructor\' of null'),
      )
    })
    it('x undefined; TypeError', async () => {
      assert.throws(
        () => Instance.isArray(undefined),
        new TypeError('Cannot read property \'constructor\' of undefined'),
      )
    })
  })

  describe('new Instance(x !null&!undefined).isArray() -> boolean', () => {
    it('x [1, 2, 3]; true', async () => {
      assert.strictEqual(new Instance([1, 2, 3]).isArray(), true)
    })
    it('x 1; false', async () => {
      assert.strictEqual(new Instance(1).isArray(), false)
    })
  })

  describe('Instance.isObject(x !null&!undefined) -> boolean', () => {
    it('x { a: 1, b: 2, c: 3 }; true', async () => {
      assert.strictEqual(Instance.isObject({ a: 1, b: 2, c: 3 }), true)
    })
    it('x []; false', async () => {
      assert.strictEqual(Instance.isObject([]), false)
    })
    it('x null; TypeError', async () => {
      assert.throws(
        () => Instance.isObject(null),
        new TypeError('Cannot read property \'constructor\' of null'),
      )
    })
    it('x undefined; TypeError', async () => {
      assert.throws(
        () => Instance.isObject(undefined),
        new TypeError('Cannot read property \'constructor\' of undefined'),
      )
    })
  })

  describe('new Instance(x !null&!undefined).isObject() -> boolean', () => {
    it('x { a: 1, b: 2, c: 3 }; true', async () => {
      assert.strictEqual(new Instance({ a: 1, b: 2, c: 3 }).isObject(), true)
    })
    it('x []; false', async () => {
      assert.strictEqual(new Instance([]).isObject(), false)
    })
  })

  describe('Instance.isSet(x !null&!undefined) -> boolean', () => {
    it('x Set<[1, 2, 3]>; true', async () => {
      assert.strictEqual(Instance.isSet(new Set([1, 2, 3])), true)
    })
    it('x [1, 2, 3]; false', async () => {
      assert.strictEqual(Instance.isSet([1, 2, 3]), false)
    })
    it('x null; TypeError', async () => {
      assert.throws(
        () => Instance.isSet(null),
        new TypeError('Cannot read property \'constructor\' of null'),
      )
    })
    it('x undefined; TypeError', async () => {
      assert.throws(
        () => Instance.isSet(undefined),
        new TypeError('Cannot read property \'constructor\' of undefined'),
      )
    })
  })

  describe('new Instance(x !null&!undefined).isSet() -> boolean', () => {
    it('x Set<[1, 2, 3]>; true', async () => {
      assert.strictEqual(new Instance(new Set([1, 2, 3])).isSet(), true)
    })
    it('x [1, 2, 3]; false', async () => {
      assert.strictEqual(new Instance([1, 2, 3]).isSet(), false)
    })
  })

  describe('Instance.isMap(x !null&!undefined) -> boolean', () => {
    it('x Map<[[1, true], [2, false], [3, true]]>; true', async () => {
      const m = new Map([[1, true], [2, false], [3, true]])
      assert.strictEqual(Instance.isMap(m), true)
    })
    it('x { a: 1, b: 2, c: 3 }; false', async () => {
      assert.strictEqual(Instance.isMap({ a: 1, b: 2, c: 3 }), false)
    })
    it('x null; TypeError', async () => {
      assert.throws(
        () => Instance.isMap(null),
        new TypeError('Cannot read property \'constructor\' of null'),
      )
    })
    it('x undefined; TypeError', async () => {
      assert.throws(
        () => Instance.isMap(undefined),
        new TypeError('Cannot read property \'constructor\' of undefined'),
      )
    })
  })

  describe('new Instance(x !null&!undefined).isMap() -> boolean', () => {
    it('x Map<[[1, true], [2, false], [3, true]]>; true', async () => {
      const m = new Map([[1, true], [2, false], [3, true]])
      assert.strictEqual(new Instance(m).isMap(), true)
    })
    it('x { a: 1, b: 2, c: 3 }; false', async () => {
      assert.strictEqual(new Instance({ a: 1, b: 2, c: 3 }).isMap(), false)
    })
  })

  describe('Instance.isIterable(x !null&!undefined) -> boolean', () => {
    it('x [1, 2, 3]; true', async () => {
      assert.strictEqual(Instance.isIterable([1, 2, 3]), true)
    })
    it('x { a: 1, b: 2, c: 3 }; false', async () => {
      assert.strictEqual(Instance.isIterable({ a: 1, b: 2, c: 3 }), false)
    })
    it('x null; TypeError', async () => {
      assert.throws(
        () => Instance.isIterable(null),
        new TypeError('object null is not iterable (cannot read property Symbol(Symbol.iterator))'),
      )
    })
    it('x undefined; TypeError', async () => {
      assert.throws(
        () => Instance.isIterable(undefined),
        new TypeError('undefined is not iterable (cannot read property Symbol(Symbol.iterator))'),
      )
    })
  })

  describe('new Instance(x !null&!undefined).isIterable() -> boolean', () => {
    it('x [1, 2, 3]; true', async () => {
      assert.strictEqual(new Instance([1, 2, 3]).isIterable(), true)
    })
    it('x { a: 1, b: 2, c: 3 }; false', async () => {
      assert.strictEqual(new Instance({ a: 1, b: 2, c: 3 }).isIterable(), false)
    })
  })

  describe('Instance.isAsyncIterable(x !null&!undefined) -> boolean', () => {
    const createAsyncIterable123 = async function*() {
      yield 1; yield 2; yield 3
    }
    it('x AsyncIterable<[1, 2, 3]>; true', async () => {
      assert.strictEqual(Instance.isAsyncIterable(createAsyncIterable123()), true)
    })
    it('x [1, 2, 3]; false', async () => {
      assert.strictEqual(Instance.isAsyncIterable([1, 2, 3]), false)
    })
    it('x null; TypeError', async () => {
      assert.throws(
        () => Instance.isAsyncIterable(null),
        new TypeError('Cannot read property \'Symbol(Symbol.asyncIterator)\' of null'),
      )
    })
    it('x undefined; TypeError', async () => {
      assert.throws(
        () => Instance.isAsyncIterable(undefined),
        new TypeError('Cannot read property \'Symbol(Symbol.asyncIterator)\' of undefined'),
      )
    })
  })

  describe('new Instance(x !null&!undefined).isAsyncIterable() -> boolean', () => {
    const createAsyncIterable123 = async function*() {
      yield 1; yield 2; yield 3
    }
    it('x AsyncIterable<[1, 2, 3]>; true', async () => {
      assert.strictEqual(new Instance(createAsyncIterable123()).isAsyncIterable(), true)
    })
    it('x [1, 2, 3]; false', async () => {
      assert.strictEqual(new Instance([1, 2, 3]).isAsyncIterable(), false)
    })
  })

  describe('Instance.isFunction(x !null&!undefined) -> boolean', () => {
    it('x function; true', async () => {
      assert.strictEqual(Instance.isFunction(function(){}), true)
    })
    it('x AsyncFunction; true', async () => {
      assert.strictEqual(Instance.isFunction(async function(){}), true)
    })
    it('x ()=>{}; true', async () => {
      assert.strictEqual(Instance.isFunction(() => {}), true)
    })
    it('x async ()=>{}; true', async () => {
      assert.strictEqual(Instance.isFunction(async () => {}), true)
    })
    it('x GeneratorFunction; true', async () => {
      assert.strictEqual(Instance.isFunction(function*(){}), true)
    })
    it('x AsyncGeneratorFunction; true', async () => {
      assert.strictEqual(Instance.isFunction(async function*(){}), true)
    })
    it('x 1; false', async () => {
      assert.strictEqual(Instance.isFunction(1), false)
    })
    it('x null; TypeError', async () => {
      assert.throws(
        () => Instance.isFunction(null),
        new TypeError('cannot convert null to Instance'),
      )
    })
    it('x undefined; TypeError', async () => {
      assert.throws(
        () => Instance.isFunction(undefined),
        new TypeError('cannot convert undefined to Instance'),
      )
    })
  })

  describe('new Instance(x !null&!undefined).isFunction() -> boolean', () => {
    it('x function; true', async () => {
      assert.strictEqual(new Instance(function(){}).isFunction(), true)
    })
    it('x AsyncFunction; true', async () => {
      assert.strictEqual(new Instance(async function(){}).isFunction(), true)
    })
    it('x ()=>{}; true', async () => {
      assert.strictEqual(new Instance(() => {}).isFunction(), true)
    })
    it('x async ()=>{}; true', async () => {
      assert.strictEqual(new Instance(async () => {}).isFunction(), true)
    })
    it('x GeneratorFunction; true', async () => {
      assert.strictEqual(new Instance(function*(){}).isFunction(), true)
    })
    it('x AsyncGeneratorFunction; true', async () => {
      assert.strictEqual(new Instance(async function*(){}).isFunction(), true)
    })
    it('x 1; false', async () => {
      assert.strictEqual(new Instance(1).isFunction(), false)
    })
  })

  describe('Instance.isReadable(x !null&!undefined) -> boolean', () => {
    it('x { read: function }; true', async () => {
      assert.strictEqual(Instance.isReadable({ read: function(){} }), true)
    })
    it('x function; false', async () => {
      assert.strictEqual(Instance.isReadable(function(){}), false)
    })
    it('x null; TypeError', async () => {
      assert.throws(
        () => Instance.isReadable(null),
        new TypeError('Cannot read property \'read\' of null'),
      )
    })
    it('x undefined; TypeError', async () => {
      assert.throws(
        () => Instance.isReadable(undefined),
        new TypeError('Cannot read property \'read\' of undefined'),
      )
    })
  })

  describe('new Instance(x !null&!undefined).isReadable() -> boolean', () => {
    it('x { read: function }; true', async () => {
      assert.strictEqual(new Instance({ read: function(){} }).isReadable(), true)
    })
    it('x function; false', async () => {
      assert.strictEqual(new Instance(function(){}).isReadable(), false)
    })
  })

  describe('Instance.isWritable(x !null&!undefined) -> boolean', () => {
    it('x { write: function }; true', async () => {
      assert.strictEqual(Instance.isWritable({ write: function(){} }), true)
    })
    it('x function; false', async () => {
      assert.strictEqual(Instance.isWritable(function(){}), false)
    })
    it('x null; TypeError', async () => {
      assert.throws(
        () => Instance.isWritable(null),
        new TypeError('Cannot read property \'write\' of null'),
      )
    })
    it('x undefined; TypeError', async () => {
      assert.throws(
        () => Instance.isWritable(undefined),
        new TypeError('Cannot read property \'write\' of undefined'),
      )
    })
  })

  describe('new Instance(x !null&!undefined).isWritable() -> boolean', () => {
    it('x { write: function }; true', async () => {
      assert.strictEqual(new Instance({ write: function(){} }).isWritable(), true)
    })
    it('x function; false', async () => {
      assert.strictEqual(new Instance(function(){}).isWritable(), false)
    })
  })

  describe('Instance.isPromise(x !null&!undefined) -> boolean', () => {
    it('x { then: function }; true', async () => {
      assert.strictEqual(Instance.isPromise({ then: function(){} }), true)
    })
    it('x Promise.resolve(); true', async () => {
      assert.strictEqual(Instance.isPromise(Promise.resolve()), true)
    })
    it('x function; false', async () => {
      assert.strictEqual(Instance.isPromise(function(){}), false)
    })
    it('x null; TypeError', async () => {
      assert.throws(
        () => Instance.isPromise(null),
        new TypeError('Cannot read property \'then\' of null'),
      )
    })
    it('x undefined; TypeError', async () => {
      assert.throws(
        () => Instance.isPromise(undefined),
        new TypeError('Cannot read property \'then\' of undefined'),
      )
    })
  })

  describe('new Instance(x !null&!undefined).isPromise() -> boolean', () => {
    it('x { then: function }; true', async () => {
      assert.strictEqual(new Instance({ then: function(){} }).isPromise(), true)
    })
    it('x Promise.resolve(); true', async () => {
      assert.strictEqual(new Instance(Promise.resolve()).isPromise(), true)
    })
    it('x function; false', async () => {
      assert.strictEqual(new Instance(function(){}).isPromise(), false)
    })
  })

  describe('Instance.isTypedArray(x !null&!undefined) -> boolean', () => {
    it('x Uint8Array<[1, 2, 3]>; true', async () => {
      assert.strictEqual(Instance.isTypedArray(new Uint8Array([1, 2, 3])), true)
    })
    it('x [1, 2, 3]; false', async () => {
      assert.strictEqual(Instance.isTypedArray([1, 2, 3]), false)
    })
    it('x null; TypeError', async () => {
      assert.throws(
        () => Instance.isTypedArray(null),
        new TypeError('Cannot read property \'constructor\' of null'),
      )
    })
    it('x undefined; TypeError', async () => {
      assert.throws(
        () => Instance.isTypedArray(undefined),
        new TypeError('Cannot read property \'constructor\' of undefined'),
      )
    })
  })

  describe('new Instance(x !null&!undefined).isTypedArray() -> boolean', () => {
    it('x Uint8Array<[1, 2, 3]>; true', async () => {
      assert.strictEqual(new Instance(new Uint8Array([1, 2, 3])).isTypedArray(), true)
    })
    it('x [1, 2, 3]; false', async () => {
      assert.strictEqual(new Instance([1, 2, 3]).isTypedArray(), false)
    })
  })

  describe('Instance.isNumberTypedArray(x !null&!undefined) -> boolean', () => {
    it('x Uint8Array<[1, 2, 3]>; true', async () => {
      assert.strictEqual(Instance.isNumberTypedArray(new Uint8Array([1, 2, 3])), true)
    })
    it('x [1, 2, 3]; false', async () => {
      assert.strictEqual(Instance.isNumberTypedArray([1, 2, 3]), false)
    })
    it('x BigUint64Array<[1n, 2n, 3n]>; false', async () => {
      assert.strictEqual(Instance.isNumberTypedArray(new BigUint64Array([1n, 2n, 3n])), false)
    })
    it('x null; TypeError', async () => {
      assert.throws(
        () => Instance.isNumberTypedArray(null),
        new TypeError('Cannot read property \'constructor\' of null'),
      )
    })
    it('x undefined; TypeError', async () => {
      assert.throws(
        () => Instance.isNumberTypedArray(undefined),
        new TypeError('Cannot read property \'constructor\' of undefined'),
      )
    })
  })

  describe('new Instance(x !null&!undefined).isNumberTypedArray() -> boolean', () => {
    it('x Uint8Array<[1, 2, 3]>; true', async () => {
      assert.strictEqual(new Instance(new Uint8Array([1, 2, 3])).isNumberTypedArray(), true)
    })
    it('x [1, 2, 3]; false', async () => {
      assert.strictEqual(new Instance([1, 2, 3]).isNumberTypedArray(), false)
    })
    it('x BigUint64Array<[1n, 2n, 3n]>; false', async () => {
      assert.strictEqual(new Instance(new BigUint64Array([1n, 2n, 3n])).isNumberTypedArray(), false)
    })
  })

  describe('Instance.isBigIntTypedArray(x !null&!undefined) -> boolean', () => {
    it('x BigUint64Array<[1, 2, 3]>; true', async () => {
      assert.strictEqual(Instance.isBigIntTypedArray(new BigUint64Array([1n, 2n, 3n])), true)
    })
    it('x [1, 2, 3]; false', async () => {
      assert.strictEqual(Instance.isBigIntTypedArray([1, 2, 3]), false)
    })
    it('x Uint8Array<[1, 2, 3]>; false', async () => {
      assert.strictEqual(Instance.isBigIntTypedArray(new Uint8Array([1, 2, 3])), false)
    })
    it('x null; TypeError', async () => {
      assert.throws(
        () => Instance.isBigIntTypedArray(null),
        new TypeError('Cannot read property \'constructor\' of null'),
      )
    })
    it('x undefined; TypeError', async () => {
      assert.throws(
        () => Instance.isBigIntTypedArray(undefined),
        new TypeError('Cannot read property \'constructor\' of undefined'),
      )
    })
  })

  describe('new Instance(x !null&!undefined).isBigIntTypedArray() -> boolean', () => {
    it('x BigUint64Array<[1, 2, 3]>; true', async () => {
      assert.strictEqual(new Instance(new BigUint64Array([1n, 2n, 3n])).isBigIntTypedArray(), true)
    })
    it('x [1, 2, 3]; false', async () => {
      assert.strictEqual(new Instance([1, 2, 3]).isBigIntTypedArray(), false)
    })
    it('x Uint8Array<[1, 2, 3]>; false', async () => {
      assert.strictEqual(new Instance(new Uint8Array([1, 2, 3])).isBigIntTypedArray(), false)
    })
  })
})
