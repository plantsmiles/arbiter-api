const bittrexService = require('../services/bittrex.service');
const poloniexService = require('../services/poloniex.service');

class OrderBookService {
    constructor() {}

    async combineOrderBooks(tradingPair) {
        const bittrexOrderBook = await bittrexService.getOrderBook(tradingPair);
        const poloniexOrderBook = await poloniexService.getOrderBook(tradingPair);

        const bids = this._generateOrders(bittrexOrderBook, poloniexOrderBook, 'bids');
        const asks = this._generateOrders(bittrexOrderBook, poloniexOrderBook, 'asks');

        return {
            bids: bids,
            asks: asks
        };
    }

    _generateOrders(bittrexOrderBook, poloniexOrderBook, orderType) {
        const orders = [];
        // flatten the data
        const bittrexBidPricePoints = bittrexOrderBook[orderType].map((order) => {
            return order[0];
        });
        const bittrexBidVolumes = bittrexOrderBook[orderType].map((order) => {
            return order[1];
        });
        const poloniexBidPricePoints = poloniexOrderBook[orderType].map((order) => {
            return order[0];
        });
        const poloniexBidVolumes = poloniexOrderBook[orderType].map((order) => {
            return order[1];
        });

        // combine to find all distinct price points
        const uniqueBidPricePoints = [new Set([...bittrexBidPricePoints, ...poloniexBidPricePoints])];
        uniqueBidPricePoints[0].forEach((pricePoint) => {
            // does bittrex have it
            const bittrexVolume = bittrexBidPricePoints.indexOf(pricePoint) > -1 ? bittrexBidVolumes[bittrexBidPricePoints.indexOf(pricePoint)] : 0;

            // does poloniex have it
            const poloniexVolume = poloniexBidPricePoints.indexOf(pricePoint) > -1 ? poloniexBidVolumes[poloniexBidPricePoints.indexOf(pricePoint)] : 0;

            // build our order
            const order = {
                [orderType]: pricePoint,
                bittrexVolume: bittrexVolume,
                poloniexVolume: poloniexVolume,
                totalVolume: bittrexVolume + poloniexVolume,
                overlap: bittrexVolume > 0 && poloniexVolume > 0
            };

            orders.push(order);
        });

        return orders;
    }
}

module.exports = exports = new OrderBookService();