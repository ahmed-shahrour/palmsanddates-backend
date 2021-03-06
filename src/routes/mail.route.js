const express = require('express');
const { mailController } = require('../controllers');
const { validateRules } = require('../middlewares/validators');

const router = express.Router();
const { validate, sendContactUs, subscribe } = mailController;

router.post(
  '/contact-us',
  validate('sendContactUs'),
  validateRules,
  sendContactUs
);

router.post('/subscribe', validate('subscribe'), validateRules, subscribe);

module.exports = router;
