const SerialPort = require('serialport')
const ReadLine = SerialPort.parsers.Readline
const parser = new ReadLine({ delimiter: "\r\n" })
const port = new SerialPort('COM10', {
    baudRate: 9600
});

const Sensor = require("../models/sensor")

port.pipe(parser)

let logs = []
let sendData = false
let movementStarted = false
let movement = {}
let limit = 10

listenForData = function () {
    parser.on("data", async data => {
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
            try {
                const sensor = await Sensor.find({ _id: movement.sensorId })
                sensor.logs.push(movement)
                await sensor.save()
                sendData = false
                logs = []
                console.log(sensor.logs[sensor.logs.length - 1])
            } catch (err) {
                console.log(err)
            }
        }
    })
}

module.exports = { port, listenForData }