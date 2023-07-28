const mongoose = require('mongoose');

const Completion = new mongoose.Schema({

  model: String,
  prompt: String,
  temperature: Number,
  user : {
    type : mongoose.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model('Completion', Completion);