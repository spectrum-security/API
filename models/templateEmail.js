const mongoose = require("mongoose");
const _ = require("lodash");
const uniqueValidator = require("mongoose-unique-validator");
const fs = require("fs-extra");

const Schema = mongoose.Schema;

const getTypes = JSON.parse(fs.readFileSync("example/emailTypes.json", "utf8"));

const templateEmail = new Schema(
  {
    title: String,
    type: {
      type: Number,
      validate: {
        validator: value => {
          return _.flatMap(getTypes, "value").indexOf(value) > -1;
        },
        message: "{VALUE} is not a valid value"
      },
      default: -1
    },
    content: {
      type: String,
      required: true
    }
  },
  {
    collection: "templateEmail",
    timestamps: true
  }
);

templateEmailSchema.plugin(uniqueValidator);

const TemplateEmail = mongoose.model("TemplateEmail", templateEmailSchema);

TemplateEmail.types = getTypes;

module.exports = TemplateEmail;
