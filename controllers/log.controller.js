const LogModel = require("../models/log");
const msg = require("../utils/jsonMessages");

exports.last7DaysLogs = async (req, res) => {
  try {
    res.status(200).send("hey");
  } catch (err) {
    res.send(err);
  }
};

exports.addNewLog = async (req, res) => {
  try {
    const dataToSave = {
      sensorId: req.params.sensorId
    };
    const savedLog = await new LogModel(dataToSave).save();
    res.status(201).send({
      success: true,
      content: { message: "Sensor log added", savedLog: savedLog }
    });
  } catch (error) {
    res
      .status(msg.internalServerError.status)
      .send({ message: msg.internalServerError.message });
  }
};
