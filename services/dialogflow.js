const dialogFlow = require('@google-cloud/dialogflow');
const config = require('../config');
let sessionIds = require('../containers/sessionIds');
const { sendTypingOn } = require('./typing');
const {
  handleDialogFlowResponse,
} = require('../helpers/WebhookEvents/eventHandler/eventHandler');

const credentials = {
  client_email: config.GOOGLE_CLIENT_EMAIL,
  private_key: config.GOOGLE_PRIVATE_KEY,
};

const sessionClient = new dialogFlow.SessionsClient({
  projectId: config.GOOGLE_PROJECT_ID,
  credentials,
});

const sendToDialogFlow = async (sender, text, params) => {
  await sendTypingOn(sender);

  try {
    const sessionPath = sessionClient.projectAgentSessionPath(
      config.GOOGLE_PROJECT_ID,
      sessionIds.get(sender),
    );
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text,
          languageCode: config.DF_LANGUAGE_CODE,
        },
      },
      queryParams: {
        payload: {
          data: params,
        },
      },
    };
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    await handleDialogFlowResponse(sender, result);
  } catch (err) {
    console.log(`error: ${err}`);
  }
};

module.exports = sendToDialogFlow;
