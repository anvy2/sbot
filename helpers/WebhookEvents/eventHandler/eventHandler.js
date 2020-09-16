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
} = require('../../../services/sendReply');

const sendToDialogFlow = require('../../../services/dialogflow');

const { sendTypingOn, sendTypingOff } = require('../../../services/typing');

const isDefined = (obj) => {
  if (typeof obj === 'undefined') {
    return false;
  }
  if (!obj) {
    return false;
  }
  return true;
};

const handleMessageAttachments = async (messageAttachments, senderId) => {
  await sendTextMessage(senderId, 'Attachment received. Thank you.');
};

const handleQuickReply = async (senderId, quickReply, messageId) => {
  const quickReplyPayload = quickReply.payload;

  console.log(
    `Quick reply for message ${messageId}  with payload ${quickReplyPayload}`,
  );
  await sendToDialogFlow(senderId, quickReplyPayload);
};

//https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-echo
const handleEcho = async (messageId, appId, metadata) => {
  console.log(
    `Received echo for message ${messageId} and app ${appId} with metadata ${metadata}`,
  );
};

const handleDialogFlowAction = async (
  sender,
  action,
  messages,
  contexts,
  parameters,
) => {
  switch (action) {
    default:
      await handleMessages(messages, sender);
  }
};

const handleMessage = async (message, sender) => {
  let replies = [];
  switch (message.message) {
    case 'text':
      message.text.text.forEach((text) => {
        if (text !== '') {
          sendTextMessage(sender, text);
        }
      });
      return;
    case 'quickReplies':
      message.quickReplies.quickReplies.forEach((text) => {
        let reply = {
          content_type: 'text',
          title: text,
          payload: text,
        };
        replies.push(reply);
      });
      await sendQuickReply(sender, message.quickReplies.title, replies);
      return;
    case 'image':
      await sendImageMessage(sender, message.image.imageUri);
      return;
  }
};

const handleCardMessage = async (messages, sender) => {
  let elements = [];
  messages.map((message) => {
    let buttons = [];
    message.card.buttons.map((button) => {
      let isLink = button.postback.substring(0, 4) === 'http';
      let buttonCard;
      if (isLink) {
        buttonCard = {
          type: 'web_url',
          title: button.text,
          url: button.postback,
        };
      } else {
        buttonCard = {
          type: 'postback',
          title: button.text,
          payload: button.postback,
        };
      }
      buttons.push(buttonCard);
    });
    let element = {
      title: message.card.title,
      image_url: message.card.imageUri,
      subtitle: message.card.subtitle,
      buttons: buttons,
    };
    elements.push(element);
  });
  await sendGenericMessage(sender, elements);
};

const handleMessages = async (messages, sender) => {
  const timeoutInterval = 1000;
  let previousType;
  let cardTypes = [];
  let timeout = 0;
  for (let i = 0; i < messages.length; i++) {
    if (
      previousType === 'card' &&
      (messages[i].message !== 'card' || i === messages.length - 1)
    ) {
      timeout = (i - 1) * timeoutInterval;
      setTimeout(handleCardMessage.bind(null, cardTypes, sender), timeout);
      cardTypes = [];
      timeout = i * timeoutInterval;
      setTimeout(handleMessage.bind(null, messages[i], sender), timeout);
    } else if (messages[i].message === 'card' && i === messages.length - 1) {
      cardTypes.push(messages[i]);
      timeout = (i - 1) * timeoutInterval;
      setTimeout(handleCardMessage.bind(null, cardTypes, sender), timeout);
      cardTypes = [];
    } else if (messages[i].message === 'card') {
      cardTypes.push(messages[i]);
    } else {
      timeout = i * timeoutInterval;
      setTimeout(handleMessage.bind(null, messages[i], sender), timeout);
    }

    previousType = messages[i].message;
  }
};

const handleDialogFlowResponse = async (sender, response) => {
  const responseText = response.fulfillmentMessages.fulfillmentText;
  const messages = response.fulfillmentMessages;
  const action = response.action;
  const contexts = response.outputContexts;
  const parameters = response.parameters;

  await sendTypingOff(sender);

  if (isDefined(action)) {
    await handleDialogFlowAction(
      sender,
      action,
      messages,
      contexts,
      parameters,
    );
  } else if (isDefined(messages)) {
    await handleMessages(messages, sender);
  } else if (responseText === '' && !isDefined(action)) {
    await sendTextMessage(
      sender,
      "I'm not sure what you want. Can you be more specific?",
    );
  } else if (isDefined(responseText)) {
    await sendTextMessage(sender, responseText);
  }
};

module.exports = {
  handleMessages,
  handleDialogFlowAction,
  handleEcho,
  handleMessage,
  handleCardMessage,
  handleQuickReply,
  handleMessageAttachments,
  handleDialogFlowResponse,
};
