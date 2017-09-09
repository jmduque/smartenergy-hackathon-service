'use strict'

// Modules
const httpStatus = require('http-status-codes')
const bcrypt = require('bcrypt')

// Configs
const mongoose = require('../../config/connection')
const config = require('../../config/main')
const Schema = mongoose.Schema

// create a schema
const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    lowercase: true,
    unique: true,
    trim: true,
    sparse: true
  },
  phone_number: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  gender: {
    type: Number,
    enum: [0, 1, 2, 9], // ISO/IEC 5218
    default: 9
  },
  password: {
    type: String,
    required: true
  },
  payment_password: {
    type: String
  },
  has_payment_password: {
    type: Boolean,
    default: false
  },
  refresh_token: {
    type: String,
    expires: config.refresh_token_ttl
  },
  role: {
    type: String,
    enum: ['admin', 'operator', 'user'],
    default: 'user'
  },
  location: {
    area_code: String,
    area_name: String
  },
  identity: {
    verified: {
      type: Boolean,
      default: false
    },
    photos: [
      {
        url: String,
        type: {
          type: String,
          enum: ['id_photo_front', 'id_photo_back']
        },
        status: String,
        comments: [String]
      }
    ],
    account_type: {
      type: String,
      enum: ['family', 'business', 'industry'] // TODO: Only family is supported now
    },
    status: {
      type: String,
      enum: ['unsubmitted', 'submitted', 'rejected', 'valid'],
      default: 'unsubmitted'
    }
  },
  private_key: {
    type: String,
    unique: true
  },
  public_key: {
    type: String,
    unique: true
  },
  avatar: String,
  is_service: {
    type: Boolean,
    default: false
  }
},
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  })

// Unique index is_service = true, only one user can be the service
userSchema.index({is_service: 1}, {unique: true, partialFilterExpression: {is_service: true}})

// Middleware that saves the user's password hashed
userSchema.pre('save', function (next) {
  const user = this

    // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next()

  bcrypt.hash(user.password, config.salt_work_factor, function (err, hash) {
    if (err) {
      return next(err)
    }
        // override the clear text password with the hashed one
    user.password = hash
    next()
  })
})

// filter the json response
userSchema.set('toJSON', {
    // black list
  transform: function (doc, ret, options) {
    delete ret.password
    delete ret.refresh_token
    delete ret.private_key
    delete ret.public_key
    delete ret.payment_password
    return ret
  }
})

// Create method to compare password input to password saved in database
userSchema.methods.comparePassword = function (pw, cb) {
  bcrypt.compare(pw, this.password, function (err, isMatch) {
    if (err) {
      return cb(err)
    }
    cb(null, isMatch)
  })
}

userSchema.statics.getAuthenticated = function (phoneNumber, password, cb) {
  this.findOne({ phone_number: phoneNumber }, function (err, user) {
    if (err) return cb(err)

        // make sure the user exists
    if (!user) {
      return cb(null, null, httpStatus.NOT_FOUND)
    }

        // test for a matching password
    user.comparePassword(password, function (err, isMatch) {
      if (err) return cb(err)
            // check if the password was a match
      if (isMatch) {
        return cb(null, user)
      }
    })
  })
}

/**
 * Get user privateKey from verifying key
 *
 * @param publicKey
 * @param cb
 *
 * @return User
 */
userSchema.statics.getSigningKey = function (
  publicKey, cb
) {
  const query = {
    public_key: publicKey
  }

  this.findOne(query, (err, user) => {
    if (err) return cb(err, null)

    // make sure the user exists
    if (!user) {
      return cb(null, null, httpStatus.NOT_FOUND)
    }

    return cb(null, user.private_key)
  })
}

module.exports = mongoose.conn_api.model('User', userSchema)
