#!/usr/bin/env node

const { pipe, fork, map, reduce, get } = require('..')

const data = { "Office": {
    "California" : {
        "Contract1": {
            1: {Price: 1000, Count: 5}, 2: {Price: 2000, Count: 11},
            3: {Price: 3000, Count: 3}, 4: {Price: 2000, Count: 1},
            5: {Price: 1000, Count: 5}, 6: {Price: 2000, Count: 11},
            7: {Price: 3000, Count: 3}, 8: {Price: 2000, Count: 1},
            9: {Price: 1000, Count: 5}, 10: {Price: 2000, Count: 11},
            11: {Price: 3000, Count: 3}, 12: {Price: 2000, Count: 1},
        },
        "Contract2": {
            1: {Price: 7000, Count: 6}, 2: {Price: 1000, Count: 4},
            3: {Price: 67000, Count: 6}, 4: {Price: 500, Count: 2},
            5: {Price: 7000, Count: 6}, 6: {Price: 1000, Count: 4},
            7: {Price: 67000, Count: 6}, 8: {Price: 500, Count: 2},
            9: {Price: 7000, Count: 6}, 10: {Price: 1000, Count: 4},
            11: {Price: 67000, Count: 6}, 12: {Price: 500, Count: 2},
        },
        "Contract3": {
            1: {Price: 4000, Count: 4}, 2: {Price: 4000, Count: 1},
            3: {Price: 5000, Count: 12}, 4: {Price: 5000, Count: 2},
            5: {Price: 4000, Count: 4}, 6: {Price: 4000, Count: 1},
            7: {Price: 5000, Count: 12}, 8: {Price: 5000, Count: 2},
            9: {Price: 4000, Count: 4}, 10: {Price: 4000, Count: 1},
            11: {Price: 5000, Count: 12}, 12: {Price: 5000, Count: 2},
        }
    },
    "North Carolina" : {
        "Contract1": {
            1: {Price: 7000, Count: 4}, 2: {Price: 7000, Count: 4},
            3: {Price: 7000, Count: 4}, 4: {Price: 7000, Count: 4},
            5: {Price: 7000, Count: 4}, 6: {Price: 7000, Count: 4},
            7: {Price: 7000, Count: 4}, 8: {Price: 7000, Count: 4},
            9: {Price: 7000, Count: 4}, 10: {Price: 7000, Count: 4},
            11: {Price: 7000, Count: 4}, 12: {Price: 7000, Count: 4},
        },
        "Contract2": {
            1: {Price: 6000, Count: 4}, 2: {Price: 2000, Count: 10},
            3: {Price: 3000, Count: 3}, 4: {Price: 2000, Count: 3},
            5: {Price: 6000, Count: 4}, 6: {Price: 2000, Count: 10},
            7: {Price: 3000, Count: 3}, 8: {Price: 2000, Count: 3},
            9: {Price: 6000, Count: 4}, 10: {Price: 2000, Count: 10},
            11: {Price: 3000, Count: 3}, 12: {Price: 2000, Count: 3},
        },
        "Contract3": {
            1: {Price: 4000, Count: 5}, 2: {Price: 2000, Count: 4},
            3: {Price: 4000, Count: 3}, 4: {Price: 2000, Count: 4},
            5: {Price: 4000, Count: 5}, 6: {Price: 2000, Count: 4},
            7: {Price: 4000, Count: 3}, 8: {Price: 2000, Count: 4},
            9: {Price: 4000, Count: 5}, 10: {Price: 2000, Count: 4},
            11: {Price: 4000, Count: 3}, 12: {Price: 2000, Count: 4},
        },
    },
} }

const addContracts = (total, contract) => ({
  Price: total.Price + contract.Price,
  Count: total.Count + contract.Count,
})

const monthNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

const sumMonthsToQuarters = contract => {
  const quartered = {
    1: { Price: 0, Count: 0 },
    2: { Price: 0, Count: 0 },
    3: { Price: 0, Count: 0 },
    4: { Price: 0, Count: 0 },
  }
  for (const monthNum of monthNumbers) {
    const quarterNum = Math.ceil(monthNum / 3)
    quartered[quarterNum] = addContracts(quartered[quarterNum], contract[monthNum])
  }
  return quartered
}

const x = map(map(map(sumMonthsToQuarters)))(data)

console.log(JSON.stringify(x))

// https://stackoverflow.com/questions/62103014/reducing-a-nested-object-in-javascript/62110877
