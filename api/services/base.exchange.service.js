const logger = require('../util/logger');
const EventEmitter = require('events');
const _ = require('lodash');
const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);
const config = require('../util/config');

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

    async _waitAndRefresh(tradingPair) {
        await setTimeoutPromise(config.cacheTTL);
        this.logger.info(`Refreshing ${tradingPair} updating ${this.exchangeName} order book`);

        await this.updateOrderBook(tradingPair);
    }

}

module.exports = exports = BaseExchangeService;