const express = require('express');

const router = express.Router();

const mailRoutes = require('./mail.route');
const schoolRoutes = require('./school.route');
const residenceRoutes = require('./residence.route');
const userRoutes = require('./user.route');
const usertypeRoutes = require('./usertype.route');
const eventRoutes = require('./event.route');

router.get('/', (req, res, next) =>
  res.status(200).json({ message: 'Hello, World!' })
);

router.use('/mail', mailRoutes);
router.use('/schools', schoolRoutes);
router.use('/residences', residenceRoutes);
router.use('/users', userRoutes);
router.use('/usertypes', usertypeRoutes);
router.use('/events', eventRoutes);

/// //////////////////////////////////////////////////////////////////////////////////////
// Error page for error handling
/// //////////////////////////////////////////////////////////////////////////////////////
router.use((error, req, res, next) =>
  res.status(error.statusCode || 500).json({
    message: error.message || 'Internal Server Error',
    data: error.data || null,
  })
);

/// //////////////////////////////////////////////////////////////////////////////////////
// If no explicit error and route requested not found
/// //////////////////////////////////////////////////////////////////////////////////////
router.use((req, res, next) =>
  res.status(404).json({ message: 'API endpoint not found.' })
);

module.exports = router;
