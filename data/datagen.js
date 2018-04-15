const featurize = require('./featureize')

const fs = require('fs')
const csv = require('fast-csv')

const TRAINING_RESULTS = 1000 * 500
const TESTING_RESULTS = 1000 * 100

let proxyIndex = 0

const proxyFile = fs.readFileSync('proxiesIpAdresses').toString().split('\n')

const TRAINING_DATA = getData(TRAINING_RESULTS)
console.log(`[Training] Exporting ${TRAINING_DATA.length} ip adresses`)

var csvStream = csv.createWriteStream({headers: true})
var writableStream = fs.createWriteStream('trainingIpData.csv')
csvStream.pipe(writableStream)
for (var index = 0; index < TRAINING_DATA.length; index++) {
  csvStream.write(TRAINING_DATA[index])
}
csvStream.end()

const TESTING_DATA = getData(TESTING_RESULTS)
console.log(`[Testing] Exporting ${TESTING_DATA.length} ip adresses`)

csvStream = csv.createWriteStream({headers: true})
writableStream = fs.createWriteStream('testingIpData.csv')
csvStream.pipe(writableStream)
for (var index = 0; index < TESTING_DATA.length; index++) {
  csvStream.write(TESTING_DATA[index])
}
csvStream.end()

function getData (MAX_RESULTS) {
  const ipAdresses = {}
  const ipData = []

  let duplicateOffset = 0
  for (var index = 0; index < MAX_RESULTS + duplicateOffset; index++) {
    const isProxy = Math.random() >= 0.5
    const IP = isProxy ? proxyFile[proxyIndex++] : randomIp()

    if (ipAdresses[IP]) {
      duplicateOffset++
      continue
    }

    const data = featurize(IP, isProxy ? 1 : 0)
    if (data) {
      ipAdresses[IP] = true
      ipData.push(data)
    } else {
      duplicateOffset++
    }
  }
  return ipData
}

function randomIp () {
  return randomByte() + '.' +
    randomByte() + '.' +
    randomByte() + '.' +
    randomByte() + '.' +
    randomByte()
}

function randomByte () {
  return Math.round(Math.random() * 256)
}
