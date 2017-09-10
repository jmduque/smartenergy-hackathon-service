'use strict'

const mongoose = require('../../config/connection')
const Schema = mongoose.Schema

//create a schema
const locationSchema = new Schema({
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  name: {
    type: String
  }
}, {
  timestamps: {
    createAt: 'create_at',
    updatedAt: 'updated_at'
  }
})

const bookSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  start_time: {
    type: Date,
    required: true,
  },
  end_time: {
    type: Date,
    required: true,
  }
})

//create a schema
const chargeSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String
  },
  using: {
    type: Boolean,
    default: 'false'
  },
  power: {
    type: Number
  },
  voltage: {
    type: String
  },
  booking: {
    type: [bookSchema]
  },
  location: {
    type: locationSchema
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports = mongoose.conn_api.model('Charge',chargeSchema)