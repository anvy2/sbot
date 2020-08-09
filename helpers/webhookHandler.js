const {
  receivedAccountLink,
  receivedAuthentication,
  receivedDeliveryConfirmation,
  receivedMessage,
  receivedPostback,
  receivedRead,
} = require('./WebhookEvents/events');

module.exports = (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    body.entry.forEach((entry) => {
      const pageId = entry.id;
      const timeOfEvent = entry.time;

      entry.messaging.forEach(async (messagingEvent) => {
        if (messagingEvent.optin) {
          await receivedAuthentication(messagingEvent);
        } else if (messagingEvent.message) {
          await receivedMessage(messagingEvent);
        } else if (messagingEvent.delivery) {
          await receivedDeliveryConfirmation(messagingEvent);
        } else if (messagingEvent.postback) {
          await receivedPostback(messagingEvent);
        } else if (messagingEvent.read) {
          await receivedRead(messagingEvent);
        } else if (messagingEvent.account_linking) {
          await receivedAccountLink(messagingEvent);
        } else {
          console.log('Unsubscribed Event Received: ', messagingEvent);
        }
      });
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
};
