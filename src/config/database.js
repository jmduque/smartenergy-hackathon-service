const config = {}

config.mongoURI = {
  test: process.env.TEST_SERVICES_DB || 'mongodb://localhost:27017/test_db',
  development: process.env.DEV_SERVICES_DB || 'mongodb://energo:energo_23axz23@ec2-52-80-57-88.cn-north-1.compute.amazonaws.com.cn:27017/staging_services_db?authSource=admin',
  staging: process.env.STAGING_SERVICES_DB,
  production: process.env.PRODUCTION_SERVICES_DB
}

config.mongoBdb = {
  test: process.env.TEST_BDB_DB || 'mongodb://localhost:27017/test_blockchain_db',
  development: process.env.DEV_BDB_DB || 'mongodb://ec2-52-80-57-88.cn-north-1.compute.amazonaws.com.cn:57017/bigchain',
  staging: process.env.STAGING_BDB_DB,
  production: process.env.PRODUCTION_SERVICES_DB
}

module.exports = config
