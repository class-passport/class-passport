let request = require('superagent');
let expect = require('chai').expect;
require('../index.js');
let User = require('../models/student');



describe('testing student rotues', function(){
  let student;
  let token;

  before(function(done) {
    console.log('something happening');
    let tmp = new User({username: 'usertestafa', password: 'testpass'}); //may have to add more based on teh schema
    tmp.save()
    .then(u => {
      student = u;
      token = u.generateToken();
      console.log(token);
      console.log('token created');
      done();
    });
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
  describe('testing POST /students functionality', function(){
    //create a student, no auth
    it('creates a student and gives a 200', function(done){ //may not need this test due to the before
      request.post('localhost:3000/signup')
      .send({username: 'TESTSTUDENT', password:'TESTPASS'}) //may have to add more
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
    it('should not allow a student to add a course to the Community College', function(done){
      request.post('localhost:3000/cccourse')
      .auth('Bearer', token, {type:'auto'})
      // .send({username: 'usertestafa', password:'testpass'})  //not sure if i need to send this
      .end((err, res) => {
        expect(request.role).to.equal('student'); //need to verify how we're defining that
        expect(res.status).to.equal(401);
        done();
      });
    });

    //prevent a student from adding a course that is not offered by the cc
    it('should not allow a student to add a course that is not offered by the Community College', function(done){
      request.post('localhost:3000/student/cccourse')
      .auth('Bearer', token, {type: 'auto'})
      // .send({username: 'usertestafa', password:'testpass'})
      .send({code: 'Basic Shoe Leather Tasting 105'})
      .end((err, res) => {
        expect(res.status).to.equal(400); //this will depend on what is written in the routes.
        done();
      });
    });

    it('should return a 401 error if an invalid token is provided for a student', function(done){
      request.post('localhost:3000/student/cccourse')
      .auth('Bearer', 'badtoken', {type: 'auto'})
      // .send({username: 'usertestafa', password:'testpass'})
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });


    it('should return a 401 error if no token was provided for a student', function(done){
      request.get('localhost:3000/student/cccourse')
      .auth('Bearer', '', {type:'auto'})
      // .send({make: 'usertestafa', model:'testpass'})
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });

    it('should return a 400 error if no body is provided in the POST request', function(){
      request.post('localhost:3000/studend/cccourse')
      .end((err, res) => {
        expect(res.status).to.equal(400);
      });
    });
  });


// testing GET errors/messages
  describe('testing GET /students functionality', function(){

    //return a student's information except password
    it('provided an id it should return a student but not the password', function(){
      request.get('localhost:3000/student')
      .auth('Bearer', token, {type:'auto'})
      // .send({make: 'usertestafa', model:'testpass'})
      .end((err, res) => {
        if (err) return (err);
        expect(res.status).to.equal(200);
        expect(res.body.username).to.equal('usertestafa');
        expect(res.body).to.not.have.property('password');
      });
    });

    //return all CC courses
    it('should return all courses offered by the Community College for an unauthenticated user', function(done){
      request.get('localhost:3000/cccourse')
      .end((err, res) => {
        expect(res.body.code).to.not.be.empty;
        done();
      });
    });

    // //prevent a student from getting another student's information
    it('should return a 404 error if the id provided was not found', function(){
      request.get('localhost:3000/users')
      .auth('Bearer', 'badToken', {type: 'auto'})
      // .send({make: 'usertestafa', model:'testpass'})
      .end((err, res) =>{
        expect(res.status).to.equal(404);
      });
    });
  });

  // testing PUT errors/messages
    describe('testing PUT /student functionality', function(){
      //allow a student to update an existing course
      it('allow a student to update an existing course within their course list', function(){
        request.get('localhost:3000/student/cccourse')
        .auth('Bearer', token, {type:'auto'})
        .send({course: 'Making Shoes for Hogs 202'})
        .end((err, res) => {
          expect(res.status).to.equal(200);
        });
      });

      //prevent a student from updating a CC course
      it('should return a 401 error if a token was not provided', function(done){
        request.post('localhost:3000/student/cccourse')
        .auth('Bearer', token, {type: 'auto'})
        // .send({username: 'usertestafa', password:'testpass'})
        .send({code: 'Making Shoes for Hogs 202'})
        .end((err, res) => {
          expect(res.status).to.equal(400); //this will depend on what is written in the routes.
          done();
        });
      });

      //prevent a student from updating another student's courses
      it('should prevent a student from updating another student\'s courses', function(){
        request.post('localhost:3000/student/cccourse')
        .auth('Bearer', )

          //THIS WILL HAVE TO WAIT UNTIL EVERYTHING ELSE IS DONE BUT BASICALLY WE'RE GOING TO LET BOB LOG IN AS BOB AND THEN HAVE HIM CHANGE SOMETHING...OR TRY TO TO CHANGE SALLY'S COURSES (LIKE SAY WE WANT TO UPDATE RECORD ID 6), THEN ENSURE THAT NOT ONLY DID HE FAIL, BUT RECORD ID 6 IS THE SAME AS IT WAS BEFORE.
      })


    });

    // testing DELETE errors/messages
      describe('testing DELETE /students functionality', function(){
        //allow a student to delete a course from their course listing
        it('should allow a student to delete a course from their course listing', function(){
          request.get('localhost:3000/student/cccourse')
          .auth('Bearer', token, {type:'auto'})
          .send({make: 'usertestafa', model:'testpass'})
          //student.deleteOne(coursename)
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
