require('dotenv').config();
const logger = require('./configs/logger');
const express = require('express');
const morgan = require('morgan');
const ProcessRequestBody = require('./services/processRequestBody')

const app = express();

const snooze = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const waitTimeMs = process.env.WAIT_TIME;

const processRequestBody = new ProcessRequestBody();

if (process.env.ENVIRONMENT === 'dev') app.use(morgan('dev'));

app.use(express.json());

app.post('/users/track', async (req, res, next) => {
  await snooze(waitTimeMs);
  processRequestBody.profileRequest(req.body)

  res.status(201).send({message: '/USER/TRACK created 201'});
  // res.status(429).send({message: '/USER/TRACK Error 429'});
});

app.post('/users/alias/new', async (req, res, next) => {
  await snooze(waitTimeMs);
  processRequestBody.aliasRequest(req.body)

  res.status(201).send({message: '/ALIASES created 201'});
  // res.status(429).send({message: '/ALIASES Error 429'});
});

app.post('/subscription/status/set', async (req, res, next) => {
  await snooze(waitTimeMs);
  processRequestBody.smsRequest(req.body)

  res.status(201).send({message: '/SMS created 201'});
  // res.status(429).send({message: '/SMS Error 429'});
});

app.listen(process.env.PORT || 3300, () => {
  console.log('Server running on port 3300');
});
