#!/usr/bin/env node

const { pipe, tap, map, transform } = require('..')
const request = require('request')

const urls = [
  'https://firebasestorage.googleapis.com/v0/b/moberra-tire-api.appspot.com/o/tire-data-eco%2Fforceum.json?alt=media&token=ed9db67c-d744-414f-8812-21cfbba63447',
  'https://firebasestorage.googleapis.com/v0/b/moberra-tire-api.appspot.com/o/tire-data-eco%2Fgood-year.json?alt=media&token=1131b553-e2e5-4ff6-87cb-f346e57e389e',
  'https://firebasestorage.googleapis.com/v0/b/moberra-tire-api.appspot.com/o/tire-data-eco%2Fgt-radial.json?alt=media&token=d2ba3f51-cef7-494e-8006-61d321d677cd',
  'https://firebasestorage.googleapis.com/v0/b/moberra-tire-api.appspot.com/o/tire-data-eco%2Fkpatos.json?alt=media&token=75743c44-1521-4ff4-8133-e56a474f7c3e',
  'https://firebasestorage.googleapis.com/v0/b/moberra-tire-api.appspot.com/o/tire-data-eco%2Fland-spider.json?alt=media&token=22a3aa7b-18a9-4bd1-b34b-5ae48cadbc55',
  'https://firebasestorage.googleapis.com/v0/b/moberra-tire-api.appspot.com/o/tire-data-eco%2Fleao-tires.json?alt=media&token=84dcc7f8-de32-46a9-9aae-854639772975',
  'https://firebasestorage.googleapis.com/v0/b/moberra-tire-api.appspot.com/o/tire-data-eco%2Fwanli.json?alt=media&token=4bb13f3a-5d9a-4c2d-b558-964ee996a534',
  'https://firebasestorage.googleapis.com/v0/b/moberra-tire-api.appspot.com/o/tire-data-eco%2Fzeta.json?alt=media&token=c04f973c-2577-4f06-805e-68e46480e9ae'
]

const getFile = url => new Promise((resolve, reject) => {
  request({
    uri: url,
    method: "GET",
    gzip: true,
    qs: { format: "json" },
  }, (err, resp, body) => err ? reject(err) : resolve(body))
})

// urls => tire_json_data
const download_tire_json_from_firebase = map(getFile)

const main = async () => {
  const data = await transform(pipe([
    map(getFile),
    tap(console.log),
  ]), [])(urls)
}

main()
