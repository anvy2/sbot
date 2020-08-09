'use strict';
const express = require('express');
const mongoose = require('mongoose');
const unfetch = require('isomorphic-unfetch');

const signatureVerification = require('./helpers/signatureVerify');
const webhook = require('./services/webhook');
const PORT = process.env.PORT ?? 3000;
const app = express();
app.use(
  express.json({
    verify: signatureVerification,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome!! This is a chatbot for FB Hackathon');
});

app.use(webhook);

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
