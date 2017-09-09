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
        API_DOMAIN: 'ec2-54-169-214-62.ap-southeast-1.compute.amazonaws.com',
        API_SECRET: '6xkn18O4RkZqFeud1Dnw*uMNcGjcwaZibqE7ZDtYf',
        STAGING_SERVICES_DB: 'mongodb://energo:energo_23axz23@ec2-54-169-214-62.ap-southeast-1.compute.amazonaws.com:27017/staging_services_db?authSource=admin'
      }
    }
  ]
}
