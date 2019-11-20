const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Base64 = require("js-base64").Base64;

const emailConfig = new Schema({
  user: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  host: {
    type: String,
    required: true
  },
  port: {
    type: Number,
    required: true
  },
  tls: {
    type: Boolean,
    required: true
  }
});

emailConfig.pre("save", next => {
  if (this.isNew || this.isModified("password")) {
    const document = this;
    document.password = Base64.encode(document.password);
    next();
  } else {
    next();
  }
});

const emailConfig = mongoose.model("EmailConfig", emailConfig);
module.exports = emailConfig;
