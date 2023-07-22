export = all;
/**
 * @name all
 *
 * @synopsis
 * ```coffeescript [specscript]
 * all(...args, funcsArray Array<function>) -> result Promise|Array
 *
 * all(funcsArray Array<function>)(...args) -> result Promise|Array
 *
 * all(...args, funcsObject Object<function>) -> result Promise|Object
 *
 * all(funcsObject Object<function>)(...args) -> result Promise|Object
 * ```
 *
 * @description
 * Function executor and composer. Accepts either an array of functions or an object of functions as the values. Calls each function of the provided array or object in parallel with the provided arguments. Returns either an array or object of the results of the function executions.
 *
 * ```javascript [playground]
 * const createArrayOfGreetingsFor = all([
 *   name => `Hi ${name}`,
 *   name => `Hey ${name}`,
 *   name => `Hello ${name}`,
 * ])
 *
 * const arrayOfGreetingsForFred = createArrayOfGreetingsFor('Fred')
 *
 * console.log(arrayOfGreetingsForFred)
 * // ['Hi Fred', 'Hey Fred', 'Hello Fred']
 *
 * const createObjectOfGreetingsFor = all({
 *   hi: name => `Hi ${name}`,
 *   hey: name => `Hey ${name}`,
 *   hello: name => `Hello ${name}`,
 * })
 *
 * const objectOfGreetingsForJane = createObjectOfGreetingsFor('Jane')
 *
 * console.log(objectOfGreetingsForJane)
 * // { hi: 'Hi Jane', hey: 'Hey Jane', hello: 'Hello Jane' }
 * ```
 *
 * `all` can simultaneously compose objects and handle promises.
 *
 * ```javascript [playground]
 * const identity = value => value
 *
 * const userbase = new Map()
 * userbase.set('1', { _id: 1, name: 'George' })
 *
 * const getUserByID = async id => userbase.get(id)
 *
 * const getAndLogUserById = pipe([
 *   all({
 *     id: identity,
 *     user: getUserByID,
 *   }),
 *   tap(({ id, user }) => {
 *     console.log(`Got user ${JSON.stringify(user)} by id ${id}`)
 *   }),
 * ])
 *
 * getAndLogUserById('1') // Got user {"_id":1,"name":"George"} by id 1
 * ```
 *
 * @execution concurrent
 */
declare function all(...args: any[]): any;
declare namespace all {
    /**
     * @name all.series
     *
     * @synopsis
     * ```coffeescript [specscript]
     * all.series(...args, funcsArray Array<function>) -> result Promise|Array
     *
     * all.series(funcsArray Array<function>)(...args) -> result Promise|Array
     * ```
     *
     * @description
     * `all` with serial execution.
     *
     * ```javascript [playground]
     * const sleep = ms => () => new Promise(resolve => setTimeout(resolve, ms))
     *
     * all.series([
     *   greeting => console.log(greeting + ' world'),
     *   sleep(1000),
     *   greeting => console.log(greeting + ' mom'),
     *   sleep(1000),
     *   greeting => console.log(greeting + ' goodbye'),
     * ])('hello') // hello world
     *             // hello mom
     *             // hello goodbye
     * ```
     *
     * @execution series
     */
    function series(...args: any[]): any;
}
