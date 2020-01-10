//INCOMPLETE

const mongoose = require("mongoose");

// Schema variable
const Schema = mongoose.Schema;

const requestSchema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Company"
    },
    date: {
      type: Date,
      required: true,
    },
    finished: {
      type: Boolean,
      default: false
    }
  },
  {
    collection: "requests",
    timestamps: true
  }
);

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;