/**
 * Created by Sergi Uceda on 21/04/2017.
 * Copyright (C) 2017 Energo Labs.
 *
 * Copy or sale of this file is forbidden.
 */
'use strict'

// General common errors.
exports.GENERAL_FIELDS_MISSING = 'Fields missing.'
exports.GENERAL_INSUFICIENT_BALANCE = 'Insufficient balance.'
exports.GENERAL_USER_NOT_FOUND = 'User not found or not verified.'
exports.GENERAL_NO_SERVICE_FOUND = 'No service found.'

// Blockchain
exports.BLOCKCHAIN_NOT_ENOUGH_FUNDS = 'Not enough funds.'
exports.BLOCKCHAIN_INSUFICIENT_AMOUNT = 'Insufficient amount.'
exports.BLOCKCHAIN_INVALID_TRANSFER_AMOUNT = 'Invalid transfer amount.'
exports.BLOCKCHAIN_ASSET_NOT_FOUND = 'Blockchain asset not found.'

// Market
exports.MARKET_TRUE_VALUE_ERROR = true
exports.MARKET_PRICE_NOT_SET = 'Market price not set.'
exports.MARKET_PERIOD_MISSING = 'Period missing.'
exports.MARKET_INVALID_PERIOD = 'Invalid period.'
exports.MARKET_ORDER_ALREADY_PLACED = 'Order already placed.'
exports.MARKET_REQUIREMENTS_NOT_MEET_UNABLE_TO_CREATE_ORDER = 'Requirements not meet. Unable to create order for user: '
exports.MARKET_NO_CHANGES_ORDERS_BUY_SELL = 'No changes. No buy or sell orders.'
exports.MARKET_NO_CHANGES = 'No changes.'
exports.MARKET_EMPTY_AMOUNTS = 'Empty amounts.'
exports.MARKET_MISSING_USER_VERIFICATION = 'Missing user verification.'

// User
exports.USER_PHONE_NUMBER_NOT_VERIFIED = 'phone number not verified.'
exports.USER_INVALID_PASSWORD_FORMAT = 'Invalid password format.'
exports.USER_PAYMENT_PASSWORD_NOT_SET = 'Payment password not set.'
exports.USER_WRONG_PAYMENT_PASSWORD = 'Wrong payment password.'
exports.USER_ERROR_REMOVE_MARKET_ORDER = 'Problem attempting to remove the related Market Orders.'
exports.USER_ERROR_REMOVE_USER = 'Problem attempting to remove the user.'

// Auth
exports.AUTH_INVALID_SYSTEM_TOKEN = 'Invalid System Token'
exports.AUTH_SMS_TEMPORAL_LIMIT_REACHED = 'Same number can only request maximum 3 times per hour, please try it after 1 hour.'
exports.AUTH_INVALID_OR_EXISTING_ACCOUNT = 'This account is invalid or already created'

// Device
exports.DEVICE_NOT_FOUND = 'Device not found.'
exports.DEVICE_NOT_BOUND = 'Device not bound.'
exports.DEVICE_DATA_REPORTED = 'Device energy data reported correctly.'

// Microgrid
exports.MICROGRID_COORDINATES_MUST_BE_ARRAY = 'Coordinates must be an array.'
