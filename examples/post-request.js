const _ = require('..')
const fetch = require('node-fetch')

// url (string) => body (object) => response (object)
const makePostRequest = url => _.flow(
  JSON.stringify,
  _.diverge([
    url,
    _.diverge({
      method: 'POST',
      body: _.id,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }),
  ]),
  _.spread(fetch),
  response => response.json(),
)

const postToHttpBin = makePostRequest('https://httpbin.org/post')

_.flow(postToHttpBin, _.get('json'), console.log)({ a: 1 })
