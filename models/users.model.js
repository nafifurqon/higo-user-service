const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    nomor: {
      type: Number,
    },
    name_of_location: {
      type: String,
    },
    date: {
      type: Date,
    },
    login_hour: {
      type: String,
    },
    name: {
      type: String,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
    },
    email: {
      type: String,
    },
    no_telp: {
      type: String,
    },
    brand_digital: {
      type: String,
    },
    digital_interest: {
      type: String,
    },
    location_type: {
      type: String,
    },
  },
  { timestamps: false },
);

module.exports = mongoose.model('User', userSchema);
