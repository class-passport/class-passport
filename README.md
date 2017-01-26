[![Build Status](https://travis-ci.org/jessicamvs/back-end-project.svg?branch=master)](https://travis-ci.org/jessicamvs/back-end-project) [![Coverage Status](https://coveralls.io/repos/github/jessicamvs/back-end-project/badge.svg?branch=jessica-student-testing2)](https://coveralls.io/github/jessicamvs/back-end-project?branch=jessica-student-testing2)

# Class Passport
An app that helps users easily plan transferring from a Community College to a University. A user can input their current Community College course list, and receive an output detailing whether each of those courses are transferrable as well as how many credits will successfully transfer. If a Community College course is not transferrable, a user can easily change their course input.  

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
### Signup/Login (auth-routes)
#### POST /signup
  - To sign up, type the following command into your terminal ```curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X POST -d '{"username": "<your unique username>", "password": "<your unique password>", "admin": "<true or false"}' localhost:3000/signup```
    - You should receive a success return as well as a unique token.


##Contributors
    Jessica Vasquez-Soltero
    Johnathan Daniels
    Jacob Isenberg
    Carolina Vasquez-Ceja
