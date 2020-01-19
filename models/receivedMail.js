const mongoose = require("mongoose");

// Schema variable
const Schema = mongoose.Schema;

// Tags
const receivedMailSchema = new Schema(
  {
    title: {
      type: String
    },
    email: {
      type: String
    },
    text: {
      type: String
    }
  },
  {
    collection: "receivedEmail",
    timestamps: true
  }
);

const ReceivedEmail = mongoose.model("ReceivedEmail", receivedMailSchema);

module.exports = ReceivedEmail;
