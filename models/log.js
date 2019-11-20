const mongoose = require("mongoose");

// Schema variable
const Schema = mongoose.Schema;

// Tags
const logSchema = new Schema(
  {
    recordadedAt: {
      type: Date,
      required: true
    },
    // May not be used
    logType: {
      type: Number,
      validate: {
        validator: value => {
          return [1, 2].indexOf(value) > -1; // 1:Motion 2:Finger print
        },
        message: "{VALUE} is not a valid type"
      },
      required: true
    },
    sensorId: {
      type: Schema.Types.ObjectId,
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
