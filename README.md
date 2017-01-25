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
  - <Jacob's awesome schema diagram goes here>

## Routes
### Signup/Login (auth-routes)
#### POST /signup
  - To sign up, type the following command into your terminal ```curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X POST -d '{"username": "<your unique username>", "password": "<your unique password>", "admin": "<true or false"}' localhost:3000/signup```
    - You should receive a success return as well as a unique token.


##Authors
    Jessica Vasquez-Soltero
    Johnathan Daniels
    Jacob Isenberg
    Carolina Vasquez-Ceja
