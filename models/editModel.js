const mongoose = require('mongoose');

const Edit = new mongoose.Schema({

  model: String,
  input: String,
  instruction: String,
  user : {
    type : mongoose.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model('Edit', Edit);