/**
 * Created by Sergi Uceda on 03/05/2017.
 * Copyright (C) 2017 Energo Labs.
 *
 * Copy or sale of this file is forbidden.
 */
'use strict'

// Modules
const randToken = require('rand-token')
const httpStatus = require('http-status-codes')
const validator = require('validator')
const speakeasy = require('speakeasy')
const bcrypt = require('bcrypt')

// Models
const User = require('../user/userModel')
const UserCode = require('../user/userCodeModel')

// Helpers
const smsHelper = require('../../helper/smsHelper')
const authHelper = require('./authHelper')

// Configs
const config = require('../../config/main')

// Constants
const errors = require('../../constants/errors')

/**
 * Send SMS with registration code and save it to the db.
 *
 * @param req
 * @param res
 * @return {Request|*}
 */
module.exports.postCodes = async (req, res) => {
  if (!req.body.phone_number || !req.body.type) {
    return res.status(httpStatus.BAD_REQUEST).send({err: 'phone_number and type required.'})
  }

  // 1. generate 6 digits secure code
  const code = speakeasy.totp({secret: config.user_codes_secret})

  let sms = null

  try {
    sms = await smsHelper.sendSmsCode(
      req.body.phone_number,
      code
    )
  } catch (err) {
    const jsonError = JSON.parse(err.error)

    const error = jsonError.code === 22
      ? errors.AUTH_SMS_TEMPORAL_LIMIT_REACHED
      : jsonError.msg

    return res.status(err.statusCode).send({error: error})
  }

  const normalizedRes = JSON.parse(sms)

  if (normalizedRes.code !== 0) {
    return res.status(httpStatus.BAD_REQUEST).send({err: sms})
  }

  try {
    const phoneCode = await UserCode.registryPhoneAndCode(
      req.body.phone_number,
      code,
      req.body.type
    )

    const result = {
      '_id': phoneCode._id
    }

    // Case development environment, add code on the response for automatic testing
    if (process.env.NODE_ENV !== 'production') result.code = code

    return res.status(httpStatus.CREATED).json(result)
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: err})
  }
}

/**
 * Registration API
 *
 * POST /auth/register
 *
 * @param req
 * @param res
 */
module.exports.postRegister = (req, res) => {
  const phoneNumber = req.body.phone_number
  const password = req.body.password
  const phoneCode = req.body.phone_code

  if (!phoneNumber || !password || !phoneCode) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Please enter phone_number, password and phone_code.'
    })
  }

  if (!validator.isMD5(password)) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Invalid password format.'
    })
  }

  UserCode.verifyPhoneAndCode(
    phoneNumber,
    phoneCode,
    async (err, response, statusCode) => {
      if (err) return res.status(statusCode).send({error: err})

      // Create the new user
      const newUser = new User({
        phone_number: req.body.phone_number,
        password: req.body.password,
        role: req.body.role,
        refresh_token: randToken.uid(256)
      })

      // Attempt to save the user
      newUser.save(function (err) {
        if (err) {
          res.status(httpStatus.CONFLICT)
          return res.json({error: errors.AUTH_INVALID_OR_EXISTING_ACCOUNT})
        }
        res.status(httpStatus.CREATED).json({
          user_id: newUser._id,
          role: newUser.role,
          access_token: 'JWT ' + authHelper.generateToken(newUser),
          refresh_token: newUser.refresh_token
        })
      })
    })
}

/**
 * Login API
 *
 * POST /auth/login
 *
 * @param req
 * @param res
 */
module.exports.postLogin = (req, res) => {
  const conditions = {
    phone_number: req.body.phone_number
  }

  const options = {
    new: true // return the updated model
  }

  const update = {
    $set: {
      refresh_token: randToken.uid(256)
    }
  }

  User.findOneAndUpdate(conditions, update, options, function (err, user) {
    if (err) {
      return res.send({ error: err })
    }

    if (!user) {
      res.status(httpStatus.UNAUTHORIZED)
      return res.send({ message: 'Authentication failed. User not found.' })
    }

    // Check if password matches
    user.comparePassword(req.body.password, function (err, isMatch) {
      if (isMatch && !err) {
        // Create token if the password matched and no error was thrown
        return res.json({
          user_id: user._id,
          access_token: 'JWT ' + authHelper.generateToken(user),
          refresh_token: user.refresh_token
        })
      }

      res.status(httpStatus.FORBIDDEN)
      res.send({
        message: 'Authentication failed. Passwords did not match.'
      })
    })
  })
}

/**
 * Get new token using the refresh token API and the user ID
 *
 * POST /auth/refresh
 *
 * @param req
 * @param res
 */
module.exports.postRefresh = (req, res) => {
  const conditions = {
    _id: req.body.user_id,
    refresh_token: req.body.refresh_token
  }

  const options = {
    new: true // return the updated model
  }

  const update = {
    $set: {
      refresh_token: randToken.uid(256)
    }
  }

  User.findOneAndUpdate(conditions, update, options, function (err, user) {
    if (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err)
    }

    if (!user) {
      res.status(httpStatus.UNAUTHORIZED)
      return res.send({ message: 'Authentication failed. User not found.' })
    }

    return res.json({
      user_id: user._id,
      access_token: 'JWT ' + authHelper.generateToken(user),
      refresh_token: user.refresh_token
    })
  })
}

/**
 * Set new password.
 *
 * @param req
 * @param res
 * @return {Request|*}
 */
module.exports.postPasswordForgot = (req, res) => {
  const phoneNumber = req.body.phone_number
  const newPassword = req.body.new_password
  const phoneCode = req.body.phone_code

  if (!phoneNumber || !newPassword || !phoneCode) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Please enter phone_number, new_password and phone_code.'
    })
  }

  if (!validator.isMD5(newPassword)) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Invalid password format.'
    })
  }

  UserCode.verifyPhoneAndCode(
    phoneNumber,
    phoneCode,
    (err, response, statusCode) => {
      if (err) return res.status(statusCode).send({error: err})

      // hash password
      bcrypt.hash(newPassword, config.salt_work_factor, function (err, hash) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: err})

        // update user password
        const query = {
          phone_number: phoneNumber
        }

        const update = {
          password: hash
        }

        const options = {
          new: true
        }

        User
          .findOneAndUpdate(query, {$set: update}, options)
          .exec((err, user) => {
            if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: err})
            if (!user) return res.status(httpStatus.NOT_FOUND).send({error: 'User not found.'})

            return res.json({
              user_id: user._id,
              role: user.role,
              access_token: 'JWT ' + authHelper.generateToken(user),
              refresh_token: user.refresh_token
            })
          })
      })
    })
}

/**
 * Set new password.
 *
 * @param req
 * @param res
 * @return {Request|*}
 */
module.exports.postPasswordChange = (req, res) => {
  const password = req.body.password
  const newPassword = req.body.new_password

  if (!password || !newPassword) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Please enter both current and new password.'
    })
  }

  if (!validator.isMD5(password) || !validator.isMD5(newPassword)) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Invalid password format.'
    })
  }

  bcrypt.compare(password, req.user.password, (err, isMatch) => {
    if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: err})
    if (!isMatch) return res.status(httpStatus.FORBIDDEN).json({error: 'Authentication failed. Passwords did not match.'})

    // hash password
    bcrypt.hash(newPassword, config.salt_work_factor, (err, hash) => {
      if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: err})

      const query = {
        _id: req.user._id
      }
      const options = {
        new: true
      }
      const update = {
        password: hash
      }

      User
        .findOneAndUpdate(query, {$set: update}, options)
        .exec((err, user) => {
          if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err })
          if (!user) return res.json({error: 'User not found.'})

          // Create token if the password matched and no error was thrown
          return res.json({
            user_id: user._id,
            role: user.role,
            access_token: 'JWT ' + authHelper.generateToken(user),
            refresh_token: user.refresh_token
          })
        })
    })
  })
}
