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

  describe('testing get /students routes', () => {
    after(done => {
      User.remove({})
        .then(() => done())
        .catch(done);
    });
  });

  it('should return 401 if the user is not authorized', (done) => {
    request.get('localhost:3000/students')
    .auth('exampleStudent', '4321')
    .end((err, res) => {
      expect(res.status).to.equal(401);
      done();
    });
  });

  it('should return an error if an admin is accessing this route', (done) => {
    request.get('localhost:3000/students')
    .send(exampleAdmin)
    .end((err, res) => {
      expect(res.status).to.equal(401);
      done();
    });
  });










});
