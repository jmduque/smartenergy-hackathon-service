/**
 * Created by Sergi Uceda on 03/05/2017.
 * Copyright (C) 2017 Energo Labs.
 *
 * Copy or sale of this file is forbidden.
 */
'use strict'

// Modules
const httpStatus = require('http-status-codes')

// Models
const User = require('./userModel')

// Constants
const errors = require('../../constants/errors')

/**
 * Get user by id
 *
 * GET /users/:id
 *
 * @param req
 * @param res
 */
module.exports.getUser = (req, res) => {
  User
    .findById(req.params.id)
    .exec(function (err, user) {
      if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err })

      return res.json(user)
    })
}

/**
 * Update user fields:
 *
 * - avatar
 *
 * PUT /users/:id
 *
 * @param req
 * @param res
 */
module.exports.updateUser = (req, res) => {
  const update = {}

  // Add fields that will be updated
  if (req.body.avatar) {
    update.avatar = req.body.avatar
  }
  if (req.body.name) {
    update.name = req.body.name
  }

  if (req.body.gender) {
    update.gender = parseInt(req.body.gender)
  }

  if (req.body.identity) {
    update.identity = {
      verified: false,
      photos: req.body.identity.photos,
      account_type: req.body.identity.account_type,
      status: 'submitted'
    }

    if (!req.body.location) {
      return res.status(httpStatus.BAD_REQUEST).json({error: 'Bad request.'})
    }

    update.location = {
      area_code: req.body.location.area_code,
      area_name: req.body.location.area_name
    }
  }

  const options = {
    new: true
  }

  User
    .findByIdAndUpdate(req.params.id, {$set: update}, options)
    .exec(function (err, user) {
      if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err })

      return res.json(user)
    })
}

/**
 * Get all users API
 *
 * GET /admin/users
 *
 * @param req
 * @param res
 */
module.exports.getAdminUsers = async (req, res) => {
  const offset = parseInt(req.query.offset || 0)
  const limit = parseInt(req.query.limit)
  const accountType = req.query.account_type

  const conditions = {
    is_service: false,
    role: 'user'
  }

  // If account type set, filter by it
  if (accountType) {
    conditions['identity.account_type'] = accountType
  }

  try {
    const users = await User.find(conditions).skip(offset).limit(limit).exec()
    return res.status(httpStatus.OK).json(users)
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: error })
  }
}

/**
 * Delete a user.
 *
 * @param req
 * @param res
 * @return {Promise.<void>}
 */
module.exports.deleteUser = async (req, res) => {
  const userId = req.params.id

  const userConditions = {
    is_service: false,
    _id: userId
  }

  try {
    const userRemoved = await User.remove(userConditions).exec()
    if (userRemoved.result.ok !== 1) {
      return res.status(httpStatus.BAD_REQUEST).json({error: errors.USER_ERROR_REMOVE_USER})
    }

    return res.status(httpStatus.NO_CONTENT).send()
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: err})
  }
}
