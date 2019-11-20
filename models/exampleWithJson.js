const fs = require("fs");
const _ = require("lodash");
const uniqueValidator = require("mongoose-unique-validator");
const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;
const getInitialProps = JSON.parse(
  fs.readFileSync("example/exampleUser.json", "utf8")
);

const getUserProps = util.getProps(getInitialProps, validator);

getUserProps.push({
  history: {
    type: Array,
    logs: [
      {
        key: String,
        oldValue: String,
        newValue: String,
        timestamp: { type: Date, default: Date.now }
      }
    ]
  }
});

_.map(getUserProps, line => {
  const key = _.first(_.keys(line));

  if (key === "logs") {
    return line;
  }
  if (line[key].type === "Schema.Types.ObjectId") {
    line[key].type = Schema.Types.ObjectId;
  }

  line[key].set = function(val) {
    this["_" + key] = this[key];
    return val;
  };

  return line;
});

// logger.log({level:"info",message:getProfileProps})

const userSchema = new Schema(getUserProps, {
  collection: "users",
  timestamps: true
});

// Add unique validator plugin

userSchema.plugin(uniqueValidator, {
  message: "Error, expected {PATH} to be unique."
});

_.map(events.profile, currentEvent => {
  if (typeof currentEvent.init === "function") currentEvent.init(userSchema);
});

const User = mongoose.model("User", userSchema);
