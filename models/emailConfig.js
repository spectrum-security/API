const mongoose = require("mongoose");
const Base64 = require("js-base64").Base64;

const Schema = mongoose.Schema;

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

emailConfig.pre("save", function(next) {
  if (this.isNew || this.isModified("password")) {
    const document = this;
    document.password = Base64.encode(document.password);
    next();
  } else {
    next();
  }
});

const EmailConfig = mongoose.model("EmailConfig", emailConfig);
module.exports = EmailConfig;
