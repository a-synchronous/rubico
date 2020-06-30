import { pipe, tap } from '../..'

const tracef = (
  transformationFn: (any) => any,
) => <T>(x: T): T => tap(pipe([
  transformationFn,
  console.log,
]))(x)

tracef.default = tracef
export = tracef
