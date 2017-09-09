'use strict'

const smsConfig = require('../config/sms')
const request = require('request-promise')

/**
 * Send SMS to the customer
 *
 * @param phone
 * @param code
 */
module.exports.sendSmsCode = (
  phone,
  code
) => {
  let text

  if (phone.startsWith('+86') ||  // Mainland China
    phone.startsWith('+853') || // Macau
    phone.startsWith('+854') || // Hong Kong
    phone.startsWith('+886') // Taiwan
  ) {
    text = '【链昱能源】您的验证码是' + code + '。如非本人操作，请忽略本短信'
  } else { // Other Countries
    text = '【ENERGO】Your verification code is: ' + code
  }

  const options = {
    method: 'POST',
    uri: smsConfig.sms_host + smsConfig.send_sms_uri,
    form: {
      text: text,
      apikey: smsConfig.apikey,
      mobile: phone
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  }

  return request(options)
}
