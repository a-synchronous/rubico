import { tap } from '../..'

const trace = (x: T): T => tap(console.log)(x)

trace.default = trace
export = trace
