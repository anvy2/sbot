const callSendAPI = require('./sendAPI');

const sendTypingOn = (recipientId) => {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    sender_action: 'typing_on',
  };

  callSendAPI(messageData).then(() => console.log('SendTypingOn Complete'));
};

const sendTypingOff = (recipientId) => {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    sender_action: 'typing_off',
  };
  callSendAPI(messageData).then(() => console.log('SendTypingOff Complete'));
};

module.exports = {
  sendTypingOn,
  sendTypingOff,
};
