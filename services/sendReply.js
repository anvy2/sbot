const callSendAPI = require('../services/sendAPI');
const { SERVER_URL } = require('../config');

const sendTextMessage = async (recipientId, text) => {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      text: text,
    },
  };
  await callSendAPI(messageData);
};

const sendImageMessage = async (recipientId, imageUrl) => {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      attachment: {
        type: 'image',
        payload: {
          url: imageUrl,
        },
      },
    },
  };
  await callSendAPI(messageData);
};

const sendGifMessage = async (recipientId) => {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      attachment: {
        type: 'image',
        payload: {
          url: SERVER_URL,
        },
      },
    },
  };
  await callSendAPI(messageData);
};

const sendAudioMessage = async (recipientId) => {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      attachment: {
        type: 'audio',
        payload: {
          url: `${SERVER_URL}/assests/sample.mp3`,
        },
      },
    },
  };
  await callSendAPI(messageData);
};

const sendVideoMessage = async (recipientId, videoName) => {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      attachment: {
        type: 'video',
        payload: {
          url: SERVER_URL + videoName,
        },
      },
    },
  };

  await callSendAPI(messageData);
};

const sendFileMessage = async (recipientId, fileName) => {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      attachment: {
        type: 'file',
        payload: {
          url: SERVER_URL + fileName,
        },
      },
    },
  };
  await callSendAPI(messageData);
};

const sendButtonMessage = async (recipientId, text, buttons) => {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text,
          buttons,
        },
      },
    },
  };
  await callSendAPI(messageData);
};

const sendGenericMessage = async (recipientId, elements) => {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements,
        },
      },
    },
  };
  await callSendAPI(messageData);
};

const sendReceiptMessage = async (
  recipientId,
  recipient_name,
  currency,
  payment_method,
  timestamp,
  elements,
  address,
  summary,
  adjustments,
) => {
  const receiptId = 'order' + Math.floor(Math.random() * 1000);
  const messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'receipt',
          order_number: receiptId,
          recipient_name,
          currency,
          payment_method,
          timestamp,
          elements,
          address,
          summary,
          adjustments,
        },
      },
    },
  };
  await callSendAPI(messageData);
};

const sendQuickReply = async (recipientId, text, replies, metadata) => {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      text,
      metadata: isDefined(metadata) ? metadata : '',
      quick_replies: replies,
    },
  };
  callSendAPI(messageData);
};

const sendReadReceipt = async (recipientId) => {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    sender_action: 'mark_seen',
  };
  await callSendAPI(messageData);
};

module.exports = {
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
};
