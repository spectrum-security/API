const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "info.log" })
  ]
});

logger.add(
  new winston.transports.Console({
    format: winston.format.simple()
  })
);

module.exports = logger;
