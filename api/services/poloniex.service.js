const Poloniex = require('poloniex-api-node');
const BaseExchangeService = require('./base.exchange.service');

class PoloniexService extends BaseExchangeService {

    constructor() {
        super('Poloniex', new Map());
        this.poloniexApi = new Poloniex();
    }

    async updateOrderBook(tradingPair) {
        try {
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

            this.exchangeMap.set(tradingPair, {
                asks: asks,
                bids: bids
            });

            this.emit('update', tradingPair);
            await this._waitAndRefresh(tradingPair);
        } catch (err) {
            this.logger.error(`Error occurred for ${tradingPair} updating ${this.exchangeName} order book`);
            await this._waitAndRefresh(tradingPair);
        }

    }
}

// create a singleton
module.exports = exports = new PoloniexService();