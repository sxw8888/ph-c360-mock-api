require('dotenv').config();
const logger = require('./configs/logger');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const ProcessRequestBody = require('./services/processRequestBody')

const app = express();

const snooze = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const waitTimeMs = process.env.WAIT_TIME;

let status = 201

const processRequestBody = new ProcessRequestBody();

if (process.env.ENVIRONMENT === 'dev') app.use(morgan('dev'));

app.use(express.json());

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/users/track', async (req, res, next) => {
  await snooze(waitTimeMs);
  processRequestBody.profileRequest(req.body)

  if (status === 201 ) res.status(status).send({message: 'success'});
  else res.status(status).send({message: `/USER/TRACK Error ${status}`});
});

app.post('/users/alias/new', async (req, res, next) => {
  await snooze(waitTimeMs);
  processRequestBody.aliasRequest(req.body)

  if (status === 201 ) res.status(status).send({message: `/ALIASES created ${status}`});
  else res.status(status).send({message: `/ALIASES Error ${status}`});
});

app.post('/subscription/status/set', async (req, res, next) => {
  await snooze(waitTimeMs);
  processRequestBody.smsRequest(req.body)

  if (status === 201 ) res.status(status).send({message: `/SMS created ${status}`});
  else res.status(status).send({message: `/SMS Error ${status}`});
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
  if (status === 201 ) res.status(status).json(mockResponse);
  else res.status(status).send({message: `/USERS/EXPORT/IDS Error ${status}`});
});

app.post('/admin', async (req, res, next) => {
  if(req.body.status) {
    console.log(`Setting endpoints status From ${status} to ${req.body.status}`);
    status = parseInt(req.body.status, 10);
    res.send(`Status changed to ${status}`);
  }
});


app.listen(3000, () => {
  console.log('Server running on port 3000');
});
