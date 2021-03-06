const RecEmailConfigModel = require("../models/emailConfig");
const RecEmailModel = require("../models/receivedMail");
const Base64 = require("js-base64").Base64;
const moment = require("moment");
const _ = require("lodash");

exports.createdLast7Days = async (req, res, next) => {
  try {
    const companyId = req.query.companyId ? req.query.companyId : null;

    const last7Days = moment()
      .subtract(6, "day")
      .toDate();

    const query = {
      createdAt: {
        $gte: last7Days
      },
      email: {
        $exists: true
      }
    };

    if (companyId !== null) {
      query.companyId = companyId;
    }
    const emailsCount = await RecEmailModel.countDocuments(query).lean();
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

exports.getInbox = async (req, res) => {
  try {
    // pagination vars
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.perPage);
    const orderBy = req.query.orderBy;
    const orderType = req.query.orderType;
    const search = new RegExp(".*" + req.query.search + ".*", "i");

    const pagination = {
      skip: size * (page - 1),
      limit: size
    };

    const query = {};
    const searchForQuery = [];

    // maps trought fields and  creates RegExp for find query
    _.map(["from", "title"], el => {
      if (req.query.search) searchForQuery.push({ [el]: search });
    });

    if (searchForQuery.length > 0) query.$or = searchForQuery;

    console.log(query);

    const totalRecords = await RecEmailModel.countDocuments(query).lean();
    const inbox = await RecEmailModel.find(query, {}, pagination)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort({ [orderBy]: orderType })
      .lean();

    return res.status(200).send({
      success: true,
      totalRecords: totalRecords,
      content: {
        inbox: inbox
      }
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
    }
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
