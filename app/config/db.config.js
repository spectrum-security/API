require("dotenv").config();

module.exports = {
  database: `mongodb+srv://spectrum:${process.env.MONGO_DB_PASS}@cluster0-zswyy.mongodb.net/main?retryWrites=true&w=majority`,
  testDatabase: `mongodb+srv://spectrum:${process.env.MONGO_DB_PASS}@cluster0-zswyy.mongodb.net/test?retryWrites=true&w=majority`,
  secret: process.env.MONGO_DB_SECRET
};
