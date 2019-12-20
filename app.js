const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

require("dotenv").config();

require("./config/passport");

const config = require("./config/db.config");

mongoose.connect(
  process.env.NODE_ENV === "development"
    ? config.testDatabase
    : config.database,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }
);

let db = mongoose.connection;

db.once("open", () => {
  console.log(`Connected to MongoDB Atlas in ${process.env.NODE_ENV} mode`);
});

db.on("error", err => {
  console.log(err);
});

const app = express();

// Routes
const indexRoute = require("./routes/index.route");
const authRoute = require("./routes/auth.route");
const usersRoute = require("./routes/user.route");
const companyRoute = require("./routes/company.route");
const sensorRoute = require("./routes/sensor.route");

// App dependencies
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Set port
app.set("port", process.env.PORT || 3000);

// Set routes
app.use("/", indexRoute);
app.use("/auth", authRoute);
app.use("/users", usersRoute);
app.use("/sensor", sensorRoute);
app.use("/companies", companyRoute);

// Log app errors with morgan
process.on("uncaughtException", error => {
  logger.log({ level: "error", message: error });
  logger.log({ level: "error", message: error.stack });
});

module.exports = app;
