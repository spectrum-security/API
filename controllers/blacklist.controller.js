const BlacklistModel = require("../models/blacklist");

exports.getBlacklist = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.perPage) || 5;
    const sort = req.query.orderBy
      ? { [req.query.orderType]: req.query.orderType }
      : null;

    const pagination = {
      skip: size * page,
      limit: size
    };

    const query = {};
    const search = [];

    if (req.query.hostname)
      search.push({
        hostname: new RegExp(".*" + req.query.hostname + ".*", "i")
      });

    if (search.length > 0) query.$and = search;

    const totalRecords = await BlacklistModel.countDocuments(query).lean();
    const blacklist = await BlacklistModel.find(query, {}, pagination)
      .sort(sort)
      .lean();

    return res.status(200).send({
      success: true,
      totalRecords: Math.ceil(totalRecords / size),
      content: {
        blacklist: blacklist
      }
    });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

exports.createBlacklist = async (req, res) => {
  try {
    const newBlacklist = {
      hostname: req.body.hostname
    };
    const data = new BlacklistModel(newBlacklist);
    await data.save();
    return res
      .status(201)
      .send({ success: true, message: "New blacklist entry created" });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

exports.editBlacklist = async (req, res) => {
  try {
    const id = req.body._id;
    const entry = await BlacklistModel.findById(id);
    if (!entry)
      return res
        .status(404)
        .send({ success: false, message: "Blacklist entry not found" });
    entry.hostname = req.body.hostname ? req.body.hostname : null;

    await entry.save();
    return res
      .status(200)
      .send({ success: true, message: "Blacklist entry edited" });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

exports.deleteBlacklist = async (req, res) => {
  try {
    const id = req.body.id;

    const deleted = await BlacklistModel.findOneAndDelete({ _id: id });
    if (!deleted)
      return res
        .status(404)
        .send({ success: false, message: "Blacklist entry not found" });
    return res
      .status(200)
      .send({ success: true, message: "Blacklist entry deleted" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};
