const logger = require('../util/logger');
const EventEmitter = require('events');
const _ = require('lodash');
const util = require('util');

class BaseExchangeService extends EventEmitter {

    constructor(exchangeName, exchangeMap) {
        // instantiate event emitter
        super();
        this.exchangeMap = exchangeMap;
        this.exchangeName = exchangeName;
        this.logger = logger;
    }

    async initialize(tradingPairs) {
        this.tradingPairs = tradingPairs;

        _.each(this.tradingPairs, async (tradingPair) => {
            logger.info(`Initializing ${tradingPair} ${this.exchangeName} order book`);
            await this.updateOrderBook(tradingPair);
        });
    }

    async getOrderBook(tradingPair) {
        return this.exchangeMap.get(tradingPair);
    }

}

module.exports = exports = BaseExchangeService;