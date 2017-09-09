module.exports = {
  power: {
    type: 'power',
    conversion_ratio: 1000000,
    symbol: 'KW'
  },
  energy: {
    type: 'energy',
    conversion_ratio: 1000000,
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
