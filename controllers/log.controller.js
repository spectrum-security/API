const LogModel = require("../models/log");
const msg = require("../utils/jsonMessages");
const _ = require("lodash");

const Moment = require("moment");
const MomentRange = require("moment-range");

const moment = MomentRange.extendMoment(Moment);

/* 
This is a function in development and is not yet working as intended
*/
exports.last7DaysLogs = async (req, res) => {
  try {
    const companyId = req.query.companyId ? req.query.companyId : null;

    const last7Days = moment()
      .subtract(7, "day")
      .toDate();

    const query = {
      createdAt: {
        $gte: last7Days
      }
    };

    if (companyId !== null) {
      query.companyId = companyId;
    }

    const logs = await LogModel.countDocuments(query).lean();

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

exports.getForChart = async (req, res, next) => {
  try {
    const sevenDaysAgo = moment()
      .subtract(7, "day")
      .toDate();
    const logs = await LogModel.find({
      createdAt: {
        $gte: sevenDaysAgo
      }
    })
      .sort({ createdAt: -1 })
      .lean();

    const lastRecord = logs[0];

    let range = moment.range(
      moment()
        .subtract(6, "day")
        .toDate(),
      moment()
    );

    range = Array.from(range.by("day"));
    range = range.map(el => (el = { date: el, count: 0 }));

    // 0(n^2) didn't find anaother way
    for (let i = 0; i < range.length; i++) {
      let rangeDate = moment(range[i].date).format("YYYY-MM-DD");
      for (let j = 0; j < logs.length; j++) {
        let logDate = moment(logs[j].createdAt).format("YYYY-MM-DD");
        if (logDate === rangeDate) {
          range[i].count += 1;
        }
      }
    }

    range = range.map(el => el.count);

    res.status(200).send({
      success: true,
      content: { range: range, lastRecord: lastRecord },
      message: "Data analytics for logs returned"
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

exports.getLogs = async (req, res, next) => {
  try {
    const companyId = req.params.companyId ? req.params.companyId : null;

    const logs = await LogModel.find({ companyId: companyId }).lean();
    res.status(200).send({ success: true, content: { logs: logs } });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
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
