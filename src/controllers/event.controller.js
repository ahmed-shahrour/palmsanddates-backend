const { param, body } = require('express-validator');

const {
  checkUserExists,
  checkResidenceExists,
  checkEndTime,
  checkEventExists,
  checkParticipantDuplicate,
  checkParticipantExists,
} = require('../middlewares/validators');
const db = require('../db/models');

const eventController = {
  validate,
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  joinEvent,
  leaveEvent,
  getJoinedUsers,
};

function validate(method) {
  switch (method) {
    case 'createEvent':
      return [
        body('name').exists().notEmpty().isString().trim(),
        body('startTime')
          .exists()
          .withMessage('startTime must be provided.')
          .bail()
          .isISO8601()
          .withMessage('startTime must be a date with ISO8601 standards.')
          .bail()
          .toDate()
          .isAfter()
          .withMessage('startTime must be after current time.')
          .bail(),
        body('endTime')
          .optional()
          .isISO8601()
          .withMessage('endTime must be a date with ISO8601 standards.')
          .bail()
          .toDate()
          .isAfter()
          .withMessage('endTime must be after current time.')
          .bail()
          .custom(checkEndTime)
          .withMessage('startTime must be before endTime.')
          .bail(),
        body('CreatorUserId')
          .exists()
          .withMessage('CreatorUserId must be provided.')
          .bail()
          .notEmpty()
          .isInt()
          .withMessage('CreatorUserId must be an integer.')
          .bail()
          .custom(checkUserExists)
          .withMessage('User creator not found.'),
        body('ResidenceId')
          .exists()
          .withMessage('ResidenceId must be provided.')
          .bail()
          .notEmpty()
          .withMessage('ResidenceId must not be empty.')
          .bail()
          .isInt()
          .withMessage('ResidenceId must be an Integer.')
          .bail()
          .custom(checkResidenceExists)
          .withMessage('Residence not found.'),
      ];
    case 'updateEvent':
      return [
        param('id').exists().isInt().custom(checkEventExists),
        body('name').optional().isString().trim(),
        body('startTime').optional().isISO8601().toDate().isAfter(),
        body('endTime')
          .optional()
          .isISO8601()
          .toDate()
          .isAfter()
          .custom(checkEndTime)
          .withMessage('startTime must be before endTime.'),
        body('creatorUserId')
          .optional()
          .notEmpty()
          .isInt()
          .custom(checkUserExists)
          .withMessage('User creator not found.'),
      ];
    case 'joinEvent':
      return [
        body('UserId').exists().notEmpty().isInt().custom(checkUserExists),
        param('id')
          .exists()
          .notEmpty()
          .isInt()
          .custom(checkEventExists)
          .bail()
          .custom(checkParticipantDuplicate),
      ];
    case 'leaveEvent':
      return [
        body('UserId').exists().notEmpty().isInt().custom(checkUserExists),
        param('id')
          .exists()
          .notEmpty()
          .isInt()
          .custom(checkEventExists)
          .bail()
          .custom(checkParticipantExists),
      ];
    case 'getJoinedUsers':
      return [
        param('id').exists().bail().isInt().bail().custom(checkEventExists),
      ];
  }
}

async function createEvent(req, res, next) {
  try {
    const newEvent = req.body;
    const createdEvent = await db.Event.create(newEvent);
    await req.User.addEvent(createdEvent);
    return res.status(201).json({
      message: 'Event successfully created.',
      data: {
        id: createdEvent.id,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getEvents(req, res, next) {
  try {
    const events = await db.Event.findAll();
    return res
      .status(200)
      .json({ message: 'Residences successfully fetched.', data: { events } });
  } catch (err) {
    next(err);
  }
}

async function getEvent(req, res, next) {
  try {
    const event = await db.Event.findByPk(req.params.id);
    if (!event) {
      const error = new Error('Event not found.');
      error.statusCode = 404;
      throw error;
    }
    return res
      .status(200)
      .json({ message: 'Event successfully fetched.', data: { event } });
  } catch (err) {
    next(err);
  }
}

async function updateEvent(req, res, next) {
  try {
    await req.Event.update(req.body);
    return res.status(204).json({ message: 'Successfully updated event.' });
  } catch (err) {
    next(err);
  }
}

async function joinEvent(req, res, next) {
  try {
    await req.Event.addUser(req.User);
    return res
      .status(201)
      .json({ message: 'User successfully added to event.', data: {} });
  } catch (err) {
    next(err);
  }
}

async function leaveEvent(req, res, next) {
  try {
    await req.Event.removeUser(req.User);
    return res
      .status(201)
      .json({ message: 'User successfully added to event.', data: {} });
  } catch (err) {
    next(err);
  }
}

async function getJoinedUsers(req, res, next) {
  try {
    const users = await req.Event.getUsers();
    return res.status(200).json({
      message: 'Joined users successfully fetched.',
      data: {
        users,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = eventController;
