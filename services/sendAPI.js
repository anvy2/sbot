const fetch = require('isomorphic-unfetch');
const { FB_PAGE_TOKEN } = require('../config');
const callSendAPI = async (messageData) => {
  try {
    const res = await fetch(
      `https://graph.facebook.com/3.2/me/messages?access_token=${FB_PAGE_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: messageData,
      },
    );

    if (res.statusCode === 200) {
      const recipientId = res.body.recipient_id;
      const messageId = res.body.message_id;

      if (messageId) {
        console.log(
          `Successfully sent message with id ${messageId} to recipient ${recipientId}`,
        );
      } else {
        console.log(
          `Successfully called Send API for recipient ${recipientId}`,
        );
      }
    }
  } catch (err) {
    console.log('Failed calling Send API: ', err);
  }
};

module.exports = callSendAPI;
