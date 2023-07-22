export = thunkConditional;
/**
 * @name thunkConditional
 *
 * @synopsis
 * ```coffeescript [specscript]
 * thunkConditional<
 *   conditionalExpression boolean,
 *   thunkOnTruthy ()=>any,
 *   thunkOnFalsy ()=>any,
 * >(conditionalExpression, thunkOnTruthy, thunkOnFalsy) -> any
 * ```
 *
 * @description
 * Like the conditional operator `a ? b : c` but for thunks.
 */
declare function thunkConditional(conditionalExpression: any, thunkOnTruthy: any, thunkOnFalsy: any): any;
