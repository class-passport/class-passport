# Class Passport
[![Build Status](https://travis-ci.org/jessicamvs/back-end-project.svg?branch=staging)](https://travis-ci.org/jessicamvs/back-end-project) [![Coverage Status](https://coveralls.io/repos/github/jessicamvs/back-end-project/badge.svg?branch=staging)](https://coveralls.io/github/jessicamvs/back-end-project?branch=staging)

An app that helps users easily plan transferring from a 2 Year Community College to a 4 Year University. A user can input their current Community College course list, and receive an output detailing whether each of those courses are transferrable as well as how many credits will successfully transfer. If a Community College course is not transferrable, a user can easily change their course input. The application allows both students and administrators to manage their respective course listings.  


## Prerequisites
1. Ensure that you have node installed on your machine.
    - If you need help installing node, please follow the steps here: https://howtonode.org/how-to-install-nodejs

## Installing
1. In your terminal, clone down a local copy of the repo
```
git clone https://github.com/jessicamvs/back-end-project.git
```

2. In your terminal type in ```npm install``` to install all necessary packages

3. To start the server type into your terminal ```node index.js```

3. Begin planning your future!

## Schema
![model750x580](https://cloud.githubusercontent.com/assets/13214336/22278630/de5f056e-e279-11e6-9818-1877aba883f4.png)
![model750x580](https://cloud.githubusercontent.com/assets/13214336/22319645/851c5d60-e339-11e6-8d5d-1741153ca5d4.png)

## Routes

### Signup/Login
#### POST /signup
A new user is authenticated by signing up with a unique username and password. Specifying whether you are an admin or not upon signup will allow you access to certain routes. Upon success, users are returned a token which provides authorization to access certain routes.
  - Expected Header:
  ```
  Content-Type: 'application/json'
  ```
  - Expected JSON Body:
    ``` js
    {
    "username": <string>,
    "password": <string>,
    "admin": <boolean>
    }
    ```

  - Example Response (token):
  ```
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4ODk1ODFmZDA0ZDFhMmIyOWM5NjQyZCIsImlhdCI6MTQ4NTM5NTk5OX0.8_Zijpib85BGwh99IUHlrGjhT59EzigyTp8fssgSE48
  ```

#### GET /login

A returning user will be required to provide their unique username and password in order to be authorized to use the app. Logging in will return a new token for future user reference.

- Expected Header:
  ```
  Authorization: 'Basic <base64 encoded username:password>'
  ```

- Example Response (token):
 ```
 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4OGI3Y2ZhMDIyYmI5MDJlYmI2MzA3MSIsImlhdCI6MTQ4NTUzNjUwNn0.kTXbq-oMFrM3OTvb93xagRniLRdOGgcr3onINgEMaW0"
 ```

#### Error Responses for Login/Signup
- 200 upon successful signup or login
- 400 BadRequestError if no username provided upon signup
- 400 BadRequestError if no password provided upon signup
- 401 UnauthorizedError if user is not found in the database upon login
- 401 UnauthorizedError if incorrect password is provided upon login
- 409 ConflictError for duplicate username upon signup

### Community College Course Routes
These routes will allow both students and administrators to input new courses as well as update, view or delete courses. Students can only add to their personal course list whereas administrators are able to add, edit and delete courses from the main Community College course list.  


#### POST /cccourses

__Students__ can, while authenticated, only add new Community College courses to their personal list.  They are not allowed to post courses to the primary Community College course list. Upon success the student's profile will be returned with a Community College course id added to their curr_courses array..

- Expected Header
```
Content-Type: 'application/json'
Authorization: Bearer <token>
```

- Expected JSON Body:
```js
{
  "code": <string>
}
```

- Example Response:
```js
{
  "_id": "588b7cc4022bb902ebb6306e",
  "username": "jessica",
  "password": null,
  "admin": false,
  "__v": 1,
  "univ_classes": [],
  "curr_courses": [
    "588b805b022bb902ebb63076"
  ]
}
```

__Administrators__ can, while authenticated, only add new courses to the primary Community College course list. They may provide the university equivalent course but it is not required. Admins are not allowed to post courses to any student's personal course list.

- Expected Header
```
Content-Type: 'application/json'
Authorization: Bearer <token>
```

- Expected JSON Body:
``` js
{
  "code": <string>
  "uwequiv": <ObjectId>
}
```

- Example Response:
```js
{
  "_id": "588b8343022bb902ebb6307b",
  "code": "MATH 151",
  "uwequiv": "588b8206022bb902ebb6307a",
  "__v": 0
}
```

#### GET /cccourses
Students, Admins, and unauthenticated users can access this route and receive a full listing of all available Community College courses.

- Example Response:
``` js
[
  {
    "_id": "588b8343022bb902ebb6307b",
    "code": "MATH 151",
    "uwequiv": "588b8206022bb902ebb6307a",
    "__v": 0
  },
  {
    "_id": "588b805b022bb902ebb63076",
    "code": "ENGL 101",
    "__v": 0
  }
]
```

#### PUT /cccourses/:id
__Students__ do not have access to this route. They are not allowed to update a course.

__Administrators__ can, while authenticated, update existing courses within the primary Community College course list. They are not allowed to update any student's current courses. The updated course will be returned upon success.

- Expected Header
```
Content-Type: 'application/json'
Authorization: Bearer <token>
```

- Expected JSON Body:
``` js
{
  "code": <string>
  "uwequiv": <ObjectId>
}
```

- Example Response:
``` js
{
  "_id": "588b8343022bb902ebb6307b",
  "code": "CHEM 124",
  "uwequiv": "588b8206022bb902ebb6307a",
  "__v": 0
}
```

#### DELETE /cccourses/:id
__Students__ are allowed, while authenticated, to delete courses by id from their personal course list only. They may not remove courses from the primary Community College course list.

__Administrators__ are allowed, while authenticated, to delete existing courses by id within the primary Community College course list. They are not allowed to delete courses within any student listing.

- Expected Header:
```
Authorization: Bearer <token>
```

#### Error Responses for CCCourses
- 200 - Everything is OK (You're cool.)
- 204 - No Content (Delete route worked.)
- 400 - Bad Request (You did something wrong.)
- 401 - Not Authorized (You can't go past the velvet rope.)
- 404 - Not Found (Like my parents when I was 5.  I found them later, when I was 12.)
- 500 - Internal Server Error (You'd better call someone.)

### University of Washington Course Routes
Only an administrator may add, edit, and delete university courses. All users may get a full list of courses offered at the university.

#### POST /uwcourses
__Administrators__ can, while authenticated, add new university courses to the primary university course list. They may provide the equivalent community college course but it is not required. The new course will be returned upon success.

- Expected Header
```
Content-Type: 'application/json'
Authorization: Bearer <token>
```

- Expected JSON Body
```js
{
  "description": <string>
  "code": <string>
  "ccequiv": <string>
  "credits": <number>
}
```

- Example Response:
```js
{
  "_id": "588addb41876df938d1b3093",
  "description": "Second quarter in the calculus of functions of a single variable. Emphasizes integral calculus. Emphasizes applications and problem solving using the tools of calculus. Prerequisite: either minimum grade of 2.0 in MATH 124, score of 3 on AB advanced placement test, or score of 3 on BC advanced placement test. Offered: AWSpS.",
  "longTitle": "CALCULUS WITH ANALYTIC GEOMETRY II",
  "code": "MATH 125",
  "ccequiv": "MATH 152"
  "credits": 5,
  "__v": 0
}
```

#### GET /uwcourses
Students, Admins, and unauthenticated users can access this route and receive a full listing of all available university courses.

- Example Response:
```js
[
  {
    "_id": "588addb41876df938d1b3093",
    "description": "Second quarter in the calculus of functions of a single variable. Emphasizes integral calculus. Emphasizes applications and problem solving using the tools of calculus. Prerequisite: either minimum grade of 2.0 in MATH 124, score of 3 on AB advanced placement test, or score of 3 on BC advanced placement test. Offered: AWSpS.",
    "longTitle": "CALCULUS WITH ANALYTIC GEOMETRY II",
    "code": "MATH 125",
    "ccequiv": "MATH 152"
    "credits": 5,
    "__v": 0
  },
  {
    "_id": "588addb41876df938d1b3097",
    "description": "Rates of change, tangent, derivative, accumulation, area, integrals in specific contexts, particularly economics. Techniques of differentiation and integration. Application to problem solving. Optimization. Credit does not apply toward a mathematics major. Prerequisite: minimum grade of 2.0 in MATH 111. Offered: WSp.",
    "longTitle": "APPLICATION OF CALCULUS TO BUSINESS AND ECONOMICS",
    "code": "MATH 112",
    "ccequiv": "MATH 110"
    "credits": 5,
    "__v": 0
  }
]
```

#### PUT /uwcourses/:id
__Administrators__ can, while authenticated, update existing courses by id within the primary university course list. The updated course will be returned upon success.

- Expected Header
```
Content-Type: 'application/json'
Authorization: Bearer <token>
```

- Expected JSON Body:
```js
{
  "description": <string>
  "code": <string>
  "ccequiv": <string>
  "credits": <number>
}
```

#### DELETE /uwcourses/:id
__Administrators__ are allowed, while authenticated, to delete existing courses by id within the primary university course list. Upon success no body will be returned.

- Expected Header
```
Authorization: Bearer <token>
```

#### Error Responses for UWCourses
- 200 - Success
- 204 - Delete was successful
- 400 - Bad Request
- 401 - Not Authorized

### Student Routes

#### POST /students/university-equiv
An authenticated __Student__ can post their university class equivalents to their profile so it will persist and always be available for them to quickly look up (instead of running a process that must do multiple database look-ups). The return value is the user object with the unique ID of the university course added in the user's _univ_courses_ property

- Expected Header
```
Content-Type: 'application/json'
Authorization: Bearer <token>
```

- Expected JSON Body:
```js
{
  "code": <string>
}
```
- Expected Response:
```js

{
  "_id":"588d111ef6850362f22195c7",
  "username":"Herbert",
  "password":null,"__v":3,
  "univ_classes":["588d3098f51cda63512800bd","588d30c7f51cda63512800be"],
  "curr_courses":["588d2bf532e9f46312fb3ffc","588d2c0332e9f46312fb3ffd"]}
}
```

#### GET /students
An authenticated __Student__ can look at all the properties of their profile (except their password).
A successful request will return an object that has the equivalent properties of what one sees in the user model (unique ID, username, current courses, UW courses, credits, admin)

- Expected Response
```js
{
  "_id":"588d111ef6850362f22195c7",
  "username":"Herbert",
  "password":null,
  "__v":2,
  "univ_classes":[],
  "curr_courses":["588d2bf532e9f46312fb3ffc","588d2c0332e9f46312fb3ffd"]
}
```

#### GET /students/cccourses
An authenticated __Student__ can look specifically at the current community college courses they are taking (in case they don't want their entire profile, and forgot what courses they signed up for). The route will populate more details about the course than what can be seen from the student profile snapshot.

- Expected Response:
```js
  [
    {"_id":"588d2bf532e9f46312fb3ffc",
      "code":"Math 151",
      "uwequiv":"588d3098f51cda63512800bd",
      "__v":0
    },
    {"_id":"588d2c0332e9f46312fb3ffd",
    "code":"Chem 200",
    "uwequiv":"588d30c7f51cda63512800be",
    "__v":0}
  ]
```

#### GET /students/university-equiv
An authenticated __Student__ look can use this route to see a side by side comparison of the community college course they are taking matched next to the equivalent university course. any community college courses that do not have university equivalents will not appear on the returned object.

- Expected Response:
```js
[
  {
    "cccourse":"Math 151",
    "uwequiv":"Math 142"
  },
  {
    "cccourse":"Chem 200",
    "uwequiv":"Chem 142"
  }
]
```

#### GET /students/university-equiv/credits
An authenticated __Student__ can look the credits that their current community college classes would earn them at a university. The object returned is a side by side look at the student's community college course and the number of credits that the course is worth. The object also contains the sum of all the credits from the courses the student is taking.

- Expected Response:
```js
{
  "courses":
  [
    {
      "cccourse":"Math 151",
      "uw_credits":5
    },
    {
      "cccourse":"Chem 200",
      "uw_credits":5
    }
  ],
    "total_uw_credits":10
}

```

#### PUT /students
An authenticated __Student__ or __Admin__ can change/update their username when making a put request on this route. A successful request will give a response with the user's updated profile information.

- Expected Header
```
Content-Type: 'application/json'
Authorization: Bearer <token>
```

- Expected JSON Body:
```js
{
  "username": <string>
}
```
- Expected Response
```js

{
  "_id":"588d111ef6850362f22195c7",
  "username":"Scott Schmidt",
  "password":null,
  "__v":3,
  "univ_classes":["588d3098f51cda63512800bd","588d30c7f51cda63512800be"],
  "curr_courses":["588d2bf532e9f46312fb3ffc","588d2c0332e9f46312fb3ffd"]
}
```

### DELETE /students
An authenticated __student__ can delete their profile if they want. Upon success no body will be returned

- Expected Header
```
Authorization: Bearer <token>
```

#### Error Responses for Students
- 200 - Success
- 204 - Delete was successful
- 400 - Bad Request
- 401 - Not Authorized
- 404 - Not Found

## Testing Framework
- Mocha
- Chai (Expect)
- Eslint
- Travis
- Coveralls

## Contributors
+ [Jessica Vasquez-Soltero](https://github.com/jessicamvs "Jessica's Github")
+ [Jonathan Daniel](https://github.com/spamalope01 "Jonathan's Github")
+ [Jacob Isenberg](https://github.com/jisenber "Jacob's Github")
+ [Carolina Vasquez-Ceja](http://github.com/cejac "Carolina's Github")
