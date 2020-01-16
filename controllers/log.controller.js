const LogModel = require("../models/log");
const msg = require("../utils/jsonMessages");
const _ = require("lodash");

/* 
This is a function in development and is not yet working as intended
*/
exports.last7DaysLogs = async (req, res) => {
  try {
    const last7Days = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
    const logs = await LogModel.countDocuments({
      createdAt: {
        $gte: last7Days
      }
    }).lean();

    res.status(200).send({
      success: true,
      totalRecords: logs,
      message: logs
        ? "Number of logs returned"
        : "No logs created in the last 7 days"
    });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
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
