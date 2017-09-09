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
  'user_codes_secret': process.env.USER_CODES_SECRET || 'egbu19d014eoqqrkvl7g',
  'order_fee_percent': 1,
  meter_data_url: 'http://device-api.energolabs.com/get_data?deviceid=',
  meter_access_url: 'http://device-api.energolabs.com/post_access?deviceid=',
  upgrades: {
    fir: {
      url: 'https://api.fir.im/apps/latest/',
      api_token: '85a07b6acf6dc889db3ea25546d7b229'
    },
    ios: {
      client_app: {
        development: '',
        staging: '',
        production: ''
      }
    },
    android: {
      client_app: {
        development: '599ea8c8548b7a667f00003f',
        staging: '', // TODO
        production: '' // TODO
      },
      smart_meter: {
        development: '',
        staging: '',
        production: ''
      }
    },
    platforms: {
      android: 'android',
      ios: 'ios'
    },
    types: {
      client_app: 'client_app',
      smart_meter: 'smart_meter'
    }
  },
  market: {
    default_order_price: 500
  }
}
