#!/usr/bin/env node

const arrayIn = [{ vendor_uLID: '5e793a0411d2bef2e375cd00', productVariations: [ { variationName: 'Colour', variationOptions: [ { name: 'Blue', record_uLID: '6afa239e-ce53-40eb-addc-836d8ecc0051', }, { name: 'yellow', record_uLID: '66654830-6850-490a-8eaf-9d505e3e4672', } ], }, { variationName: 'Pattern', variationOptions: [ { name: 'Bold', record_uLID: '6afa239e-ce53-40eb-addc-836d8ecc0055', }, { name: 'Spotted', record_uLID: '66654830-6850-490a-8eaf-9d505e3e4671', }, { name: 'Stripped', record_uLID: 'ec9b5fbe-6428-4a67-aab8-9a23cdce2f9f', }, ], }, ], }, { vendor_uLID: '5e7bb266071f9601b6ad8f4e', productVariations: [ { variationName: 'Colour', variationOptions: [ { name: 'Blue', record_uLID: '6afa239e-ce53-40eb-addc-836d8ecc0051', }, { name: 'yellow', record_uLID: '66654830-6850-490a-8eaf-9d505e3e4672', } ], }, { variationName: 'Pattern', variationOptions: [ { name: 'Bold', record_uLID: '6afa239e-ce53-40eb-addc-836d8ecc0055', }, { name: 'Spotted', record_uLID: '66654830-6850-490a-8eaf-9d505e3e4671', }, { name: 'Stripped', record_uLID: 'ec9b5fbe-6428-4a67-aab8-9a23cdce2f9f', }, ], }, ], }, { vendor_uLID: '5e80971b1540161f3279e29e', productVariations: [ { variationName: 'Pattern', variationOptions: [ { name: 'Bold', record_uLID: '6afa239e-ce53-40eb-addc-836d8ecc0055', }, { name: 'Spotted', record_uLID: '66654830-6850-490a-8eaf-9d505e3e4671' } ] } ] } ]

const { pipe, fork, assign, tap, map, reduce, get } = require('..')

const trace = tap(console.log)

const identity = x => x

const incMap = (m, { record_uLID, vendor_uLID }) => {
  if (m.has(record_uLID)) {
    m.get(record_uLID).add(vendor_uLID)
  } else {
    m.set(record_uLID, new Set([vendor_uLID]))
  }
  return m
}

/*
// normal version
const createRecordToVendorMap = pipe([
  flatMap(vendor => pipe([
    get('productVariations'),
    flatMap(pipe([
      get('variationOptions'),
      map(fork({
        record_uLID: get('record_uLID'),
        vendor_uLID: () => vendor.vendor_uLID,
      })),
    ]))
  ])(vendor)),
  reduce(incMap, new Map()),
])

// transducer version
reduce(flatMap(vendor => pipe([
  get('productVariations'),
  flatMap(pipe([
    get('variationOptions'),
    map(fork({
      record_uLID: get('record_uLID'),
      vendor_uLID: () => vendor.vendor_uLID,
    })),
  ]))
])(vendor))(incMap), new Map())
*/

const combineMaps = (mA, mB) => {
  for (const [record_uLID, linkedVendors] of mB) {
    for (const vendor_uLID of linkedVendors) {
      incMap(mA, { record_uLID, vendor_uLID })
    }
  }
  return mA
}

/*
 * vendors => Map { record_uLID -> Set { vendor_uLID } }
 */
const createRecordToVendorMap = pipe([
  map(vendor => pipe([ // for each vendor of vendors
    get('productVariations'),
    map(pipe([ // for each productVariation of productVariations
      get('variationOptions'),
      reduce(map(fork({ // for each record of each variationOption of each variationOptions, create a new object
        record_uLID: get('record_uLID'),
        vendor_uLID: () => vendor.vendor_uLID,
      }))(incMap), new Map()), // reduce the new object via incMap into a new Map()
    ])),
    reduce(combineMaps, new Map()), // combine array of Maps into one Map
  ])(vendor)),
  reduce(combineMaps, new Map()), // combine array of Maps into one Map
])

/*
 * vendors => variationOptions_with_linkedVendors
 */
const linkVendorsToProductVariations = pipe([
  fork({
    recordToVendorMap: createRecordToVendorMap, // vendors => Map { record_uLID => Set { vendor_uLID } }
    vendors: identity,
  }),
  ({ recordToVendorMap, vendors }) => map(pipe([ // for each vendor of vendors
    get('productVariations'),
    map(fork({ // for each productVariation of productVariations, create a new object { variationName, variationOptions }
      variationName: get('variationName'),
      variationOptions: pipe([
        get('variationOptions'),
        map(assign({ // for each variationOption of variationOptions, assign the object { ...variationOption, linkedVendors }
          linkedVendors: pipe([
            get('record_uLID'),
            record_uLID => recordToVendorMap.get(record_uLID) || new Set(),
            Array.from,
          ]),
        })),
      ]),
    })),
  ]))(vendors),
])

console.log(JSON.stringify(
  linkVendorsToProductVariations(arrayIn),
  null,
  2,
))
