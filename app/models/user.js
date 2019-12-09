const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

// Schema variable
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    // May use only email to authenticate
    // username: {
    //   type: String,
    //   required: true
    // },
    name: {
      first: {
        type: String,
        required: true
      },
      last: {
        type: String,
        required: true
      }
    },
    userType: {
      type: Number,
      validate: {
        validator: value => {
          return [1, 2, 3].indexOf(value) > -1; // 1:Backoffice users 2:Company Admin 3:Normal user
        },
        message: "{VALUE} is not a valid type"
      },
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    // May change to userId in companies collection
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },
    fingerprint: {
      type: String, // Will be a string of the path to the file system
      unique: true
    }
  },
  {
    collection: "users",
    timestamps: true
  }
);

userSchema.pre("save", next => {
  if (this.isNew || this.isModified("password")) {
    const document = this;
    bcrypt.hash(document.password, saltRounds, (err, hashedPassword) => {
      if (err) {
        next(err);
      } else {
        document.password = hashedPassword;
        next();
      }
    });
  } else {
    next();
  }
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);

module.exports = User;
