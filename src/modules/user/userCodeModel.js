'use strict'

// Modules
const httpStatus = require('http-status-codes')

// Configs
const mongoose = require('../../config/connection')
const config = require('../../config/main')
const Schema = mongoose.Schema

// Constants
const errors = require('../../constants/errors')

// create a schema
const userCodeSchema = new Schema({
  phone_number: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['register', 'forgot_password']
  },
  created_at: {
    type: Date,
    default: Date.now,
    expires: config.user_codes_ttl
  }
})

userCodeSchema.index({phone_number: 1, type: 1}, { unique: true })

/**
 * Registry phone and code
 *
 * @param phoneNumber
 * @param code
 * @param type
 */
userCodeSchema.statics.registryPhoneAndCode = function (
  phoneNumber,
  code,
  type
) {
  const query = {
    phone_number: phoneNumber,
    type: type
  }

  const update = {
    code: code
  }

  const options = {
    new: true,
    upsert: true
  }

  return this
    .findOneAndUpdate(query, {$set: update}, options)
    .exec()
}

/**
 * Check if phone code is valid with the corresponding phone number.
 *
 * @param phoneNumber
 * @param code
 * @param cb
 */
userCodeSchema.statics.verifyPhoneAndCode = function (
  phoneNumber,
  code,
  cb
) {
  const query = {
    phone_number: phoneNumber,
    code: code
  }

  this
    .findOne(query)
    .exec((err, phoneRegistration) => {
      if (err) return cb(err, null, httpStatus.INTERNAL_SERVER_ERROR)

      if (!phoneRegistration) {
        return cb(errors.USER_PHONE_NUMBER_NOT_VERIFIED, null, httpStatus.NOT_FOUND)
      }

      return cb(null, phoneRegistration)
    })
}

module.exports = mongoose.conn_api.model('UserCode', userCodeSchema)
