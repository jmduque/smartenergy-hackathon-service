const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../modules/user/userModel')
const config = require('./main')

// Setup work and export for the JWT passport strategy
module.exports = function (passport) {
  const opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader()
  opts.secretOrKey = config.secret

  passport.use(new JwtStrategy(opts, function (jwtPayload, done) {
    User.findOne({_id: jwtPayload._doc._id}, function (err, user) {
      if (err) {
        return done(err, false)
      }
      if (user) {
        done(null, user)
      } else {
        done(null, false)
      }
    })
  }))
}
