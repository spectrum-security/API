const RecEmailConfigModel = require("../models/emailConfig");
const RecEmailModel = require("../models/receivedMail");
const Base64 = require("js-base64").Base64;
const moment = require("moment");

exports.createdLast7Days = async (req, res, next) => {
  try {
    const last7Days = moment()
      .subtract(6, "day")
      .toDate();
    const emailsCount = await RecEmailModel.countDocuments({
      createdAt: {
        $gte: last7Days
      }
    }).lean();
    res.status(200).send({
      success: true,
      totalRecords: emailsCount,
      message: emailsCount
        ? "Number of emails returned"
        : "No emails received in the last 7 days"
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

exports.getRecEmailConfig = async (req, res) => {
  try {
    const getRecEmailConfig = await RecEmailConfigModel.findOne({}).lean();
    if (getRecEmailConfig)
      getRecEmailConfig.password = Base64.decode(getRecEmailConfig.password);

    delete getRecEmailConfig.password;
    return res
      .status(200)
      .send({ success: true, recEmailConfig: getRecEmailConfig });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.createRecEmailConfig = async (req, res) => {
  try {
    let getRecEmailConfig = await RecEmailConfigModel.findOne({}).lean(); // only have one

    if (!getRecEmailConfig) {
      getRecEmailConfig = new RecEmailConfigModel();
    }
    getRecEmailConfig.user = req.body.user;
    getRecEmailConfig.password = req.body.password;
    getRecEmailConfig.host = req.body.host;
    getRecEmailConfig.port = req.body.port;
    getRecEmailConfig.tls = req.body.tls;

    await getRecEmailConfig.save();

    global.mailListenerWrapper.close(); // force close to initiate with new variables
    global.mailListenerWrapper.init(); // init now with new variables

    return res.status(200).send({
      success: true,
      message: "IMAP was updated and is now listening"
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.deleteRecEmailConfig = async (req, res) => {
  try {
    const deletedRecEmailConfig = await RecEmailConfigModel.findOneAndDelete(
      {}
    );
    if (!deletedRecEmailConfig)
      return res.status(404).send({
        success: false,
        message: "Recruitment email config not found"
      });
    global.mailListenerWrapper.close();
    return res.status(200).send({
      success: true,
      message: "Receiver email deleted, IMAP might not work now"
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};
