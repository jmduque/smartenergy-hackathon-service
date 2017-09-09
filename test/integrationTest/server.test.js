/**
 * Created by Sergi Uceda on 14/06/2017.
 * Copyright (C) 2017 Energo Labs.
 *
 * Copy or sale of this file is forbidden.
 */
'use strict'

// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

const app = require('../../app')
const chai = require('chai')
const request = require('supertest')

const expect = chai.expect

describe('Server API Tests', () => {
  describe('#GET / ', () => {
    it('should return version number', done => {
      request(app)
        .get('/api')
        .end(function (err, res) {
          if (err) console.error(err)
          expect(res.body).to.have.property('version')
          expect(res.body).to.have.property('api_endpoint')
          expect(res.statusCode).to.equal(200)
          done()
        })
    })
  })
})
