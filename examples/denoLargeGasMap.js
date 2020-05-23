#!/usr/bin/env -S deno run --allow-net

import {
  pipe, fork, tap, map, filter, reduce, transform, get, not,
} from '../rubico.js'

const apiKey = "709a7d013e4fda8f3e21166c33a1a691"

const urls = [
  'https://cors-anywhere.herokuapp.com/https://agsi.gie.eu/api/data/21X000000001160J/DE',
  'https://cors-anywhere.herokuapp.com/https://agsi.gie.eu/api/data/37X0000000000151/DE',
  'https://cors-anywhere.herokuapp.com/https://agsi.gie.eu/api/data/37X0000000000224/DE',
  'https://cors-anywhere.herokuapp.com/https://agsi.gie.eu/api/data/21X000000001125L/DE',
  'https://cors-anywhere.herokuapp.com/https://agsi.gie.eu/api/data/21X0000000010849/DE',
  'https://cors-anywhere.herokuapp.com/https://agsi.gie.eu/api/data/21X000000001368W/DE',
  'https://cors-anywhere.herokuapp.com/https://agsi.gie.eu/api/data/21X0000000011756/DE',
  'https://cors-anywhere.herokuapp.com/https://agsi.gie.eu/api/data/21X000000001090E/DE',
  'https://cors-anywhere.herokuapp.com/https://agsi.gie.eu/api/data/21X0000000013805/DE',
  'https://cors-anywhere.herokuapp.com/https://agsi.gie.eu/api/data/21X000000001262B/DE',
  'https://cors-anywhere.herokuapp.com/https://agsi.gie.eu/api/data/21X000000001140P/DE',
  'https://cors-anywhere.herokuapp.com/https://agsi.gie.eu/api/data/37X000000000042Z/DE',
  'https://cors-anywhere.herokuapp.com/https://agsi.gie.eu/api/data/21X0000000011748/DE',
  'https://cors-anywhere.herokuapp.com/https://agsi.gie.eu/api/data/11XNERGIE------1/DE',
  'https://cors-anywhere.herokuapp.com/https://agsi.gie.eu/api/data/37X0000000000119/DE',
  'https://cors-anywhere.herokuapp.com/https://agsi.gie.eu/api/data/25X-OMVGASSTORA5/DE',
  'https://cors-anywhere.herokuapp.com/https://agsi.gie.eu/api/data/11XSWHANNOVERAG3/DE',
  'https://cors-anywhere.herokuapp.com/https://agsi.gie.eu/api/data/21X000000001072G/DE',
  'https://cors-anywhere.herokuapp.com/https://agsi.gie.eu/api/data/11XSWB-BREMEN--I/DE',
  'https://cors-anywhere.herokuapp.com/https://agsi.gie.eu/api/data/37X000000000051Y/DE',
  'https://cors-anywhere.herokuapp.com/https://agsi.gie.eu/api/data/21X000000001307F/DE',
  'https://cors-anywhere.herokuapp.com/https://agsi.gie.eu/api/data/21X000000001310Q/DE',
  'https://cors-anywhere.herokuapp.com/https://agsi.gie.eu/api/data/21X000000001127H/DE',
  'https://cors-anywhere.herokuapp.com/https://agsi.gie.eu/api/data/21X000000001138C/DE',
]

const getData = url => fetch(url, {
  method: 'GET',
  headers: {
    'x-key': apiKey,
    'Origin': null,
  },
}).then(res => res.json())

const incrementMap = (y, xi) => {
  const [gasDate, gasVol] = xi
  if (y.has(gasDate)) {
    y.set(gasDate, y.get(gasDate) + gasVol)
  } else {
    y.set(gasDate, gasVol)
  }
  return y
}

// url => [gas_record]
const toGasDateVolRecordsMap = url => pipe([
  getData,
  reduce(pipe([
    map(fork([
      get('gasDayStartedOn'),
      pipe([get('gasInStorage'), parseFloat]),
    ])),
    filter(pipe([get(1), not(isNaN)])),
  ])(incrementMap), new Map()),
  tap(() => console.log('done with', url)),
])(url)

// mapA, mapB -> mapC
const combineMaps = (y, xi) => {
  let newMap = y
  for (const record of xi) {
    newMap = incrementMap(newMap, record)
  }
  return y
}

console.log('beginning requests')
const now = Date.now()
const finalMap = await pipe([
  map(toGasDateVolRecordsMap),
  reduce(combineMaps, new Map()),
])(urls)

console.log(finalMap, 'in', Date.now() - now, 'ms')

// https://stackoverflow.com/questions/61798071/javascript-api-promise-problem-need-faster-solution
