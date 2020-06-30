import { pipe, tap } from '../..'

const tracef = (
  transformationFn: (any) => any,
) => (x: any) => tap(pipe([
  transformationFn,
  console.log,
]))(x)

tracef.default = tracef
export = tracef
