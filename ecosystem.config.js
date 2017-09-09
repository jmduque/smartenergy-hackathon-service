module.exports = {
  apps: [
    {
      name: 'SERVICE-API',
      script: 'app.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_staging: {
        NODE_ENV: 'staging',
        API_PORT: 3000,
        API_DOMAIN: 'ext-api.energolabs.com',
        API_SECRET: '6xkn18O4RkZqFeud1Dnw*uMNcGjcwaZibqE7ZDtYf',
        STAGING_SERVICES_DB: 'mongodb://energo:energo_23axz23@ip-172-31-6-125.cn-north-1.compute.internal:27017/staging_services_db?authSource=admin',
        STAGING_BDB_DB: 'mongodb://ip-172-31-6-125.cn-north-1.compute.internal:57017/bigchain',
        BDB_URL: 'http://ip-172-31-6-125.cn-north-1.compute.internal:19984/api/v1',
        BDB_WRAPPER_URL: 'http://ip-172-31-6-125.cn-north-1.compute.internal:5000/'
      }
    }
  ]
}
