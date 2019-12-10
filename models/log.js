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
    sensorType: {
        type:Number,
        validate: {
            validator: value => {
              return [1, 2].indexOf(value) > -1; // 1:Motion sensor 2: Fingerprint sensor
            },
            message: "{VALUE} is not a valid type"
          },
          required: true
    },
    alteredValue:{
        type:[
            {
                alteredField:{
                    type:String,
                    required:true
                },
                previousValue:{
                    type:String,
                    required:true
                },
                newValue:{
                    type:String,
                    required:true
                }
            }
        ]
    },
    
     
    sensorId: {
        type: Schema.Types.ObjectId,
        ref: "Sensor",
        required: true
      },
    userId:{
        type:Schema.Types.ObjectId,
        required:true
    }
  },
  {
    collection: "logs",
    timestamps: true
  }
);

const Log = mongoose.model("Log", logSchema);

module.exports = Log;
