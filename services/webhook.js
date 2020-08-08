const router = require('express').router();

const webhookVerification = require('../helpers/webhookVerification');
const webhookHandler = require('../helpers/webhookHandler');

router.get('/webhook', webhookVerification);
router.post('/webhook', webhookHandler);

module.exports = router;
