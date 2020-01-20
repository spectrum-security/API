const mongoose = require("mongoose");

// Schema variable
const Schema = mongoose.Schema;

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    mainAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    phoneContacts: {
      main: {
        type: Number
      },
      others: [Number]
    },
    points: {
      type: Number,
      default: 0
    },
    offices: {
      type: [
        {
          location: {
            type: String
          },
          postalCode: {
            type: String
          }
        }
      ],
      required: true
    },
    // Prototype may not use
    paymentMethod: {
      type: Number,
      validate: {
        validator: value => {
          return [1, 2, 3].indexOf(value) > -1; // 1:Paypal 2:CreditCard 3:Bank Transfer
        },
        message: "{VALUE} is not a valid type"
      },
      required: true
    }
  },
  {
    collection: "companies",
    timestamps: true
  }
);

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
