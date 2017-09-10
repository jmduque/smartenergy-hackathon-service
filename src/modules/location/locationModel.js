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
    },
    name: {
      type: String
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  })

module.exports = mongoose.conn_api.model('Location', locationSchema)
