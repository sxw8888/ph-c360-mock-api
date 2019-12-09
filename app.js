require('dotenv').config();
const logger = require('./configs/logger');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const ProcessRequestBody = require('./services/processRequestBody')

const app = express();

const snooze = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const waitTimeMs = process.env.WAIT_TIME;

let statuses = {
  track: 201,
  exportIds: 201,
  aliases: 201,
  subscription: 201
}

const processRequestBody = new ProcessRequestBody();

if (process.env.ENVIRONMENT === 'dev') app.use(morgan('dev'));

app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/users/track', async (req, res, next) => {
  await snooze(waitTimeMs);
  processRequestBody.profileRequest(req.body, statuses.track)

  if (statuses.track === 201 ) res.status(statuses.track).send({message: 'success'});
  else res.status(statuses.track).send({message: `/USER/TRACK Error ${statuses.track}`});
});

app.post('/users/alias/new', async (req, res, next) => {
  await snooze(waitTimeMs);
  processRequestBody.aliasRequest(req.body, statuses.aliases)

  if (statuses.aliases === 201 ) res.status(statuses.aliases).send({message: `+++++++++++++++ /ALIASES created ${statuses.aliases}`});
  else res.status(statuses.aliases).send({message: `+++++++++++++++ /ALIASES Error ${statuses.aliases}`});
});

app.post('/subscription/status/set', async (req, res, next) => {
  await snooze(waitTimeMs);
  processRequestBody.smsRequest(req.body, statuses.subscription)

  if (statuses.subscription === 201 ) res.status(statuses.subscription).send({message: `+++++++++++++++ /SMS created ${statuses.subscription}`});
  else res.status(statuses.subscription).send({message: `+++++++++++++++ /SMS Error ${statuses.subscription}`});
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
  if (statuses.exportIds === 201 ) res.status(statuses.exportIds ).json(mockResponse);
  else res.status(statuses.exportIds).send({message: `/USERS/EXPORT/IDS Error ${statuses.exportIds}`});
});

app.post('/admin', async (req, res, next) => {
  console.log(`Setting endpoints status From ${JSON.stringify(statuses)} to ${JSON.stringify(req.body)}`);
  if (req.body.track) statuses.track = parseInt(req.body.track, 10);
  if (req.body.exportIds) statuses.exportIds = parseInt(req.body.exportIds, 10);
  if (req.body.aliases) statuses.aliases = parseInt(req.body.aliases, 10);
  if (req.body.subscription) statuses.subscription = parseInt(req.body.subscription, 10);
  res.send(`Status changed to ${JSON.stringify(statuses)}`);
});


app.listen(3000, () => {
  console.log('Server running on port 3000');
});
