module.exports = {
  environments: {
    TEST: 'test',
    DEVELOPMENT: 'development',
    STAGING: 'staging',
    PRODUCTION: 'production'
  },
  'secret': process.env.API_SECRET || 'm3vGU3MxdXtpRYotkykd*vu4usGOUz98LAWgLyVX',
  'salt_work_factor': 9,
  'port': process.env.API_PORT || 3001,
  'version': process.env.API_VERSION || '0.2.5',
  'last_endpoint_version': process.env.API_LAST_ENPOINT_VERSION || 'v1',
  'domain': process.env.API_DOMAIN || 'http://localhost:3001',
  'refresh_token_ttl': process.env.REFRESH_TOKEN_TTL || '365d',
  'user_codes_ttl': process.env.USER_CODES_TTL || '600s',
  'user_codes_secret': process.env.USER_CODES_SECRET || 'egbu19d014eoqqrkvl7g'
}
