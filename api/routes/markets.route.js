const express = require('express');
const bittrexService = require('../services/bittrex.service');

const router = express.Router();

router.get('/orderbook', async(req, res, next) => {
    if (!req.query.tradingPair) {
        const err = new Error('tradingPair query not defined');
        err.status = 400;
        return next(err);
    }

    const bittrexOrderBook = await bittrexService.getOrderBook(req.query.tradingPair);
    const orderBook = {
        bittrex: bittrexOrderBook
    };

    res.status(200).send(orderBook);
});

module.exports = router;