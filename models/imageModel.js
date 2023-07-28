const mongoose = require('mongoose');

const Image = new mongoose.Schema({

  prompt: String,
  n: Number,
  size: String,
  user : {
    type : mongoose.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model('Image', Image);