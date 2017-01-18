'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
//
const cccourseSchema = Schema({
  code: {type: String, required: true},
});
//
module.exports = mongoose.model('course', cccourseSchema);
