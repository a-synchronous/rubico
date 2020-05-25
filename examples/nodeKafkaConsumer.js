#!/usr/bin/env node

const { pipe, fork, get } = require('rubico')
const kafka = require('kafka-node'),

// safely accesses properties with get
const safeParseTopic = (topic, data) => get([topic, 0, 0])(data)

const fetchLatestOffset = client => topic => new Promise((resolve, reject) => {
  new kafka.Offset(client).fetch(
    [{ topic: topic, partition: 0, time: -1 }],
    (err, data) => err ? reject(err) : resolve(safeParseTopic(topic, data)),
  )
})

// it's recommend to create new client for different consumers
// https://www.npmjs.com/package/kafka-node#consumer
// ({ topic, offset }) -> consumerInstance
const makeConsumerInstance = client => ({ topic, offset }) => (
  new kafka.Consumer(
    client,
    [{ topic, offset, partition: 0 }],
    { autoCommit: true },
  )
)

// consumerInstance -> messages
const consume = consumerInstance => new Promise((resolve, reject) => {
  const messages = []

  consumerInstance.on('message', message => {
    messages.push(message)
    if (message.offset == (message.highWaterOffset - 1)) {
      resolve(messages)
      // TODO: cleanup consumerInstance here
    }
  })

  // handles a termination signal from the producer
  consumerInstance.on('end', () => resolve(messages))

  consumerInstance.on('error', reject)
})

// topic -> messages
// pipe chains async functions together
const consumer = topic => {
  const client = new kafka.KafkaClient({ kafkaHost: 'kafka:9092' })
  return pipe([
    fetchLatestOffset(client), // topic -> latestOffset

    fork({
      topic: () => topic,
      offset: latestOffset => latestOffset,
    }), // latestOffset -> ({ topic, offset })

    makeConsumerInstance(client), // ({ topic, offset }) -> consumerInstance

    consume, // consumerInstance -> messages
  ])(topic)
}

module.exports = { consumer }
