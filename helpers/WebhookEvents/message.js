const uuid = require('uuid');
let sessionIds = require('../../containers/sessionIds');

const receivedMessage = (event) => {
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
    handleEcho(messageId, appId, metadata);
  } else if (quickReply) {
    handleQuickReply(senderId, quickReply, messageId);
  } else if (messageText) {
    sendToDialogFlow(senderId, messageText);
  } else if (messageAttachments) {
    handleMessageAttachments(messageAttachments, senderId);
  }
};
