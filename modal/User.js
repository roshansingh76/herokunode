var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
var crypto    = require('crypto'), hmac, signature;
const bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var userSchema = new Schema({

  full_name: { type: String,  required: [true, 'Full name must be provided'] },

  email:    { 
    
    type: String,     
    Required:  'Email address cannot be left blank.',
    validate: [validateEmail, 'Please fill a valid email address'],
         match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
         index: {unique: true, dropDups: true}
    },

  password: { type: String , required: [true,  'Password cannot be left blank']},

  dob: { type: Date },

  country: { type: String},

  gender: { type: String },

  usertype: { type: String },
  image: { type: String },
  isActive: { type: String },
  hash: String,
  salt: String,
  permissions: [{name: String,permit: Boolean}],
  created_at: { type: Date, default: Date.now },

  


});

userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

userSchema.methods.validatePassword = function(password,next) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
  next();
};

userSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    email: this.email,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
}

userSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT(),
  };
};

userSchema.pre('save', function (next) {
  var user = this;
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(this.password, this.salt, 10000, 512, 'sha512').toString('hex');
  user.password = this.hash;
  next();
 
});


module.exports = mongoose.model('Users', userSchema);