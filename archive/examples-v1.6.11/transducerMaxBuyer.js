#!/usr/bin/env node

// from https://stackoverflow.com/questions/62074394/filter-array-and-get-max-values-of-nested-array-of-each-set-of-objects-in-javas/62077548#62077548

const { transform, pipe, assign, tap, map, filter, reduce, get, gt } = require('rubico')

const data = [
  {
    product: 'laptop',
    count_buyer: 3,
    buyers: [
      { name: 'Vins', purchase_amount: 27 },
      { name: 'Jan', purchase_amount: 38 },
      { name: 'Alex', purchase_amount: 80 },
    ],
  },
  {
    product: 'televisor',
    count_buyer: 2,
    buyers: [
      { name: 'Carl', purchase_amount: 25 },
      { name: 'Digi', purchase_amount: 40 }
    ],
  },
  {
    product: 'ropa varon',
    count_buyer: 0,
    buyers: [],
  }
];

const getMaxBuyer = (y, xi) => y.purchase_amount > xi.purchase_amount ? y : xi

const getProductsWithMaxBuyer = pipe([
  filter(gt(get('buyers.length'), 0)), // filter for products with buyers.length > 0
  tap(x => console.log('tap', x)),
  map(assign({
    buyers: pipe([
      get('buyers'), // product => product.buyers
      reduce(getMaxBuyer), // buyers => [max_buyer]
    ]),
  })),
  tap(x => console.log('tap', x)),
])

console.log('intermediate arrays, should see 2 arrays')

getProductsWithMaxBuyer(data) /* > [
  {
    product: 'laptop',
    count_buyer: 3,
    buyers: { name: 'Alex', purchase_amount: 80 }
  },
  {
    product: 'televisor',
    count_buyer: 2,
    buyers: { name: 'Digi', purchase_amount: 40 }
  }
]
*/

console.log('one pass, should see 4 products individually')

transform(
  getProductsWithMaxBuyer,
  [],
)(data)
