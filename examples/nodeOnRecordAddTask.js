#!/usr/bin/env node

const { pipe, fork, map, get } = require('rubico')

const requestAPI = record => {/* make API request */}

const saveToDatabase = result => {/* save result to database */}

const getImages = apiResult => {/* make images API request */}

const flatten = arr => arr.flat(1)

const uploadToS3 = image => {/* upload to s3 code */}

/*
const onRecordAddTask = async record => {
  const results = await requestAPI(record)
  const [arraysOfImages,] = await Promise.all([
    await Promise.all(results.map(getImages)),
    await Promise.all(results.map(saveToDatabase)),
  ])
  await Promise.all(flatten(arraysOfImages).map(uploadToS3))
}
*/

const onRecordAddTask = pipe([
  requestAPI,
  fork([
    map(getImages),
    map(saveToDatabase),
  ]),
  get(0),
  map(map(uploadToS3)),
])
