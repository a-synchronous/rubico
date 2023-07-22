export default rubico;
declare namespace rubico {
    export { pipe };
    export { compose };
    export { tap };
    export { forEach };
    export { switchCase };
    export { tryCatch };
    export { all };
    export { assign };
    export { get };
    export { set };
    export { pick };
    export { omit };
    export { map };
    export { filter };
    export { flatMap };
    export { reduce };
    export { transform };
    export { and };
    export { or };
    export { not };
    export { some };
    export { every };
    export { eq };
    export { gt };
    export { lt };
    export { gte };
    export { lte };
    export { thunkify };
    export { always };
    export { curry };
    export { __ };
}
declare function pipe(...args: any[]): any;
declare function compose(...args: any[]): any;
declare function tap(...args: any[]): any;
declare namespace tap {
    function _if(predicate: any, func: any): (...args: any[]) => any;
    export { _if as if };
}
declare function forEach(...args: any[]): any;
declare function switchCase(...args: any[]): any;
declare function tryCatch(...args: any[]): any;
declare function all(...args: any[]): any;
declare namespace all {
    function series(...args: any[]): any;
}
declare function assign(arg0: any, arg1: any): any;
declare function get(arg0: any, arg1: any, arg2: any): any;
declare function set(arg0: any, arg1: any, arg2: any): any;
declare function pick(arg0: any, arg1: any): any;
declare function omit(arg0: any, arg1: any): any;
declare function map(...args: any[]): any;
declare namespace map {
    function entries(mapper: any): (value: any) => any;
    function series(mapper: any): (value: any) => any;
    function pool(concurrencyLimit: any, mapper: any): (value: any) => any[] | Promise<any>;
}
declare function filter(...args: any[]): any;
declare function flatMap(...args: any[]): any;
declare function reduce(...args: any[]): any;
declare function transform(...args: any[]): any;
declare function and(...args: any[]): any;
declare function or(...args: any[]): any;
declare function not(...args: any[]): any;
declare function some(...args: any[]): any;
declare function every(...args: any[]): any;
declare function eq(...args: any[]): any;
declare function gt(...args: any[]): any;
declare function lt(...args: any[]): any;
declare function gte(...args: any[]): any;
declare function lte(...args: any[]): any;
declare function thunkify(func: any, ...args: any[]): () => any;
declare function always(value: any): () => any;
declare function curry(func: any, ...args: any[]): any;
declare namespace curry {
    function arity(arity: any, func: any, ...args: any[]): any;
}
declare const __: any;
