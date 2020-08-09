const uuid = require('uuid');
let sessionIds = require('../../containers/sessionIds');
const {
  sendTextMessage,
  sendAudioMessage,
  sendButtonMessage,
  sendFileMessage,
  sendGenericMessage,
  sendGifMessage,
  sendImageMessage,
  sendQuickReply,
  sendReadReceipt,
  sendReceiptMessage,
  sendVideoMessage,
} = require('../../services/sendReply');

const {
  handleMessages,
  handleDialogFlowAction,
  handleEcho,
  handleMessage,
  handleCardMessage,
  handleQuickReply,
  handleMessageAttachments,
  handleDialogFlowResponse,
} = require('./eventHandler/eventHandler');

const sendToDialogFlow = require('../../services/dialogflow');

const receivedMessage = async (event) => {
  const senderId = event.sender.id;
  const recipientId = event.recipient.id;
  const timeOfMessage = event.timestamp;
  const message = event.message;

  if (!sessionIds.has(senderId)) {
    sessionIds.set(senderId, uuid.v1());
  }

  const isEcho = message.is_echo;
  const messageId = message.mid;
  const appId = message.app_id;
  const metadata = message.metadata;

  const messageText = message.text;
  const messageAttachments = message.attachments;
  const quickReply = message.quick_reply;

  if (isEcho) {
    await handleEcho(messageId, appId, metadata);
  } else if (quickReply) {
    await handleQuickReply(senderId, quickReply, messageId);
  } else if (messageText) {
    await sendToDialogFlow(senderId, messageText);
  } else if (messageAttachments) {
    await handleMessageAttachments(messageAttachments, senderId);
  }
};

const receivedPostback = async (event) => {
  const senderId = event.sender.id;
  const recipientId = event.recipient.id;
  const timeOfPostback = event.timestamp;

  const payload = event.postback.payload;

  switch (payload) {
    default:
      await sendTextMessage(
        senderId,
        "I'm not sure what you want. Can you be more specific?",
      );
      break;
  }
  console.log(
    `Received postback for user ${senderId} and page ${recipientId} with payload ${payload} at ${timeOfPostback}`,
  );
};

const receivedRead = async (event) => {
  const senderId = event.sender.id;
  const recipientId = event.recipient.id;

  const watermark = event.read.watermark;
  const sequenceNumber = event.read.seq;

  console.log(
    `Received message read event for watermark ${watermark} and sequence number ${sequenceNumber}`,
  );
};

const receivedAccountLink = async (event) => {
  const senderId = event.sender.id;
  const recipientId = event.recipient.id;

  const status = event.account_linking_status;
  const authCode = event.account_linking.authorization_code;

  console.log(
    `Received account link event for user ${senderId} with status ${status} and auth code ${authCode}`,
  );
};

const receivedDeliveryConfirmation = async (event) => {
  const senderId = event.sender.id;
  const recipientId = event.recipient.id;
  const delivery = event.delivery;
  const messageIds = delivery.mids;
  const watermark = delivery.watermark;
  const sequenceNumber = delivery.seq;

  if (messageIds) {
    messageIds.forEach((messageId) => {
      console.log(
        `Received delivery confirmation for message ID: ${messageId}`,
      );
    });
  }
  console.log(`All message before ${watermark} were delivered`);
};

const receivedAuthentication = async (event) => {
  const senderId = event.sender.id;
  const recipientId = event.recipient.id;
  const timeOfAuth = event.timestamp;

  const passThroughParam = event.optin.ref;
  console.log(
    `Received authentication for user ${senderId} and page ${recipientId} with pass ${passThroughParam} through param ${timeOfAuth}`,
  );

  await sendTextMessage(senderId, 'Authentication successful');
};

module.exports = {
  receivedAccountLink,
  receivedAuthentication,
  receivedDeliveryConfirmation,
  receivedMessage,
  receivedPostback,
  receivedRead,
};
