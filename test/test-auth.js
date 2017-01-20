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

describe('Testing Auth Routes', function() {
  let server;

  before((done) => {
    server = app.listen(PORT, () => console.log('started tests from user tests'));
    done();
  });
//
//   describe('testing POST /signup routes', function() {
//     after((done) => {
//       User.remove({}).exec();
//       done();
//     });
//
//     it('should return 200 and token on student signup', (done) => {
//       request.post('localhost:3000/signup')
//       .send(exampleStudent)
//       .end((err, res) => {
//         expect(res.status).to.equal(200);
//         expect(res.body).to.be.a('string');
//         done();
//       });
//     });
//
//     it('should return 200 and token on admin signup', (done) => {
//       request.post('localhost:3000/signup')
//       .send(exampleAdmin)
//       .end((err, res) => {
//         expect(res.status).to.equal(200);
//         expect(res.body).to.be.a('string');
//         done();
//       });
//     });
//
//     it('should return 400 with no body provided', (done) => {
//       request.post('localhost:3000/signup')
//       .send()
//       .end((err, res) => {
//         expect(res.status).to.equal(400);
//         done();
//       });
//     });
//
//     it('should return 400 with invalid body provided', (done) => {
//       request.post('localhost:3000/signup')
//       .send('Invalid Body')
//       .end((err, res) => {
//         expect(res.status).to.equal(400);
//         done();
//       });
//     });
//
//     it('should return 409 if username is already in database', (done) => {
//       request.post('localhost:3000/signup')
//       .send(exampleStudent)
//       .end((err, res) => {
//         expect(res.status).to.equal(409);
//         expect(res.text).to.equal('ConflictError');
//         done();
//       });
//     });
//   });
//
//   after((done) => {
//     server.close(() => console.log('server closed after user tests'));
//     done();
//   });
// });

describe('testing GET /login route', function(){

  before(done => {
    let user = new User(exampleStudent);
    user.hashPassword(exampleStudent.password)
      .then(user => user.save())
      .then(user => {
        this.tempUser = user;
        done();
      })
      .catch(done);
  });

  after(done => {
    User.remove({})
      .then(() => done())
      .catch(done);
  });

  it('should return a token', function(done){
    request.get('localhost:3000/login')
    .auth('exampleStudent', '1234')
    .end((err, res) => {
      expect(res.status).to.equal(200);
      expect(res.body).to.be.a('string');
      done();
    });
  });

  it('should return 401 if user is not authenticated', function(done){
    request.get('localhost:3000/login')
    .auth('exampleStudent', '4321')
    .end((err, res) => {
      expect(res.status).to.equal(401);
      done();
    });
  });























});
});
