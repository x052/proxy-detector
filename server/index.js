const f = require('../data/featureize')

const express = require('express')
const app = express()

const zmq = require('zeromq-ng')
const socket = new zmq.Request()

const csvFeatures = 'isProxy,org,continentCode,countryCode\n0'

function buildFeatures (ip) {
  let features = f(ip, 0)
  return `${csvFeatures},${features.org.replace(',', '')},${features.continentCode},${features.countryCode}`
}

async function setupZnq () {
  await socket.bind('tcp://127.0.0.1:3000')
  console.log('Requester bound to port 3000')

  app.get('/', (req, res) => res.send('Hello World!'))
  app.get('/api/isProxy/:ip', async function (req, res) {
    let featureString = buildFeatures(req.params.ip)
    socket.send(featureString)
    let [msg] = await socket.receive()
    msg = msg.toString()
    console.log(msg)
    res.json({
      ip: req.params.ip,
      isProxy: msg === 0
    })
  })

  app.listen(8080, () => console.log('App listening on port 8080!'))
}

setupZnq()
