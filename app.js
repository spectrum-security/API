const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const logger = require("./helpers/logger");
const cors = require("cors");
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");

require("dotenv").config();

const mailListenerWrapper = require("./mailListenerWrapper");

require("./config/passport");

const config = require("./config/db.config");

mongoose.connect(config.testDatabase, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

let db = mongoose.connection;

let gfs;

db.once("open", () => {
  gfs = Grid(db.db, mongoose.mongo);
  gfs.collection("uploads");
  console.log(`Connected to MongoDB Atlas in ${process.env.NODE_ENV} mode`);
});

db.on("error", err => {
  console.log(err);
});

const app = express();

global.mailListenerWrapper = new mailListenerWrapper();

// Routes
const indexRoute = require("./routes/index.route");
const authRoute = require("./routes/auth.route");
const usersRoute = require("./routes/user.route");
const companyRoute = require("./routes/company.route");
const sensorRoute = require("./routes/sensor.route");
const logRoute = require("./routes/log.route");
const maillingRoute = require("./routes/mailling.route");
const requestRoute = require("./routes/request.route");
const fileRoute = require("./routes/file.route");
const recEmailRoute = require("./routes/recEmail.route");

// App dependencies
app.use(morgan("dev"));
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/storage", express.static("storage"));

// Set port
app.listen(app.get("port"));

// Set routes
app.use("/", indexRoute);
app.use("/auth", authRoute);
app.use("/users", usersRoute);
app.use("/sensors", sensorRoute);
app.use("/logs", logRoute);
app.use("/companies", companyRoute);
app.use("/mail", maillingRoute);
app.use("/request", requestRoute);
app.use("/file", fileRoute);
app.use("/rec_email", recEmailRoute);

// couldnt find a way to set it up as REST
app.get("/files/image/:filename", async (req, res, next) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ err: "No File Exists" });
    } else {
      // Check if is image
      if (
        file.contentType === "image/jpeg" ||
        file.contentType === "image/png"
      ) {
        // Read output to broswer
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({ err: "Not an image" });
      }
    }
  });
});

// Log app errors with morgan
process.on("uncaughtException", error => {
  logger.log({ level: "error", message: error });
  logger.log({ level: "error", message: error.stack });
});

module.exports = app;
