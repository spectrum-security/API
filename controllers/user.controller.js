const User = require("../models/user");
const msg = require("../utils/jsonMessages");
const _ = require("lodash");
const moment = require("moment");

exports.createdLast7Days = async (req, res) => {
  try {
    const companyId = req.query.companyId ? req.query.companyId : null;

    const last7Days = moment()
      .subtract(6, "day")
      .toDate();

    const query = {
      createdAt: {
        $gte: last7Days
      }
    };

    if (companyId !== null) {
      query.companyId = companyId;
    }

    const usersCount = await User.countDocuments(query).lean();
    res.status(200).send({
      success: true,
      totalRecords: usersCount,
      message: usersCount
        ? "Number of users returned"
        : "No users created in the last 7 days"
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

exports.getForChart = async (req, res, next) => {
  try {
    const sevenDaysAgo = moment()
      .subtract(7, "day")
      .toDate();
    const users = await User.find({
      createdAt: {
        $gte: sevenDaysAgo
      }
    })
      .sort({ createdAt: -1 })
      .lean();

    const lastRecord = users[0];

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
      for (let j = 0; j < users.length; j++) {
        let date = moment(users[j].createdAt).format("YYYY-MM-DD");
        if (date === rangeDate) {
          range[i].count += 1;
        }
      }
    }

    range = range.map(el => el.count);

    res.status(200).send({
      success: true,
      content: { range: range, lastRecord: lastRecord },
      message: "Data analytics for users returned"
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

exports.get = async function(req, res) {
  console.log(req.query); // testing purposes

  try {
    // pagination vars
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.perPage);
    const orderBy = req.query.orderBy;
    const orderType = req.query.orderType;
    const search = req.query.search
      ? new RegExp(".*" + req.query.search + ".*", "i")
      : "";

    // set skip and size of pagination query
    const pagination = {
      skip: size * (page - 1), // -1 because query.page starts at 1
      limit: size
    };

    const query = {};
    const searchForQuery = [];

    // maps trought fields and  creates RegExp for find query
    _.map(["email", "name.last"], el => {
      if (req.query.search) searchForQuery.push({ [el]: search });
    });

    // defines query if search isnt empty
    if (searchForQuery.length > 0) query.$or = searchForQuery;

    // counts total users for pagination calculation in frontend
    const totalUsers = await User.countDocuments(query).lean();
    const users = await User.find(query)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort({ [orderBy]: orderType })
      .populate("companyId")
      .lean();

    return res.status(msg.user.getUsers().status).send({
      content: { users: msg.user.getUsers(users).content.users },
      totalUsers: totalUsers,
      status: msg.user.getUsers().status,
      success: msg.user.getUsers().success
    });
  } catch (err) {
    return res.status(400).send({ error: `Could not get: ${err}` });
  }
};

//Edit user
exports.put = async function(req, res) {
  try {
    console.log(req.body);
    const id = req.params.id;
    const { body } = req;

    const updateUser = await User.findByIdAndUpdate(id, body, { new: true });
    return res
      .status(200)
      .send({ success: true, message: "User edited with success" });
  } catch (err) {
    return res.status(500).send({ error: `Could not edit user: ${err}` });
  }
};

//Remove user
exports.del = async function(req, res) {
  const _id = req.params.id;
  try {
    await User.findByIdAndDelete(_id);
    return res.status(200).send({
      success: true,
      message: "User deleted with success!",
      status: 200
    });
  } catch (err) {
    return res.status(400).send({
      success: false,
      message: `Could not remove user: ${err}`,
      status: 400
    });
  }
};
