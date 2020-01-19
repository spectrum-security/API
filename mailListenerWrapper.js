const simpleParser = require("mailparser").simpleParser;
const fs = require("fs-extra");
const Imap = require("imap");
const moment = require("moment");
const striptags = require("striptags");
const BlackListModel = require("./models/blacklist");
const RecEmailConfigModel = require("./models/emailConfig");
const ReceivedEmailModel = require("./models/receivedMail");
const Base64 = require("js-base64").Base64;
const _ = require("lodash");
const logger = require("./helpers/logger");
const mongoose = require("mongoose");
require("dotenv").config();

class MailListenerWrapper {
  constructor() {
    this.imap = null;
    this.init();
  }

  async init() {
    try {
      const getRecEmailConfig = await RecEmailConfigModel.findOne({});

      if (getRecEmailConfig) {
        getRecEmailConfig.password = Base64.decode(getRecEmailConfig.password);
        this.imap = new Imap({
          user: getRecEmailConfig.user,
          password: getRecEmailConfig.password,
          host: getRecEmailConfig.host,
          port: getRecEmailConfig.port,
          tls: getRecEmailConfig.tls,
          tlsOptions: {
            rejectUnauthorized: false,
            authTimeout: 10000
          }
        });
      } else {
        return false;
      }

      let lastMessage = 0;

      const openInbox = cb => {
        this.imap.openBox("INBOX", true, cb);
      };
      const regEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

      this.imap.once("ready", () => {
        openInbox((err, box) => {
          if (err) {
            logger.log({ level: "error", message: err });
            return false;
          }
          lastMessage = box.messages.total;

          this.imap.on("mail", numberOfNewMessages => {
            const newEmail = {};
            // const numberOfNewMessages = 0
            lastMessage = lastMessage + numberOfNewMessages;

            const f = this.imap.seq.fetch(lastMessage + ":" + lastMessage, {
              bodies: ["HEADER.FIELDS (SUBJECT FROM)", ""],
              struct: true
            });

            f.on("message", msg => {
              msg.on("body", async stream => {
                try {
                  const parsed = await simpleParser(stream);
                  if (parsed.headers.get("subject")) {
                    // ################ HEADER ################ \\
                    newEmail.title = parsed.headers.get("subject");
                    const getFrom = parsed.headers.get("from").text.split(" <");

                    if (getFrom.length === 2) {
                      newEmail.name = getFrom[0];
                      newEmail.email = getFrom[1].match(regEmail).join("\n");
                    }
                    // ################ HEADER ################ \\
                  }
                  if (parsed.text) {
                    // ################ TEXT ################ \\
                    newEmail.text = striptags(parsed.text).toString("utf8");
                    // ################ TEXT ################ \\
                  }
                  if (
                    newEmail.name &&
                    newEmail.email &&
                    newEmail.title &&
                    newEmail.text
                  ) {
                    const getEmailHostname = newEmail.email.replace(/.*@/, "");
                    const blacklists = await BlackListModel.find({
                      hostname: new RegExp(".*" + getEmailHostname + ".*", "i")
                    });
                    if (blacklists.length > 0) {
                      logger.log({
                        level: "info",
                        message:
                          "A BLACKLIST ENTRY WAS TRYING TO SUBMIT AN APPLICATION"
                      });
                      return false;
                    }

                    const savedEmail = new ReceivedEmailModel(newEmail);
                    await savedEmail.save();

                    logger.log({
                      level: "info",
                      message:
                        "SAVED RECEIVED EMAIL =>" + JSON.stringify(savedEmail)
                    });
                  }
                } catch (err) {
                  logger.log({ level: "error", message: err });
                }
              }); // msg on body
            });
          }); // on mail

          this.imap.once("error", err => {
            logger.log({
              level: "error",
              message: err
            });
          }); // on error
        }); // openInbox
      }); // ready

      this.imap.connect();
    } catch (err) {
      logger.log({
        level: "error",
        message: err
      });
    }
  }

  close() {
    if (this.imap) this.imap.end();
  }
}

module.exports = MailListenerWrapper;
