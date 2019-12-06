require('dotenv').config();
const Bunyan = require('bunyan');
const bformat = require('bunyan-format');

const formatOut = bformat({ outputMode: process.env.LOG_MODE, color: false });
const name = process.env.SERVICE_NAME || 'ph-c360-mock-api';
const level = process.env.LOG_LEVEL || 'debug';
const logger = Bunyan.createLogger({
  name,
  stream: formatOut,
  level,
});

module.exports = logger;
