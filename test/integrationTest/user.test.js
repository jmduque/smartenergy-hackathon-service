/**
 * Created by Sergi Uceda on 14/06/2017.
 * Copyright (C) 2017 Energo Labs.
 *
 * Copy or sale of this file is forbidden.
 */
'use strict'

// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

// Modules
const app = require('../../app')
const chai = require('chai')
const request = require('supertest')
const faker = require('faker/locale/zh_CN')
const expect = chai.expect
const speakeasy = require('speakeasy')
const crypto = require('crypto')

// Models
const UserCode = require('../../src/modules/user/userCodeModel')

// Config
const config = require('../../src/config/main')

describe('Registration Tests', async () => {
  const phoneNumber = faker.phone.phoneNumber()
  const phoneCode = speakeasy.totp({secret: config.user_codes_secret})
  const userPassword = crypto.createHash('md5').update(faker.internet.password()).digest('hex')
  let userId = null
  let authToken = null

  it('should generate a new registration code for the phone number', done => {
    UserCode.remove({}, async err => {
      if (err) done(err)
      const userCode = new UserCode({
        phone_number: phoneNumber,
        code: phoneCode,
        type: 'register'
      })

      try {
        userCode.save()
        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it('should Register', done => {
    const payload = {
      phone_number: phoneNumber,
      phone_code: phoneCode,
      password: userPassword
    }
    request(app)
      .post('/api/v1/auth/register')
      .send(payload)
      .end((err, res) => {
        if (err) done(err)

        const body = res.body
        expect(body).to.have.property('user_id')
        expect(body).to.have.property('role').to.equal('user')
        expect(body).to.have.property('access_token')
        expect(body).to.have.property('refresh_token')
        expect(res.statusCode).to.equal(201)
        done()
      })
  })

  it('should Login', done => {
    const payload = {
      phone_number: phoneNumber,
      password: userPassword
    }

    request(app)
      .post('/api/v1/auth/login')
      .send(payload)
      .end((err, res) => {
        if (err) done(err)

        const body = res.body
        expect(body).to.have.property('user_id')
        expect(body).to.have.property('access_token')
        expect(body).to.have.property('refresh_token')
        expect(res.statusCode).to.equal(200)

        userId = body.user_id
        authToken = body.access_token

        done()
      })
  })

  it('should get user information', done => {
    request(app)
      .get('/api/v1/users/' + userId)
      .set('Authorization', authToken)
      .end((err, res) => {
        if (err) done(err)

        const body = res.body
        expect(body).to.be.a('object')
        expect(body).to.have.property('_id').to.equal(userId)
        expect(body).to.have.property('phone_number').to.equal(phoneNumber)
        expect(body).to.have.property('is_service').to.equal(false)
        expect(body).to.have.property('identity')
        expect(body.identity).to.have.property('status').to.equal('unsubmitted')
        expect(body.identity).to.have.property('verified').to.equal(false)
        expect(body.identity).to.have.property('photos').to.be.a('array').to.have.length(0)
        expect(body).to.have.property('role').to.equal('user')
        expect(body).to.have.property('has_payment_password').to.equal(false)
        expect(body).to.have.property('gender').to.equal(9)
        expect(body).to.have.property('updated_at')
        expect(body).to.have.property('created_at')
        expect(res.statusCode).to.equal(200)
        done()
      })
  })

  it('should update user with new personal info', done => {
    const payload = {
      'avatar': faker.image.imageUrl(),
      'name': faker.name.findName(),
      'gender': 1,
      'location': {
        'area_code': faker.address.countryCode(),
        'area_name': faker.address.country()
      },
      'identity': {
        'account_type': 'family',
        'photos': [
          {
            'url': faker.image.imageUrl(),
            'type': 'id_photo_front'
          },
          {
            'url': faker.image.imageUrl(),
            'type': 'id_photo_back'
          }
        ]
      }
    }

    request(app)
      .put('/api/v1/users/' + userId)
      .send(payload)
      .set('Authorization', authToken)
      .end((err, res) => {
        if (err) done(err)

        const body = res.body
        expect(body).to.be.a('object')
        expect(body).to.have.property('_id').to.equal(userId)
        expect(body).to.have.property('phone_number').to.equal(phoneNumber)
        expect(body).to.have.property('is_service').to.equal(false)
        expect(body).to.have.property('identity')
        expect(body.identity).to.have.property('status').to.equal('submitted')
        expect(body.identity).to.have.property('verified').to.equal(false)
        expect(body.identity).to.have.property('photos').to.be.a('array').to.have.length(2)
        expect(body).to.have.property('role').to.equal('user')
        expect(body).to.have.property('has_payment_password').to.equal(false)
        expect(body).to.have.property('gender').to.equal(1)
        expect(body).to.have.property('updated_at')
        expect(body).to.have.property('created_at')
        expect(res.statusCode).to.equal(200)
        done()
      })
  })

  it('should update user with new personal info', done => {
    const payload = {
      'avatar': faker.image.imageUrl(),
      'name': faker.name.findName(),
      'gender': 1,
      'location': {
        'area_code': faker.address.countryCode(),
        'area_name': faker.address.country()
      },
      'identity': {
        'account_type': 'family',
        'photos': [
          {
            'url': faker.image.imageUrl(),
            'type': 'id_photo_front'
          },
          {
            'url': faker.image.imageUrl(),
            'type': 'id_photo_back'
          }
        ]
      }
    }

    request(app)
      .put('/api/v1/users/' + userId)
      .send(payload)
      .set('Authorization', authToken)
      .end((err, res) => {
        if (err) done(err)

        const body = res.body
        expect(body).to.be.a('object')
        expect(body).to.have.property('_id').to.equal(userId)
        expect(body).to.have.property('phone_number').to.equal(phoneNumber)
        expect(body).to.have.property('is_service').to.equal(false)
        expect(body).to.have.property('identity')
        expect(body.identity).to.have.property('status').to.equal('submitted')
        expect(body.identity).to.have.property('verified').to.equal(false)
        expect(body.identity).to.have.property('photos').to.be.a('array').to.have.length(2)
        expect(body).to.have.property('role').to.equal('user')
        expect(body).to.have.property('has_payment_password').to.equal(false)
        expect(body).to.have.property('gender').to.equal(1)
        expect(body).to.have.property('updated_at')
        expect(body).to.have.property('created_at')
        expect(res.statusCode).to.equal(200)
        done()
      })
  })
})
