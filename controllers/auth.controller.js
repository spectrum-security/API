const UserModel = require("../models/user");
const messages = require("../utils/jsonMessages");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// JWT sign user function
function jwtSignUser(user) {
  const tempDate = new Date();

  const expiresIn = tempDate.setHours(
    tempDate.getHours() + process.env.JWT_HOURS_DURATION
  );

  return jwt.sign(user, process.env.JWT_KEY, {
    expiresIn: expiresIn
  });
}

exports.getMe = async (req, res, next) => {
  return res
    .status(messages.user.getUsers().status)
    .send(messages.user.getUsers(req.user, req.user.name));
};

exports.signUp = async (req, res, next) => {
  try {
    let newUser = new UserModel({
      name: req.body.name,
      email: req.body.email,
      userType: req.body.userType ? req.body.userType : 3,
      password: req.body.password,
      companyId: req.body.companyId
    });

    console.log("hey");
    await newUser.save();

    res.status(messages.user.signUpSuccess.status).json({
      success: messages.user.signUpSuccess.success,
      message: messages.user.signUpSuccess.message
    });
  } catch (error) {
    console.log(error);
    res.status(messages.internalServerError.status).json({
      success: messages.internalServerError.success,
      message: messages.internalServerError.message
    });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email: email })
      .select("+password")
      .lean();

    if (!user) {
      return res.status(messages.user.notFound.status).send({
        success: messages.user.notFound.success,
        message: messages.user.notFound.message,
        emailNotFound: true
      });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(messages.user.invalidPassword.status).json({
        success: messages.user.invalidPassword.success,
        message: messages.user.invalidPassword.message,
        passwordError: true
      });
    }

    delete user.password;

    res
      .status(messages.user.loginSuccess().status)
      .json(messages.user.loginSuccess(jwtSignUser(user), user));
  } catch (error) {
    res
      .status(messages.internalServerError.status)
      .json(messages.internalServerError.message);
  }
};

exports.adminLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email: email })
      .select("+password")
      .lean();

    if (!user) {
      return res.status(messages.user.notFound.status).send({
        success: messages.user.notFound.success,
        message: messages.user.notFound.message,
        emailNotFound: true
      });
    }

    if (user.userType !== 1) {
      return res.status(messages.user.insufficientPermissions.status).send({
        success: messages.user.insufficientPermissions.success,
        message: messages.user.insufficientPermissions.message
      });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(messages.user.invalidPassword.status).json({
        success: messages.user.invalidPassword.success,
        message: messages.user.invalidPassword.message,
        passwordError: true
      });
    }

    delete user.password;

    res
      .status(messages.user.loginSuccess().status)
      .json(messages.user.loginSuccess(jwtSignUser(user), user));
  } catch (error) {
    res
      .status(messages.internalServerError.status)
      .json(messages.internalServerError.message);
  }
};
