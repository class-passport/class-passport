'use strict';

let request = require('superagent');
let expect = require('chai').expect;
let app = require('../index.js');
let User = require('../models/user');
let CC = require('../models/cccourse');
let PORT = process.env.PORT || 3000;

describe('testing cccourse routes', function(){
  let server;
  let token;
  let badToken = 'adfawr234q2345234';
  let courseID;
  let adminToken;


  before(function(done) {
    server = app.listen(PORT, () => console.log('started tests from cccourse tests'));
    User.remove({}).exec()
    .then(CC.remove({}).exec());

    let tmp = new User({username: 'sallyhardesty', password: 'testpass', admin: false});
    let tmpAdmin = new User({username: 'franklinhardesty', password: 'testpass', admin: true});


    tmpAdmin.save()
    .then(a => {
      a.generateToken()
      .then(aT => {
        adminToken = aT;
      });
    });

    tmp.save()
    .then(u => {
      u.generateToken()
      .then(tok => {
        token = tok;
      });
    });

    let cmp = new CC({code: 'Eng 101'});
    cmp.save()
    .then(c => {
      courseID = c._id;
      done();
    });
  });

  after(function(done) {
    server.close(() => console.log('server closed after cccourse tests'));
    done();
  });

  describe('testing unregistered route', function(){
    it('should return 404 for an unregistered route', function(done) {
      request.get('http://localhost:3000/stuff')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  });

  // test POST errors/messages
  describe('testing POST /cccourses functionality', function(){

    it('should add a new course to a studen\'s personal course list', function(done){
      request.post('localhost:3000/cccourses')
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/json')
      .send({code: 'Eng 101'})
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.curr_courses.length).to.equal(1);
        done();
      });
    });

    it('should allow an admin to add a new course to the CC DB', function(done){
      request.post('localhost:3000/cccourses')
      .set('Authorization', 'Bearer ' + adminToken)
      .set('Accept', 'application/json')
      .send({code: 'Fish: Are they really trying to take all our women? 204'})
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
    });

    it('should not allow a student to add a course to the Community College', function(done){
      request.post('localhost:3000/cccourses')
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/json')
      .send({code: 'Marmot Shaving 105'})
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });

    it('should not allow a student to add a course that is not offered by the Community College', function(done){
      request.post('localhost:3000/cccourses')
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/json')
      .send({code: 'Marmot Shaving 105'})
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });

    it('should return a 500 error if an invalid token is provided for a student', function(done){
      request.post('localhost:3000/cccourses')
      .set('Authorization', 'Bearer ' + badToken)
      .end((err, res) => {
        expect(res.status).to.equal(500);
        done();
      });
    });

    it('should return a 401 if no token provided', function(done){
      request.post('localhost:3000/cccourses')
      .set('Authorization', 'Bearer', '')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });

    it('should return a 400 error if no body is provided in the POST request', function(done){
      request.post('localhost:3000/cccourses')
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/json')
      .send()
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
    });
  });

  // testing GET errors/messages
  describe('testing GET /cccourses functionality', function(){

    it('should return all courses offered by the Community College for an unauthenticated user', function(done){
      request.get('localhost:3000/cccourses')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body[0].code).to.equal('Eng 101');
        done();
      });
    });

    it('should return a specifc course offered by the CC for an unauthenticated user', function(done){
      request.get('localhost:3000/cccourses/' + courseID)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.code).to.equal('Eng 101');
        done();
      });
    });
  });

  // testing PUT errors/messages
  describe('testing PUT /cccourses functionality', function(){

    it('does not allow a student to update an existing course within their course list', function(done){
      request.put('localhost:3000/cccourses/' + courseID)
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/json')
      .send({course: 'Making Shoes for Hogs 202'})
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });

    it('will allow an admin to update an existing course within the CC course list', function(done) {
      request.put('localhost:3000/cccourses/' + courseID)
      .set('Authorization', 'Bearer ' + adminToken)
      .set('Accept', 'application/json')
      .send({code: 'How to sniff garbage and detect notes of lavender'})
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.code).to.equal('How to sniff garbage and detect notes of lavender');
        done();
      });
    });

    it('will prevent a student from updating a course within the CC course list', function(done){
      request.put('localhost:3000/cccourses/' + courseID)
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/json')
      .send({course: 'Making Shoes for Hogs 202'})
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });

    it('should return a 404 error if an invalid token is provided for a user', function(done){
      request.put('localhost:3000/cccourses')
      .set('Authorization', 'Bearer ' + badToken)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });

    it('should return a 404 if no token provided', function(done){
      request.put('localhost:3000/cccourses')
      .set('Authorization', 'Bearer ', '')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  });

  // testing DELETE errors/messages
  describe('testing DELETE /cccourses functionality', function(){
    it('should allow a student to delete a course from their course list', function(done){
      request.delete('localhost:3000/cccourses/' + courseID)
      .set('Authorization', 'Bearer ' + token)
      .end((err, res) => {
        expect(res.status).to.equal(204);
        expect(res.body).to.deep.equal({});
        done();
      });
    });

    it('should allow an admin to delete a course from the cc course listing', function(done){
      request.delete('localhost:3000/cccourses/' + courseID)
      .set('Authorization', 'Bearer ' + adminToken)
      .end((err, res) => {
        expect(res.status).to.equal(204);
        done();
      });
    });
  });

});
