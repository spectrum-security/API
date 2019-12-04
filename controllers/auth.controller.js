const UserModel = require("../models/user");
const messages = require("../utils/jsonMessages");

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
  } catch (error) {
    res
      .status(messages.internalServerError.status)
      .send(messages.internalServerError.message);
  }
};
