#!/usr/bin/env node

const { pipe, map, filter, transform, get, and, gt } = require('..')

const groups = [
  {
    id: 0,
    name: "All",
    selected: false
  },
  {
    id: -1,
    name: "All",
    selected: true
  },
  {
    id: 1,
    name: "Group1",
    selected: false
  },
  {
    id: 2,
    name: "Group2",
    selected: false
  },
  {
    id: 3,
    name: "Group3",
    selected: false
  },
  {
    id: 4,
    name: "Group4",
    selected: true
  },
]

const getPositiveSelectedIDs = pipe([
  filter(and([
    gt(get('id'), 0),
    get('selected'),
  ])),
  map(get('id')),
])

const ids = transform(getPositiveSelectedIDs, [])(groups) // => [4]

console.log('Extracted:', ids)

// https://stackoverflow.com/questions/60653070/extract-id-from-array-using-map-with-condition-javascript/61967120#61967120
