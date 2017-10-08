const config = require('../util/config');
const NodeCache = require('node-cache');
const Poloniex = require('poloniex-api-node');
const BaseExchangeService = require('./base.exchange.service');

class PoloniexService extends BaseExchangeService {

    constructor() {
        super('Poloniex', new NodeCache({stdTTL: config.cacheTTL, checkperiod: 10}));
        this.poloniexApi = new Poloniex();
    }

    async updateOrderBook(tradingPair) {
        const orderBook = await this.poloniexApi.returnOrderBook(tradingPair.replace('-', '_'));
        this.logger.debug(`Received order book update from ${this.exchangeName} via REST API for ${tradingPair}`);
        const asks = orderBook.asks.map((ask) => {
            const pricePoint = Number(ask[0]).toFixed(10);
            const volume = ask[1];
            return [pricePoint, volume];
        });

        const bids = orderBook.bids.map((bid) => {
            const pricePoint = Number(bid[0]).toFixed(10);
            const volume = bid[1];
            return [pricePoint, volume]
        });

        this.exchangeCache.set(tradingPair, {
            asks: asks,
            bids: bids
        });

        this.emit('update', tradingPair);
    }
}

// create a singleton
module.exports = exports = new PoloniexService();