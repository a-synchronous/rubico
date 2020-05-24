#!/usr/bin/env node

const {
  pipe, fork, tap, switchCase,
  map, filter, transform,
  and, not, eq, get,
} = require('rubico')

const identity = x => x

// [person] => Map { person => (Set { person }) }
const makeTracker = transform(
  map(fork([
    person => person,
    () => new Set(),
  ])),
  new Map(),
)

const db = new Map()

const saveTracker = async tracker => { db.set('tracker', tracker) }

const hasTracker = async () => db.has('tracker')

const getTracker = async tracker => db.get('tracker')

const isNotIn = set => x => !set.has(x)

// { people, tracker } => { people, tracker, pairs }
const algorithm = ({ people, tracker }) => {
  const matchedThisRound = new Set()
  return fork({
    people: identity,
    tracker: () => tracker,
    pairs: transform(
      pipe([
        filter(isNotIn(matchedThisRound)),
        map(person => {
          for (const other of people) {
            // console.log('person:other', `${person}:${other}`)
            if (other === person) continue
            if (tracker.get(person).has(other)) continue
            if (matchedThisRound.has(other)) continue
            tracker.get(person).add(other)
            tracker.get(other).add(person)
            matchedThisRound.add(person)
            matchedThisRound.add(other)
            return [person, other]
          }
        }),
        filter(Array.isArray),
      ]),
      [],
    )
  })(people)
}

// [person, person, person, person, ...] => [[person, person], [person, person], ...]
const matchmake = pipe([
  fork({
    people: identity,
    tracker: switchCase([
      hasTracker, getTracker,
      makeTracker,
    ]),
  }),
  algorithm,
  tap(pipe([get('tracker'), saveTracker])),
])

const didEveryoneMatch = (tracker, people) => {
  for (const [, set] of tracker) {
    if (set.size < people.length - 1) return false // 1 for yourself
  }
  return true
}

const makePeople = number => Array.from((function*() {
  for (let i = 0; i < number; i++) yield `${i + 1}`
})())

const main = async () => {
  const people = makePeople(99)
  console.log('people', people)
  let i = 0
  while (true) {
    const round = await matchmake(people)
    const { tracker, pairs } = round
    console.log('round', i, pairs)
    if (didEveryoneMatch(tracker, people)) break
    i += 1
  }
}

main()
