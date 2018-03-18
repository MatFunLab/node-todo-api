const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value);
      },
      message: "{VALUE} is not a valid email"
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

//regular method - determines what gets returned when mongoose model is converted into JSON value
UserSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject(); // taking mongoose variable (user) and converts it to object
  return _.pick(userObject, ["_id", "email"]);
}

UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = "auth";
  var token = jwt.sign({_id: user._id.toHexString(), access}, "abc123").toString();

  user.tokens = user.tokens.concat([{access, token}]);
  return user.save().then(() => {
    return token;
  }).catch(() => {
    console.log("Problem with saving user");
  });
};

UserSchema.statics.findByToken = function(token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, "abc123");
  } catch(e) {
    return Promise.reject("Unauthorized access!");
  }

  return User.findOne({
    "_id": decoded._id,
    "tokens.token": token,
    "tokens.access": "auth"
  });
};
var User = mongoose.model("User", UserSchema);

module.exports = {User};
