let request = require('superagent');
let expect = require('chai').expect;
let app = require('../index.js');
let User = require('../models/user');
let UW = require('../models/uwcourse');
let PORT = process.env.PORT || 3000;

describe('testing uwcourse routes', function(){
  let server;
  // let student;
  let token;
  // let uwCourse;
  let badToken = 'adfawr234q2345234';
  let uwCourseID;
  // let admin;
  let adminToken;

  before(function(done) {
    User.remove({}).exec()
        .then(UW.remove({}).exec());

    server = app.listen(PORT, () => console.log('started tests from uwcourse tests'));

    let tmpAdmin = new User({username: 'franklinhardesty', password: 'testpass', admin: true});
    let tmp = new User({username: 'sallyhardesty', password: 'testpass', admin: false});

    let uwtmp = new UW({code: 'Fish: Are they really trying to take all our women? 200', credits: 5});
    uwtmp.save()
    .then(w => {
      uwCourseID = w._id;
      // uwCourse = w;
    });

    tmp.save()
    .then(u => {
      // student = u;
      u.generateToken()
      .then(tok => {
        token = tok;
      });
    });

    tmpAdmin.save()
    .then(a => {
      // admin = a;
      a.generateToken()
      .then(aT => {
        adminToken = aT;
        done();
      });
    });

  });

  after(function(done) {
    server.close(() => console.log('server closed after uwcourse tests'));
    done();
  });


  //Unregistered route
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
  describe('testing POST /uwcourse functionality', function(){
    it('should allow an admin to add a new course to the UW DB', function(done){
      request.post('localhost:3000/uwcourses')
      .set('Authorization', 'Bearer ' + adminToken)
      .set('Accept', 'application/json')
      .send({code: 'Fish: Are they really trying to take all our women? 205', credits: 5})
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
    });

    it('should not allow a student to add a course to the UW DB', function(done){
      request.post('localhost:3000/uwcourses')
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/json')
      .send({code: 'Marmot Shaving 105'})
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });

    it('should return a 500 error if an invalid token is provided for an admin', function(done){
      request.post('localhost:3000/uwcourses')
      .set('Authorization', 'Bearer ' + badToken)
      .end((err, res) => {
        expect(res.status).to.equal(500);
        done();
      });
    });

    it('should return a 401 if no token provided', function(done){
      request.post('localhost:3000/uwcourses')
      .set('Authorization', 'Bearer ', '')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });

    it('should return a 400 error if no body is provided in the POST request', function(done){
      request.post('localhost:3000/uwcourses')
      .set('Authorization', 'Bearer ' + adminToken)
      .set('Accept', 'application/json')
      .send()
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
    });
  });
//
//
// test GET functionality
  describe('testing GET /uwcourse functionality', function(){
    it('should return all courses offered by UW for an unauthenticated user', function(done){
      request.get('localhost:3000/uwcourses')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.text).to.contain('Fish: Are they really trying to take all our women? 200');
        done();
      });
    });
  });

  // // test PUT functionality
  describe('testing PUT /uwcourse functionality', function(){
    it('will allow an admin to update an existing course within the UW course list', function(done) {
      request.put('localhost:3000/uwcourses/' + uwCourseID)
       .set('Authorization', 'Bearer ' + adminToken)
       .set('Accept', 'application/json')
       .send({code: 'How to sniff garbage and detect notes of lavender', credits: 50})
       .end((err, res) => {
         expect(res.status).to.equal(200);
         expect(res.body.code).to.equal('How to sniff garbage and detect notes of lavender');
         done();
       });
    });

    it('will prevent a student from updating a course within the UW course list', function(done){
      request.put('localhost:3000/uwcourses/' + uwCourseID)
       .set('Authorization', 'Bearer ' + token)
       .set('Accept', 'application/json')
       .send({course: 'Making Shoes for Hogs 202'})
       .end((err, res) => {
         expect(res.status).to.equal(401);
         done();
       });
    });

    it('should return a 500 error if an invalid token is provided for an admin', function(done){
      request.post('localhost:3000/uwcourses')
      .set('Authorization', 'Bearer ' + badToken)
      .end((err, res) => {
        expect(res.status).to.equal(500);
        done();
      });
    });

    it('should return a 401 if no token provided', function(done){
      request.post('localhost:3000/uwcourses')
      .set('Authorization', 'Bearer ', '')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });

    it('should return a 400 error if no body is provided in the POST request', function(done){
      request.post('localhost:3000/cccourses')
      .set('Authorization', 'Bearer ' + adminToken)
      .set('Accept', 'application/json')
      .send()
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
    });
  });


  // test DELETE functionality
  describe('testing DELETE /uwcourse functionality', function(){
    it('should allow an admin to delete a course from the UW course listing', function(done){
      request.delete('localhost:3000/uwcourses/' + uwCourseID)
      .set('Authorization', 'Bearer ' + adminToken)
      .end((err, res) => {
        expect(res.status).to.equal(204);
        done();
      });
    });
    it('should not allow a student to delete a course from the UW course listing', function(done) {
      request.delete('localhost:3000/uwcourses/' + uwCourseID)
      .set('Authoriziation', 'Bearer ' + token)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });
  });
//end of file
});
