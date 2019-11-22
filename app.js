const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const app = express();

// Routes
const indexRoute = require("./routes/index");

// App dependencies
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Set port
app.set("port", process.env.PORT || 3000);

// Set routes
app.use("/index", indexRoute);

// Log app errors with morgan
process.on("uncaughtException", error => {
  logger.log({ level: "error", message: error });
  logger.log({ level: "error", message: error.stack });
});

module.exports = app;
