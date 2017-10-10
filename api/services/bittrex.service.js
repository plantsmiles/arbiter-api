const config = require('../util/config');
const requestPromise = require('request-promise');
const queryString = require('query-string');
const BaseExchangeService = require('./base.exchange.service');

// ideally was going to use websocket api from the wrapper "node-bittrex-api" to get order book
// but `updateExchangeState` only returns recently filled orders and not orderbooks
// bittrex's recomendation is to listen via websockets for changes then call REST endpoint for orderbook

class BittrexService extends BaseExchangeService {

    constructor() {
        super('Bittrex', new Map());
        this.requestPromise = requestPromise;
    }

    async updateOrderBook(tradingPair) {
        try {
            const queryParam = {
                market: tradingPair,
                type: 'both'
            };
            const orderBookUrlRequest = `${config.bittrexApiUrl}?${queryString.stringify(queryParam)}`;
            const orderBookResponse = await this.requestPromise(orderBookUrlRequest);
            this.logger.debug(`Received order book update from ${this.exchangeName} via REST API for ${tradingPair}`);
            const orderBook = JSON.parse(orderBookResponse).result;

            const asks = orderBook.sell.map((ask) => {
                const pricePoint = Number(ask.Rate).toFixed(10);
                const volume = ask.Quantity;
                return [pricePoint, volume];
            });

            const bids = orderBook.buy.map((bid) => {
                const pricePoint = Number(bid.Rate).toFixed(10);
                const volume = bid.Quantity;
                return [pricePoint, volume];
            });

            this.exchangeMap.set(tradingPair, {
                asks: asks,
                bids: bids
            });

            this.emit('update', tradingPair);
            await this._waitAndRefresh(tradingPair);
        } catch (error) {
            this.logger.error(`Error occurred for ${tradingPair} updating ${this.exchangeName} order book`);
            await this._waitAndRefresh(tradingPair);
        }
    }
}

// create a singleton
module.exports = exports = new BittrexService();