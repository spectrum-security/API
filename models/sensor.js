const mongoose = require("mongoose");

// Schema variable
const Schema = mongoose.Schema;

// Tags
const sensorSchema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
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
      required: true
    },
    // location: {
    //   type: String,
    //   required: true
    // },
    maintenance: {
      type: [
        {
          date: {
            type: Date,
            required: true
          },

          statusReport: String,
          required: true
        }
      ]
    }
  },
  {
    collection: "sensors",
    timestamps: true
  }
);

const Sensor = mongoose.model("Sensor", sensorSchema);

module.exports = Sensor;
