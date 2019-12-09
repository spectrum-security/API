const mongoose = require("mongoose");

// Schema variable
const Schema = mongoose.Schema;

// Tags
const fingerprintLogsSchema = new Schema(
  {
    recordadedAt: {
      type: Date,
      required: true
    },
    sensorId: {
      type: Schema.Types.ObjectId,
      ref: "Sensor",
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    collection: "fingerprintLogs",
    timestamps: true
  }
);

const FingerprintLog = mongoose.model("FingerprintLog", fingerprintLogsSchema);

module.exports = FingerprintLogs;
