const callSendAPI = require('./sendAPI');

const sendTypingOn(recipientId) {
  const messsageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "typing_on"
  };

  callSendAPI(messageData);
}

const sendTypingOff(recipientId) {
  const messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "typing_off"
  }
  callSendAPI(messageData);
}