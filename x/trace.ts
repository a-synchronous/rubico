import { tap } from '..'

const trace = (x: any) => tap(console.log)(x)

export default trace
