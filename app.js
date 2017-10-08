require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('./api/util/logger');
const config = require('./api/util/config');

const index = require('./api/routes/index');
const actuator = require('./api/routes/actuator.route');
const markets = require('./api/routes/markets.route');

const bittrexService = require('./api/services/bittrex.service');
const poloniexService = require('./api/services/poloniex.service');

bittrexService.connect(config.tradingPairs);
poloniexService.connect(config.tradingPairs);

const app = express();

// middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
    'credentials': true,
    'methods': 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    'optionsSuccessStatus': 204,
    'origin': true,
    'preflightContinue': true,
}));

// routes
app.use('/', index);
app.use('/actuator', actuator);
app.use('/markets', markets);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
    logger.error(err);
  res.status(err.status || 500)
      .send(err.message || 'Internal Server Error');
});

app.listen(config.port, () => {
    logger.info(`Arbiter API listening on port ${config.port}!`)
});
