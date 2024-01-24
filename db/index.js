const mongoose = require('mongoose');

const { mongodb_url: mongoDbUrl } = require('../config');

mongoose.connect(mongoDbUrl, {
  useUnifiedTopology: true,
  // useFindAndModify: true,
  // useCreateIndex: true,
  useNewUrlParser: true,
});

const db = mongoose.connection;

module.exports = db;
