/**
 * @name conditional
 *
 * @synopsis
 * conditional<
 *   shouldReturnArg1 boolean,
 *   arg1 any,
 *   arg2 any,
 * >(shouldReturnArg1, arg1, arg2) -> arg1|arg2
 */
const conditional = (
  shouldReturnArg1, arg1, arg2,
) => shouldReturnArg1 ? arg1 : arg2

module.exports = conditional
