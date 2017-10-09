const express = require('express');
const orderBookService = require('../services/order.book.service');
const config = require('../util/config');

const router = express.Router();

router.get('/tradingPairs', async(req, res, next) => {
    res.status(200).send(config.tradingPairs);
});

router.get('/orderbook', async(req, res, next) => {
    if (!req.query.tradingPair) {
        const err = new Error('tradingPair query not defined');
        err.status = 400;
        return next(err);
    }

    const orderBook = await orderBookService.combineOrderBooks(req.query.tradingPair);
    res.status(200).send(orderBook);
});

module.exports = router;