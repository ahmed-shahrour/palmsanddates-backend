const checkUserExists = require('./checkUserExists.validator');
const checkSchoolExists = require('./checkSchoolExists.validator');
const checkEventExists = require('./checkEventExists.validator')
const checkEndTime = require('./checkEndTime.validator');

module.exports = {
  checkUserExists,
  checkSchoolExists,
  checkEndTime,
  checkEventExists,
};
