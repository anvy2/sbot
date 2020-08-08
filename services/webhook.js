const express = require('express');
const router = express.Router();

const webhookVerification = require('../helpers/webhookVerification');
const webhookHandler = require('../helpers/webhookHandler');

router.get('/webhook', webhookVerification);
router.post('/webhook', webhookHandler);

module.exports = router;
