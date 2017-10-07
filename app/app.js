const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const index = require('./routes/index');
const actuator = require('./routes/actuator');
const logger = require('./util/logger');
const env = require('dotenv');

env.config();
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routes
app.use('/', index);
app.use('/actuator', actuator);

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

app.listen(port, () => {
    logger.info(`Arbiter API listening on port ${port}!`)
});
