const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const blacklistSchema = new Schema(
  {
    hostname: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    collection: "blacklist",
    timestamps: true
  }
);

blacklistSchema.plugin(uniqueValidator);

const Blacklist = mongoose.model("Blacklist", blacklistSchema);

module.exports = Blacklist;
