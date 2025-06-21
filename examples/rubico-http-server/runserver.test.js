const assert = require('assert')
const Http = require('presidium/Http')
const runserverSimple = require('./runserver-simple')
const runserverComplex = require('./runserver-complex')

describe('runserver-simple', () => {
  it('integration', async () => {
    const { server } = runserverSimple({ port: 7357 })

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

    const userId = '100'

    { // put user bad request (id missing)
      const response = await http.put(`/user/${userId}`, {
        body: JSON.stringify({
          // id: userId,
          name: `User ${userId}`,
          birthdate: '2020-01-01',
          profilePictureUrl: 'https://rubico.land/assets/rubico-logo.png',
          email: 'user@example.com',
        }),
      })

      assert.equal(response.status, 400)
      assert.deepEqual(await response.text(), 'Bad Request')
    }

    { // put user bad request (name missing)
      const response = await http.put(`/user/${userId}`, {
        body: JSON.stringify({
          id: userId,
          // name: `User ${userId}`,
          birthdate: '2020-01-01',
          profilePictureUrl: 'https://rubico.land/assets/rubico-logo.png',
          email: 'user@example.com',
        }),
      })

      assert.equal(response.status, 400)
      assert.deepEqual(await response.text(), 'Bad Request')
    }

    { // put user bad request (birthdate missing)
      const response = await http.put(`/user/${userId}`, {
        body: JSON.stringify({
          id: userId,
          name: `User ${userId}`,
          // birthdate: '2020-01-01',
          profilePictureUrl: 'https://rubico.land/assets/rubico-logo.png',
          email: 'user@example.com',
        }),
      })

      assert.equal(response.status, 400)
      assert.deepEqual(await response.text(), 'Bad Request')
    }

    { // put user bad request (profilePictureUrl missing)
      const response = await http.put(`/user/${userId}`, {
        body: JSON.stringify({
          id: userId,
          name: `User ${userId}`,
          birthdate: '2020-01-01',
          // profilePictureUrl: 'https://rubico.land/assets/rubico-logo.png',
          email: 'user@example.com',
        }),
      })

      assert.equal(response.status, 400)
      assert.deepEqual(await response.text(), 'Bad Request')
    }

    { // put user bad request (email missing)
      const response = await http.put(`/user/${userId}`, {
        body: JSON.stringify({
          id: userId,
          name: `User ${userId}`,
          birthdate: '2020-01-01',
          profilePictureUrl: 'https://rubico.land/assets/rubico-logo.png',
          // email: 'user@example.com',
        }),
      })

      assert.equal(response.status, 400)
      assert.deepEqual(await response.text(), 'Bad Request')
    }

    { // put user success
      const response = await http.put(`/user/${userId}`, {
        body: JSON.stringify({
          id: userId,
          name: `User ${userId}`,
          birthdate: '2020-01-01',
          profilePictureUrl: 'https://rubico.land/assets/rubico-logo.png',
          email: 'user@example.com',
        }),
      })

      assert.equal(response.status, 200)
      assert.deepEqual(await response.json(), { message: 'success' })
    }

    { // get user
      const response = await http.get(`/user/${userId}`)
      assert.equal(response.status, 200)
      const responseBodyJSON = await response.json()
      assert.equal(responseBodyJSON.user.id, userId)
      assert.equal(responseBodyJSON.user.name, `User ${userId}`)
      assert.equal(responseBodyJSON.user.birthdate, '2020-01-01')
      assert.equal(responseBodyJSON.user.profilePictureUrl, 'https://rubico.land/assets/rubico-logo.png')
      assert.equal(typeof responseBodyJSON.user.createTime, 'number')
    }

    { // not found
      const response = await http.get('/not-found')
      assert.equal(response.status, 404)
      assert.equal(await response.text(), 'Not Found')
    }

    server.close()
  }).timeout(60000)
})

describe('runserver-complex', () => {
  it('integration', async () => {
    const { server } = runserverComplex({ port: 7357 })

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

    const userId = '100'

    { // put user bad request (id missing)
      const response = await http.put(`/user/${userId}`, {
        body: JSON.stringify({
          // id: userId,
          name: `User ${userId}`,
          birthdate: '2020-01-01',
          profilePictureUrl: 'https://rubico.land/assets/rubico-logo.png',
          email: 'user@example.com',
        }),
      })

      assert.equal(response.status, 400)
      assert.deepEqual(await response.text(), 'Bad Request')
    }

    { // put user bad request (name missing)
      const response = await http.put(`/user/${userId}`, {
        body: JSON.stringify({
          id: userId,
          // name: `User ${userId}`,
          birthdate: '2020-01-01',
          profilePictureUrl: 'https://rubico.land/assets/rubico-logo.png',
          email: 'user@example.com',
        }),
      })

      assert.equal(response.status, 400)
      assert.deepEqual(await response.text(), 'Bad Request')
    }

    { // put user bad request (birthdate missing)
      const response = await http.put(`/user/${userId}`, {
        body: JSON.stringify({
          id: userId,
          name: `User ${userId}`,
          // birthdate: '2020-01-01',
          profilePictureUrl: 'https://rubico.land/assets/rubico-logo.png',
          email: 'user@example.com',
        }),
      })

      assert.equal(response.status, 400)
      assert.deepEqual(await response.text(), 'Bad Request')
    }

    { // put user bad request (profilePictureUrl missing)
      const response = await http.put(`/user/${userId}`, {
        body: JSON.stringify({
          id: userId,
          name: `User ${userId}`,
          birthdate: '2020-01-01',
          // profilePictureUrl: 'https://rubico.land/assets/rubico-logo.png',
          email: 'user@example.com',
        }),
      })

      assert.equal(response.status, 400)
      assert.deepEqual(await response.text(), 'Bad Request')
    }

    { // put user bad request (email missing)
      const response = await http.put(`/user/${userId}`, {
        body: JSON.stringify({
          id: userId,
          name: `User ${userId}`,
          birthdate: '2020-01-01',
          profilePictureUrl: 'https://rubico.land/assets/rubico-logo.png',
          // email: 'user@example.com',
        }),
      })

      assert.equal(response.status, 400)
      assert.deepEqual(await response.text(), 'Bad Request')
    }

    { // put user success
      const response = await http.put(`/user/${userId}`, {
        body: JSON.stringify({
          id: userId,
          name: `User ${userId}`,
          birthdate: '2020-01-01',
          profilePictureUrl: 'https://rubico.land/assets/rubico-logo.png',
          email: 'user@example.com',
        }),
      })

      assert.equal(response.status, 200)
      assert.deepEqual(await response.json(), { message: 'success' })
    }

    { // get user
      const response = await http.get(`/user/${userId}`)
      assert.equal(response.status, 200)
      const responseBodyJSON = await response.json()
      assert.equal(responseBodyJSON.user.id, userId)
      assert.equal(responseBodyJSON.user.name, `User ${userId}`)
      assert.equal(responseBodyJSON.user.birthdate, '2020-01-01')
      assert.equal(responseBodyJSON.user.profilePictureUrl, 'https://rubico.land/assets/rubico-logo.png')
      assert.equal(typeof responseBodyJSON.user.createTime, 'number')
    }

    { // not found
      const response = await http.get('/not-found')
      assert.equal(response.status, 404)
      assert.equal(await response.text(), 'Not Found')
    }

    server.close()
  }).timeout(60000)
})
