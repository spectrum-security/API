const SerialPort = require('serialport')
const ReadLine = SerialPort.parsers.Readline
const parser = new ReadLine({ delimiter: "\r\n" })
const port = new SerialPort('COM10', {
    baudRate: 9600
});

const Log = require("../models/log")

port.pipe(parser)

let logs = []
let move = {}
let sendData = false
let movementStarted = false
let movement = {}
let limit = 10

module.exports = parser.on("data", async data => {
    let info = data.split(" ")
    info = {
        sensorId: info[0],
        value: parseInt(info[1])
    }
    logs.push(info)


    logs.forEach(log => {
        if (log.value < limit) {
            sendData = false
            movementStarted = true
            movement.started = new Date()
            movement.sensorId = info.sensorId
        } else if (log.value >= limit && movementStarted) {
            movementStarted = false
            movement.finished = new Date()
            sendData = true
        }

    })

    if (sendData) {
        console.log(movement)
        await Log.create(movement)
        sendData = false
        logs = []
    }
    console.log(info.value)
})

