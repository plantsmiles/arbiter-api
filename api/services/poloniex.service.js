const config = require('../util/config');
const logger = require('../util/logger');
const NodeCache = require('node-cache');
const _ = require('lodash');
const Poloniex = require('poloniex-api-node');

class PoloniexService {

    constructor() {
        this.poloniexApi = new Poloniex();
        this.poloniexCache = new NodeCache({stdTTL: config.cacheTTL, checkperiod: 10});

        this.poloniexCache.on('expired', async (tradingPairKey, value) => {
            logger.info(`${tradingPairKey} expired updating poloniex order book`);
            await this.updateOrderBook(tradingPairKey);
        });
    }

    async connect(tradingPairs) {
        this.tradingPairs = tradingPairs;

        _.each(this.tradingPairs, async (tradingPair) => {
            logger.info(`Initializing ${tradingPair} poloniex order book`);
            await this.updateOrderBook(tradingPair);
        });
    }

    async updateOrderBook(tradingPair) {
        const orderBook = await this.poloniexApi.returnOrderBook(tradingPair.replace('-', '_'));
        const asks = orderBook.asks.map((ask) => {
            const pricePoint = Number(ask[0]);
            const volume = ask[1];
            return {
                pricePoint: pricePoint,
                volume: volume
            }
        });

        const bids = orderBook.bids.map((bid) => {
            const pricePoint = Number(bid[0]);
            const volume = bid[1];
            return {
                pricePoint: pricePoint,
                volume: volume
            }
        });

        this.poloniexCache.set(tradingPair, {
            asks: asks,
            bids: bids
        });
    }

    async getOrderBook(tradingPair) {
        return this.poloniexCache.get(tradingPair);
    }

    // visible for testing
    _setClient(poloniexClient) {

    }
}

// create a singleton
module.exports = exports = new PoloniexService();