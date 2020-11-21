#!/usr/bin/env node

const fetch = require('node-fetch')
const { pipe, fork, get } = require('..')

const getToken = () => 'token'

const getJSON = res => res.json()

// expects the object { body: {...}, uuid: 'string' }
const postRequestWithAuth = route => pipe([
  fork({
    method: () => 'POST',
    headers: pipe([
      get('uuid'),
      getToken,
      token => ({
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      }),
    ]),
    body: pipe([
      get('body'),
      JSON.stringify,
    ]),
  }),
  payload => fetch(route, payload),
  getJSON,
])

postRequestWithAuth('http://localhost:8001/myRoute')({
  uuid: 'ffda7b1c-fc6b-4949-98c4-e5cb86675f5f',
  body: { hello: 'world' },
})

// https://stackoverflow.com/questions/54852314/javascript-functional-programming-how-to-handle-fetch-for-pipes/61907662#61907662
