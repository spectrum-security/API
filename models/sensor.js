const mongoose = require("mongoose");

// Schema variable
const Schema = mongoose.Schema;

const sensorSchema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },
    location: {
      type: String,
      required: true
    },
    sensorType: {
      type: Number,
      validate: {
        validator: value => {
          return [1, 2].indexOf(value) > -1; // 1: Motion 2: Fingerprint
        },
        message: "{VALUE} is not a valid type"
      },
      default: 1
    },
    logs: [
      {
        sensorId: {
          type: Schema.Types.ObjectId,
          ref: "Sensor"
        },
        started: {
          type: Date
        },
        finished: {
          type: Date
        }
      }
    ],
    maintenance: [
      {
        date: {
          type: Date
        },
        report: {
          statusReport: String
        }
      }
    ],
    active: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  {
    collection: "sensors",
    timestamps: true
  }
);

const Sensor = mongoose.model("Sensor", sensorSchema);

module.exports = Sensor;
