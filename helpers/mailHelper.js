const nodemailer = require("nodemailer");
const logger = require("../helpers/logger");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_TLS,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  }
});

exports.sendMail = async (to, subject, message) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: to,
      subject: subject,
      html: message
    };
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (err) {
    logger.log({ level: "info", message: err });
    return null;
  }
};
