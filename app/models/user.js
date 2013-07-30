
/**
 * Module dependencies
 */

var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , bcrypt = require('bcrypt')
  , Schema = mongoose.Schema
  , crypto = require('crypto');
/**
 * User Schema
 */

var UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  username: { type: String, required: true, trim: true },
  hash: { type: String, required: true, trim: true },
  accessTokens: [String]
}, { collection: 'users' });


/**
 * Virtuals
 */

UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.hash = this.encryptPassword(password);
  })
  .get(function () { return this._password; });

UserSchema
  .virtual('passwordConfirm')
  .set(function (passwordConfirm) {
    this._passwordConfirm = passwordConfirm;
  })
  .get(function () { return this._passwordConfirm; });

/**
 * Validations
 */

UserSchema.path('email').validate(function (email) {
  return (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/).test(email);
});

UserSchema.path('hash').validate(function () {
  if (this._password) {
    if (this._password.length < config.auth.minPassword) {
      this.invalidate('password', 'Passwords must be at least ' + config.auth.minPassword + ' long');
    }
    if (this._password !== this._passwordConfirm) {
      this.invalidate('passwordConfirm', 'Passwords do not match');
    }
  }
});

/**
 * Statics
 */

UserSchema.statics = {
  findByAccessToken: function (accessToken, callback) {
    var id = accessToken.split('::')[1];
    var userFound = null;
    if (id) {
      mongoose.model('User').findOne({ _id: id }, { hash: 0, password: 0 }, function (err, user) {
        if (user && user.hasAccessToken(accessToken)) {
          userFound = user;
        }
        return callback(err, userFound);
      });
    } else {
      return callback();
    }
  }
};

/**
 * Methods
 */

UserSchema.methods = {

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean} true should the user have provided the correct credentials, false otherwise
   * @api public
   */

  authenticate: function (plainText) {
    return bcrypt.compareSync(plainText, this.hash);
  },

  /**
   * Encrypt password using bcrypt
   *
   * @param {String} password
   * @return {String} encrypted hash of the password
   * @api public
   */

  encryptPassword: function (password) {
    if (!password) {
      return '';
    }

    return bcrypt.hashSync(password, config.auth.saltSize);
  },

  /**
   * Generates a new access token based on user's username, hashed password, and now miliseconds
   *
   * @return {String} access token
   * @api public
   */

  newAccessToken: function () {
    var accessToken = crypto.createHash('sha1').update(this.username + this.hash + (new Date().getTime())).digest('hex');
    accessToken += '::' + this._id;

    this.accessTokens.push(accessToken);
    this.save();

    return accessToken;
  },

  /**
   * Verifies if the user has the access token provided
   *
   * @param {String} accessToken
   * @return {Boolean} true if the user has the access token and is valid, false otherwise
   * @api public
   */

  hasAccessToken: function (accessToken) {
    accessToken = accessToken.replace(/^Kraken /, '');
    return this.accessTokens.indexOf(accessToken) > -1;
  }
};

mongoose.model('User', UserSchema);
module.exports.UserSchema = UserSchema;
