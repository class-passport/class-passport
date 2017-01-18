'use strict';

let mongoose = require('mongoose');

let cccourseSchema = mongoose.Schema({
  code: {type: String, required: true}
});

module.exports = mongoose.model('cccourses', cccourseSchema);
