const User = require("../models/user");
const msg = require("../utils/jsonMessages");
const _ = require("lodash");

exports.get = async function(req, res) {
  console.log(req.query); // testing purposes

  try {
    // pagination vars
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.perPage);
    console.log(req.query.perPage);
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
    console.log(pagination);
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
    const { id, body } = req;

    User.findByIdAndUpdate(id, body, { new: true }, (err, data) => {
      if (err) {
        return res.status(400).send({ error: `Could not edit user: ${err}` });
      }
    });
    return res.send("edited " + req.params.id);
  } catch (err) {
    return res.status(400).send({ error: `Could not edit user: ${err}` });
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
