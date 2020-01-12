const mongoose = require("mongoose");

// Schema variable
const Schema = mongoose.Schema;

// Tags
const logSchema = new Schema(
  {
    sensorId: {
      type: Schema.Types.ObjectId,
      ref: "Sensor",
      required: true
    }
  },
  {
    collection: "logs",
    timestamps: true
  }
);

const Log = mongoose.model("Log", logSchema);

module.exports = Log;
