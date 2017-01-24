'use strict';

let request = require('superagent');
let expect = require('chai').expect;
let app = require('../index.js');
let User = require('../models/user');
let UW = require('../models/uwcourse');
let CC = require('../models/cccourse');
let PORT = process.env.PORT || 3000;

describe('testing student routes', function(){
  let server;
  let student;
  let token;
  let course;
  let badToken = 'adfawr234q2345234';
  let courseID;
  let admin;
  let adminToken;
  let uwCourseID;
  let uwCourse;

  before(function(done) {
    server = app.listen(PORT, () => console.log('started student tests'));

    let tempStudent = new User({username: 'mars', password: '1234', admin: false});
    let tempAdmin = new User({username: 'perry', password: '4321', admin: true});
    let uwtmp = new UW({code: 'Fish: Are they really trying to take all our women? 200', credits: 5});

    uwtmp.save()
      .then(w => {
        uwCourseID = w._id;
        uwCourse = w;
      });
    tempAdmin.save()
    .then(userAdmin => {
      admin = userAdmin;
      userAdmin.generateToken()
      .then(tokenA => {
        adminToken = tokenA;
      });
    });
    tempStudent.save()
    .then(userStudent => {
      student = userStudent;
      userStudent.generateToken()
      .then(tokenS => {
        token = tokenS;
      });
    });
    let tempCourse = new CC({code: 'PoliSci 101'});
    tempCourse.save()
    .then(c => {
      courseID = c._id;
      course = c;
      done();
    });
  });

  after(function(done) {
    User.remove({_id: student._id}).exec();
    User.remove({_id: admin._id}).exec();
    CC.remove({_id: course._id}).exec();

    server.close(() => console.log('server closed after student tests'));
    done();
  });

  //Unregistered route
  describe('testing unregistered route', () => {
    it('should return 404 for an unregistered route', (done) => {
      request.get('localhost:3000/cats')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  });

  describe('testing GET /students route', () => {

    it('should allow a student to access /students route', (done) => {
      request.get('localhost:3000/students')
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
    });

    it('should not allow an admin to access /students route', function(done){
      request.get('localhost:3000/students')
      .set('Authorization', 'Bearer ' + adminToken)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });

    it('should return 401 when unauth user attemps to access the route', (done) => {
      request.get('localhost:3000/students')
      .set('Authorization', 'Bearer' + badToken)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });
  });

  describe('testing GET /students/cccourses route', () => {

    it('should return 401 when an unauth user hits the route', (done) => {
      request.get('localhost:3000/students/cccourses')
      .set('Authorization', 'Bearer' + badToken)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });
  });

  it('should get courses from student personal course list', (done) => {
    request.get('localhost:3000/students/cccourses')
    .set('Authorization', 'Bearer ' + token)
    .set('Accept', 'application/json')
    .send({code: 'PoliSci 101'})
    .end((err, res) => {
      expect(res.status).to.equal(200);
      done();
    });
  });

  it('should get courses from an admin personal course list', (done) => {
    request.get('localhost:3000/students/cccourses')
    .set('Authorization', 'Bearer ' + adminToken)
    .set('Accept', 'application/json')
    .send({code: 'PoliSci 101'})
    .end((err, res) => {
      expect(res.status).to.equal(200);
      done();
    });
  });




  describe('testing DELETE /students route', () => {

    it('should not allow an admin user to hit this route', (done) => {
      request.delete('localhost:3000/students')
      .set('Authorization', 'Bearer ' + adminToken)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });

    it('should allow a student to delete their profile', (done) => {
      request.delete('localhost:3000/students')
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(204);
        done();
      });
    });


  });



});
