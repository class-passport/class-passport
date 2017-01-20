'use strict';

const request = require('superagent');
const expect = require('chai').expect;

const User = require('../models/user.js');
const app = require('../index.js');
const PORT = process.env.PORT || 3000;

const exampleStudent = {
  username: 'exampleStudent',
  password: '1234',
  admin: false
};

const exampleAdmin = {
  username: 'exampleAdmin',
  password: '1234',
  admin: true
};

describe('Testing Student Routes', () => {
  let server;

  before((done) => {
    server = app.listen(PORT, () => console.log('started tests from user tests'));
    done();
  });

  describe('testing GET /students route',  (done) => {
  });

  after((done) => {
    server.close(() => console.log('server closed after user tests'));
    done();
  });

});
