const bittrexService = require('../services/bittrex.service');
const poloniexService = require('../services/poloniex.service');

class OrderBookService {

    constructor() {
        this.bittrexCache = new NodeCache({stdTTL: 0});
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
        const orderBookResponse = await requestPromise(orderBookUrlRequest);
        const orderBook = JSON.parse(orderBookResponse).result;

        const asks = orderBook.sell.map((ask) => {
            const pricePoint = ask.Rate;
            const volume = ask.Quantity;
            return {
                pricePoint: pricePoint,
                volume: volume
            }
        });

        const bids = orderBook.buy.map((bid) => {
            const pricePoint = bid.Rate;
            const volume = bid.Quantity;
            return {
                pricePoint: pricePoint,
                volume: volume
            }
        });

        this.bittrexCache.set(tradingPair, {
            asks: asks,
            bids: bids
        });
    }

    async getOrderBook(tradingPair) {
        return this.bittrexCache.get(tradingPair);
    }

    // visible for testing
    _setClient(bittrexClient) {

    }
}

// create a singleton
module.exports = exports = new OrderBookService();