'use strict'

const jwt = require('jsonwebtoken')

const config = require('../../config/main')

/**
 * Generate JWT Token
 * @param user
 * @returns String
 */
module.exports.generateToken = (user) => {
  return jwt.sign(user, config.secret, {
    expiresIn: 432000 // 5 days
  })
}
