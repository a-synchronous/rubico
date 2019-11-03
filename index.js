const _ = {}

_.flow = (...fns) => async x => {
  let y = x
  for (const fn of fns) y = await fn(y)
  return y
}

_.syncFlow = (...fns) => x => {
  let y = x
  for (const fn of fns) y = fn(y)
  return y
}

module.exports = _
