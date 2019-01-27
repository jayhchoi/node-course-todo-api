const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});

userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

userSchema.methods.generateAuthToken = function() {
  const user = this;
  const access = 'auth';
  const token = jwt.sign({ _id: user._id.toHexString(), access }, '1q2w3e4r');

  user.tokens.push({ access, token });

  // Returns promise with success value of token
  return user.save().then(() => {
    return token;
  });
};

userSchema.statics.findByToken = function(token) {
  const User = this;
  let decoded;

  try {
    // decoded = { _id, access }
    decoded = jwt.verify(token, '1q2w3e4r');
  } catch (e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject();
  }

  // Return promise with user query
  return User.findOne({
    _id: decoded._id,
    // Quotes for nested comparison
    'tokens.token': token,
    'tokens.access': decoded.access
  });
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
