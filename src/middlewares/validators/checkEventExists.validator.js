const db = require('../../db/models');

const checkEventExists = async (value, { req, location, path }) => {
  const event = await db.Event.findByPk(value);
  const isValid = event !== undefined && event !== null;

  if (!isValid) {
    const error = new Error('Event not found');
    error.statusCode = 404;
    throw error;
  }

  req.Event = event;
  return isValid;
};

module.exports = checkEventExists;
