import { tap } from '../..'

const trace = <T>(x: T): T => tap(console.log)(x)

export = trace
