const mongoose = require("mongoose");

// Schema variable
const Schema = mongoose.Schema;

// Tags
const motionLogSchema = new Schema(
  {
    recordadedAt: {
      type: Date,
      required: true
    },
    sensorId: {
      type: Schema.Types.ObjectId,
      ref: "Sensor",
      required: true
    }
  },
  {
    collection: "motionLogs",
    timestamps: true
  }
);

const MotionLog = mongoose.model("MotionLog", motionLogSchema);

module.exports = MotionLog;
