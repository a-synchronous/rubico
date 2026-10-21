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

    const id = '100'

    { // put profile bad request (id missing)
      const response = await http.put(`/profile/${id}`, {
        body: JSON.stringify({
          // id: id,
          name: `Profile ${id}`,
          birthdate: '2020-01-01',
          profilePictureUrl: 'https://rubico.land/assets/rubico-logo.png',
          email: 'profile@example.com',
        }),
      })

      assert.equal(response.status, 400)
      assert.deepEqual(await response.text(), 'Bad Request')
    }

    { // put profile bad request (name missing)
      const response = await http.put(`/profile/${id}`, {
        body: JSON.stringify({
          id: id,
          // name: `Profile ${id}`,
          birthdate: '2020-01-01',
          profilePictureUrl: 'https://rubico.land/assets/rubico-logo.png',
          email: 'profile@example.com',
        }),
      })

      assert.equal(response.status, 400)
      assert.deepEqual(await response.text(), 'Bad Request')
    }

    { // put profile bad request (birthdate missing)
      const response = await http.put(`/profile/${id}`, {
        body: JSON.stringify({
          id: id,
          name: `Profile ${id}`,
          // birthdate: '2020-01-01',
          profilePictureUrl: 'https://rubico.land/assets/rubico-logo.png',
          email: 'profile@example.com',
        }),
      })

      assert.equal(response.status, 400)
      assert.deepEqual(await response.text(), 'Bad Request')
    }

    { // put profile bad request (profilePictureUrl missing)
      const response = await http.put(`/profile/${id}`, {
        body: JSON.stringify({
          id: id,
          name: `Profile ${id}`,
          birthdate: '2020-01-01',
          // profilePictureUrl: 'https://rubico.land/assets/rubico-logo.png',
          email: 'profile@example.com',
        }),
      })

      assert.equal(response.status, 400)
      assert.deepEqual(await response.text(), 'Bad Request')
    }

    { // put profile bad request (email missing)
      const response = await http.put(`/profile/${id}`, {
        body: JSON.stringify({
          id: id,
          name: `Profile ${id}`,
          birthdate: '2020-01-01',
          profilePictureUrl: 'https://rubico.land/assets/rubico-logo.png',
          // email: 'profile@example.com',
        }),
      })

      assert.equal(response.status, 400)
      assert.deepEqual(await response.text(), 'Bad Request')
    }

    { // put profile success
      const response = await http.put(`/profile/${id}`, {
        body: JSON.stringify({
          id: id,
          name: `Profile ${id}`,
          birthdate: '2020-01-01',
          profilePictureUrl: 'https://rubico.land/assets/rubico-logo.png',
          email: 'profile@example.com',
        }),
      })

      assert.equal(response.status, 200)
      assert.deepEqual(await response.json(), { message: 'success' })
    }

    { // get profile
      const response = await http.get(`/profile/${id}`)
      assert.equal(response.status, 200)
      const responseBodyJSON = await response.json()
      assert.equal(responseBodyJSON.profile.id, id)
      assert.equal(responseBodyJSON.profile.name, `Profile ${id}`)
      assert.equal(responseBodyJSON.profile.birthdate, '2020-01-01')
      assert.equal(responseBodyJSON.profile.profilePictureUrl, 'https://rubico.land/assets/rubico-logo.png')
      assert.equal(responseBodyJSON.profile.email, null)
      assert.equal(typeof responseBodyJSON.profile.createTime, 'number')
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

    const id = '100'

    { // put profile bad request (id missing)
      const response = await http.put(`/profile/${id}`, {
        body: JSON.stringify({
          // id: id,
          name: `Profile ${id}`,
          birthdate: '2020-01-01',
          profilePictureUrl: 'https://rubico.land/assets/rubico-logo.png',
          email: 'profile@example.com',
        }),
      })

      assert.equal(response.status, 400)
      assert.deepEqual(await response.text(), 'Bad Request')
    }

    { // put profile bad request (name missing)
      const response = await http.put(`/profile/${id}`, {
        body: JSON.stringify({
          id: id,
          // name: `Profile ${id}`,
          birthdate: '2020-01-01',
          profilePictureUrl: 'https://rubico.land/assets/rubico-logo.png',
          email: 'profile@example.com',
        }),
      })

      assert.equal(response.status, 400)
      assert.deepEqual(await response.text(), 'Bad Request')
    }

    { // put profile bad request (birthdate missing)
      const response = await http.put(`/profile/${id}`, {
        body: JSON.stringify({
          id: id,
          name: `Profile ${id}`,
          // birthdate: '2020-01-01',
          profilePictureUrl: 'https://rubico.land/assets/rubico-logo.png',
          email: 'profile@example.com',
        }),
      })

      assert.equal(response.status, 400)
      assert.deepEqual(await response.text(), 'Bad Request')
    }

    { // put profile bad request (profilePictureUrl missing)
      const response = await http.put(`/profile/${id}`, {
        body: JSON.stringify({
          id: id,
          name: `Profile ${id}`,
          birthdate: '2020-01-01',
          // profilePictureUrl: 'https://rubico.land/assets/rubico-logo.png',
          email: 'profile@example.com',
        }),
      })

      assert.equal(response.status, 400)
      assert.deepEqual(await response.text(), 'Bad Request')
    }

    { // put profile bad request (email missing)
      const response = await http.put(`/profile/${id}`, {
        body: JSON.stringify({
          id: id,
          name: `Profile ${id}`,
          birthdate: '2020-01-01',
          profilePictureUrl: 'https://rubico.land/assets/rubico-logo.png',
          // email: 'profile@example.com',
        }),
      })

      assert.equal(response.status, 400)
      assert.deepEqual(await response.text(), 'Bad Request')
    }

    { // put profile success
      const response = await http.put(`/profile/${id}`, {
        body: JSON.stringify({
          id: id,
          name: `Profile ${id}`,
          birthdate: '2020-01-01',
          profilePictureUrl: 'https://rubico.land/assets/rubico-logo.png',
          email: 'profile@example.com',
        }),
      })

      assert.equal(response.status, 200)
      assert.deepEqual(await response.json(), { message: 'success' })
    }

    { // get profile
      const response = await http.get(`/profile/${id}`)
      assert.equal(response.status, 200)
      const responseBodyJSON = await response.json()
      assert.equal(responseBodyJSON.profile.id, id)
      assert.equal(responseBodyJSON.profile.name, `Profile ${id}`)
      assert.equal(responseBodyJSON.profile.birthdate, '2020-01-01')
      assert.equal(responseBodyJSON.profile.profilePictureUrl, 'https://rubico.land/assets/rubico-logo.png')
      assert.equal(responseBodyJSON.profile.email, null)
      assert.equal(typeof responseBodyJSON.profile.createTime, 'number')
    }

    { // not found
      const response = await http.get('/not-found')
      assert.equal(response.status, 404)
      assert.equal(await response.text(), 'Not Found')
    }

    server.close()
  }).timeout(60000)
})
