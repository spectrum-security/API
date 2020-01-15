const LogModel = require("../models/log");
const msg = require("../utils/jsonMessages");
const _ = require("lodash");

exports.last7DaysLogs = async (req, res) => {
  try {
    const logs = await LogModel.find({
      createdAt: {
        $gte: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000)
      }
    }).select("createdAt");

    const splitedLogs = _.groupBy(logs, el => {
      return el.createdAt.getDay();
    });

    res.send(splitedLogs);
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
