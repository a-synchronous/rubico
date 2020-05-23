#!/usr/bin/env node

const { pipe, fork, switchCase, get } = require('rubico')

const jira = { // this is a mock jira.board.getAllBoards api
  board: {
    getAllBoards: ({ type, startAt }) => {
      if (startAt === 0) return {
        isLast: false,
        values: [{ _id: 1, type: 'scrum', title: 'Hello' }],
        startAt: 0,
      }
      if (startAt === 1) return {
        isLast: false,
        values: [{ _id: 2, type: 'scrum', title: 'World' }],
        startAt: 1,
      }
      return {
        isLast: true,
        values: [],
      }
    },
  }
}

const getAllBoards = boards => pipe([
  fork({
    type: () => 'scrum',
    startAt: get('startAt'),
  }),
  jira.board.getAllBoards,
  switchCase([
    get('isLast'),
    response => boards.concat(response.values),
    response => getAllBoards(boards.concat(response.values))({
      startAt: response.startAt + response.values.length,
    })
  ]),
])

const boards = getAllBoards([])({ startAt: 0 }) // => [...boards]

console.log(boards)

// https://stackoverflow.com/questions/55819017/how-do-i-return-an-entire-paged-set-from-the-jira-api-using-ramda/61909364#61909364
