const mongoose = require("mongoose");

// Schema variable
const Schema = mongoose.Schema;

// Tags
const sentEmailSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    to: {
      type: String
    },
    text: {
      type: String
    }
  },
  {
    collection: "sentEmail",
    timestamps: true
  }
);

const SentEmail = mongoose.model("SentEmail", sentEmailSchema);

module.exports = SentEmail;
