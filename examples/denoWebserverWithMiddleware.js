import { serve } from 'https://deno.land/std/http/server.ts'
import r, { pipe, map, transform, ternary, get, tap, eq } from '../mod.js'

const s = serve({ port: 8001 })
console.log('http://localhost:8001/')

const trace = tap(console.log)

const addServerTime = req => {
  req.serverTime = Date.now()
  return req
}

const formatTimestamp = ts => (new Date(ts)).toLocaleString()

const respondWithHelloWorld = req => {
  req.respond({ body: 'Hello World\n' })
}

const respondWithServerTime = req => {
  req.respond({ body: `The server time is ${formatTimestamp(req.serverTime)}` })
}

const respondWithNotFound = req => {
  req.respond({ body: 'Not Found\n' })
}

/* TODO: uncomment this when done with switchCase and making operator functions binary
const route = switchCase([
  eq('/', get('url')), respondWithHelloWorld,
  eq('/time', get('url')), respondWithServerTime,
  eq(true, false), () => 'hey',
  respondWithNotFound,
])
*/

const route = req => {
  if (req.url === '/') return respondWithHelloWorld(req)
  if (req.url === '/time') return respondWithServerTime(req)
  if (true === false) return 'hey'
  return respondWithNotFound(req)
}

const onRequest = pipe([
  addServerTime,
  route,
])

transform(null, map(onRequest))(s)
