'use strict';

// npm modules
let request = require('superagent');
let expect = require('chai').expect;

// app modules
let app = require('../index.js');
let User = require('../models/user.js');

// module constants
let PORT = process.env.PORT || 3000;

let exampleStudent = {
  username: 'mars',
  password: '1234',
  admin: false
};

let exampleAdmin = {
  username: 'perry',
  password: '4321',
  admin: true
};

describe('testing student routes', function() {
  let server;

  before(done => {
    User.remove({}).exec();

    server = app.listen(PORT, () => console.log('started server from student tests'));

    new User(exampleStudent).save()
      .then(student => {
        this.tempStudent = student;
        return this.tempStudent.generateToken();
      })
      .then(token => {
        this.tempStudent.token = token;
      })
      .catch(done);

    new User(exampleAdmin).save()
      .then(admin => {
        this.tempAdmin = admin;
        return this.tempAdmin.generateToken();
      })
      .then(token => {
        this.tempAdmin.token = token;
        done();
      })
      .catch(done);
  });

  after(done => {
    User.remove({})
    .then(() => {
      server.close(() => console.log('server closed after student tests'));
      done();
    });
  });

  describe('testing unregistered route', () => {
    it('should return 404 for an unregistered route', done => {
      request.get('localhost:3000/cats')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  });

  describe('testing GET /students route', () => {
    it('should return students info without password', done => {
      request.get('localhost:3000/students')
      .set('Authorization', 'Bearer ' + this.tempStudent.token)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.username).to.equal('mars');
        expect(res.body.password).to.not.exist;
        done();
      });
    });

    it('should not allow an admin to access /students route', done => {
      request.get('localhost:3000/students')
      .set('Authorization', 'Bearer ' + this.tempAdmin.token)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body).to.deep.equal({});
        done();
      });
    });

    it('should return 401 for unauthenticated user', done => {
      request.get('localhost:3000/students')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body).to.deep.equal({});
        done();
      });
    });

    it('should return 500 for malformed token', done => {
      request.get('localhost:3000/students')
      .set('Authorization', 'Bearer malformedToken')
      .end((err, res) => {
        expect(res.status).to.equal(500);
        expect(res.body).to.deep.equal({});
        done();
      });
    });
  });

  describe('testing GET /students/cccourses route', () => {
    it('should return 401 for unauthenticated user', done => {
      request.get('localhost:3000/students/cccourses')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });

    it('should return 200 for student along with current courses populated', done => {
      request.get('localhost:3000/students/cccourses')
      .set('Authorization', 'Bearer ' + this.tempStudent.token)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.currCourses).to.deep.equal([]); //NEED TO ADD A COURSE IN THE BEFORE BLOCK
        done();
      });
    });

    it('should return 401 for admin', done => {
      request.get('localhost:3000/students/cccourses')
      .set('Authorization', 'Bearer ' + this.tempAdmin.token)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });
  });

  describe('testing PUT /students route', () => {
    it('should return 200 for student along with updated profile', done => {
      request.put('localhost:3000/students')
      .set('Authorization', 'Bearer ' + this.tempStudent.token)
      .send({username: 'jinx'})
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body._id).to.equal(`${this.tempStudent._id}`);
        expect(res.body.username).to.equal('jinx');
        expect(res.body.password).to.not.exist;
        expect(res.body.admin).to.equal.false;
        expect(res.body.univ_classes).to.deep.equal([]);
        expect(res.body.curr_courses).to.deep.equal([]);
        done();
      });
    });

    it('should not add properties not currently on students profile', done => {
      request.put('localhost:3000/students')
      .set('Authorization', 'Bearer ' + this.tempStudent.token)
      .send({newProperty: 'Hello', username: 'ikaika'})
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.username).to.equal('ikaika');
        expect(res.body.newProperty).to.not.exist;
        done();
      });
    });

    it('should return 400 for student trying to change admin property', done => {
      request.put('localhost:3000/students')
      .set('Authorization', 'Bearer ' + this.tempStudent.token)
      .send({admin: true})
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
    });

    it('should return 401 for admin', done => {
      request.put('localhost:3000/students')
      .set('Authorization', 'Bearer ' + this.tempAdmin.token)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });

    it('should return 401 for unauthenticated user', done => {
      request.put('localhost:3000/students')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });
  });

  describe('testing DELETE /students route', () => {
    it('should allow a student to delete their profile', done => {
      request.delete('localhost:3000/students')
      .set('Authorization', 'Bearer ' + this.tempStudent.token)
      .end((err, res) => {
        expect(res.status).to.equal(204);
        done();
      });
    });

    it('should return 401 for admin', done => {
      request.delete('localhost:3000/students')
      .set('Authorization', 'Bearer ' + this.tempAdmin.token)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });

    it('should return 401 for unauthenticated user', done => {
      request.delete('localhost:3000/students')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });
  });

});
