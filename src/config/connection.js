'use strict'

const Promise = require('bluebird')
const mongoose = require('mongoose')
const config = require('./database')
const env = require('./main').environments

mongoose.Promise = Promise

let options = null

// Password is needed to get access to the production DB
if (process.env.NODE_ENV === env.PRODUCTION) {
  options = {
    user: process.env.MDB_USER,
    pass: process.env.MDB_PASSWORD
  }
}

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = env.DEVELOPMENT
}

// Service Database
const connApi = mongoose.createConnection(config.mongoURI[process.env.NODE_ENV], options)

// BigchainDB connection
const connBdb = mongoose.createConnection(config.mongoBdb[process.env.NODE_ENV])

connApi.on('error', console.error.bind(console, 'Connection Error : '))
connApi.once('open', () => {
  console.log('Connection to API service DB ok!')
})

connBdb.on('error', console.error.bind(console, 'Connection Error : '))
connBdb.once('open', () => {
  console.log('Connection to Blockchain DB ok!')
})

mongoose.conn_api = connApi
mongoose.conn_bdb = connBdb

module.exports = mongoose
