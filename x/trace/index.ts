import { tap } from '../..'

const trace = (x: any): any => tap(console.log)(x)

trace.default = trace
export = trace
