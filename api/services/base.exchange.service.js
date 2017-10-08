const logger = require('../util/logger');
const EventEmitter = require('events');
const _ = require('lodash');

class BaseExchangeService extends EventEmitter {

    constructor(exchangeName, exchangeCache) {
        // instantiate event emitter
        super();
        this.exchangeCache = exchangeCache;
        this.exchangeName = exchangeName;
        this.logger = logger;

        this.exchangeCache.on('expired', async (tradingPairKey, value) => {
            logger.info(`${tradingPairKey} expired updating ${this.exchangeName} order book`);
            await this.updateOrderBook(tradingPairKey);
        });
    }

    async connect(tradingPairs) {
        this.tradingPairs = tradingPairs;

        _.each(this.tradingPairs, async (tradingPair) => {
            logger.info(`Initializing ${tradingPair} ${this.exchangeName} order book`);
            await this.updateOrderBook(tradingPair);
        });
    }

    async getOrderBook(tradingPair) {
        return this.exchangeCache.get(tradingPair);
    }

}

module.exports = exports = BaseExchangeService;