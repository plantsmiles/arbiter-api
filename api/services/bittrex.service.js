const config = require('../util/config');
const NodeCache = require('node-cache');
const requestPromise = require('request-promise');
const queryString = require('query-string');
const BaseExchangeService = require('./base.exchange.service');

// ideally was going to use websocket api from the wrapper "node-bittrex-api" to get order book
// but `updateExchangeState` only returns recently filled orders and not orderbooks
// bittrex's recomendation is to listen via websockets for changes then call REST endpoint for orderbook

class BittrexService extends BaseExchangeService {

    constructor() {
        super('Bittrex', new NodeCache({stdTTL: config.cacheTTL, checkperiod: 10}));
        this.orderBookPath = '/public/getorderbook';
    }

    async updateOrderBook(tradingPair) {
        const queryParam = {
            market: tradingPair,
            type: 'both'
        };
        const orderBookUrlRequest = `${config.bittrexApiUrl}${this.orderBookPath}?${queryString.stringify(queryParam)}`;
        const orderBookResponse = await requestPromise(orderBookUrlRequest);
        this.logger.debug(`Received order book update from ${this.exchangeName} via REST API for ${tradingPair}`);
        const orderBook = JSON.parse(orderBookResponse).result;

        const asks = orderBook.sell.map((ask) => {
            const pricePoint = ask.Rate;
            const volume = ask.Quantity;
            return [pricePoint, volume];
        });

        const bids = orderBook.buy.map((bid) => {
            const pricePoint = bid.Rate;
            const volume = bid.Quantity;
            return [pricePoint, volume];
        });

        this.exchangeCache.set(tradingPair, {
            asks: asks,
            bids: bids
        });

        this.emit('update', tradingPair);
    }
}

// create a singleton
module.exports = exports = new BittrexService();