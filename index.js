'use strict';

// npm modules
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const jsonParser = require('body-parser').json();
const app = express();

// app modules
const errorMiddlware = require('./lib/error-middleware.js');
const authRoutes = require('./routes/auth-routes.js');
const studentRoutes = require('./routes/student-routes.js');
const ccCourseRoutes = require('./routes/cccourse-routes.js');
// const uwRoutes = require('./routes/uw-routes.js');
const uwCourseRoutes = require('./routes/uwcourse-routes.js');
const mongo = require('./secrets/secrets');

// module constants
const PORT = process.env.PORT || 3000;
const MONGODB_URI = mongo.URI || 'mongodb://localhost/project';

mongoose.connect(MONGODB_URI);
mongoose.Promise = Promise;

// app middleware
app.use(morgan('dev'));
app.use(jsonParser);
app.use(authRoutes);
app.use(studentRoutes);
app.use(ccCourseRoutes);
// app.use(uwRoutes);
app.use(uwCourseRoutes);
app.use(errorMiddlware);

module.exports = app;

// start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('listening on PORT', PORT);
  });
}
