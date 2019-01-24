const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
