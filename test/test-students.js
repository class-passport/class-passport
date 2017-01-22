let request = require('superagent');
let expect = require('chai').expect;
let app = require('../index.js');
let User = require('../models/user');
let Courses = require('../models/cccourse');
let PORT = process.env.PORT || 3000;

describe('testing cccourse routes', function(){
  let server;
  let student;
  let token;
  let course;
  let badToken = 'adfawr234q2345234';
  let courseID;
  let admin;
  let adminToken;

  before(function(done) {
    server = app.listen(PORT, () => console.log('started tests from cccourse tests'));

    let tempStudent = new User({username: 'mars', password: '1234', admin: false});
    let tempAdmin = new User({username: 'perry', password: '4321', admin: true});
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
    let cmp = new CC({code: 'Eng 101'});
    cmp.save()
    .then(c => {
      courseID = c._id;
      course = c;
      done();
    });
  });

  after(function(done) {
    User.remove({_id:student._id}).exec();
    User.remove({_id:admin._id}).exec();
    CC.remove({_id:course._id}).exec();

    server.close(() => console.log('server closed after cccourse tests'));
    done();
  });

  //Unregistered route
  describe('testing unregistered route', function(){
    it('should return 404 for an unregistered route', function(done) {
      request.get('localhost:3000/cats')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  });
  //
  describe('testing GET /students route', function(){

    it('should allow a student to access /students route', function(done){
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





  });
});
