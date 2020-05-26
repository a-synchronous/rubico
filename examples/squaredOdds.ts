#!/usr/bin/env -S deno run

import { map, filter, pipe } from '../rubico.js'

const isOdd = (x: number): boolean => x % 2 === 1

const square = (x: number): number => x ** 2

const squaredOdds = pipe([
  filter(isOdd),
  map(square),
])

console.log(
  squaredOdds([1, 2, 3, 4, 5]), // [1, 9, 25]
)
