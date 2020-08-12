const assert = require('assert')
const Instance = require('./Instance')

describe('Instance', () => {
  describe('new Instance(x any) -> Instance', () => {
    it('x 1; Instance<1>', async () => {
      assert.strictEqual(new Instance(1).constructor.name, 'Instance')
      assert(new Instance(1).value === 1)
    })
    it('x null; Instance<null>', async () => {
      assert.strictEqual(new Instance(null).constructor.name, 'Instance')
      assert(new Instance(null).value === null)
    })
    it('x undefined; Instance<undefined>', async () => {
      assert.strictEqual(new Instance(undefined).constructor.name, 'Instance')
      assert(new Instance(undefined).value === undefined)
    })
  })

  describe('<A any, B any>new Instance(x A).chain(f A=>Instance<B>) -> Instance<B>', () => {
    it('x 1; f x=>x; 1', async () => {
      assert.strictEqual(new Instance(1).chain(x => x), 1)
    })
    it('x 1; f x=>Instance(x + 1); Instance { 2 }', async () => {
      assert.deepEqual(new Instance(1).chain(x => new Instance(x + 1)), new Instance(2))
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

  describe('Instance.is(x any, constructor function) -> boolean', () => {
    it('x 1, constructor Number; true', async () => {
      assert.strictEqual(Instance.is(1, Number), true)
    })
    it('x 1, constructor String; false', async () => {
      assert.strictEqual(Instance.is(1, String), false)
    })
    it('x null; false', async () => {
      assert.strictEqual(Instance.is(null, Object), false)
    })
    it('x undefined; false', async () => {
      assert.strictEqual(Instance.is(undefined, Object), false)
    })
  })

  describe('new Instance(x any).is(constructor function) -> boolean', () => {
    it('x 1, constructor Number; true', async () => {
      assert.strictEqual(new Instance(1).is(Number), true)
    })
    it('x 1, constructor String; false', async () => {
      assert.strictEqual(new Instance(1).is(String), false)
    })
  })

  describe('Instance.isString(x any) -> boolean', () => {
    it('x \'hey\'; true', async () => {
      assert.strictEqual(Instance.isString('hey'), true)
    })
    it('x 3; false', async () => {
      assert.strictEqual(Instance.isString(3), false)
    })
    it('x null; false', async () => {
      assert.strictEqual(Instance.isString(null), false)
    })
    it('x undefined; false', async () => {
      assert.strictEqual(Instance.isString(undefined), false)
    })
  })

  describe('new Instance(x any).isString() -> boolean', () => {
    it('x \'hey\'; true', async () => {
      assert.strictEqual(new Instance('hey').isString(), true)
    })
    it('x 3; false', async () => {
      assert.strictEqual(new Instance(3).isString(), false)
    })
  })

  describe('Instance.isNumber(x any) -> boolean', () => {
    it('x 3; true', async () => {
      assert.strictEqual(Instance.isNumber(3), true)
    })
    it('x true; false', async () => {
      assert.strictEqual(Instance.isNumber(true), false)
    })
    it('x null; false', async () => {
      assert.strictEqual(Instance.isNumber(null), false)
    })
    it('x undefined; false', async () => {
      assert.strictEqual(Instance.isNumber(undefined), false)
    })
  })

  describe('new Instance(x any).isNumber() -> boolean', () => {
    it('x 3; true', async () => {
      assert.strictEqual(new Instance(3).isNumber(), true)
    })
    it('x true; false', async () => {
      assert.strictEqual(new Instance(false).isNumber(), false)
    })
  })

  describe('Instance.isArray(x any) -> boolean', () => {
    it('x [1, 2, 3]; true', async () => {
      assert.strictEqual(Instance.isArray([1, 2, 3]), true)
    })
    it('x 1; false', async () => {
      assert.strictEqual(Instance.isArray(1), false)
    })
    it('x null; false', async () => {
      assert.strictEqual(Instance.isArray(null), false)
    })
    it('x undefined; false', async () => {
      assert.strictEqual(Instance.isArray(undefined), false)
    })
  })

  describe('new Instance(x any).isArray() -> boolean', () => {
    it('x [1, 2, 3]; true', async () => {
      assert.strictEqual(new Instance([1, 2, 3]).isArray(), true)
    })
    it('x 1; false', async () => {
      assert.strictEqual(new Instance(1).isArray(), false)
    })
  })

  describe('Instance.isObject(x any) -> boolean', () => {
    it('x { a: 1, b: 2, c: 3 }; true', async () => {
      assert.strictEqual(Instance.isObject({ a: 1, b: 2, c: 3 }), true)
    })
    it('x []; false', async () => {
      assert.strictEqual(Instance.isObject([]), false)
    })
    it('x null; false', async () => {
      assert.strictEqual(Instance.isObject(null), false)
    })
    it('x undefined; false', async () => {
      assert.strictEqual(Instance.isObject(undefined), false)
    })
  })

  describe('new Instance(x any).isObject() -> boolean', () => {
    it('x { a: 1, b: 2, c: 3 }; true', async () => {
      assert.strictEqual(new Instance({ a: 1, b: 2, c: 3 }).isObject(), true)
    })
    it('x []; false', async () => {
      assert.strictEqual(new Instance([]).isObject(), false)
    })
  })

  describe('Instance.isSet(x any) -> boolean', () => {
    it('x Set<[1, 2, 3]>; true', async () => {
      assert.strictEqual(Instance.isSet(new Set([1, 2, 3])), true)
    })
    it('x [1, 2, 3]; false', async () => {
      assert.strictEqual(Instance.isSet([1, 2, 3]), false)
    })
    it('x null; false', async () => {
      assert.strictEqual(Instance.isSet(null), false)
    })
    it('x undefined; false', async () => {
      assert.strictEqual(Instance.isSet(undefined), false)
    })
  })

  describe('new Instance(x any).isSet() -> boolean', () => {
    it('x Set<[1, 2, 3]>; true', async () => {
      assert.strictEqual(new Instance(new Set([1, 2, 3])).isSet(), true)
    })
    it('x [1, 2, 3]; false', async () => {
      assert.strictEqual(new Instance([1, 2, 3]).isSet(), false)
    })
  })

  describe('Instance.isMap(x any) -> boolean', () => {
    it('x Map<[[1, true], [2, false], [3, true]]>; true', async () => {
      const m = new Map([[1, true], [2, false], [3, true]])
      assert.strictEqual(Instance.isMap(m), true)
    })
    it('x { a: 1, b: 2, c: 3 }; false', async () => {
      assert.strictEqual(Instance.isMap({ a: 1, b: 2, c: 3 }), false)
    })
    it('x null; false', async () => {
      assert.strictEqual(Instance.isMap(null), false)
    })
    it('x undefined; false', async () => {
      assert.strictEqual(Instance.isMap(undefined), false)
    })
  })

  describe('new Instance(x any).isMap() -> boolean', () => {
    it('x Map<[[1, true], [2, false], [3, true]]>; true', async () => {
      const m = new Map([[1, true], [2, false], [3, true]])
      assert.strictEqual(new Instance(m).isMap(), true)
    })
    it('x { a: 1, b: 2, c: 3 }; false', async () => {
      assert.strictEqual(new Instance({ a: 1, b: 2, c: 3 }).isMap(), false)
    })
  })

  describe('Instance.isIterable(x any) -> boolean', () => {
    it('x [1, 2, 3]; true', async () => {
      assert.strictEqual(Instance.isIterable([1, 2, 3]), true)
    })
    it('x { a: 1, b: 2, c: 3 }; false', async () => {
      assert.strictEqual(Instance.isIterable({ a: 1, b: 2, c: 3 }), false)
    })
    it('x null; false', async () => {
      assert.strictEqual(Instance.isIterable(null), false)
    })
    it('x undefined; false', async () => {
      assert.strictEqual(Instance.isIterable(undefined), false)
    })
  })

  describe('new Instance(x any).isIterable() -> boolean', () => {
    it('x [1, 2, 3]; true', async () => {
      assert.strictEqual(new Instance([1, 2, 3]).isIterable(), true)
    })
    it('x { a: 1, b: 2, c: 3 }; false', async () => {
      assert.strictEqual(new Instance({ a: 1, b: 2, c: 3 }).isIterable(), false)
    })
  })

  describe('Instance.isAsyncIterable(x any) -> boolean', () => {
    const createAsyncIterable123 = async function*() {
      yield 1; yield 2; yield 3
    }
    it('x AsyncIterable<[1, 2, 3]>; true', async () => {
      assert.strictEqual(Instance.isAsyncIterable(createAsyncIterable123()), true)
    })
    it('x [1, 2, 3]; false', async () => {
      assert.strictEqual(Instance.isAsyncIterable([1, 2, 3]), false)
    })
    it('x null; false', async () => {
      assert.strictEqual(Instance.isAsyncIterable(null), false)
    })
    it('x undefined; false', async () => {
      assert.strictEqual(Instance.isAsyncIterable(undefined), false)
    })
  })

  describe('new Instance(x any).isAsyncIterable() -> boolean', () => {
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

  describe('Instance.isFunction(x any) -> boolean', () => {
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
    it('x null; false', async () => {
      assert.strictEqual(Instance.isFunction(null), false)
    })
    it('x undefined; false', async () => {
      assert.strictEqual(Instance.isFunction(undefined), false)
    })
  })

  describe('new Instance(x any).isFunction() -> boolean', () => {
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

  describe('Instance.isReadable(x any) -> boolean', () => {
    it('x { read: function }; true', async () => {
      assert.strictEqual(Instance.isReadable({ read: function(){} }), true)
    })
    it('x function; false', async () => {
      assert.strictEqual(Instance.isReadable(function(){}), false)
    })
    it('x null; false', async () => {
      assert.strictEqual(Instance.isReadable(null), false)
    })
    it('x undefined; false', async () => {
      assert.strictEqual(Instance.isReadable(undefined), false)
    })
  })

  describe('new Instance(x any).isReadable() -> boolean', () => {
    it('x { read: function }; true', async () => {
      assert.strictEqual(new Instance({ read: function(){} }).isReadable(), true)
    })
    it('x function; false', async () => {
      assert.strictEqual(new Instance(function(){}).isReadable(), false)
    })
  })

  describe('Instance.isWritable(x any) -> boolean', () => {
    it('x { write: function }; true', async () => {
      assert.strictEqual(Instance.isWritable({ write: function(){} }), true)
    })
    it('x function; false', async () => {
      assert.strictEqual(Instance.isWritable(function(){}), false)
    })
    it('x null; false', async () => {
      assert.strictEqual(Instance.isWritable(null), false)
    })
    it('x undefined; false', async () => {
      assert.strictEqual(Instance.isWritable(undefined), false)
    })
  })

  describe('new Instance(x any).isWritable() -> boolean', () => {
    it('x { write: function }; true', async () => {
      assert.strictEqual(new Instance({ write: function(){} }).isWritable(), true)
    })
    it('x function; false', async () => {
      assert.strictEqual(new Instance(function(){}).isWritable(), false)
    })
  })

  describe('Instance.isPromise(x any) -> boolean', () => {
    it('x { then: function }; true', async () => {
      assert.strictEqual(Instance.isPromise({ then: function(){} }), true)
    })
    it('x Promise.resolve(); true', async () => {
      assert.strictEqual(Instance.isPromise(Promise.resolve()), true)
    })
    it('x function; false', async () => {
      assert.strictEqual(Instance.isPromise(function(){}), false)
    })
    it('x null; false', async () => {
      assert.strictEqual(Instance.isPromise(null), false)
    })
    it('x undefined; false', async () => {
      assert.strictEqual(Instance.isPromise(undefined), false)
    })
  })

  describe('new Instance(x any).isPromise() -> boolean', () => {
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

  describe('Instance.isTypedArray(x any) -> boolean', () => {
    it('x TypedArray<[1, 2, 3]>; true', async () => {
      assert.strictEqual(Instance.isTypedArray(new Uint8Array([1, 2, 3])), true)
      assert.strictEqual(Instance.isTypedArray(new Int8Array([1, 2, 3])), true)
      assert.strictEqual(Instance.isTypedArray(new Uint16Array([1, 2, 3])), true)
      assert.strictEqual(Instance.isTypedArray(new Int16Array([1, 2, 3])), true)
      assert.strictEqual(Instance.isTypedArray(new Uint32Array([1, 2, 3])), true)
      assert.strictEqual(Instance.isTypedArray(new Int32Array([1, 2, 3])), true)
      assert.strictEqual(Instance.isTypedArray(new Float32Array([1, 2, 3])), true)
      assert.strictEqual(Instance.isTypedArray(new Float64Array([1, 2, 3])), true)
      assert.strictEqual(Instance.isTypedArray(new BigUint64Array([1n, 2n, 3n])), true)
      assert.strictEqual(Instance.isTypedArray(new BigInt64Array([1n, 2n, 3n])), true)
    })
    it('x [1, 2, 3]; false', async () => {
      assert.strictEqual(Instance.isTypedArray([1, 2, 3]), false)
    })
    it('x ArrayBuffer; false', async () => {
      assert.strictEqual(Instance.isTypedArray(new ArrayBuffer()), false)
    })
    it('x null; false', async () => {
      assert.strictEqual(Instance.isTypedArray(null), false)
    })
    it('x undefined; false', async () => {
      assert.strictEqual(Instance.isTypedArray(undefined), false)
    })
  })

  describe('new Instance(x any).isTypedArray() -> boolean', () => {
    it('x Uint8Array<[1, 2, 3]>; true', async () => {
      assert.strictEqual(new Instance(new Uint8Array([1, 2, 3])).isTypedArray(), true)
      assert.strictEqual(new Instance(new Uint8Array([1, 2, 3])).isTypedArray(), true)
      assert.strictEqual(new Instance(new Int8Array([1, 2, 3])).isTypedArray(), true)
      assert.strictEqual(new Instance(new Uint16Array([1, 2, 3])).isTypedArray(), true)
      assert.strictEqual(new Instance(new Int16Array([1, 2, 3])).isTypedArray(), true)
      assert.strictEqual(new Instance(new Uint32Array([1, 2, 3])).isTypedArray(), true)
      assert.strictEqual(new Instance(new Int32Array([1, 2, 3])).isTypedArray(), true)
      assert.strictEqual(new Instance(new Float32Array([1, 2, 3])).isTypedArray(), true)
      assert.strictEqual(new Instance(new Float64Array([1, 2, 3])).isTypedArray(), true)
      assert.strictEqual(new Instance(new BigUint64Array([1n, 2n, 3n])).isTypedArray(), true)
      assert.strictEqual(new Instance(new BigInt64Array([1n, 2n, 3n])).isTypedArray(), true)
    })
    it('x [1, 2, 3]; false', async () => {
      assert.strictEqual(new Instance([1, 2, 3]).isTypedArray(), false)
    })
    it('x ArrayBuffer; false', () => {
      assert.strictEqual(new Instance(new ArrayBuffer()).isTypedArray(), false)
    })
  })
})
