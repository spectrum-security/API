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
    image: {
      type: String
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
      ]
    },
    // Prototype may not use
    paymentMethod: {
      creditCardNumber: {
        type: Number
      },
      cvv: {
        type: Number
      },
      expiresIn: {
        type: Date
      }
    }
  },
  {
    collection: "companies",
    timestamps: true
  }
);

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
