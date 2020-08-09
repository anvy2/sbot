module.exports = (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    body.entry.forEach((entry) => {
      const pageId = entry.id;
      const timeOfEvent = entry.time;

      pageEntry.messaging.forEach(messagingEvent) => {
        if(messagingEvent.optin) {
          receivedAuthentication(messagingEvent);
        } else if(messagingEvent.message) {
          recivedMessage(messagingEvent);
        } else if(messagingEvent.delivery) {
          receivedDeliveryConfirmation(messagingEvent);
        } else if(messagingEvent.postback) {
          receivedPostback(messagingEvent);
        } else if(messagingEvent.read) {
          receivedRead(messagingEvent);
        } else if(messagingEvent.account_linking) {
          receivedAccountLink(messagingEvent);
        } else {
          console.log('Unsubscribed Event Received: ', messagingEvent);
        }
      }
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
};
