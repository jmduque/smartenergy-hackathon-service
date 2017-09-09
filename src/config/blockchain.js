module.exports = {
  bdb_url: process.env.BDB_URL || 'http://ec2-52-80-57-88.cn-north-1.compute.amazonaws.com.cn:19984/api/v1',
  bdb_transactions_endpoint: '/transactions',
  bdb_wrapper_url: process.env.BDB_WRAPPER_URL || 'http://ec2-52-80-57-88.cn-north-1.compute.amazonaws.com.cn:5000/',
  bdb_wrapper_users_endpoint: 'blockchain/users',
  bdb_wrapper_fulfill_endpoint: 'blockchain/transactions/fulfill',
  bdb_wrapper_asset_fulfill_endpoint: 'blockchain/assets/fulfill',
  bdb: {
    outputs_endpoint: '/outputs'
  },
  power: {
    type: 'power',
    conversion_ratio: 1000,
    symbol: 'KW'
  },
  energy: {
    type: 'energy',
    conversion_ratio: 1000,
    symbol: 'KWh'
  },
  currency: {
    type: 'currency',
    conversion_ratio: 1000000,
    symbol: 'CNY',
    withdraw: 'withdraw',
    topup: 'topup'
  },
  system_access_token: process.env.SYSTEM_ACCESS_TOKEN || '2b2865f7a4c3a1bc4357fcd9be0d15140f473bd8',
  tx_types: {
    add: 'add',
    remove: 'remove',
    transfer: 'transfer',
    fees: 'fees',
    reading: 'reading',
    undefined: 'undefined'
  },
  node: {
    node_name: 'EnergoLabs',
    operator: 'EnergoLabs',
    node_ip: '123.206.218.84'
  }
}
