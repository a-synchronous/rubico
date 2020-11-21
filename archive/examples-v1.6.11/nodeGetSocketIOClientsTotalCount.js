#!/usr/bin/env node

const { pipe, map, reduce, get } = require('rubico')
const io = require('socket.io')()

const rooms = ['room1', 'room2', 'room3']

const getClientsInRoom = room => new Promise((resolve, reject) => {
  io.in(room).clients((err, clients) => {
    if (err) {
      reject(err);
    } else {
      resolve(clients);
    }
  })
});

const add = (a, b) => a + b

const getTotalClientsCount = pipe([
  map(getClientsInRoom), // [...rooms] => [[...clients], [...clients], ...]
  map(get('length')), // [[...clients], [...clients], ...] => [16, 1, 20, 0, ...]
  reduce(add, 0), // [16, 1, 20, 0, ...] => 0 + 16 + 1 + 20 + 0 + ...
]);

async function main() {
  const rooms = ['room1', 'room2', 'room3']
  const totalCount = await getTotalClientsCount(rooms)
  console.log(totalCount)
}

main()

// https://stackoverflow.com/questions/61802050/how-to-make-socket-io-asynchronous-method-synchronous/61924033#61924033
