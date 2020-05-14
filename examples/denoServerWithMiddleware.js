import { serve } from 'https://deno.land/std/http/server.ts'
import {
  pipe, fork, assign, tap, tryCatch, switchCase,
  map, filter, reduce, transform,
  any, all, and, or, not,
  eq, gt, lt, gte, lte,
  get, pick, omit,
} from '../rubico.js'

const join = delim => x => x.join(delim)

const addServerTime = req => {
  req.serverTime = (new Date()).toJSON()
  return req
}

const traceRequest = pipe([
  fork([
    pipe([get('serverTime'), x => '[' + x + ']']),
    get('method'),
    get('url'),
  ]),
  join(' '),
  console.log,
])

const respondWithHelloWorld = req => {
  req.respond({ body: 'Hello World\n' })
}

const respondWithServerTime = req => {
  req.respond({ body: `The server time is ${req.serverTime}\n` })
}

const respondWithNotFound = req => {
  req.respond({ body: 'Not Found\n' })
}

const route = switchCase([
  eq('/', get('url')), respondWithHelloWorld,
  eq('/time', get('url')), respondWithServerTime,
  respondWithNotFound,
])

const onRequest = pipe([
  addServerTime,
  tap(traceRequest),
  route,
])

const s = serve({ port: 8001 })
console.log('http://localhost:8001/')
transform(map(onRequest), null)(s)
