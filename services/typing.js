const callSendAPI = require('./sendAPI');

const sendTypingOn = async (recipientId) => {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    sender_action: 'typing_on',
  };

  await callSendAPI(messageData);
};

const sendTypingOff = async (recipientId) => {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    sender_action: 'typing_off',
  };
  await callSendAPI(messageData);
};

module.exports = {
  sendTypingOn,
  sendTypingOff,
};
