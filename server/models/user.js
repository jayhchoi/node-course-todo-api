const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

// Overriding given method to pick what fields to send
userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

userSchema.methods.generateAuthToken = function() {
  const user = this;
  const access = 'auth';
  const token = jwt.sign(
    { _id: user._id.toHexString(), access },
    process.env.JWT_SECRET
  );

  user.tokens.push({ access, token });

  // Returns promise with success value of token
  return user.save().then(() => {
    return token;
  });
};

userSchema.methods.removeToken = function(token) {
  const user = this;

  return user.update({
    $pull: {
      tokens: {
        token
      }
    }
  });
};

userSchema.statics.findByToken = function(token) {
  const User = this;
  let decoded;

  try {
    // decoded = { _id, access }
    decoded = jwt.verify(token, process.env.JWT_SECRET);
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

userSchema.statics.findByCredentials = function(email, password) {
  const User = this;

  return User.findOne({ email }) // findOne method itself returns a promise
    .then(user => {
      if (!user) {
        return Promise.reject('There is no user by the email'); // Shortcut for new Promise((resolve, reject) =>)
      }

      return new Promise((resolve, reject) => {
        // Compare the hashed and string passwords
        bcrypt.compare(password, user.password, (err, isEqual) => {
          if (isEqual) {
            resolve(user);
          } else {
            reject('Password is not valid');
          }
        });
      });
    })
    .catch(e => {
      return Promise.reject(e);
    });
};

userSchema.pre('save', function(next) {
  const user = this;

  if (user.isModified('password')) {
    bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(user.password, salt))
      .then(hashed => {
        user.password = hashed;
        next();
      });
  } else {
    next();
  }
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
