export = always;
/**
 * @name always
 *
 * @synopsis
 * ```coffeescript [specscript]
 * always(value any) -> getter ()=>value
 * ```
 *
 * @description
 * Create a function that always returns a value.
 */
declare function always(value: any): () => any;
