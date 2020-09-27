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
const thunkConditional = (
  conditionalExpression, thunkOnTruthy, thunkOnFalsy,
) => conditionalExpression ? thunkOnTruthy() : thunkOnFalsy()

module.exports = thunkConditional
