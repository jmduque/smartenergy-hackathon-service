const config = {}

config.mongoURI = {
  test: process.env.TEST_SERVICES_DB || 'mongodb://localhost:27017/test_db',
  development: process.env.DEV_SERVICES_DB || 'mongodb://energo:energo_23axz23@ec2-54-169-214-62.ap-southeast-1.compute.amazonaws.com:27017/develop_services_db?authSource=admin',
  staging: process.env.STAGING_SERVICES_DB,
  production: process.env.PRODUCTION_SERVICES_DB
}

module.exports = config
