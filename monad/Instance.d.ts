export = Instance;
/**
 * @name Instance
 *
 * @synopsis
 * new Instance(value any) -> Instance
 *
 * @catchphrase
 * Type checking
 */
declare class Instance {
    /**
     * @name Instance.isInstance
     *
     * @synopsis
     * Instance.isInstance(x any) -> boolean
     *
     * @catchphrase
     * `false` <- only for `undefined` and `null`
     *
     * @TODO Change to isDefined
     */
    static isInstance(x: any): boolean;
    /**
     * @name Instance.is
     *
     * @synopsis
     * Instance.is(x any, constructor function) -> boolean
     */
    static is(x: any, constructor: any): boolean;
    /**
     * @name Instance.isString
     *
     * @synopsis
     * Instance.isString(x any) -> boolean
     */
    static isString(x: any): boolean;
    /**
     * @name Instance.isNumber
     *
     * @synopsis
     * Instance.isNumber(x any) -> boolean
     */
    static isNumber(x: any): boolean;
    /**
     * @name Instance.isObject
     *
     * @synopsis
     * Instance.isObject(x any) -> boolean
     */
    static isObject(x: any): boolean;
    /**
     * @name Instance.isSet
     *
     * @synopsis
     * Instance.isSet(x any) -> boolean
     */
    static isSet(x: any): boolean;
    /**
     * @name Instance.isMap
     *
     * @synopsis
     * Instance.isMap(x any) -> boolean
     */
    static isMap(x: any): boolean;
    /**
     * @name Instance.isIterable
     *
     * @synopsis
     * Instance.isIterable(value any) -> boolean
     */
    static isIterable(value: any): boolean;
    /**
     * @name Instance.isAsyncIterable
     *
     * @synopsis
     * Instance.isAsyncIterable(value any) -> boolean
     */
    static isAsyncIterable(value: any): boolean;
    /**
     * @name Instance.isFunction
     *
     * @synopsis
     * Instance.isFunction(x any) -> boolean
     */
    static isFunction(x: any): boolean;
    /**
     * @name Instance.isReadable
     *
     * @synopsis
     * Instance.isReadable(x any) -> boolean
     */
    static isReadable(x: any): boolean;
    /**
     * @name Instance.isWritable
     *
     * @synopsis
     * Instance.isWritable(x any) -> boolean
     */
    static isWritable(x: any): boolean;
    /**
     * @name Instance.isPromise
     *
     * @synopsis
     * Instance.isPromise(x any) -> boolean
     */
    static isPromise(x: any): boolean;
    constructor(value: any);
    value: any;
    /**
     * @name Instance.prototype.map
     *
     * @synopsis
     * <A any, B any>new Instance(value A).map(func A=>B) -> Instance<B>
    Instance.prototype.map = function(func) {
      return new Instance(func(this.value))
    } */
    /**
     * @name Instance.prototype.join
     *
     * @synopsis
     * <T any>new Instance(Instance<T>).join() -> Instance<T>
     *
     * <T any>new Instance(value T).join() -> value T
    Instance.prototype.join = function() {
      return this.value
    } */
    /**
     * @name Instance.prototype.*chain
     *
     * @synopsis
     * <A any, B any>new Instance(x A).chain(f A=>Instance<B>) -> Instance<B>
     *
     * @catchphrase
     * For associativity
     *
     * @example
     * const inst = new Instance(3)
     * console.log(
     *   inst.chain(number => new Instance(number ** 2))
     * ) // Instance { 9 }
     */
    chain(f: any): any;
    /**
     * @name Instance.prototype.isArray
     *
     * @synopsis
     * new Instance(x any).isArray() -> boolean
     */
    isArray(): boolean;
    /**
     * @name Instance.prototype.isTypedArray
     *
     * @synopsis
     * new Instance(x any).isTypedArray() -> boolean
     */
    isTypedArray(): boolean;
    /**
     * @name Instance.prototype.is
     *
     * @synopsis
     * new Instance(x any).is(constructor function) -> boolean
     */
    is(constructor: any): boolean;
    /**
     * @name Instance.prototype.isString
     *
     * @synopsis
     * new Instance(x any).isString() -> boolean
     */
    isString(): boolean;
    /**
     * @name Instance.prototype.isNumber
     *
     * @synopsis
     * new Instance(x any).isNumber() -> boolean
     */
    isNumber(): boolean;
    /**
     * @name Instance.prototype.isObject
     *
     * @synopsis
     * new Instance(x any).isObject() -> boolean
     */
    isObject(): boolean;
    /**
     * @name Instance.prototype.isSet
     *
     * @synopsis
     * new Instance(x any).isSet() -> boolean
     */
    isSet(): boolean;
    /**
     * @name Instance.prototype.isMap
     *
     * @synopsis
     * new Instance(x any).isMap() -> boolean
     */
    isMap(): boolean;
    /**
     * @name Instance.prototype.isIterable
     *
     * @synopsis
     * new Instance(value any).isIterable() -> boolean
     */
    isIterable(): boolean;
    /**
     * @name Instance.prototype.isAsyncIterable
     *
     * @synopsis
     * new Instance(value any).isAsyncIterable() -> boolean
     */
    isAsyncIterable(): boolean;
    /**
     * @name Instance.prototype.isFunction
     *
     * @synopsis
     * new Instance(x any).isFunction() -> boolean
     */
    isFunction(): boolean;
    /**
     * @name Instance.prototype.isReadable
     *
     * @synopsis
     * new Instance(x any).isReadable() -> boolean
     */
    isReadable(): boolean;
    /**
     * @name Instance.prototype.isWritable
     *
     * @synopsis
     * new Instance(x any).isWritable() -> boolean
     */
    isWritable(): boolean;
    /**
     * @name Instance.prototype.isPromise
     *
     * @synopsis
     * new Instance(x any).isPromise() -> boolean
     */
    isPromise(): boolean;
}
declare namespace Instance {
    let isArray: (arg: any) => arg is any[];
    let isTypedArray: (arg: any) => arg is ArrayBufferView;
}
