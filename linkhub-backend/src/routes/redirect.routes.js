const express = require('express');
const router = express.Router();
const redirectController = require('../controllers/redirect.controller');

router.get('/:shortCode', redirectController.handleRedirect);

module.exports = router;