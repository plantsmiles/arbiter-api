const express = require('express');
const bittrexService = require('../services/bittrex.service');

const router = express.Router();

router.get('/orderbook', async(req, res, next) => {
    // any application health checking
    res.status(200).send('OK');
});

module.exports = router;