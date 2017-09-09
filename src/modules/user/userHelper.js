'use strict'

// Modules
const Promise = require('bluebird')
const validator = require('validator')
const httpStatus = require('http-status-codes')

// Models
const UserModel = require('./userModel')
const UserKeysLog = require('./userKeysLogModel')

// Config
const bcConfig = require('../../config/blockchain')

// Constants
const errors = require('../../constants/errors')

/**
 * Check payment password validity.
 *
 * @param paymentPassword
 * @param userId
 * @param cb
 *
 * @return User
 */
module.exports.verifyPaymentPassword = function (
  paymentPassword,
  userId,
  cb
) {
  if (!validator.isMD5(paymentPassword)) {
    return cb(errors.USER_INVALID_PASSWORD_FORMAT, null, httpStatus.BAD_REQUEST)
  }

  const query = {
    '_id': userId,
    has_payment_password: true
  }

  UserModel
    .findOne(query)
    .exec((err, user) => {
      if (err) return cb(err, null, httpStatus.INTERNAL_SERVER_ERROR)
      if (!user) return cb(errors.USER_PAYMENT_PASSWORD_NOT_SET, null, httpStatus.BAD_REQUEST)

      if (user.payment_password !== paymentPassword) {
        return cb(errors.USER_WRONG_PAYMENT_PASSWORD, null, httpStatus.UNAUTHORIZED)
      }

      return cb(null, user)
    })
}
