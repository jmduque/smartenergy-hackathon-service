'use strict'

/**
 * Initialize Socket.io
 */
const init = function (app) {
  const server = require('http').Server(app)

  // The server object will be then used to list to a port number
  return server
}

module.exports = init
