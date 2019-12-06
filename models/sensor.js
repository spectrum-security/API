const mongoose = require("mongoose");

// Schema variable
const Schema = mongoose.Schema;

const sensorSchema = new Schema(
  {
    name:String
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
    maintenance:[
      {
        date:{
          type:Date,
          required:true
        },
        report:{
          statusReport:String  
        }
      }
    ],
    active: {
      type: Boolean,
      required: true
    }
  },
  {
    collection: "sensors",
    timestamps: true
  }
);

const Sensor = mongoose.model("Sensor", sensorSchema);

module.exports = Sensor;
