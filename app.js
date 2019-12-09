require('dotenv').config();
const logger = require('./configs/logger');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const ProcessRequestBody = require('./services/processRequestBody')

const app = express();

const snooze = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const waitTimeMs = process.env.WAIT_TIME;

const processRequestBody = new ProcessRequestBody();

if (process.env.ENVIRONMENT === 'dev') app.use(morgan('dev'));

app.use(express.json());

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/users/track', async (req, res, next) => {
  await snooze(waitTimeMs);
  processRequestBody.profileRequest(req.body)

  res.status(201).send({message: 'success'});
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

app.post('/users/export/ids', async (req, res, next) => {
  await snooze(waitTimeMs);
  processRequestBody.smsRequest(req.body)
  const mockResponse = {
      "users": [
          {
              "user_aliases": []
          }
        ]
  }
  res.status(201).json(mockResponse);
  // res.status(429).send({message: '/SMS Error 429'});
});


app.listen(3000, () => {
  console.log('Server running on port 3000');
});
