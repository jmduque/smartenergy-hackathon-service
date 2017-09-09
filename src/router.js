'use strict'

const express = require('express')
const passport = require('passport')
const ConnectRoles = require('connect-roles')
const httpStatus = require('http-status-codes')

const auth = require('./modules/auth/authController')
const user = require('./modules/user/userController')

// Middleware to require login/auth
const userAuth = passport.authenticate('jwt', {session: false})

// set roles
const roles = new ConnectRoles({
  failureHandler: function (req, res, action) {
    res.status(httpStatus.FORBIDDEN)
    res.send({error: 'Access Denied - You don\'t have permission to: ' + action})
  }
})

// define admin role
roles.use('admin', function (req) {
  if (req.user.role === 'admin') {
    return true
  }
})

// Initializing route groups
const apiRoutes = express.Router()
const v1Routes = express.Router()

// Set v1 routes as subgroup/middleware to apiRoutes
apiRoutes.use('/v1', v1Routes)

// Auth
v1Routes.post('/auth/login', auth.postLogin)
v1Routes.post('/auth/register', auth.postRegister)
v1Routes.post('/auth/refresh', auth.postRefresh)
v1Routes.post('/auth/codes', auth.postCodes)
v1Routes.post('/auth/password/forgot', auth.postPasswordForgot)

// User
v1Routes.get('/users/:id', userAuth, user.getUser)
v1Routes.put('/users/:id', userAuth, user.updateUser)

module.exports = apiRoutes
