'use strict'

// Configs
const mongoose = require('../../config/connection')
const Schema = mongoose.Schema

// create a schema
const userKeysLogSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  private_key: {
    type: String,
    unique: true
  },
  public_key: {
    type: String,
    unique: true
  },
  checked: {
    type: Boolean,
    default: false
  }
},
  {
    timestamps: {createdAt: 'created_at'}
  })

module.exports = mongoose.conn_api.model('UserKeysLog', userKeysLogSchema)
