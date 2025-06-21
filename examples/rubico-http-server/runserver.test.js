const Test = require('thunk-test')
const assert = require('assert')
const Http = require('presidium/Http')
const runserver = require('./runserver')

const test = new Test('runserver', async () => {
  const { server } = runserver({ port: 7357 })

  const http = new Http('http://localhost:7357')

  { // /health
    const response = await http.get('/health')
    assert.equal(response.status, 200)
    assert.equal(await response.text(), 'ok')
  }

  { // OPTIONS
    const response = await http.options('/')
    assert.equal(response.headers.get('access-control-allow-origin'), '*')
    assert.equal(response.headers.get('access-control-allow-methods'), '*')
    assert.equal(response.headers.get('access-control-allow-headers'), '*')
    assert.equal(response.headers.get('access-control-max-age'), '86400')
    assert.equal(response.status, 204)
    assert.equal(await response.text(), '')
  }

  { // get user
    const response = await http.get('/user/100')
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), {
      user: {
        id: '100',
        name: 'User 100',
        createTime: 1,
        birthdate: '2020-01-01',
        profilePictureUrl: 'https://rubico.land/assets/rubico-logo.png',
      },
    })
  }

  { // not found
    const response = await http.get('/not-found')
    assert.equal(response.status, 404)
    assert.equal(await response.text(), 'Not Found')
  }

  server.close()
}).case()

if (process.argv[1] == __filename) {
  test()
}

module.exports = test
