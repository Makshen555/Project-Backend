const mongoose = require('mongoose');

const User = new mongoose.Schema({

  email: String,
  name: String,
  password: String,
  role: String,
  verified: Boolean
});

module.exports = mongoose.model('User', User);