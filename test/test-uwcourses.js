let request = require('superagent');
let expect = require('chai').expect;
let app = require('../index.js');
let User = require('../models/user');
let UW = require('../models/uwcourse');
let PORT = process.env.PORT || 3000;

describe.only('testing uwcourse routes', function(){
  let server;
  let student;
  let token;
  let uwCourse;
  let badToken = 'adfawr234q2345234';
  let uwCourseID;
  let admin;
  let adminToken;

  before(function(done) {
    server = app.listen(PORT, () => console.log('started tests from uwcourse tests'));

    let tmpAdmin = new User({username: 'franklinhardesty', password: 'testpass', admin: true});
    let tmp = new User({username: 'sallyhardesty', password: 'testpass', admin: false});

    let uwtmp = new UW({code: 'Fish: Are they really trying to take all our women? 200', credits: 5});
    uwtmp.save()
    .then(w => {
      uwCourseID = w._id;
      uwCourse = w;
      console.log(uwCourseID);
    });

    tmp.save()
    .then(u => {
      student = u;
      u.generateToken()
      .then(tok => {
        token = tok;
      });
    });

    tmpAdmin.save()
    .then(a => {
      admin = a;
      a.generateToken()
      .then(aT => {
        adminToken = aT;
        done();
      });
    });

  });

  after(function(done) {
    console.log('uwCourse', uwCourse);
    User.remove({_id:student._id}).exec();
    User.remove({_id:admin._id}).exec();
    // UW.remove({_id:uwCourse._id}).exec();

    server.close(() => console.log('server closed after uwcourse tests'));
    done();
  });


  //Unregistered route
  // describe('testing unregistered route', function(){
  //   it('should return 404 for an unregistered route', function(done) {
  //     request.get('http://localhost:3000/stuff')
  //     .end((err, res) => {
  //       expect(res.status).to.equal(404);
  //       done();
  //     });
  //   });
  // });


  // test POST errors/messages
  describe('testing POST /uwcourse functionality', function(){
    it('should allow an admin to add a new course to the UW DB', function(done){
      request.post('localhost:3000/uwcourse')
      .set('Authorization', 'Bearer ' + adminToken)
      .set('Accept', 'application/json')
      .send({code: 'Fish: Are they really trying to take all our women? 205', credits: 5})
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
    });

    it('should not allow a student to add a course to the UW DB', function(done){
      console.log('tok', token);
      request.post('localhost:3000/uwcourse')
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/json')
      .send({code: 'Marmot Shaving 105'})
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });
  });


// test GET functionality
  describe('testing GET /uwcourse functionality', function(){
    it('should return all courses offered by UW for an unauthenticated user', function(done){
      request.get('localhost:3000/uwcourse')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.text).to.contain('Fish: Are they really trying to take all our women? 200');
        done();
      });
    });
    it('should return a specific course offered by UW when given an id', function(done){
      console.log(uwCourseID);
      request.get('localhost:3000/uwcourse/' + uwCourseID)
      .end((err, res) => {
        console.log('res', res);
        // expect(res.status).to.equal(200);
        // console.log('body', res.body);
        // expect(res.body.code).to.equal('Fish: Are they really trying to take all our women? 200');
        done();
      });
    });
  });

  // // test PUT functionality
  //   describe('testing PUT /uwcourse functionality', function(){
  //     it('should ', function(done){
  //       //things
  //       done();
  //     });
  //     it('should ', function(done){
  //       //things
  //       done();
  //     });
  //   });
  //
  //   // test DELETE functionality
  //     describe('testing DELETE /uwcourse functionality', function(){
  //       it('should ', function(done){
  //         //things
  //         done();
  //       });
  //       it('should ', function(done){
  //         //things
  //         done();
  //       });
  //     });




  //end of file
});
