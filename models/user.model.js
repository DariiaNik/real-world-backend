const mongoose = require('mongoose');


const User = mongoose.model(
  'User',
  new mongoose.Schema({
    email: String,
    username: String,
    password: String,
    bio: String,
    image: String,
    followingBy: [String],
  })
);



module.exports = User;
