'use strict'

const mongoose = require('../../config/connection')
const Schema = mongoose.Schema

// create a schema
const locationSchema = new Schema(
  {
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  })

// create a schema
const batterySchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['online', 'offline'],
    default: 'online'
  },
  type: {
    type: String,
    enum: ['ev', 'pw'],
    default: 'pw'
  },
  capacity: {
    type: Number,
    min: 0
  },
  charge: {
    type: Number,
    min: 0
  },
  location: {
    type: locationSchema
  }
},
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  })

module.exports = mongoose.conn_api.model('Battery', batterySchema)
