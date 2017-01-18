let request = require('superagent');
let expect = require('chai').expect;
require('../index.js');
let User = require('../models/student');



describe('testing student rotues', function(){
  let student;
  let token;

  // before(function(done) {
  //   console.log('something happening');
  //   let tmp = new User({username: 'usertestafa', password: 'testpass'});
  //   tmp.save()
  //   .then(u => {
  //     user = u;
  //     token = u.generateToken();
  //     console.log(token);
  //     console.log('token created');
  //     done();
  //   });
  // });



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
  describe('testing POST /users for response 200', function(){
    //create a student, no auth
    it('creates a student and gives a 200', function(done){
      request.post('localhost:3000/signup')
      .send({make: 'TESTSTUDENT', model:'TESTPASS'})
      .end((err, res) => {
        console.log('body', res.body);
        student = res.body;
        console.log('user', student);
        expect(res.status).to.equal(200);
        done();
      });
    });

      //student adds a new course to their personal course list
    it('should add a new course to a studen\'s personal course list', function(done){
      request.post('localhost:3000/student/cccourse')
      .send({code: 'Statistics 101'})
      .end((err, res) => {
        student = res.body;
        expect(student.currCourses).to.contain('Statistics 101');
        done();
      });
    });

      //prevent a student from adding a course to the cc
    it('should not allow a student to add a course to the Community College', function(){
      request.post('localhost:3000/cccourse')
      .auth('Bearer', '', {type:'auto'})
      .send({make: 'usertestafa', model:'testpass'})
      .end((err, res) => {
        expect(res.status).to.equal(401);
        // done();
      });
    });

    //prevent a student from adding a course that is not offered by the cc
    // it('should return a 400 error if no body is provided', function(){
    //   request.post('localhost:3000/users')
    //   .end((err, res) => {
    //     expect(res.status).to.equal(400);
    //   });
    // });

    //it should return a 401 error if an invalid token is provided for a student


    //it should return a 401 error if no token was provided for a student

    // it('should return a 400 error if no body is provided in the POST request', function(){
    //   request.post('localhost:3000/users')
    //   .end((err, res) => {
    //     expect(res.status).to.equal(400);
    //   });
    // });
  });


// testing GET errors/messages
  describe('testing GET /users respones', function(){
    //return a student's information except password
    it('provided an id it should return a user but not the password', function(){
      request.get('localhost:3000/users')
      .auth('Bearer', token, {type:'auto'})
      .send({make: 'usertestafa', model:'testpass'})
      .end((err, res) => {
        if (err) return (err);
        expect(res.status).to.equal(200);
        expect(res.body.username).to.equal('usertestafa');
        expect(res.body).to.not.have.property('password');
      });
    });

    //return all CC courses
    it('should return a 401 error if a token was not provided', function(){
      request.get('localhost:3000/users')
      .auth('Bearer', '', {type:'auto'})
      .send({make: 'usertestafa', model:'testpass'})
      .end((err, res) => {
        expect(res.status).to.equal(401);
        // done();
      });
    });

    // //prevent a student from getting another student's information
    it('should return a 404 error if the id provided was not found', function(){
      request.get('localhost:3000/users')
      .auth('Bearer', 'badToken', {type: 'auto'})
      .send({make: 'usertestafa', model:'testpass'})
      .end((err, res) =>{
        expect(res.status).to.equal(404);
      });
    });
  });

  // testing PUT errors/messages
    describe('testing PUT /users respones', function(){
      //allow a student to update an existing course
      it('provided an id it should return a user but not the password', function(){
        request.get('localhost:3000/users')
        .auth('Bearer', token, {type:'auto'})
        .send({make: 'usertestafa', model:'testpass'})
        .end((err, res) => {
          if (err) return (err);
          expect(res.status).to.equal(200);
          expect(res.body.username).to.equal('usertestafa');
          expect(res.body).to.not.have.property('password');
        });
      });

      //prevent a student from updating a CC course
      it('should return a 401 error if a token was not provided', function(){
        request.get('localhost:3000/users')
        .auth('Bearer', '', {type:'auto'})
        .send({make: 'usertestafa', model:'testpass'})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          // done();
        });
      });

      // //return all
      // it('should return a 404 error if the id provided was not found', function(){
      //   request.get('localhost:3000/users')
      //   .auth('Bearer', 'badToken', {type: 'auto'})
      //   .send({make: 'usertestafa', model:'testpass'})
      //   .end((err, res) =>{
      //     expect(res.status).to.equal(404);
      //   });
      // });
    });

    // testing DELETE errors/messages
      describe('testing DELETE /users respones', function(){
        //allow a student to delete a course from their course listing
        it('provided an id it should return a user but not the password', function(){
          request.get('localhost:3000/users')
          .auth('Bearer', token, {type:'auto'})
          .send({make: 'usertestafa', model:'testpass'})
          .end((err, res) => {
            if (err) return (err);
            expect(res.status).to.equal(200);
            expect(res.body.username).to.equal('usertestafa');
            expect(res.body).to.not.have.property('password');
          });
        });

        //allow a student to delete their own profile
        it('should return a 401 error if a token was not provided', function(){
          request.get('localhost:3000/users')
          .auth('Bearer', '', {type:'auto'})
          .send({make: 'usertestafa', model:'testpass'})
          .end((err, res) => {
            expect(res.status).to.equal(401);
            // done();
          });
        });

        // prevent a student from deleting another student
        // it('should return a 404 error if the id provided was not found', function(){
        //   request.get('localhost:3000/users')
        //   .auth('Bearer', 'badToken', {type: 'auto'})
        //   .send({make: 'usertestafa', model:'testpass'})
        //   .end((err, res) =>{
        //     expect(res.status).to.equal(404);
        //   });
        // });

        //prevent a student from deleting a cc course
      });


  // after(function(done) {
  //   User.remove({_id:user._id}).exec();
  //   done();
  // });

//end of file
});
