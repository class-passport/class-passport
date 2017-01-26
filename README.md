# Class Passport
[![Build Status](https://travis-ci.org/jessicamvs/back-end-project.svg?branch=master)](https://travis-ci.org/jessicamvs/back-end-project) [![Coverage Status](https://coveralls.io/repos/github/jessicamvs/back-end-project/badge.svg?branch=jessica-student-testing2)](https://coveralls.io/github/jessicamvs/back-end-project?branch=jessica-student-testing2)

An app that helps users easily plan transferring from a 2 Year Community College to a 4 Year University. A user can input their current Community College course list, and receive an output detailing whether each of those courses are transferrable as well as how many credits will successfully transfer. If a Community College course is not transferrable, a user can easily change their course input. The application allows both students and administrators to manage their respective course listings.  


## Prerequisites
1. Ensure that you have node installed on your machine.
    - If you need help installing node, please follow the steps here: https://howtonode.org/how-to-install-nodejs

## Installing
1. In your terminal, clone down a local copy of the repo ```git clone https://github.com/jessicamvs/back-end-project.git```
2. In your terminal type in ```npm install``` to install all necessary packages
3. To start the server type into your terminal ```npm index.js```
3. Begin planning your future!

## Schema
![model750x580](https://cloud.githubusercontent.com/assets/13214336/22278630/de5f056e-e279-11e6-9818-1877aba883f4.png)
![model750x580](https://cloud.githubusercontent.com/assets/13214336/22319645/851c5d60-e339-11e6-8d5d-1741153ca5d4.png)

## Routes

### Signup/Login (auth-routes)
#### POST /signup
  -  A new user is authenticated by signing up with a unique username and password. Specifying whether you are an admin or not upon signup will allow you access to certain routes. Upon success, users are returned a token which provides authorization to access certain routes.
      - Expected body:
        ```
        {
        "username": "<string>",<br/>
        "password": "<string>",<br/>
        "admin": <true/false><br/>
        }
        ```

      - Example Response(token):
      ```
      eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4ODk1ODFmZDA0ZDFhMmIyOWM5NjQyZCIsImlhdCI6MTQ4NTM5NTk5OX0.8_Zijpib85BGwh99IUHlrGjhT59EzigyTp8fssgSE48
      ```

#### GET /login
  - A returning user will be required to provide their unique username and password in order to be authorized to use the app. Logging in will return a new token for future user reference

  - Expected header:
  ```
  Authorization: 'Bearer <token>'
  ```
  - Provide username and password in JSON format:
    ```
        {
        "username": "string",
        "password": "string",
        }
    ```

   - Example Response(token):
```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4ODk1ODFmZDA0ZDFhMmIyOWM5NjQyZCIsImlhdCI6MTQ4NTM5NTk5OX0.8_Zijpib85BGwh99IUHlrGjhT59EzigyTp8fssgSE48
 ```

### Login/Sigunp Error Handling
- 200 upon successful signup or login
- 400 BadRequestError if no username provided upon signup
- 400 BadRequestError if no password provided upon signup
- 401 UnauthorizedError if user is not found in the database upon login
- 401 UnauthorizedError if incorrect password is provided upon login
- 409 ConflictError for duplicate username upon signup



#### Community College Course Routes
This route will allow both students and administrators to input new courses as well as update, view or delete courses. Students can only add to their personal course list whereas administrators are able to add, edit and delete courses from the main Community College course list.  

#### GET /cccourses
 Student and Admin (unauthenticated)

 Example: [http://localhost:3000/cccourses](http://localhost:3000/cccourses)

 Students and Admins can, as unauthenticated users on this route, receive a full listing of all available Community College courses.  

 Example Response:
 ```
 {
  "_id" : ObjectId("58894cb409ecbe1d2700c0f2"),
 "username" : "franklinhardesty",
 "password" : "testpass",
 "admin" : true,
 "univ_classes" : [ ],
 "curr_courses" : [ ], "__v" : 0
}
 ```


#### POST /cccourses
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

  Example Response:
  ```
  {
  "_id" : ObjectId("58894cb309ecbe1d2700c0ef"),
  "code" : "MATH 151", "__v" : 0,
  "uwequiv" : ObjectId("58894cb309ecbe1d2700c0ee")
  }
  ```

#### PUT /cccourses/:id
Administrators (authenticated)

Example: [http://localhost:3000/cccourses/58894cb309ecbe1d2700c0ed](http://localhost:3000/cccourses/58894cb309ecbe1d2700c0ed)

Administrators can, while authenticated, update existing courses within the primary Community College course list.  They are not allowed to update courses within any student listing.

- Authorization Header
  - Bearer <user token>

- Required fields (in the body):
  - Code (class name) - Must be a string

#### DELETE /cccourses/:id
Students and Administrators (authenticated)

Example: [http://localhost:3000/cccourses/58894cb309ecbe1d2700c0ed](http://localhost:3000/cccourses/58894cb309ecbe1d2700c0ed)

Students are allowed, while authenticated, to delete courses from their personal course list only.  They may not remove courses from the primary Community College course list.

Administrators are allowed, while authenticated, to delete existing courses within the primary Community College course list.  They are not allowed to delete courses within any student listing.

- Authorization Header
  - Bearer <user token>

- Required fields:
  - Course ID

### Error Responses for CCCourses Routes
- 200 - Everything is OK (You're cool.)
- 204 - No Content (Delete route worked.)
- 400 - Bad Request (You did something wrong.)
- 401 - Not Authorized (You can't go past the velvet rope.)
- 404 - Not Found (Like my parents when I was 5.  I found them later, when I was 12.)
- 500 - Internal Server Error (You'd better call someone.)

## Testing Framework
- Mocha
- Chai (Expect)
- Eslint

## Contributors
    Jessica Vasquez-Soltero
    Jonathan Daniel
    Jacob Isenberg
    Carolina Vasquez-Ceja
