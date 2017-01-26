[![Build Status](https://travis-ci.org/jessicamvs/back-end-project.svg?branch=master)](https://travis-ci.org/jessicamvs/back-end-project) [![Coverage Status](https://coveralls.io/repos/github/jessicamvs/back-end-project/badge.svg?branch=jessica-student-testing2)](https://coveralls.io/github/jessicamvs/back-end-project?branch=jessica-student-testing2)

# Class Passport
An app that helps users easily plan transferring from a 2 Year Community College to a 4 Year University. A user can input their current Community College course list, and receive an output detailing whether each of those courses are transferrable as well as how many credits will successfully transfer. If a Community College course is not transferrable, a user can easily change their course input. The application allows both students and administrators to manage their respective course listings.  

##Prerequisites
1. Ensure that you have node installed on your machine.
    - If you need help installing node, please follow the steps here: https://howtonode.org/how-to-install-nodejs

##Installing
1. In your terminal, clone down a local copy of the repo ```git clone https://github.com/jessicamvs/back-end-project.git```
2. In your terminal type in ```npm install``` to install all necessary packages
3. To start the server type into your terminal ```npm index.js```
3. Begin planning your future!

##Schema
![model750x580](https://cloud.githubusercontent.com/assets/13214336/22278630/de5f056e-e279-11e6-9818-1877aba883f4.png)

## Routes

#Community College Course Routes
This route will allow both students and administrators to input new courses as well as update, view or delete courses. Students can only add to their personal course list whereas administrators are able to add, edit and delete courses from the main Community College course list.  

# GET /cccourses
 Student and Admin (unauthenticated)

 Example: [http://localhost:3000/cccourses](http://localhost:3000/cccourses)

 Students and Admins can, as unauthenticated users on this route, receive a full listing of all available Community College courses.  

 Example Return: ```{ "_id" : ObjectId("58894cb409ecbe1d2700c0f2"), "username" : "franklinhardesty", "password" : "testpass", "admin" : true, "univ_classes" : [ ], "curr_courses" : [ ], "__v" : 0 }```


# POST /cccourses
Students (authenticated)

Example: [http://localhost:3000/cccourses](http://localhost:3000/cccourses)

Students can, while authenticated, only add new Community College courses to their personal list.  They are not allowed to post courses to the primary Community College course list.

- Authorization Header
  - Bearer <user token>

- Required fields (in the body):
  - Code (class name) - Must be a string


Administrators (authenticated)

Example: [http://localhost:3000/cccourses](http://localhost:3000/cccourses)

Administrators can, while authenticated, only add new courses to the primary Community College course list.  They are not allowed to post courses to any student's personal course list.

- Authorization Header
  - Bearer <user token>

- Required fields (in the body):
  - Code (class name) - Must be a string

  Example Return: ```{ "_id" : ObjectId("58894cb309ecbe1d2700c0ef"), "code" : "MATH 151", "__v" : 0, "uwequiv" : ObjectId("58894cb309ecbe1d2700c0ee") }```


# PUT /cccourses/:id
Administrators (authenticated)

Example: [http://localhost:3000/cccourses/58894cb309ecbe1d2700c0ed](http://localhost:3000/cccourses/58894cb309ecbe1d2700c0ed)

Administrators can, while authenticated, update existing courses within the primary Community College course list.  They are not allowed to update courses within any student listing.

- Authorization Header
  - Bearer <user token>

- Required fields (in the body):
  - Code (class name) - Must be a string


# DELETE /cccourses/:id
Students and Administrators (authenticated)

Example: [http://localhost:3000/cccourses/58894cb309ecbe1d2700c0ed](http://localhost:3000/cccourses/58894cb309ecbe1d2700c0ed)

Students are allowed, while authenticated, to delete courses from their personal course list only.  They may not remove courses from the primary Community College course list.

Administrators are allowed, while authenticated, to delete existing courses within the primary Community College course list.  They are not allowed to delete courses within any student listing.

- Authorization Header
  - Bearer <user token>

- Required fields:
  - Course ID


# Error Responses
- 200 - Everything is OK (You're cool.)
- 204 - No Content (Delete route worked.)
- 400 - Bad Request (You did something wrong.)
- 401 - Not Authorized (You can't go past the velvet rope.)
- 404 - Not Found (Like my parents when I was 5.  I found them later, when I was 12.)
- 500 - Internal Server Error (You'd better call someone.)





### Signup/Login (auth-routes)
#### POST /signup
  - To sign up, type the following command into your terminal ```curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X POST -d '{"username": "<your unique username>", "password": "<your unique password>", "admin": "<true or false"}' localhost:3000/signup```
    - You should receive a success return as well as a unique token.


## Testing

# Testing Framework

- Mocha
- Chai (Expect)
- Eslint



##Contributors
    Jessica Vasquez-Soltero
    Jonathan Daniel
    Jacob Isenberg
    Carolina Vasquez-Ceja
