const config = require('../util/config');
const logger = require('../util/logger');
const NodeCache = require('node-cache');
const _ = require('lodash');
const requestPromise = require('request-promise');
const queryString = require('query-string');

// ideally was going to use websocket api from the wrapper "node-bittrex-api" to get order book
// but `updateExchangeState` only returns recently filled orders and not orderbooks
// bittrex's recomendation is to listen via websockets for changes then call REST endpoint for orderbook

class BittrexService {

    constructor() {
        this.bittrexCache = new NodeCache({stdTTL: config.cacheTTL, checkperiod: 10});
        this.orderBookPath = '/public/getorderbook';

        this.bittrexCache.on('expired', async (tradingPairKey, value) => {
            logger.info(`${tradingPairKey} expired updating bittrex order book`);
            await this.updateOrderBook(tradingPairKey);
        });
    }

    async connect(tradingPairs) {
        this.tradingPairs = tradingPairs;

        _.each(this.tradingPairs, async (tradingPair) => {
           logger.info(`Initializing ${tradingPair} bittrex order book`);
           await this.updateOrderBook(tradingPair);
        });
    }

    async updateOrderBook(tradingPair) {
        const queryParam = {
            market: tradingPair,
            type: 'both'
        };
        const orderBookUrlRequest = `${config.bittrexApiUrl}${this.orderBookPath}?${queryString.stringify(queryParam)}`;
        const orderBook = await requestPromise(orderBookUrlRequest);
        const orderBookResponse = JSON.parse(orderBook);

        this.bittrexCache.set(tradingPair, orderBookResponse.result);
    }

    async getOrderBook(tradingPair) {
        return this.bittrexCache.get(tradingPair);
    }

    // visible for testing
    _setClient(bittrexClient) {

    }
}

// create a singleton
module.exports = exports = new BittrexService();